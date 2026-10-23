import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { QueryResultRow } from 'pg';
import { DatabaseService } from '../../database/database.service.js';
import {
  CreateNewsDto,
  NewsCategoryType,
  QueryNewsDto,
  UpdateNewsDto,
} from './dto/news.dto.js';

export interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  category: NewsCategoryType;
  isPublished: boolean;
  views: number;
  authorId: number | null;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsRow extends QueryResultRow {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail_url: string;
  category: NewsCategoryType;
  is_published: boolean;
  views: number;
  author_id: number | null;
  author_name: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapNewsRow(row: NewsRow): News {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    thumbnailUrl: row.thumbnail_url,
    category: row.category,
    isPublished: row.is_published,
    views: row.views,
    authorId: row.author_id,
    authorName: row.author_name || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

@Injectable()
export class NewsService {
  constructor(private readonly database: DatabaseService) {}

  private async ensureUniqueSlug(baseSlug: string, currentId?: number): Promise<string> {
    let candidate = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.database.query<NewsRow>(
        currentId
          ? 'SELECT id FROM news WHERE slug = $1 AND id != $2'
          : 'SELECT id FROM news WHERE slug = $1',
        currentId ? [candidate, currentId] : [candidate],
      );

      if (existing.rows.length === 0) {
        return candidate;
      }

      candidate = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async findAll(query: QueryNewsDto): Promise<{
    items: News[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['n.is_published = true'];
    const params: (string | number | boolean | null)[] = [];

    if (query.category && query.category !== 'ALL') {
      params.push(query.category);
      conditions.push(`n.category = $${params.length}`);
    }

    if (query.search && query.search.trim()) {
      params.push(`%${query.search.trim()}%`);
      const pIdx = params.length;
      conditions.push(`(n.title ILIKE $${pIdx} OR n.summary ILIKE $${pIdx})`);
    }

    const whereClause = conditions.join(' AND ');

    // Count
    const countRes = await this.database.query<{ count: string | number }>(
      `SELECT COUNT(*)::int as count FROM news n WHERE ${whereClause}`,
      params,
    );
    const total = Number(countRes.rows[0]?.count || 0);

    // Items
    const dataParams = [...params, limit, offset];
    const itemsRes = await this.database.query<NewsRow>(
      `SELECT n.*, u.full_name as author_name
       FROM news n
       LEFT JOIN users u ON n.author_id = u.id
       WHERE ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams,
    );

    return {
      items: itemsRes.rows.map(mapNewsRow),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findAllForAdmin(query: QueryNewsDto): Promise<{
    items: News[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['1=1'];
    const params: (string | number | boolean | null)[] = [];

    if (query.category && query.category !== 'ALL') {
      params.push(query.category);
      conditions.push(`n.category = $${params.length}`);
    }

    if (query.search && query.search.trim()) {
      params.push(`%${query.search.trim()}%`);
      const pIdx = params.length;
      conditions.push(`(n.title ILIKE $${pIdx} OR n.summary ILIKE $${pIdx})`);
    }

    const whereClause = conditions.join(' AND ');

    const countRes = await this.database.query<{ count: string | number }>(
      `SELECT COUNT(*)::int as count FROM news n WHERE ${whereClause}`,
      params,
    );
    const total = Number(countRes.rows[0]?.count || 0);

    const dataParams = [...params, limit, offset];
    const itemsRes = await this.database.query<NewsRow>(
      `SELECT n.*, u.full_name as author_name
       FROM news n
       LEFT JOIN users u ON n.author_id = u.id
       WHERE ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams,
    );

    return {
      items: itemsRes.rows.map(mapNewsRow),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findBySlug(slug: string): Promise<News> {
    const result = await this.database.query<NewsRow>(
      `SELECT n.*, u.full_name as author_name
       FROM news n
       LEFT JOIN users u ON n.author_id = u.id
       WHERE n.slug = $1`,
      [slug],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Bài viết với slug '${slug}' không tồn tại`);
    }

    const article = result.rows[0];

    // Increment views
    await this.database.query(
      `UPDATE news SET views = views + 1 WHERE id = $1`,
      [article.id],
    );

    article.views += 1;
    return mapNewsRow(article);
  }

  async findById(id: number): Promise<News> {
    const result = await this.database.query<NewsRow>(
      `SELECT n.*, u.full_name as author_name
       FROM news n
       LEFT JOIN users u ON n.author_id = u.id
       WHERE n.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Bài viết #${id} không tồn tại`);
    }

    return mapNewsRow(result.rows[0]);
  }

  async create(dto: CreateNewsDto, authorId?: number): Promise<News> {
    const rawSlug = dto.slug?.trim() || generateSlug(dto.title);
    const slug = await this.ensureUniqueSlug(rawSlug);

    const isPublished = dto.isPublished !== undefined ? dto.isPublished : true;

    const result = await this.database.query<NewsRow>(
      `INSERT INTO news (
         title, slug, summary, content, thumbnail_url,
         category, is_published, views, author_id
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8)
       RETURNING *`,
      [
        dto.title.trim(),
        slug,
        dto.summary.trim(),
        dto.content.trim(),
        dto.thumbnailUrl.trim(),
        dto.category,
        isPublished,
        authorId || null,
      ],
    );

    return this.findById(result.rows[0].id);
  }

  async update(id: number, dto: UpdateNewsDto): Promise<News> {
    const existing = await this.findById(id);

    let nextSlug = existing.slug;
    if (dto.slug && dto.slug.trim() !== existing.slug) {
      nextSlug = await this.ensureUniqueSlug(generateSlug(dto.slug.trim()), id);
    } else if (dto.title && !dto.slug && dto.title.trim() !== existing.title) {
      nextSlug = await this.ensureUniqueSlug(generateSlug(dto.title.trim()), id);
    }

    const title = dto.title !== undefined ? dto.title.trim() : existing.title;
    const summary = dto.summary !== undefined ? dto.summary.trim() : existing.summary;
    const content = dto.content !== undefined ? dto.content.trim() : existing.content;
    const thumbnailUrl =
      dto.thumbnailUrl !== undefined ? dto.thumbnailUrl.trim() : existing.thumbnailUrl;
    const category = dto.category !== undefined ? dto.category : existing.category;
    const isPublished =
      dto.isPublished !== undefined ? dto.isPublished : existing.isPublished;

    const result = await this.database.query<NewsRow>(
      `UPDATE news
       SET title = $1,
           slug = $2,
           summary = $3,
           content = $4,
           thumbnail_url = $5,
           category = $6,
           is_published = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, nextSlug, summary, content, thumbnailUrl, category, isPublished, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Bài viết #${id} không tồn tại`);
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.database.query('DELETE FROM news WHERE id = $1', [id]);
  }
}
