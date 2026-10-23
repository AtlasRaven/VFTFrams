import { apiClient } from './api';
import type { NewsArticle, NewsListResponse } from '../types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
}

export const newsService = {
  // 1. PUBLIC: Lấy danh sách tin tức đã xuất bản
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<NewsListResponse> => {
    const response = await apiClient.get<ApiEnvelope<NewsListResponse>>('/news', {
      params: {
        page: params?.page,
        limit: params?.limit,
        category: params?.category,
        search: params?.search,
      },
    });
    return response.data.data;
  },

  // 2. PUBLIC: Lấy chi tiết bài viết theo Slug (Tự động tăng views)
  getBySlug: async (slug: string): Promise<NewsArticle> => {
    const response = await apiClient.get<ApiEnvelope<NewsArticle>>(`/news/${slug}`);
    return response.data.data;
  },

  // 3. ADMIN/STAFF: Lấy bài viết theo ID phục vụ form sửa
  getById: async (id: number): Promise<NewsArticle> => {
    const response = await apiClient.get<ApiEnvelope<NewsArticle>>(`/news/id/${id}`);
    return response.data.data;
  },

  // 4. ADMIN/STAFF: Lấy toàn bộ bài viết (bao gồm bản nháp)
  getAllForAdmin: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<NewsListResponse> => {
    const response = await apiClient.get<ApiEnvelope<NewsListResponse>>('/news/admin/all', {
      params: {
        page: params?.page,
        limit: params?.limit,
        category: params?.category,
        search: params?.search,
      },
    });
    return response.data.data;
  },

  // 5. ADMIN/STAFF: Tạo bài viết mới
  create: async (
    data: Omit<NewsArticle, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>
  ): Promise<NewsArticle> => {
    const response = await apiClient.post<ApiEnvelope<NewsArticle>>('/news', data);
    return response.data.data;
  },

  // 6. ADMIN/STAFF: Chỉnh sửa bài viết
  update: async (
    id: number,
    data: Partial<Omit<NewsArticle, 'id' | 'views' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>>
  ): Promise<NewsArticle> => {
    const response = await apiClient.patch<ApiEnvelope<NewsArticle>>(`/news/${id}`, data);
    return response.data.data;
  },

  // 7. ADMIN: Xóa bài viết
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/news/${id}`);
  },
};
