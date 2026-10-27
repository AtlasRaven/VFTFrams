import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { QueryResultRow } from 'pg';
import { DatabaseService } from '../../database/database.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';

export interface CategoryItem {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  subcategories?: CategoryItem[];
}

interface CategoryRow extends QueryResultRow {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

function toCategory(row: CategoryRow): CategoryItem {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    sortOrder: row.sort_order,
  };
}

@Injectable()
export class CategoriesService {
  private cacheAll: CategoryItem[] | null = null;
  private cacheTree: CategoryItem[] | null = null;
  private cacheExpiresAt = 0;
  private readonly TTL_MS = 60 * 1000; // 60 seconds TTL

  constructor(private readonly database: DatabaseService) {}

  public clearCache(): void {
    this.cacheAll = null;
    this.cacheTree = null;
    this.cacheExpiresAt = 0;
  }

  async findAll(): Promise<CategoryItem[]> {
    if (this.cacheAll && Date.now() < this.cacheExpiresAt) {
      return this.cacheAll;
    }
    const result = await this.database.query<CategoryRow>(
      'SELECT id, parent_id, name, slug, description, sort_order FROM categories ORDER BY sort_order, id',
    );
    this.cacheAll = result.rows.map(toCategory);
    this.cacheExpiresAt = Date.now() + this.TTL_MS;
    return this.cacheAll;
  }

  async findTree(): Promise<CategoryItem[]> {
    if (this.cacheTree && Date.now() < this.cacheExpiresAt) {
      return this.cacheTree;
    }
    const all = await this.findAll();
    const parents = all.filter((c) => c.parentId === null);
    this.cacheTree = parents.map((parent) => ({
      ...parent,
      subcategories: all.filter((c) => c.parentId === parent.id),
    }));
    return this.cacheTree;
  }

  async findBySlug(slug: string): Promise<CategoryItem | null> {
    const result = await this.database.query<CategoryRow>(
      'SELECT id, parent_id, name, slug, description, sort_order FROM categories WHERE slug = $1',
      [slug],
    );
    return result.rows[0] ? toCategory(result.rows[0]) : null;
  }

  async findById(id: number): Promise<CategoryItem | null> {
    const result = await this.database.query<CategoryRow>(
      'SELECT id, parent_id, name, slug, description, sort_order FROM categories WHERE id = $1',
      [id],
    );
    return result.rows[0] ? toCategory(result.rows[0]) : null;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryItem> {
    const existing = await this.database.query(
      'SELECT id FROM categories WHERE slug = $1',
      [dto.slug.trim()],
    );
    if (existing.rowCount && existing.rowCount > 0) {
      throw new ConflictException(`Danh mục với slug "${dto.slug}" đã tồn tại`);
    }

    const result = await this.database.query<CategoryRow>(
      `INSERT INTO categories (parent_id, name, slug, description, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, parent_id, name, slug, description, sort_order`,
      [
        dto.parentId ?? null,
        dto.name.trim(),
        dto.slug.trim(),
        dto.description?.trim() ?? '',
        dto.sortOrder ?? 0,
      ],
    );
    this.clearCache();
    return toCategory(result.rows[0]);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategoryItem> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`Danh mục #${id} không tồn tại`);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const dup = await this.database.query(
        'SELECT id FROM categories WHERE slug = $1 AND id != $2',
        [dto.slug.trim(), id],
      );
      if (dup.rowCount && dup.rowCount > 0) {
        throw new ConflictException(`Slug "${dto.slug}" đã được sử dụng.`);
      }
    }

    const result = await this.database.query<CategoryRow>(
      `UPDATE categories SET
         parent_id = COALESCE($2, parent_id),
         name = COALESCE($3, name),
         slug = COALESCE($4, slug),
         description = COALESCE($5, description),
         sort_order = COALESCE($6, sort_order),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, parent_id, name, slug, description, sort_order`,
      [
        id,
        dto.parentId ?? null,
        dto.name?.trim() ?? null,
        dto.slug?.trim() ?? null,
        dto.description?.trim() ?? null,
        dto.sortOrder ?? null,
      ],
    );
    this.clearCache();
    return toCategory(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    // Kiểm tra danh mục con
    const subcats = await this.database.query(
      'SELECT id FROM categories WHERE parent_id = $1 LIMIT 1',
      [id],
    );
    if (subcats.rowCount && subcats.rowCount > 0) {
      throw new ConflictException(
        'Không thể xóa danh mục đang có các danh mục con phụ thuộc.',
      );
    }

    // Kiểm tra sản phẩm phụ thuộc
    const products = await this.database.query(
      'SELECT id FROM products WHERE category_id = $1 LIMIT 1',
      [id],
    );
    if (products.rowCount && products.rowCount > 0) {
      throw new ConflictException(
        'Không thể xóa danh mục đang có sản phẩm nông sản thuộc về nó.',
      );
    }

    const result = await this.database.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id],
    );
    if (!result.rowCount) {
      throw new NotFoundException(`Danh mục #${id} không tồn tại.`);
    }
    this.clearCache();
  }
}
