import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import type { ProductItem, ProductsService } from '../products/products.service.js';
import { CartService } from './cart.service.js';

describe('CartService', () => {
  function createCartService() {
    const product: ProductItem = {
      id: 1,
      categoryId: 10,
      name: 'Test product',
      slug: 'test-product',
      imageUrl: '/test.jpg',
      unit: 'Kg',
      specification: '1kg',
      price: 30000,
      salePrice: 25000,
      stockQuantity: 100,
      certification: 'VietGAP',
      origin: 'Test farm',
      isFeatured: true,
      isBestSeller: true,
      description: 'Test product',
    };
    const productsService = {
      findById: async (id: number) => (id === product.id ? product : null),
    } as unknown as ProductsService;
    return new CartService(productsService);
  }

  it('keeps carts isolated by client cart ID', async () => {
    const cartService = createCartService();
    await cartService.addItem('session-a', { productId: 1, quantity: 2 });

    expect((await cartService.getCart('session-a')).totalItems).toBe(2);
    expect((await cartService.getCart('session-b')).totalItems).toBe(0);
  });

  it('rejects cumulative cart quantity above available stock', async () => {
    const cartService = createCartService();

    await cartService.addItem('session-a', { productId: 1, quantity: 100 });
    await expect(
      cartService.addItem('session-a', { productId: 1, quantity: 100 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects non-finite or non-positive quantities', async () => {
    const cartService = createCartService();

    await expect(
      cartService.addItem('session-a', {
        productId: 1,
        quantity: Number.NaN,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      cartService.addItem('session-a', { productId: 1, quantity: 0 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
