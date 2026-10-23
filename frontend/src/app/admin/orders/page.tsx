"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  RotateCcw,
  Edit3,
  Loader2,
  DollarSign,
  ShieldCheck,
  Phone,
  MapPin,
  Eye,
  Check,
  Camera,
  Upload,
  X,
  MessageCircle,
  ExternalLink,
  FileCheck,
  Send,
  AlertTriangle,
} from "lucide-react";
import { orderService } from "../../../services/api";
import { RoleGuard } from "../../../components/auth/RoleGuard";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Order } from "../../../types";
import { TraceabilityModal } from "../../../components/products/TraceabilityModal";

export default function AdminOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  // Selected Order for Edit/Status Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoadingStatus, setActionLoadingStatus] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Proof Image & Camera State
  const [proofImage, setProofImage] = useState<string>("");
  const [proofNote, setProofNote] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lightbox / Proof Image Preview Modal
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    orderCode: string;
    note?: string;
    time?: string;
  } | null>(null);

  // Traceability Modal
  const [traceProductId, setTraceProductId] = useState<number | null>(null);
  const [traceProductName, setTraceProductName] = useState<string>("");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllForAdmin();
      setOrders(data);
    } catch (err: unknown) {
      console.error("Lỗi khi tải đơn hàng cho Admin:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng kiểm tra quyền truy cập.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Clean up camera on unmount or modal close
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Không thể mở camera:", err);
      alert("Không thể truy cập camera. Vui lòng cấp quyền hoặc tải ảnh từ máy.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Watermark
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(
      `VFT FARMS CHỨNG TỪ: #${selectedOrder?.orderCode || "ORDER"} | ${new Date().toLocaleString("vi-VN")}`,
      15,
      canvas.height - 15,
    );

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setProofImage(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate 3 file types: JPG, PNG, WEBP (webpng)
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      alert("Định dạng tệp không hợp lệ! Vui lòng chỉ chọn ảnh có đuôi .jpg, .png hoặc .webp.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setProofImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setProofImage(order.proofImageUrl || "");
    setProofNote(order.proofNote || "");
    setIsCameraActive(false);
  };

  const handleCloseUpdateModal = () => {
    stopCamera();
    setSelectedOrder(null);
    setProofImage("");
    setProofNote("");
    setActionLoadingStatus(null);
  };

  // Execution when clicking a distinct action button
  const handleExecuteStatusChange = async (targetStatus: Order["orderStatus"]) => {
    if (!selectedOrder) return;
    setActionLoadingStatus(targetStatus);

    let nextPaymentStatus: Order["paymentStatus"] | undefined = selectedOrder.paymentStatus;
    if (targetStatus === "DELIVERED") {
      nextPaymentStatus = "PAID";
    }

    try {
      await orderService.updateStatus(
        selectedOrder.id,
        targetStatus,
        nextPaymentStatus,
        proofImage || undefined,
        proofNote || undefined,
      );

      setSuccessNotice(
        `Đã chuyển đơn hàng #${selectedOrder.orderCode} sang trạng thái "${targetStatus}" thành công.`,
      );
      handleCloseUpdateModal();
      await loadOrders();
    } catch (err: unknown) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setActionLoadingStatus(null);
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING").length;
  const shippingOrders = orders.filter((o) => o.orderStatus === "SHIPPING").length;
  const completedRevenue = orders
    .filter((o) => o.orderStatus === "DELIVERED" || o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Status badge styling helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Chờ xác nhận
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            Đã xác nhận
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Package className="w-3.5 h-3.5 text-indigo-500" />
            Đang đóng gói
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Truck className="w-3.5 h-3.5 text-cyan-500" />
            Đang giao hàng
          </span>
        );
      case "DELIVERED":
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Giao thành công
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "ALL" && order.orderStatus !== statusFilter) return false;
    if (paymentFilter !== "ALL" && order.paymentStatus !== paymentFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = order.orderCode.toLowerCase().includes(q);
      const matchName = order.recipientName?.toLowerCase().includes(q);
      const matchPhone = order.recipientPhone?.includes(q);
      const matchAddress = order.shippingAddress?.toLowerCase().includes(q);
      return matchCode || matchName || matchPhone || matchAddress;
    }

    return true;
  });

  return (
    <RoleGuard allowedRoles={["ADMIN", "STAFF"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link href="/admin" className="hover:text-[#2E7D32]">
                Khu vực Quản trị
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Quản lý Đơn hàng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-[#2E7D32]" />
              <span>Quản Lý Đơn Hàng & Chứng Từ Giao Vận</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Hệ thống điều phối đơn hàng với xác nhận ảnh chụp trực tiếp (Camera/Upload .jpg, .png, .webp).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#2E7D32]" />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tổng Số Đơn
              </p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                {totalOrders}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Chờ Xác Nhận
              </p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                {pendingOrders}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                Đang Vận Chuyển
              </p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                {shippingOrders}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Doanh Thu Hoàn Tất
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-800 mt-0.5">
                {completedRevenue.toLocaleString("vi-VN")}đ
              </h3>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 font-medium text-gray-700 cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái ({orders.length})</option>
                <option value="PENDING">Chờ xác nhận (PENDING)</option>
                <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
                <option value="PROCESSING">Đang đóng gói (PROCESSING)</option>
                <option value="SHIPPING">Đang vận chuyển (SHIPPING)</option>
                <option value="DELIVERED">Giao thành công (DELIVERED)</option>
                <option value="CANCELLED">Đã hủy (CANCELLED)</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 font-medium text-gray-700 cursor-pointer"
              >
                <option value="ALL">Tất cả thanh toán</option>
                <option value="PAID">Đã thanh toán (PAID)</option>
                <option value="PENDING">Chưa thanh toán (COD / Chờ)</option>
                <option value="REFUNDED">Đã hoàn tiền (REFUNDED)</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-semibold text-gray-500">
            Hiển thị <span className="text-[#2E7D32]">{filteredOrders.length}</span> / {orders.length} đơn
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
              <p className="text-sm font-semibold">Đang tải danh sách đơn hàng toàn hệ thống...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">{error}</p>
              <button
                onClick={loadOrders}
                className="bg-[#2E7D32] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Tải lại
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="text-sm font-bold text-gray-700">
                Không tìm thấy đơn hàng nào
              </h4>
              <p className="text-xs text-gray-400">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Mã Đơn / Ngày Tạo</th>
                    <th className="py-3.5 px-4">Khách Hàng (Rê chuột xem liên hệ)</th>
                    <th className="py-3.5 px-4">Địa Chỉ Giao</th>
                    <th className="py-3.5 px-4">Nông Sản / Chi Tiết</th>
                    <th className="py-3.5 px-4 text-right">Tổng Tiền</th>
                    <th className="py-3.5 px-4">Ảnh Làm Chứng</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Code & Date */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono font-bold text-gray-900 block">
                          #{order.orderCode}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Customer Info with Interactive Hover Card */}
                      <td className="py-3.5 px-4 align-top relative group">
                        <div className="cursor-pointer">
                          <span className="font-bold text-gray-900 block group-hover:text-[#2E7D32] transition-colors underline decoration-dotted underline-offset-2">
                            {order.recipientName}
                          </span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#2E7D32]" />
                            {order.recipientPhone}
                          </span>
                        </div>

                        {/* Interactive Contact Popover on Hover */}
                        <div className="absolute left-4 top-full mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-40 hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#2E7D32] to-[#4CAF50] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                              {order.recipientName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-gray-900 truncate">
                                {order.recipientName}
                              </h4>
                              <p className="text-[11px] text-emerald-700 font-semibold">
                                Khách mua hàng VFT
                              </p>
                            </div>
                          </div>

                          <div className="py-2.5 space-y-2">
                            {/* Call Button */}
                            <a
                              href={`tel:${order.recipientPhone}`}
                              className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Gọi điện thoại</span>
                              </span>
                              <span>{order.recipientPhone}</span>
                            </a>

                            {/* Zalo Button */}
                            <a
                              href={`https://zalo.me/${order.recipientPhone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                                <span>Nhắn tin Zalo</span>
                              </span>
                              <ExternalLink className="w-3 h-3 text-blue-500" />
                            </a>
                          </div>

                          <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
                            <p className="flex items-start gap-1">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{order.shippingAddress}</span>
                            </p>
                            {order.notes && (
                              <p className="italic text-amber-700">
                                Ghi chú: "{order.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Shipping Address */}
                      <td className="py-3.5 px-4 align-top max-w-[180px]">
                        <p className="line-clamp-2 text-gray-700 leading-snug">
                          {order.shippingAddress}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 align-top max-w-[220px]">
                        <div className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 text-[11px]"
                            >
                              <span className="truncate font-medium text-gray-800">
                                {item.productName}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="font-bold text-gray-600">
                                  x{item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTraceProductId(item.productId);
                                    setTraceProductName(item.productName);
                                  }}
                                  title="Xem chứng thư SHA-256"
                                  className="text-[#2E7D32] hover:text-[#1B5E20] cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <span className="font-black text-sm text-[#2E7D32] block">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </td>

                      {/* Proof Image Column */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        {order.proofImageUrl ? (
                          <div
                            onClick={() =>
                              setLightboxImage({
                                url: order.proofImageUrl!,
                                orderCode: order.orderCode,
                                note: order.proofNote,
                                time: order.updatedAt,
                              })
                            }
                            className="group flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-emerald-50 transition-colors"
                            title="Bấm để xem ảnh chứng từ khổ lớn"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-emerald-300 shadow-xs shrink-0 bg-gray-100">
                              <Image
                                src={order.proofImageUrl}
                                alt={`Ảnh làm chứng #${order.orderCode}`}
                                fill
                                unoptimized
                                sizes="40px"
                                className="object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" />
                                Có ảnh làm chứng
                              </span>
                              <span className="text-[9px] text-gray-400">Bấm để phóng to</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Chưa có ảnh</span>
                        )}
                      </td>

                      {/* Order Status */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        {renderStatusBadge(order.orderStatus)}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenUpdateModal(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#E8F5E9] hover:text-[#2E7D32] text-gray-700 font-bold transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span>Cập nhật</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Status Modal with Camera & Distinct Buttons */}
        {selectedOrder && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
            onClick={() => !actionLoadingStatus && handleCloseUpdateModal()}
          >
            <div
              className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] text-[10px] font-bold uppercase tracking-wider mb-1">
                    Cập Nhật Trạng Thái & Bằng Chứng
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">
                    Đơn Hàng #{selectedOrder.orderCode}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Khách hàng: <strong className="text-gray-800">{selectedOrder.recipientName}</strong> ({selectedOrder.recipientPhone})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseUpdateModal}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Proof Section: Camera Capture & File Upload (.jpg, .png, .webp) */}
              <div className="space-y-3.5 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#2E7D32]" />
                    <span>Ảnh Chụp Làm Chứng Giao Nhận</span>
                  </label>
                  <span className="text-[10px] text-gray-500">
                    Chấp nhận: .jpg, .png, .webp
                  </span>
                </div>

                {/* Camera Viewfinder (when active) */}
                {isCameraActive ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Chụp Ảnh Làm Chứng</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 text-xs font-semibold cursor-pointer"
                      >
                        Đóng Camera
                      </button>
                    </div>
                  </div>
                ) : proofImage ? (
                  /* Captured/Uploaded Image Preview */
                  <div className="relative w-full aspect-video sm:aspect-2/1 rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-sm bg-gray-900 group">
                    <Image
                      src={proofImage}
                      alt="Ảnh làm chứng"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setProofImage("")}
                        className="p-1.5 rounded-xl bg-black/60 hover:bg-black text-white text-xs transition-colors cursor-pointer"
                        title="Xóa ảnh này"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-black/70 text-white text-[10px] font-mono">
                      ✓ Đã đính kèm ảnh làm chứng cho #{selectedOrder.orderCode}
                    </div>
                  </div>
                ) : (
                  /* Actions when no image */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="p-4 rounded-xl border-2 border-dashed border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#2E7D32]">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span>Chụp ảnh trực tiếp từ camera</span>
                      <span className="text-[10px] font-normal text-gray-500">
                        Bật máy ảnh điện thoại / webcam
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span>Tải ảnh từ máy</span>
                      <span className="text-[10px] font-normal text-gray-500">
                        Hỗ trợ .jpg, .png, .webp
                      </span>
                    </button>

                    {/* Hidden input strictly accepting JPG, PNG, WEBP */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Proof Note Input */}
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Ghi Chú Xác Nhận Làm Chứng (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    placeholder="Ví dụ: Đã giao tận tay khách, kiểm tra rau củ tươi đủ 3 món và thu 320.000đ..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
                  />
                </div>
              </div>

              {/* Distinct Action Buttons */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Bấm Chọn Nút Hành Động Để Xác Nhận Cập Nhật
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Button 1: CONFIRMED */}
                  <button
                    type="button"
                    disabled={actionLoadingStatus !== null}
                    onClick={() => handleExecuteStatusChange("CONFIRMED")}
                    className="p-3 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-between transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Xác Nhận Đơn Hàng</span>
                    </div>
                    {actionLoadingStatus === "CONFIRMED" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded font-mono">CONFIRMED</span>
                    )}
                  </button>

                  {/* Button 2: PROCESSING */}
                  <button
                    type="button"
                    disabled={actionLoadingStatus !== null}
                    onClick={() => handleExecuteStatusChange("PROCESSING")}
                    className="p-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-between transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-600" />
                      <span>Đang Đóng Gói Kho</span>
                    </div>
                    {actionLoadingStatus === "PROCESSING" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    ) : (
                      <span className="text-[10px] bg-indigo-200 px-2 py-0.5 rounded font-mono">PROCESSING</span>
                    )}
                  </button>

                  {/* Button 3: SHIPPING */}
                  <button
                    type="button"
                    disabled={actionLoadingStatus !== null}
                    onClick={() => handleExecuteStatusChange("SHIPPING")}
                    className="p-3 rounded-2xl border border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-900 text-xs font-bold flex items-center justify-between transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-600" />
                      <span>Giao Cho Vận Chuyển</span>
                    </div>
                    {actionLoadingStatus === "SHIPPING" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                    ) : (
                      <span className="text-[10px] bg-cyan-200 px-2 py-0.5 rounded font-mono">SHIPPING</span>
                    )}
                  </button>

                  {/* Button 4: CANCELLED */}
                  <button
                    type="button"
                    disabled={actionLoadingStatus !== null}
                    onClick={() => {
                      if (confirm(`Bạn có chắc chắn muốn HỦY đơn #${selectedOrder.orderCode}? Nông sản sẽ được hoàn trả về tồn kho tự động.`)) {
                        handleExecuteStatusChange("CANCELLED");
                      }
                    }}
                    className="p-3 rounded-2xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-900 text-xs font-bold flex items-center justify-between transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Hủy Đơn & Hoàn Kho</span>
                    </div>
                    {actionLoadingStatus === "CANCELLED" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                    ) : (
                      <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded font-mono">CANCELLED</span>
                    )}
                  </button>
                </div>

                {/* Primary Complete Delivery Button (with proof attached) */}
                <button
                  type="button"
                  disabled={actionLoadingStatus !== null}
                  onClick={() => handleExecuteStatusChange("DELIVERED")}
                  className="w-full p-4 rounded-2xl bg-linear-to-r from-[#2E7D32] to-[#388E3C] hover:from-[#1B5E20] hover:to-[#2E7D32] text-white text-sm font-black flex items-center justify-between shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-200" />
                    </div>
                    <div className="text-left">
                      <span className="block leading-tight">Xác Nhận Đã Giao Hàng Thành Công</span>
                      <span className="text-[11px] text-emerald-200 font-normal">
                        {proofImage ? "✓ Có đính kèm ảnh chụp làm chứng" : "Đổi trạng thái sang DELIVERED & PAID"}
                      </span>
                    </div>
                  </div>

                  {actionLoadingStatus === "DELIVERED" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-mono uppercase">
                      DELIVERED
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox / Proof Image Viewer Modal */}
        {lightboxImage && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#2E7D32]" />
                    <span>Chứng Từ Làm Chứng Đơn Hàng #{lightboxImage.orderCode}</span>
                  </h3>
                  {lightboxImage.time && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Thời điểm xác thực: {new Date(lightboxImage.time).toLocaleString("vi-VN")}
                    </p>
                  )}
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
                  <strong>Ghi chú người giao:</strong> "{lightboxImage.note}"
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Traceability Modal */}
        <TraceabilityModal
          productId={traceProductId}
          productName={traceProductName}
          isOpen={traceProductId !== null}
          onClose={() => setTraceProductId(null)}
        />
      </div>
    </RoleGuard>
  );
}
