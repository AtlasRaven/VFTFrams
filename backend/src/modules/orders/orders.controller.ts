import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { OrdersService, CreateOrderDto } from './orders.service.js';
import { JWT_CONFIG } from '../../config/jwt.config.js';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator.js';

export class UpdateOrderStatusDto {
  orderStatus!:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPING'
    | 'DELIVERED'
    | 'CANCELLED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  proofImageUrl?: string;
  proofNote?: string;
}

@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private extractUser(authHeader?: string): { id: number; role?: string } | undefined {
    if (!authHeader) return undefined;
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Token xác thực không đúng định dạng');
    }

    try {
      const decoded = jwt.verify(parts[1], JWT_CONFIG.secret) as any;
      if (typeof decoded !== 'object' || decoded === null) {
        throw new UnauthorizedException('Token xác thực không hợp lệ');
      }

      const subject = decoded.sub ?? decoded.id;
      const userId = Number(subject);
      if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new UnauthorizedException('Token xác thực không hợp lệ');
      }
      return { id: userId, role: decoded.role };
    } catch {
      throw new UnauthorizedException('Token xác thực không hợp lệ hoặc đã hết hạn');
    }
  }

  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.extractUser(authHeader);
    const order = await this.ordersService.create(dto, user?.id);
    return {
      success: true,
      data: order,
      message: 'Đặt hàng thành công! VFT Farms đã tiếp nhận đơn của bạn.',
    };
  }

  // Khách hàng / Nhân viên / Admin xem lịch sử đơn hàng của mình
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const userId = Number(user.sub || user.id);
    const result = await this.ordersService.findAll({
      userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      status,
      search,
    });
    return {
      success: true,
      data: result.items,
      pagination: result.pagination,
      message: 'Lấy lịch sử đơn hàng thành công',
    };
  }

  // RBAC: Chỉ ADMIN và STAFF mới được xem toàn bộ đơn hàng của tất cả khách hàng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Get('admin/all')
  async getAllAdminOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.ordersService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      status,
      search,
    });
    return {
      success: true,
      data: result.items,
      pagination: result.pagination,
      message: 'Lấy toàn bộ danh sách đơn hàng hệ thống (Admin/Staff)',
    };
  }

  // Khách hàng tự hủy đơn hàng của mình (khi đơn còn PENDING)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const userId = Number(user.sub || user.id);
    const cancelled = await this.ordersService.cancelOrderByCustomer(
      Number(id),
      userId,
    );
    return {
      success: true,
      data: cancelled,
      message: `Đã hủy đơn hàng #${cancelled.orderCode} và hoàn kho thành công.`,
    };
  }

  // RBAC: STAFF và ADMIN cập nhật trạng thái đơn hàng (kèm tự động hoàn kho nếu hủy)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const updated = await this.ordersService.updateStatus(
      Number(id),
      dto.orderStatus,
      dto.paymentStatus,
      dto.proofImageUrl,
      dto.proofNote,
    );
    return {
      success: true,
      data: updated,
      message: `Đã cập nhật trạng thái đơn hàng #${id} thành ${dto.orderStatus}`,
    };
  }

  // Tra cứu đơn hàng theo mã (Hỗ trợ cả Customer tra cứu đơn của mình, hoặc Admin/Staff, hoặc đơn Guest)
  @Get(':code')
  async getByCode(
    @Param('code') code: string,
    @Headers('authorization') authHeader?: string,
  ) {
    const order = await this.ordersService.findByCode(code);
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với mã "${code}"`);
    }

    const requester = this.extractUser(authHeader);
    // Nếu đơn hàng có gắn userId và người yêu cầu là CUSTOMER -> kiểm tra ownership
    if (order.userId && requester) {
      if (
        requester.role === 'CUSTOMER' &&
        order.userId !== requester.id
      ) {
        throw new ForbiddenException(
          'Bạn không có quyền xem thông tin đơn hàng này.',
        );
      }
    }

    return {
      success: true,
      data: order,
      message: 'Lấy chi tiết đơn hàng thành công',
    };
  }
}
