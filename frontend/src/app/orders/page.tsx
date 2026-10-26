"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Search,
  RotateCcw,
  Loader2,
  ExternalLink,
  Eye,
  FileCheck,
  X,
  MessageCircle,
  QrCode,
} from "lucide-react";
import { orderService } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import type { Order } from "../../types";
import { TraceabilityModal } from "../../components/products/TraceabilityModal";
import { VietQRModal } from "../../components/payment/VietQRModal";

type FilterTab = "ALL" | "PENDING" | "SHIPPING" | "COMPLETED" | "CANCELLED";

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, hasHydrated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  // Cancel order state
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);

  // Traceability modal state
  const [traceProductId, setTraceProductId] = useState<number | null>(null);
  const [traceProductName, setTraceProductName] = useState<string>("");

  // Delivery Proof Lightbox Modal
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    orderCode: string;
    note?: string;
    time?: string;
  } | null>(null);

  // VietQR Payment Modal
  const [qrModalOrder, setQrModalOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err: unknown) {
      console.error("Lỗi tải đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      // Allow guest to sign in or view via lookup
      setIsLoading(false);
      return;
    }
    loadOrders();
  }, [hasHydrated, token, loadOrders]);

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    try {
      await orderService.cancelOrder(cancelModalOrder.id);
      setCancelNotice(`Đơn hàng #${cancelModalOrder.orderCode} đã được hủy thành công.`);
      setCancelModalOrder(null);
      await loadOrders();
    } catch (err: unknown) {
      console.error("Lỗi khi hủy đơn:", err);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Status badge styling helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Chờ xác nhận
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            Đã xác nhận
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Package className="w-3.5 h-3.5 text-indigo-500" />
            Đang đóng gói
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Truck className="w-3.5 h-3.5 text-cyan-500" />
            Đang vận chuyển
          </span>
        );
      case "DELIVERED":
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Giao thành công
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Payment method badge helper
  const renderPaymentBadge = (method: string, status: string) => {
    const isPaid = status === "PAID";
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium text-gray-600 flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5 text-gray-500" />
          {method === "COD" ? "Thanh toán khi nhận (COD)" : method}
        </span>
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
            isPaid
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
        </span>
      </div>
    );
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    if (activeTab === "PENDING" && order.orderStatus !== "PENDING") return false;
    if (activeTab === "SHIPPING" && order.orderStatus !== "SHIPPING") return false;
    if (
      activeTab === "COMPLETED" &&
      order.orderStatus !== "DELIVERED" &&
      order.orderStatus !== "COMPLETED"
    )
      return false;
    if (activeTab === "CANCELLED" && order.orderStatus !== "CANCELLED") return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = order.orderCode.toLowerCase().includes(q);
      const matchPhone = order.recipientPhone?.includes(q);
      const matchItem = order.items?.some((i) =>
        i.productName.toLowerCase().includes(q),
      );
      return matchCode || matchPhone || matchItem;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / limit) || 1;
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  if (!hasHydrated) return null;

  // Unauthenticated Guest State
  if (!token) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
          <Package className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Theo Dõi Đơn Hàng Của Bạn
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Vui lòng đăng nhập để xem lịch sử mua sắm và theo dõi trạng thái giao
            hàng của các đơn nông sản sạch VFT Farms.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth?mode=login"
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition-all cursor-pointer"
          >
            Đăng Nhập Ngay
          </Link>
          <Link
            href="/products"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl text-sm transition-all"
          >
            Khám Phá Nông Sản
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-[#2E7D32]" />
            <span>Lịch Sử Đơn Hàng</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Quản lý và tra cứu nguồn gốc nông sản cho từng đơn hàng của tài khoản{" "}
            <strong className="text-gray-800">{user?.fullName}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mua sắm tiếp</span>
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {cancelNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{cancelNotice}</span>
          </div>
          <button
            onClick={() => setCancelNotice(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Toolbar: Search & Filter Tabs */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo mã đơn (#ORD-...) hoặc tên món..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 text-xs sm:text-sm font-semibold">
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "PENDING", label: "Chờ xác nhận" },
            { key: "SHIPPING", label: "Đang vận chuyển" },
            { key: "COMPLETED", label: "Giao thành công" },
            { key: "CANCELLED", label: "Đã hủy" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as FilterTab);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#2E7D32] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((skeleton) => (
            <div
              key={skeleton}
              className="p-6 bg-white rounded-2xl border border-gray-200 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-72 bg-gray-200 rounded" />
              </div>
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-sm font-semibold text-gray-800">{error}</p>
          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-2 bg-[#2E7D32] text-white px-5 py-2 rounded-xl text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-800">
              Không có đơn hàng nào
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? `Không tìm thấy đơn hàng nào khớp với từ khóa "${searchQuery}".`
                : "Bạn chưa có đơn hàng nào trong trạng thái này."}
            </p>
          </div>
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Khám phá nông sản ngay</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {paginatedOrders.map((order) => {
            const canCancel = order.orderStatus === "PENDING";
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all hover:border-[#81C784]/60"
              >
                {/* Order Card Header */}
                <div className="p-4 sm:p-5 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm sm:text-base text-gray-900 tracking-tight">
                      #{order.orderCode}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {renderStatusBadge(order.orderStatus)}
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Recipient & Shipping Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#FBFDFB] p-3.5 rounded-xl border border-gray-100">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Người nhận: {order.recipientName}</span>
                      </div>
                      <p className="text-gray-600 pl-5 leading-relaxed">
                        {order.shippingAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Số điện thoại: {order.recipientPhone}</span>
                      </div>
                      <div className="pl-5 pt-0.5 space-y-1.5">
                        {renderPaymentBadge(
                          order.paymentMethod,
                          order.paymentStatus,
                        )}
                        {order.paymentMethod === "BANK_TRANSFER" &&
                          order.paymentStatus === "PENDING" &&
                          order.orderStatus !== "CANCELLED" && (
                            <div>
                              <button
                                type="button"
                                onClick={() => setQrModalOrder(order)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[#2E7D32] text-xs font-bold transition-colors cursor-pointer shadow-xs"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                <span>Quét mã VietQR thanh toán</span>
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-100 border-y border-gray-100">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="py-3 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                              {item.productName}
                            </h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {item.quantity} x{" "}
                              {item.unitPrice.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Traceability SHA-256 Trigger Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setTraceProductId(item.productId);
                              setTraceProductName(item.productName);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] text-xs font-semibold transition-colors cursor-pointer"
                            title="Xác thực nguồn gốc chuỗi khối SHA-256"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Truy xuất SHA-256</span>
                          </button>

                          <div className="text-right min-w-[100px]">
                            <span className="text-xs sm:text-sm font-black text-gray-900">
                              {item.totalPrice.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Proof (if uploaded by shipper/staff) */}
                  {order.proofImageUrl && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() =>
                            setLightboxImage({
                              url: order.proofImageUrl!,
                              orderCode: order.orderCode,
                              note: order.proofNote,
                              time: order.updatedAt || order.createdAt,
                            })
                          }
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-300 shadow-xs cursor-pointer group shrink-0 bg-white"
                          title="Bấm để xem ảnh chứng từ giao nhận hàng khổ lớn"
                        >
                          <Image
                            src={order.proofImageUrl}
                            alt={`Chứng từ đơn #${order.orderCode}`}
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                            <Eye className="w-3.5 h-3.5 text-white drop-shadow" />
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                            <FileCheck className="w-4 h-4 text-[#2E7D32]" />
                            <span>Chứng Từ Giao Nhận Nông Sản (Chụp Trực Tiếp)</span>
                            <span className="text-[10px] bg-emerald-200 text-emerald-900 font-semibold px-1.5 py-0.5 rounded">
                              Đã chụp làm chứng
                            </span>
                          </div>
                          {order.proofNote ? (
                            <p className="text-gray-700 text-[11px] line-clamp-1 italic">
                              &ldquo;{order.proofNote}&rdquo;
                            </p>
                          ) : (
                            <p className="text-gray-500 text-[11px]">
                              Đã lưu ảnh chụp bàn giao thực tế của kiện hàng nông sản này.
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setLightboxImage({
                            url: order.proofImageUrl!,
                            orderCode: order.orderCode,
                            note: order.proofNote,
                            time: order.updatedAt || order.createdAt,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem Ảnh Làm Chứng</span>
                      </button>
                    </div>
                  )}

                  {/* Summary & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-xs text-gray-500">
                        <span>Phí vận chuyển: </span>
                        <strong className="text-gray-700">
                          {order.shippingFee === 0
                            ? "Miễn phí"
                            : `${order.shippingFee.toLocaleString("vi-VN")}đ`}
                        </strong>
                      </div>

                      {/* Hover Contact / Support Popover */}
                      <div className="relative group/contact">
                        <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2E7D32] cursor-pointer py-1 font-medium transition-colors">
                          <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span>Hỗ trợ đơn này</span>
                          <span className="text-[10px] text-gray-400 group-hover/contact:text-[#2E7D32]">
                            (Rê chuột xem liên hệ)
                          </span>
                        </div>

                        {/* Interactive Hover Popover */}
                        <div className="invisible opacity-0 group-hover/contact:visible group-hover/contact:opacity-100 transition-all duration-200 absolute left-0 bottom-full mb-2 z-30 w-72 p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-xs text-gray-700 pointer-events-auto">
                          <div className="font-bold text-gray-900 text-[12px] pb-1.5 border-b border-gray-100 flex items-center justify-between">
                            <span>Hỗ Trợ Nhanh Đơn Hàng</span>
                            <span className="text-[10px] text-emerald-600 font-normal">Trực 07:30 - 21:00</span>
                          </div>
                          <div className="space-y-2 pt-2">
                            <a
                              href="tel:02432029199"
                              className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-[#2E7D32] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#2E7D32]" />
                                <div>
                                  <div className="font-bold text-xs">024 3202 9199</div>
                                  <div className="text-[10px] text-gray-500">Tổng đài VFT Farms (Bấm gọi)</div>
                                </div>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                            </a>

                            <a
                              href="https://zalo.me/0910000009"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2 rounded-xl bg-blue-50/60 hover:bg-blue-100 text-blue-900 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="font-bold text-xs">0910 000 009</div>
                                  <div className="text-[10px] text-blue-700">Chat Zalo hỗ trợ đơn #{order.orderCode}</div>
                                </div>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">
                          Tổng thanh toán:
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#2E7D32]">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      {/* Cancel Order Button */}
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(order)}
                          className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500 font-medium">
                Hiển thị{" "}
                <span className="font-bold text-gray-900">
                  {(page - 1) * limit + 1} -{" "}
                  {Math.min(page * limit, filteredOrders.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-bold text-gray-900">
                  {filteredOrders.length}
                </span>{" "}
                đơn hàng
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPage(p);
                        window.scrollTo({ top: 150, behavior: "smooth" });
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        page === p
                          ? "bg-[#2E7D32] text-white shadow-xs"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => !isCancelling && setCancelModalOrder(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-gray-900">
                Xác nhận hủy đơn hàng
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn hủy đơn hàng{" "}
                <strong className="text-gray-900 font-mono">
                  #{cancelModalOrder.orderCode}
                </strong>
                ? Hệ thống sẽ tự động hoàn trả số lượng nông sản về kho. Thao tác
                này không thể hoàn tác.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setCancelModalOrder(null)}
                className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Xác nhận hủy</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Traceability SHA-256 Modal */}
      <TraceabilityModal
        productId={traceProductId}
        productName={traceProductName}
        isOpen={traceProductId !== null}
        onClose={() => setTraceProductId(null)}
      />

      {/* Proof Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#2E7D32]" />
                <div>
                  <h3 className="font-black text-sm text-gray-900">
                    Ảnh Làm Chứng Giao Nhận Hàng • #{lightboxImage.orderCode}
                  </h3>
                  {lightboxImage.time && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      Thời gian:{" "}
                      {new Date(lightboxImage.time).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Image */}
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-black shadow-inner">
              <Image
                src={lightboxImage.url}
                alt={`Chứng từ #${lightboxImage.orderCode}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-contain"
              />
            </div>

            {/* Note */}
            {lightboxImage.note && (
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                <strong>Ghi chú người giao hàng:</strong> &ldquo;{lightboxImage.note}&rdquo;
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="px-5 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VietQR Payment Modal */}
      <VietQRModal
        isOpen={!!qrModalOrder}
        onClose={() => setQrModalOrder(null)}
        orderCode={qrModalOrder?.orderCode || ""}
        amount={qrModalOrder?.totalAmount || 0}
      />
    </div>
  );
}
