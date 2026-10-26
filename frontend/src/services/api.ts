import axios from "axios";
import {
  Product,
  Category,
  Policy,
  Order,
  User,
  TraceabilityInfo,
  AdminDashboardStatistics,
  PaginationInfo,
} from "../types";
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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bắt lỗi 403 Forbidden
    if (error.response?.status === 403) {
      console.warn("Truy cập bị từ chối (403 Forbidden):", error.response?.data?.message);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vft:forbidden", {
            detail: {
              message:
                error.response?.data?.message ||
                "Bạn không có quyền truy cập chức năng này.",
            },
          }),
        );
      }
      return Promise.reject(error);
    }

    // Bắt lỗi 401 Unauthorized và tự động Refresh Token
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (
        originalRequest?.url?.includes("/auth/refresh") ||
        originalRequest?.url?.includes("/auth/login")
      ) {
        return Promise.reject(error);
      }

      const refreshToken =
        useAuthStore.getState().refreshToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem("vft_refresh_token")
          : null);

      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<{
          success: boolean;
          data: { accessToken: string; user: User };
        }>(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, user } = refreshResponse.data.data;
        useAuthStore.getState().login(accessToken, user, refreshToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/auth?mode=login&sessionExpired=true";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

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

export const adminService = {
  getDashboard: async (): Promise<{
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

  getStatistics: async (): Promise<AdminDashboardStatistics> => {
    const response = await apiClient.get<ApiEnvelope<AdminDashboardStatistics>>(
      "/admin/dashboard/statistics",
    );
    return response.data.data;
  },
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiEnvelope<User[]>>("/users");
    return response.data.data;
  },

  create: async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: User["role"];
  }): Promise<User> => {
    const response = await apiClient.post<ApiEnvelope<User>>("/users", data);
    return response.data.data;
  },

  update: async (
    id: number,
    data: Partial<
      Pick<User, "fullName" | "email" | "phoneNumber" | "role" | "isActive">
    > & { password?: string },
  ): Promise<User> => {
    const response = await apiClient.patch<ApiEnvelope<User>>(
      `/users/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiEnvelope<User>>("/users/me");
    return response.data.data;
  },

  updateProfile: async (data: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<User> => {
    const response = await apiClient.patch<ApiEnvelope<User>>(
      "/users/me/profile",
      data,
    );
    return response.data.data;
  },
};

export const productService = {
  getPaginated: async (params?: {
    categoryId?: number;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    certification?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<{ items: Product[]; pagination: PaginationInfo }> => {
    try {
      const response = await apiClient.get("/products", {
        params: {
          category_id: params?.categoryId,
          search: params?.search,
          is_featured: params?.isFeatured,
          is_best_seller: params?.isBestSeller,
          certification: params?.certification,
          limit: params?.limit ?? 12,
          page: params?.page ?? 1,
        },
      });
      return {
        items: response.data.data || [],
        pagination: response.data.pagination || {
          total: (response.data.data || []).length,
          page: params?.page ?? 1,
          limit: params?.limit ?? 12,
          totalPages: Math.ceil(((response.data.data || []).length) / (params?.limit ?? 12)) || 1,
        },
      };
    } catch (error) {
      warnApiFallback("Products Paginated", error);
      let list = [...MOCK_PRODUCTS];
      if (params?.categoryId) {
        list = list.filter((p) => p.categoryId === params.categoryId);
      }
      if (params?.isBestSeller !== undefined) {
        list = list.filter((p) => p.isBestSeller === params.isBestSeller);
      }
      if (params?.isFeatured !== undefined) {
        list = list.filter((p) => p.isFeatured === params.isFeatured);
      }
      if (params?.certification) {
        list = list.filter((p) => p.certification === params.certification);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(query));
      }
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 12;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const offset = (page - 1) * limit;
      return {
        items: list.slice(offset, offset + limit),
        pagination: { total, page, limit, totalPages },
      };
    }
  },

  getAll: async (params?: {
    categoryId?: number;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    certification?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<Product[]> => {
    try {
      const response = await apiClient.get("/products", {
        params: {
          category_id: params?.categoryId,
          search: params?.search,
          is_featured: params?.isFeatured,
          is_best_seller: params?.isBestSeller,
          certification: params?.certification,
          limit: params?.limit ?? 100,
          page: params?.page,
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
      if (params?.isFeatured !== undefined) {
        list = list.filter((p) => p.isFeatured === params.isFeatured);
      }
      if (params?.certification) {
        list = list.filter((p) => p.certification === params.certification);
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

  getAllForAdmin: async (): Promise<Product[]> => {
    const response = await apiClient.get("/products", {
      params: { limit: 100 },
    });
    return response.data.data;
  },

  create: async (data: Omit<Product, "id">): Promise<Product> => {
    const response = await apiClient.post<ApiEnvelope<Product>>(
      "/products",
      data,
    );
    return response.data.data;
  },

  update: async (
    id: number,
    data: Omit<Partial<Omit<Product, "id">>, "salePrice"> & {
      salePrice?: number | null;
    },
  ): Promise<Product> => {
    const response = await apiClient.put<ApiEnvelope<Product>>(
      `/products/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  getTraceability: async (id: number): Promise<TraceabilityInfo> => {
    const response = await apiClient.get<ApiEnvelope<TraceabilityInfo>>(
      `/products/${id}/traceability`,
    );
    return response.data.data;
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

  getAllForAdmin: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiEnvelope<Category[]>>("/categories");
    return response.data.data;
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
    const response = await apiClient.get<ApiEnvelope<Order[]>>("/orders");
    return response.data.data;
  },

  getAllForAdmin: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiEnvelope<Order[]>>("/orders/admin/all");
    return response.data.data;
  },

  cancelOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.patch<ApiEnvelope<Order>>(`/orders/${id}/cancel`);
    return response.data.data;
  },

  updateStatus: async (
    id: number,
    orderStatus: Order["orderStatus"],
    paymentStatus?: Order["paymentStatus"],
    proofImageUrl?: string,
    proofNote?: string,
  ): Promise<Order> => {
    const response = await apiClient.patch<ApiEnvelope<Order>>(`/orders/${id}/status`, {
      orderStatus,
      paymentStatus,
      proofImageUrl,
      proofNote,
    });
    return response.data.data;
  },

  getByCode: async (code: string): Promise<Order | undefined> => {
    const response = await apiClient.get<ApiEnvelope<Order>>(`/orders/${code}`);
    return response.data.data;
  },
};

export { newsService } from './news.service';

