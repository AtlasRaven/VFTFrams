import axios from 'axios';
import { Product, Category, Policy, Order } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_POLICIES } from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: async (params?: { categoryId?: number; isBestSeller?: boolean; search?: string }): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data.data;
    } catch {
      // Graceful fallback to mock data
      let list = [...MOCK_PRODUCTS];
      if (params?.categoryId) {
        list = list.filter((p) => p.categoryId === params.categoryId);
      }
      if (params?.isBestSeller !== undefined) {
        list = list.filter((p) => p.isBestSeller === params.isBestSeller);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(query));
      }
      return list;
    }
  },

  getBySlug: async (slug: string): Promise<Product | undefined> => {
    try {
      const response = await apiClient.get(`/products/slug/${slug}`);
      return response.data.data;
    } catch {
      return MOCK_PRODUCTS.find((p) => p.slug === slug);
    }
  },
};

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/categories/tree');
      return response.data.data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },
};

export const policyService = {
  getAll: async (): Promise<Policy[]> => {
    try {
      const response = await apiClient.get('/policies');
      return response.data.data;
    } catch {
      return MOCK_POLICIES;
    }
  },

  getBySlug: async (slug: string): Promise<Policy | undefined> => {
    try {
      const response = await apiClient.get(`/policies/slug/${slug}`);
      return response.data.data;
    } catch {
      return MOCK_POLICIES.find((p) => p.slug === slug);
    }
  },
};

export const orderService = {
  create: async (data: {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    notes?: string;
    paymentMethod: string;
    items: {
      productId: number;
      productName: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }[];
  }): Promise<Order> => {
    try {
      const response = await apiClient.post('/orders', data);
      return response.data.data;
    } catch {
      // Mock successful order return
      const subtotal = data.items.reduce((s, i) => s + i.totalPrice, 0);
      const shippingFee = subtotal >= 300000 ? 0 : 25000;
      return {
        id: Date.now(),
        orderCode: `VFT-${Date.now().toString().slice(-6)}`,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        subtotal,
        shippingFee,
        totalAmount: subtotal + shippingFee,
        paymentMethod: data.paymentMethod as any,
        paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        orderStatus: 'CONFIRMED',
        items: data.items,
        createdAt: new Date().toISOString(),
      };
    }
  },
};
