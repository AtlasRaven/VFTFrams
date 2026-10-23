import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import type {
  ProductItem,
  ProductsService,
} from '../products/products.service.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

function createController() {
  const product: ProductItem = {
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
  };
  const productsService = {
    findById: async (id: number) => (id === product.id ? product : null),
    deductStocks: async () => true,
  } as unknown as ProductsService;
  const mockDb = {
    query: async () => ({ rows: [] }),
    withTransaction: async () => ({ rows: [] }),
  } as unknown as any;
  return new OrdersController(new OrdersService(mockDb, productsService));
}

const orderRequest = {
  recipientName: 'Guest Customer',
  recipientPhone: '0912345678',
  shippingAddress: 'Test address',
  paymentMethod: 'COD' as const,
  items: [
    {
      productId: 1,
      productName: 'Bắp cải VietGAP',
      unitPrice: 30000,
      quantity: 1,
      totalPrice: 30000,
    },
  ],
};

describe('OrdersController optional authentication', () => {
  it('rejects a supplied invalid token instead of silently downgrading to guest', async () => {
    await expect(
      createController().createOrder(orderRequest, 'invalid-token'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('still permits guest checkout when no authorization header is supplied', async () => {
    const result = await createController().createOrder(orderRequest);

    expect(result.data.userId).toBeNull();
    expect(result.data.paymentStatus).toBe('PENDING');
  });
});
