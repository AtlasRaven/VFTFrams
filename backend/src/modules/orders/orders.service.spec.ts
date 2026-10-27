import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import type {
  ProductItem,
  ProductsService,
} from '../products/products.service.js';
import { OrdersService } from './orders.service.js';

function createOrderService() {
  const products = new Map<number, ProductItem>([
    [
      1,
      {
        id: 1,
        categoryId: 10,
        name: 'Bắp cải VietGAP',
        slug: 'bap-cai-vietgap',
        imageUrl: '/images/products/cabbage.jpg',
        unit: 'Kg',
        specification: 'Túi 1.2kg',
        price: 33000,
        salePrice: 30000,
        stockQuantity: 193.46,
        certification: 'VietGAP',
        origin: 'HTX Nông Nghiệp VFT Farms',
        isFeatured: true,
        isBestSeller: true,
        description: 'Bắp cải tươi.',
      },
    ],
  ]);
  const productsService = {
    findById: async (id: number) => products.get(id) ?? null,
    deductStocks: async (quantities: ReadonlyMap<number, number>) => {
      if (
        [...quantities].some(
          ([id, quantity]) =>
            !products.has(id) || products.get(id)!.stockQuantity < quantity,
        )
      ) {
        return false;
      }
      for (const [id, quantity] of quantities) {
        products.get(id)!.stockQuantity -= quantity;
      }
      return true;
    },
  } as unknown as ProductsService;
  const mockClient = {
    query: async (sql: string, params: any[] = []) => {
      if (sql.includes('INSERT INTO orders')) {
        return {
          rows: [
            {
              id: 1,
              order_code: 'VFT-20261027-1001',
              user_id: params[1] ?? null,
              recipient_name: params[2],
              recipient_phone: params[3],
              shipping_address: params[4],
              notes: params[5],
              subtotal: params[6],
              shipping_fee: params[7],
              total_amount: params[8],
              payment_method: params[9],
              payment_status: params[10],
              order_status: params[11],
              proof_image_url: null,
              proof_note: null,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
        };
      }
      return { rows: [] };
    },
  };
  const mockDb = {
    query: async () => ({ rows: [] }),
    withTransaction: async (fn: (client: any) => Promise<any>) => fn(mockClient),
  } as unknown as any;
  return {
    productsService,
    ordersService: new OrdersService(mockDb, productsService),
    products,
  };
}

describe('OrdersService', () => {
  it('uses server product details and prices instead of client-supplied values', async () => {
    const { ordersService } = createOrderService();
    const order = await ordersService.create({
      recipientName: 'Test Customer',
      recipientPhone: '0912345678',
      shippingAddress: 'Test address',
      paymentMethod: 'COD',
      items: [
        {
          productId: 1,
          productName: 'Fake product name',
          unitPrice: 1,
          quantity: 2,
          totalPrice: 2,
        },
      ],
    });

    expect(order.items[0]).toMatchObject({
      productName: 'Bắp cải VietGAP',
      unitPrice: 30000,
      quantity: 2,
      totalPrice: 60000,
    });
    expect(order.subtotal).toBe(60000);
  });

  it('keeps non-COD orders pending until a payment provider confirms settlement', async () => {
    const { ordersService } = createOrderService();
    const order = await ordersService.create({
      recipientName: 'Test Customer',
      recipientPhone: '0912345678',
      shippingAddress: 'Test address',
      paymentMethod: 'BANK_TRANSFER',
      items: [
        {
          productId: 1,
          productName: 'Bắp cải VietGAP',
          unitPrice: 30000,
          quantity: 1,
          totalPrice: 30000,
        },
      ],
    });

    expect(order.paymentStatus).toBe('PENDING');
  });

  it('rejects duplicate items exceeding stock without deducting stock', async () => {
    const { ordersService, products } = createOrderService();
    const initialStock = products.get(1)!.stockQuantity;
    const item = {
      productId: 1,
      productName: 'Bắp cải VietGAP',
      unitPrice: 30000,
      quantity: 100,
      totalPrice: 3000000,
    };

    await expect(
      ordersService.create({
        recipientName: 'Test Customer',
        recipientPhone: '0912345678',
        shippingAddress: 'Test address',
        paymentMethod: 'COD',
        items: [item, item],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(products.get(1)?.stockQuantity).toBe(initialStock);
  });

  it('rejects zero or negative quantities', async () => {
    const { ordersService } = createOrderService();

    await expect(
      ordersService.create({
        recipientName: 'Test Customer',
        recipientPhone: '0912345678',
        shippingAddress: 'Test address',
        paymentMethod: 'COD',
        items: [
          {
            productId: 1,
            productName: 'Bắp cải VietGAP',
            unitPrice: 30000,
            quantity: 0,
            totalPrice: 0,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
