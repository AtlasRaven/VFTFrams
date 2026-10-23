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
  const mockDb = {
    query: async () => ({ rows: [] }),
    withTransaction: async () => ({ rows: [] }),
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
