export type CertificationType = 'VietGAP' | 'VfSC' | 'Organic' | 'HACCP';

export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  sortOrder?: number;
  subcategories?: Category[];
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  imageUrl: string;
  secondaryImages?: string[];
  unit: string;
  specification: string;
  price: number;
  salePrice?: number;
  stockQuantity: number; // Decimal support e.g. 193.46
  certification?: CertificationType;
  origin?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnit?: string;
}

export interface Policy {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: 'CAM_KET' | 'BAN_HANG' | 'THANH_TOAN' | 'DOI_TRA' | 'GIAO_HANG' | 'BAO_MAT';
  sortOrder?: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
  avatarUrl?: string;
  isActive?: boolean;
}

export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderCode: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';
  paymentStatus: string;
  orderStatus: string;
  proofImageUrl?: string;
  proofNote?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
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

export interface AdminDashboardStatistics {
  revenue: {
    total: number;
    formatted: string;
  };
  orders: {
    total: number;
    pending: number;
    shipping: number;
    completed: number;
  };
  customers: {
    total: number;
  };
  products: {
    total: number;
  };
  lowStockAlerts: Array<{
    id: number;
    name: string;
    stock_quantity: number;
    unit: string;
  }>;
  topSellingProducts: Array<{
    id: number;
    name: string;
    total_sold: number;
  }>;
  recentOrders: Order[];
}

export type NewsCategory = 'TIN_TRANG_TRAI' | 'KIEN_THUC' | 'THONG_BAO';

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  category: NewsCategory;
  isPublished: boolean;
  views: number;
  authorId?: number | null;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListResponse {
  items: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}



