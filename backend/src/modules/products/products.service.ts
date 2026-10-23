import crypto from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { QueryResultRow } from 'pg';
import type { PoolClient } from 'pg';
import { DatabaseService } from '../../database/database.service.js';

export type ProductCertification = 'VietGAP' | 'VfSC' | 'Organic' | 'HACCP';

export interface ProductItem {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  imageUrl: string;
  unit: string;
  specification: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  certification?: ProductCertification;
  origin: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  description: string;
}

export interface ProductQueryParams {
  categoryId?: number;
  search?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  page?: number;
  limit?: number;
}

export interface TraceabilityInfo {
  productId: number;
  productName: string;
  origin: string;
  certification: string;
  batchCode: string;
  hashSHA256: string;
  verifiedAt: string;
  harvestStandard: string;
}

interface ProductRow extends QueryResultRow {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image_url: string;
  unit: string;
  specification: string;
  price: number | string;
  sale_price: number | string | null;
  stock_quantity: number | string;
  certification: ProductCertification | null;
  origin: string | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  description: string | null;
}

const PRODUCT_COLUMNS = `
  id, category_id, name, slug, image_url, unit, specification, price,
  sale_price, stock_quantity, certification, origin, is_featured,
  is_best_seller, description
`;

function toProduct(row: ProductRow): ProductItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.image_url,
    unit: row.unit,
    specification: row.specification,
    price: Number(row.price),
    ...(row.sale_price !== null ? { salePrice: Number(row.sale_price) } : {}),
    stockQuantity: Number(row.stock_quantity),
    ...(row.certification ? { certification: row.certification } : {}),
    origin: row.origin ?? '',
    isFeatured: row.is_featured ?? false,
    isBestSeller: row.is_best_seller ?? false,
    description: row.description ?? '',
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  );
}

function isForeignKeyViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23503'
  );
}

const STOCK_UNAVAILABLE = Symbol('stock-unavailable');

@Injectable()
export class ProductsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(params: ProductQueryParams) {
    const conditions: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    const addCondition = (condition: string, value: string | number | boolean) => {
      values.push(value);
      conditions.push(condition.replace('?', `$${values.length}`));
    };

    if (params.categoryId !== undefined) {
      addCondition('category_id = ?', params.categoryId);
    }
    if (params.isFeatured !== undefined) {
      addCondition('is_featured = ?', params.isFeatured);
    }
    if (params.isBestSeller !== undefined) {
      addCondition('is_best_seller = ?', params.isBestSeller);
    }
    if (params.search?.trim()) {
      addCondition('name ILIKE ?', `%${params.search.trim()}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = await this.database.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM products ${where}`,
      values,
    );
    const total = Number(countResult.rows[0].count);
    const page =
      Number.isSafeInteger(params.page) && (params.page ?? 0) > 0
        ? params.page!
        : 1;
    const limit =
      Number.isSafeInteger(params.limit) && (params.limit ?? 0) > 0
        ? Math.min(params.limit!, 100)
        : 20;
    const offset = (page - 1) * limit;
    const result = await this.database.query<ProductRow>(
      `SELECT ${PRODUCT_COLUMNS} FROM products ${where}
       ORDER BY id
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset],
    );

    return {
      items: result.rows.map(toProduct),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFeatured(): Promise<ProductItem[]> {
    const result = await this.database.query<ProductRow>(
      `SELECT ${PRODUCT_COLUMNS} FROM products
       WHERE is_featured = TRUE OR is_best_seller = TRUE
       ORDER BY id`,
    );
    return result.rows.map(toProduct);
  }

  async findBySlug(slug: string): Promise<ProductItem | null> {
    const result = await this.database.query<ProductRow>(
      `SELECT ${PRODUCT_COLUMNS} FROM products WHERE slug = $1`,
      [slug],
    );
    return result.rows[0] ? toProduct(result.rows[0]) : null;
  }

  async findById(id: number): Promise<ProductItem | null> {
    const result = await this.database.query<ProductRow>(
      `SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? toProduct(result.rows[0]) : null;
  }

  async deductStock(id: number, quantity: number): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE products
       SET stock_quantity = stock_quantity - $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND stock_quantity >= $2
       RETURNING id`,
      [id, quantity],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async deductStocks(
    quantities: ReadonlyMap<number, number>,
  ): Promise<boolean> {
    try {
      await this.database.withTransaction(async (client: PoolClient) => {
        for (const [id, quantity] of quantities) {
          const result = await client.query(
            `UPDATE products
             SET stock_quantity = stock_quantity - $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND stock_quantity >= $2
             RETURNING id`,
            [id, quantity],
          );
          if (!result.rowCount) throw STOCK_UNAVAILABLE;
        }
      });
      return true;
    } catch (error) {
      if (error === STOCK_UNAVAILABLE) return false;
      throw error;
    }
  }

  async create(dto: Omit<ProductItem, 'id'>): Promise<ProductItem> {
    try {
      const result = await this.database.query<ProductRow>(
        `INSERT INTO products (
           category_id, name, slug, image_url, unit, specification, price,
           sale_price, stock_quantity, certification, origin, is_featured,
           is_best_seller, description
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
         )
         RETURNING ${PRODUCT_COLUMNS}`,
        [
          dto.categoryId,
          dto.name.trim(),
          dto.slug.trim(),
          dto.imageUrl.trim(),
          dto.unit.trim(),
          dto.specification.trim(),
          dto.price,
          dto.salePrice ?? null,
          dto.stockQuantity,
          dto.certification ?? null,
          dto.origin.trim(),
          dto.isFeatured,
          dto.isBestSeller,
          dto.description.trim(),
        ],
      );
      return toProduct(result.rows[0]);
    } catch (error) {
      this.rethrowConstraintError(error);
    }
  }

  async update(
    id: number,
    dto: Partial<Omit<ProductItem, 'id' | 'salePrice'>> & {
      salePrice?: number | null;
    },
  ): Promise<ProductItem> {
    const columns: Record<keyof Omit<ProductItem, 'id'>, string> = {
      categoryId: 'category_id',
      name: 'name',
      slug: 'slug',
      imageUrl: 'image_url',
      unit: 'unit',
      specification: 'specification',
      price: 'price',
      salePrice: 'sale_price',
      stockQuantity: 'stock_quantity',
      certification: 'certification',
      origin: 'origin',
      isFeatured: 'is_featured',
      isBestSeller: 'is_best_seller',
      description: 'description',
    };
    const entries = Object.entries(dto).filter(
      ([key, value]) => key in columns && value !== undefined,
    ) as [keyof Omit<ProductItem, 'id'>, unknown][];
    if (!entries.length) {
      const existing = await this.findById(id);
      if (!existing) throw new NotFoundException(`Sản phẩm #${id} không tồn tại`);
      return existing;
    }

    const values: (string | number | boolean | null)[] = [id];
    const assignments = entries.map(([key, value]) => {
      if (key === 'salePrice' && value === null) {
        values.push(null);
      } else if (typeof value === 'string') {
        values.push(value.trim());
      } else if (
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null
      ) {
        values.push(value);
      } else {
        throw new BadRequestException(`Giá trị trường ${key} không hợp lệ.`);
      }
      return `${columns[key]} = $${values.length}`;
    });

    try {
      const result = await this.database.query<ProductRow>(
        `UPDATE products SET
           ${assignments.join(', ')},
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING ${PRODUCT_COLUMNS}`,
        values,
      );
      if (!result.rows[0]) {
        throw new NotFoundException(`Sản phẩm #${id} không tồn tại`);
      }
      return toProduct(result.rows[0]);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.rethrowConstraintError(error);
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.database.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id],
    );
    if (!result.rowCount) {
      throw new NotFoundException(`Sản phẩm #${id} không tồn tại`);
    }
  }

  async getTraceability(id: number): Promise<TraceabilityInfo> {
    const product = await this.findById(id);
    if (!product) {
      throw new NotFoundException(`Sản phẩm #${id} không tồn tại`);
    }

    const batchCode = `BATCH-${product.id.toString().padStart(4, '0')}-2026`;
    const payload = `${product.id}|${product.name}|${product.origin}|${product.certification || 'VietGAP'}|${batchCode}`;
    const hashSHA256 = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      productId: product.id,
      productName: product.name,
      origin: product.origin,
      certification: product.certification || 'VietGAP',
      batchCode,
      hashSHA256,
      verifiedAt: new Date().toISOString(),
      harvestStandard: 'Canh tác hữu cơ & quy chuẩn VietGAP an toàn sinh học VFT Farms',
    };
  }

  private rethrowConstraintError(error: unknown): never {
    if (isUniqueViolation(error)) {
      throw new ConflictException('Tên đường dẫn sản phẩm đã được sử dụng.');
    }
    if (isForeignKeyViolation(error)) {
      throw new BadRequestException('Danh mục sản phẩm không tồn tại.');
    }
    throw error;
  }
}
