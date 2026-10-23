import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PoolClient, QueryResultRow } from 'pg';
import { DatabaseService } from '../../database/database.service.js';
import { ProductsService } from '../products/products.service.js';
import { ENV } from '../../config/env.config.js';

export interface OrderItemInput {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export class CreateOrderDto {
  recipientName!: string;
  recipientPhone!: string;
  shippingAddress!: string;
  notes?: string;
  paymentMethod!: 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';
  items!: OrderItemInput[];
}

export interface OrderRecord {
  id: number;
  orderCode: string;
  userId?: number | null;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  proofImageUrl?: string | null;
  proofNote?: string | null;
  items: OrderItemInput[];
  createdAt: string;
  updatedAt: string;
}

interface OrderRow extends QueryResultRow {
  id: number;
  order_code: string;
  user_id: number | null;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  notes: string | null;
  subtotal: string | number;
  shipping_fee: string | number;
  total_amount: string | number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  proof_image_url?: string | null;
  proof_note?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface OrderItemRow extends QueryResultRow {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit_price: string | number;
  quantity: string | number;
  total_price: string | number;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly productsService: ProductsService,
  ) {}

  private mapOrder(row: OrderRow, items: OrderItemInput[]): OrderRecord {
    return {
      id: row.id,
      orderCode: row.order_code,
      userId: row.user_id,
      recipientName: row.recipient_name,
      recipientPhone: row.recipient_phone,
      shippingAddress: row.shipping_address,
      notes: row.notes || undefined,
      subtotal: Number(row.subtotal),
      shippingFee: Number(row.shipping_fee),
      totalAmount: Number(row.total_amount),
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      orderStatus: row.order_status,
      proofImageUrl: row.proof_image_url || undefined,
      proofNote: row.proof_note || undefined,
      items,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  }

  async create(dto: CreateOrderDto, userId?: number): Promise<OrderRecord> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    const orderItems = await Promise.all(
      dto.items.map(async (item) => {
        if (
          !Number.isInteger(item.productId) ||
          !Number.isFinite(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new BadRequestException(
            'Sản phẩm hoặc số lượng đặt hàng không hợp lệ',
          );
        }

        const product = await this.productsService.findById(item.productId);
        if (!product) {
          throw new NotFoundException(
            `Sản phẩm #${item.productId} không tồn tại`,
          );
        }

        const unitPrice = product.salePrice ?? product.price;
        return {
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity: item.quantity,
          totalPrice: unitPrice * item.quantity,
        };
      }),
    );

    const quantityByProduct = new Map<number, number>();
    for (const item of orderItems) {
      quantityByProduct.set(
        item.productId,
        (quantityByProduct.get(item.productId) ?? 0) + item.quantity,
      );
    }

    // Validate tồn kho
    for (const [productId, quantity] of quantityByProduct) {
      const product = await this.productsService.findById(productId);
      if (!product) {
        throw new NotFoundException(`Sản phẩm #${productId} không tồn tại`);
      }
      if (product.stockQuantity < quantity) {
        throw new BadRequestException(
          `Sản phẩm "${product.name}" chỉ còn ${product.stockQuantity} ${product.unit} trong kho, không đủ số lượng (${quantity})`,
        );
      }
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingFee =
      subtotal >= ENV.FREE_SHIPPING_THRESHOLD ? 0 : ENV.DEFAULT_SHIPPING_FEE;
    const totalAmount = subtotal + shippingFee;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `VFT-${dateStr}-${randomSuffix}`;

    return this.database.withTransaction(async (client: PoolClient) => {
      // Trừ kho trong transaction
      for (const [productId, quantity] of quantityByProduct) {
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1',
          [quantity, productId],
        );
      }

      // Lưu bảng orders
      const orderRes = await client.query<OrderRow>(
        `INSERT INTO orders (
           order_code, user_id, recipient_name, recipient_phone,
           shipping_address, notes, subtotal, shipping_fee, total_amount,
           payment_method, payment_status, order_status, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         RETURNING *`,
        [
          orderCode,
          userId ?? null,
          dto.recipientName.trim(),
          dto.recipientPhone.trim(),
          dto.shippingAddress.trim(),
          dto.notes?.trim() ?? null,
          subtotal,
          shippingFee,
          totalAmount,
          dto.paymentMethod,
          'PENDING',
          'PENDING', // Trạng thái khởi tạo chuẩn PENDING
        ],
      );
      const savedOrder = orderRes.rows[0];

      // Lưu bảng order_items
      for (const item of orderItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            savedOrder.id,
            item.productId,
            item.productName,
            item.unitPrice,
            item.quantity,
            item.totalPrice,
          ],
        );
      }

      return this.mapOrder(savedOrder, orderItems);
    });
  }

  async findAll(userId?: number): Promise<OrderRecord[]> {
    let orderQuery = 'SELECT * FROM orders';
    const params: (number | string)[] = [];

    if (userId) {
      orderQuery += ' WHERE user_id = $1';
      params.push(userId);
    }
    orderQuery += ' ORDER BY id DESC';

    const ordersRes = await this.database.query<OrderRow>(orderQuery, params);
    if (!ordersRes.rows.length) return [];

    const orderIds = ordersRes.rows.map((r) => r.id);
    const placeholders = orderIds.map((_, i) => `$${i + 1}`).join(',');
    const itemsRes = await this.database.query<OrderItemRow>(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
      orderIds,
    );

    const itemsByOrderId = new Map<number, OrderItemInput[]>();
    for (const item of itemsRes.rows) {
      const list = itemsByOrderId.get(item.order_id) ?? [];
      list.push({
        productId: item.product_id,
        productName: item.product_name,
        unitPrice: Number(item.unit_price),
        quantity: Number(item.quantity),
        totalPrice: Number(item.total_price),
      });
      itemsByOrderId.set(item.order_id, list);
    }

    return ordersRes.rows.map((row) =>
      this.mapOrder(row, itemsByOrderId.get(row.id) ?? []),
    );
  }

  async findByCode(code: string): Promise<OrderRecord | null> {
    const orderRes = await this.database.query<OrderRow>(
      'SELECT * FROM orders WHERE lower(order_code) = lower($1)',
      [code.trim()],
    );
    if (!orderRes.rows.length) return null;

    const row = orderRes.rows[0];
    const itemsRes = await this.database.query<OrderItemRow>(
      'SELECT * FROM order_items WHERE order_id = $1',
      [row.id],
    );

    const items: OrderItemInput[] = itemsRes.rows.map((i) => ({
      productId: i.product_id,
      productName: i.product_name,
      unitPrice: Number(i.unit_price),
      quantity: Number(i.quantity),
      totalPrice: Number(i.total_price),
    }));

    return this.mapOrder(row, items);
  }

  async findById(id: number): Promise<OrderRecord | null> {
    const orderRes = await this.database.query<OrderRow>(
      'SELECT * FROM orders WHERE id = $1',
      [id],
    );
    if (!orderRes.rows.length) return null;

    const row = orderRes.rows[0];
    const itemsRes = await this.database.query<OrderItemRow>(
      'SELECT * FROM order_items WHERE order_id = $1',
      [row.id],
    );

    const items: OrderItemInput[] = itemsRes.rows.map((i) => ({
      productId: i.product_id,
      productName: i.product_name,
      unitPrice: Number(i.unit_price),
      quantity: Number(i.quantity),
      totalPrice: Number(i.total_price),
    }));

    return this.mapOrder(row, items);
  }

  /**
   * Cập nhật trạng thái đơn hàng (Dành cho STAFF / ADMIN)
   * Kèm Event/Transaction hoàn kho khi CANCELLED
   */
  async updateStatus(
    id: number,
    orderStatus: string,
    paymentStatus?: string,
    proofImageUrl?: string,
    proofNote?: string,
  ): Promise<OrderRecord> {
    return this.database.withTransaction(async (client: PoolClient) => {
      const orderRes = await client.query<OrderRow>(
        'SELECT * FROM orders WHERE id = $1',
        [id],
      );
      if (!orderRes.rows.length) {
        throw new NotFoundException(`Đơn hàng #${id} không tồn tại`);
      }
      const existing = orderRes.rows[0];
      const oldStatus = existing.order_status;

      // Event/Transaction: Khi chuyển sang CANCELLED -> Hoàn lại tồn kho
      if (oldStatus !== 'CANCELLED' && orderStatus === 'CANCELLED') {
        const itemsRes = await client.query<OrderItemRow>(
          'SELECT * FROM order_items WHERE order_id = $1',
          [id],
        );
        for (const item of itemsRes.rows) {
          await client.query(
            'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
            [Number(item.quantity), item.product_id],
          );
        }
      }

      // Nếu đơn bị hủy trước đó mà mở lại -> kiểm tra & trừ lại kho
      if (oldStatus === 'CANCELLED' && orderStatus !== 'CANCELLED') {
        const itemsRes = await client.query<OrderItemRow>(
          'SELECT * FROM order_items WHERE order_id = $1',
          [id],
        );
        for (const item of itemsRes.rows) {
          await client.query(
            'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
            [Number(item.quantity), item.product_id],
          );
        }
      }

      const updatedRes = await client.query<OrderRow>(
        `UPDATE orders
         SET order_status = $2,
             payment_status = COALESCE($3, payment_status),
             proof_image_url = COALESCE($4, proof_image_url),
             proof_note = COALESCE($5, proof_note),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [
          id,
          orderStatus,
          paymentStatus ?? null,
          proofImageUrl ?? null,
          proofNote ?? null,
        ],
      );

      const itemsRes = await client.query<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id],
      );
      const items: OrderItemInput[] = itemsRes.rows.map((i) => ({
        productId: i.product_id,
        productName: i.product_name,
        unitPrice: Number(i.unit_price),
        quantity: Number(i.quantity),
        totalPrice: Number(i.total_price),
      }));

      return this.mapOrder(updatedRes.rows[0], items);
    });
  }

  /**
   * Khách hàng tự hủy đơn khi đơn hàng còn ở trạng thái PENDING
   */
  async cancelOrderByCustomer(
    id: number,
    userId: number,
  ): Promise<OrderRecord> {
    return this.database.withTransaction(async (client: PoolClient) => {
      const orderRes = await client.query<OrderRow>(
        'SELECT * FROM orders WHERE id = $1',
        [id],
      );
      if (!orderRes.rows.length) {
        throw new NotFoundException(`Đơn hàng #${id} không tồn tại`);
      }
      const order = orderRes.rows[0];

      if (order.user_id !== userId) {
        throw new ForbiddenException(
          'Bạn không có quyền hủy đơn hàng của người khác.',
        );
      }

      if (order.order_status !== 'PENDING') {
        throw new BadRequestException(
          `Không thể hủy đơn hàng ở trạng thái "${order.order_status}". Chỉ hủy được khi đơn còn PENDING.`,
        );
      }

      // Hoàn lại kho
      const itemsRes = await client.query<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id],
      );
      for (const item of itemsRes.rows) {
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
          [Number(item.quantity), item.product_id],
        );
      }

      const updatedRes = await client.query<OrderRow>(
        `UPDATE orders
         SET order_status = 'CANCELLED',
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id],
      );

      const items: OrderItemInput[] = itemsRes.rows.map((i) => ({
        productId: i.product_id,
        productName: i.product_name,
        unitPrice: Number(i.unit_price),
        quantity: Number(i.quantity),
        totalPrice: Number(i.total_price),
      }));

      return this.mapOrder(updatedRes.rows[0], items);
    });
  }
}
