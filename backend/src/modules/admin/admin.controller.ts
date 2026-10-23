import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard.js';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { UsersService } from '../users/users.service.js';
import { DatabaseService } from '../../database/database.service.js';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly database: DatabaseService,
  ) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: { sub?: number; id?: number }) {
    const profile = await this.usersService.findById(
      Number(user.sub || user.id),
    );
    if (!profile || profile.role !== 'ADMIN') {
      throw new NotFoundException('Không tìm thấy tài khoản quản trị.');
    }

    return {
      user: profile,
      accessLevel: 'ADMIN',
      message: `Xin chào ${profile.fullName}, chào mừng bạn đến với trang quản trị VFT Farms.`,
    };
  }

  @Get('dashboard/statistics')
  async getDashboardStatistics() {
    // 1. Doanh thu
    const revenueRes = await this.database.query<{ total: string | number }>(
      `SELECT COALESCE(SUM(total_amount), 0)::numeric as total
       FROM orders
       WHERE order_status = 'DELIVERED' OR payment_status = 'PAID'`,
    );
    const totalRevenue = Number(revenueRes.rows[0]?.total || 0);

    // 2. Đơn hàng
    const ordersRes = await this.database.query<{
      total: number;
      pending: number;
      shipping: number;
      completed: number;
    }>(
      `SELECT
         COUNT(*)::int as total,
         COUNT(*) FILTER (WHERE order_status = 'PENDING')::int as pending,
         COUNT(*) FILTER (WHERE order_status = 'SHIPPING')::int as shipping,
         COUNT(*) FILTER (WHERE order_status = 'DELIVERED')::int as completed
       FROM orders`,
    );
    const orderStats = ordersRes.rows[0] || {
      total: 0,
      pending: 0,
      shipping: 0,
      completed: 0,
    };

    // 3. Khách hàng
    const customersRes = await this.database.query<{ total: number }>(
      `SELECT COUNT(*)::int as total FROM users WHERE role = 'CUSTOMER'`,
    );
    const totalCustomers = customersRes.rows[0]?.total || 0;

    // 4. Sản phẩm nông sản
    const productsRes = await this.database.query<{ total: number }>(
      `SELECT COUNT(*)::int as total FROM products`,
    );
    const totalProducts = productsRes.rows[0]?.total || 0;

    // 5. Cảnh báo tồn kho thấp (<= 15)
    const lowStockRes = await this.database.query<{
      id: number;
      name: string;
      stock_quantity: number;
      unit: string;
    }>(
      `SELECT id, name, stock_quantity, unit
       FROM products
       WHERE stock_quantity <= 15
       ORDER BY stock_quantity ASC
       LIMIT 6`,
    );

    // 6. Nông sản bán chạy nhất
    const topSellingRes = await this.database.query<{
      id: number;
      name: string;
      total_sold: string | number;
    }>(
      `SELECT p.id, p.name, COALESCE(SUM(oi.quantity), 0)::numeric as total_sold
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       GROUP BY p.id, p.name
       ORDER BY total_sold DESC
       LIMIT 5`,
    );

    // 7. Đơn hàng gần nhất
    const recentOrdersRes = await this.database.query<{
      id: number;
      order_code: string;
      recipient_name: string;
      total_amount: string | number;
      order_status: string;
      created_at: Date | string;
    }>(
      `SELECT id, order_code, recipient_name, total_amount, order_status, created_at
       FROM orders
       ORDER BY id DESC
       LIMIT 5`,
    );

    return {
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders: orderStats.total,
          pendingOrders: orderStats.pending,
          shippingOrders: orderStats.shipping,
          completedOrders: orderStats.completed,
          totalCustomers,
          totalProducts,
        },
        lowStockProducts: lowStockRes.rows.map((p) => ({
          id: p.id,
          name: p.name,
          stockQuantity: Number(p.stock_quantity),
          unit: p.unit,
        })),
        topSellingProducts: topSellingRes.rows.map((p) => ({
          id: p.id,
          name: p.name,
          totalSold: Number(p.total_sold),
        })),
        recentOrders: recentOrdersRes.rows.map((o) => ({
          id: o.id,
          orderCode: o.order_code,
          recipientName: o.recipient_name,
          totalAmount: Number(o.total_amount),
          orderStatus: o.order_status,
          createdAt: new Date(o.created_at).toISOString(),
        })),
      },
      message: 'Lấy dữ liệu thống kê quản trị thành công',
    };
  }
}
