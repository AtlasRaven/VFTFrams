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
  role: 'CUSTOMER' | 'ADMIN';
  avatarUrl?: string;
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
  items: OrderItem[];
  createdAt: string;
}
