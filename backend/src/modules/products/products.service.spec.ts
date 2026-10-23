import { describe, expect, it, vi } from 'vitest';
import { DatabaseService } from '../../database/database.service.js';
import { ProductsService } from './products.service.js';

describe('ProductsService PostgreSQL persistence', () => {
  it('updates dynamic columns using the matching PostgreSQL parameter positions', async () => {
    const query = vi.fn().mockResolvedValue({
      rows: [
        {
          id: 7,
          category_id: 10,
          name: 'Updated product',
          slug: 'updated-product',
          image_url: '/images/product.jpg',
          unit: 'Kg',
          specification: 'Pack',
          price: '14000',
          sale_price: null,
          stock_quantity: '5',
          certification: 'VietGAP',
          origin: 'Farm',
          is_featured: false,
          is_best_seller: false,
          description: 'Updated description',
        },
      ],
    });
    const service = new ProductsService({ query } as unknown as DatabaseService);

    const product = await service.update(7, {
      name: 'Updated product',
      price: 14000,
    });

    const [sql, values] = query.mock.calls[0];
    expect(sql).toContain('name = $2');
    expect(sql).toContain('price = $3');
    expect(values).toEqual([7, 'Updated product', 14000]);
    expect(product).toMatchObject({ id: 7, name: 'Updated product', price: 14000 });
  });

  it('clears a sale price when the update explicitly sets it to null', async () => {
    const query = vi.fn().mockResolvedValue({
      rows: [
        {
          id: 7,
          category_id: 10,
          name: 'Product',
          slug: 'product',
          image_url: '/images/product.jpg',
          unit: 'Kg',
          specification: 'Pack',
          price: '14000',
          sale_price: null,
          stock_quantity: '5',
          certification: null,
          origin: 'Farm',
          is_featured: false,
          is_best_seller: false,
          description: 'Description',
        },
      ],
    });
    const service = new ProductsService({ query } as unknown as DatabaseService);

    await service.update(7, { salePrice: null });

    const [sql, values] = query.mock.calls[0];
    expect(sql).toContain('sale_price = $2');
    expect(values).toEqual([7, null]);
  });
});
