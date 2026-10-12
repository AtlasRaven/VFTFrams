import axios from "axios";
import { Product, Category, Policy, Order, User } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_POLICIES,
} from "../data/mockData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function warnApiFallback(resource: string, error: unknown) {
  const reason = axios.isAxiosError(error) ? error.message : "Unknown error";
  console.warn(`${resource} API failed; showing fallback data. ${reason}`);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
}

export const authService = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiEnvelope<AuthResponse>>(
      "/auth/login",
      credentials,
    );
    return response.data.data;
  },

  register: async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<{ user: User }> => {
    const response = await apiClient.post<ApiEnvelope<{ user: User }>>(
      "/auth/register",
      data,
    );
    return response.data.data;
  },

  getAdminDashboard: async (): Promise<{
    user: User;
    accessLevel: string;
    message: string;
  }> => {
    const response = await apiClient.get<
      ApiEnvelope<{
        user: User;
        accessLevel: string;
        message: string;
      }>
    >("/admin/dashboard");
    return response.data.data;
  },
};

export const productService = {
  getAll: async (params?: {
    categoryId?: number;
    isBestSeller?: boolean;
    search?: string;
  }): Promise<Product[]> => {
    try {
      const response = await apiClient.get("/products", {
        params: {
          category_id: params?.categoryId,
          search: params?.search,
          is_featured: params?.isBestSeller,
        },
      });
      return response.data.data;
    } catch (error) {
      warnApiFallback("Products", error);
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

  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get("/products/featured");
      return response.data.data;
    } catch (error) {
      warnApiFallback("Featured products", error);
      return MOCK_PRODUCTS.filter((p) => p.isBestSeller);
    }
  },

  getBySlug: async (slug: string): Promise<Product | undefined> => {
    try {
      const response = await apiClient.get(`/products/${slug}`);
      return response.data.data;
    } catch (error) {
      warnApiFallback("Product detail", error);
      return MOCK_PRODUCTS.find((p) => p.slug === slug);
    }
  },
};

export const categoryService = {
  getTree: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get("/categories/tree");
      return response.data.data;
    } catch (error) {
      warnApiFallback("Category tree", error);
      return MOCK_CATEGORIES;
    }
  },

  getAll: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get("/categories");
      return response.data.data;
    } catch (error) {
      warnApiFallback("Categories", error);
      return MOCK_CATEGORIES;
    }
  },
};

export const policyService = {
  getAll: async (): Promise<Policy[]> => {
    try {
      const response = await apiClient.get("/policies");
      return response.data.data;
    } catch (error) {
      warnApiFallback("Policies", error);
      return MOCK_POLICIES;
    }
  },

  getBySlug: async (slug: string): Promise<Policy | undefined> => {
    try {
      const response = await apiClient.get(`/policies/${slug}`);
      return response.data.data;
    } catch (error) {
      warnApiFallback("Policy detail", error);
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
    paymentMethod: Order["paymentMethod"];
    items: {
      productId: number;
      productName: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }[];
  }): Promise<Order> => {
    const response = await apiClient.post<ApiEnvelope<Order>>("/orders", data);
    return response.data.data;
  },

  getAll: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get("/orders");
      return response.data.data;
    } catch (error) {
      warnApiFallback("Order history", error);
      return [];
    }
  },

  getByCode: async (code: string): Promise<Order | undefined> => {
    try {
      const response = await apiClient.get(`/orders/${code}`);
      return response.data.data;
    } catch (error) {
      warnApiFallback("Order lookup", error);
      return undefined;
    }
  },
};
