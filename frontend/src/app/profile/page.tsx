"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Phone,
  Mail,
  Shield,
  Key,
  Camera,
  Upload,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Save,
  ArrowLeft,
  Package,
  Calendar,
  X,
  Sparkles,
  MapPin,
  Plus,
  Check,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { userService } from "../../services/api";
import { compressImage } from "../../utils/imageCompressor";
import type { UserAddress } from "../../types";

type ProfileTab = "INFO" | "ADDRESSES" | "PASSWORD";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, hasHydrated, updateUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>("INFO");

  // Form states for Personal Info
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarInputUrl, setAvatarInputUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientPhone, setNewRecipientPhone] = useState("");
  const [newStreetAddress, setNewStreetAddress] = useState("");
  const [newWard, setNewWard] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newProvince, setNewProvince] = useState("");
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states for Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & Notifications
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate user data once hydrated
  useEffect(() => {
    if (!hasHydrated) return;
    if (!token || !user) {
      router.push("/auth?mode=login");
      return;
    }
    setFullName(user.fullName || "");
    setPhoneNumber(user.phoneNumber || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [hasHydrated, token, user, router]);

  const loadAddresses = async (force = false) => {
    setIsLoadingAddresses(true);
    try {
      const data = await userService.getAddresses(force);
      setAddresses(data);
    } catch (err) {
      console.error("Lỗi tải danh sách địa chỉ:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (hasHydrated && token && user) {
      loadAddresses();
    }
  }, [hasHydrated, token, user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName.trim() || !newRecipientPhone.trim() || !newStreetAddress.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ tên người nhận, số điện thoại và địa chỉ nhận hàng.");
      return;
    }
    setIsSavingAddress(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await userService.addAddress({
        recipientName: newRecipientName.trim(),
        phoneNumber: newRecipientPhone.trim(),
        streetAddress: newStreetAddress.trim(),
        ward: newWard.trim(),
        district: newDistrict.trim(),
        province: newProvince.trim(),
        isDefault: newIsDefault,
      });
      await loadAddresses(true);
      setShowAddAddressForm(false);
      setNewStreetAddress("");
      setNewWard("");
      setNewDistrict("");
      setNewProvince("");
      setNewIsDefault(false);
      setSuccessMessage("Đã thêm địa chỉ nhận hàng mới thành công!");
    } catch (err: unknown) {
      console.error("Lỗi thêm địa chỉ:", err);
      setErrorMessage("Không thể lưu địa chỉ. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ nhận hàng này?")) return;
    try {
      await userService.deleteAddress(id);
      await loadAddresses(true);
      setSuccessMessage("Đã xóa địa chỉ thành công.");
    } catch (err) {
      console.error("Lỗi xóa địa chỉ:", err);
      setErrorMessage("Không thể xóa địa chỉ nhận hàng.");
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await userService.setDefaultAddress(id);
      await loadAddresses(true);
      setSuccessMessage("Đã đặt làm địa chỉ giao hàng mặc định cho tài khoản.");
    } catch (err) {
      console.error("Lỗi đặt địa chỉ mặc định:", err);
      setErrorMessage("Không thể đặt địa chỉ mặc định.");
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Ensure camera stream attaches properly to video element
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => console.error("Video play error:", err));
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Không thể mở camera:", err);
      setErrorMessage("Không thể truy cập camera. Vui lòng cấp quyền hoặc tải ảnh từ máy tính.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const w = v.videoWidth || 480;
    const h = v.videoHeight || 480;

    const canvas = document.createElement("canvas");
    const size = Math.min(w, h);
    const startX = (w - size) / 2;
    const startY = (h - size) / 2;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw square cropped snapshot for avatar
    ctx.drawImage(v, startX, startY, size, size, 0, 0, 400, 400);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    try {
      const compressed = await compressImage(dataUrl, 400, 400, 0.85);
      setAvatarUrl(compressed);
    } catch {
      setAvatarUrl(dataUrl);
    }
    stopCamera();
    setSuccessMessage("Đã chụp ảnh đại diện thành công. Bấm 'Lưu Thay Đổi' để hoàn tất.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strictly validate 3 image formats: .jpg, .png, .webp
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage("Định dạng tệp không hợp lệ! Vui lòng chỉ chọn ảnh có đuôi .jpg, .png hoặc .webp.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const compressed = await compressImage(file, 500, 500, 0.85);
      setAvatarUrl(compressed);
      setSuccessMessage("Đã tải ảnh đại diện từ thiết bị. Bấm 'Lưu Thay Đổi' để hoàn tất.");
    } catch (compressErr) {
      console.warn("Lỗi nén ảnh avatar:", compressErr);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setAvatarUrl(event.target.result);
          setSuccessMessage("Đã tải ảnh đại diện từ thiết bị. Bấm 'Lưu Thay Đổi' để hoàn tất.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (!avatarInputUrl.trim()) return;
    setAvatarUrl(avatarInputUrl.trim());
    setShowUrlInput(false);
    setAvatarInputUrl("");
    setSuccessMessage("Đã liên kết ảnh đại diện. Bấm 'Lưu Thay Đổi' để hoàn tất.");
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    stopCamera();
    setSuccessMessage("Đã xóa ảnh đại diện. Bấm 'Lưu Thay Đổi' để hoàn tất.");
  };

  // Submit Personal Info
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Họ và tên không được để trống.");
      return;
    }

    // Phone validation
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber.trim())) {
      setErrorMessage("Số điện thoại không hợp lệ (yêu cầu 10 chữ số).");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        avatarUrl: avatarUrl.trim(),
      });

      // Update auth store in real-time
      updateUser({
        fullName: updated.fullName,
        phoneNumber: updated.phoneNumber,
        avatarUrl: updated.avatarUrl,
      });

      setSuccessMessage("Cập nhật thông tin cá nhân và ảnh đại diện thành công!");
    } catch (err: unknown) {
      console.error("Lỗi cập nhật thông tin cá nhân:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Không thể cập nhật thông tin. Vui lòng kiểm tra lại.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Password Change
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Vui lòng nhập mật khẩu hiện tại của bạn.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Xác nhận mật khẩu mới không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      return;
    }

    setIsSaving(true);
    try {
      await userService.updateProfile({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Đổi mật khẩu tài khoản thành công! Mật khẩu mới đã được kích hoạt.");
    } catch (err: unknown) {
      console.error("Lỗi đổi mật khẩu:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Mật khẩu hiện tại không chính xác. Vui lòng thử lại.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Chưa nhập", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: "Yếu", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "Trung bình", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Khá mạnh", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Rất mạnh", color: "bg-emerald-600" };
      default:
        return { score: 15, label: "Quá ngắn", color: "bg-gray-400" };
    }
  };

  const strength = getPasswordStrength(newPassword);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!hasHydrated || !user) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const isStaff = user.role === "STAFF";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#2E7D32] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800">Thông tin tài khoản</span>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
        >
          <Package className="w-4 h-4" />
          <span>Xem đơn hàng của tôi</span>
        </Link>
      </div>

      {/* Hero Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-emerald-100/60 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Large Avatar */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-linear-to-tr from-[#2E7D32] to-[#4CAF50] flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-black text-white tracking-wider">
                {getInitials(fullName)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab("INFO");
              fileInputRef.current?.click();
            }}
            className="absolute bottom-1 right-1 p-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
            title="Đổi ảnh đại diện"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info Summary */}
        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {fullName || "Người dùng VFT Farms"}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAdmin
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : isStaff
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-emerald-100 text-emerald-900 border border-emerald-300"
              }`}
            >
              {isAdmin && <Shield className="w-3.5 h-3.5 text-amber-600" />}
              <span>
                {isAdmin
                  ? "Quản Trị Viên (ADMIN)"
                  : isStaff
                    ? "Nhân Viên (STAFF)"
                    : "Khách Hàng Thân Thiết"}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{phoneNumber || "Chưa cập nhật số điện thoại"}</span>
            </span>
          </div>

          <p className="text-xs text-gray-400 pt-1">
            Quản lý thông tin định danh, bảo mật mật khẩu và địa chỉ mua sắm nông sản sạch VFT Farms.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => {
            setActiveTab("INFO");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "INFO"
              ? "border-[#2E7D32] text-[#2E7D32]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Thông Tin Cá Nhân & Ảnh Đại Diện</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("ADDRESSES");
            setErrorMessage(null);
            setSuccessMessage(null);
            if (!newRecipientName && user) {
              setNewRecipientName(user.fullName || "");
              setNewRecipientPhone(user.phoneNumber || "");
            }
          }}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ADDRESSES"
              ? "border-[#2E7D32] text-[#2E7D32]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sổ Địa Chỉ Giao Hàng ({addresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("PASSWORD");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "PASSWORD"
              ? "border-[#2E7D32] text-[#2E7D32]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Đổi Mật Khẩu Bảo Mật</span>
        </button>
      </div>

      {/* Tab 1: Personal Info & Avatar */}
      {activeTab === "INFO" && (
        <form onSubmit={handleSaveInfo} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#2E7D32]" />
              <span>Ảnh Đại Diện (Avatar)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Ảnh đại diện giúp cá nhân hóa tài khoản và hiển thị trên thanh điều hướng, hóa đơn đặt hàng.
            </p>
          </div>

          {/* Camera Viewfinder if Camera is active */}
          {isCameraActive ? (
            <div className="relative w-full max-w-md aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center mx-auto border-2 border-emerald-400">
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
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
                  <span>Chụp Ảnh Này</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 text-xs font-semibold cursor-pointer"
                >
                  Hủy Camera
                </button>
              </div>
            </div>
          ) : (
            /* Avatar Upload / Action Controls */
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-300 shadow-xs bg-linear-to-tr from-[#2E7D32] to-[#4CAF50] flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-white">
                    {getInitials(fullName)}
                  </span>
                )}
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  {/* File Upload Button (accepts .jpg, .png, .webp) */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-gray-800 border border-gray-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#2E7D32]" />
                    <span>Tải ảnh từ máy</span>
                  </button>

                  {/* Camera Capture Button */}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-gray-800 border border-gray-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#2E7D32]" />
                    <span>Chụp ảnh webcam</span>
                  </button>

                  {/* URL Input Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium shadow-xs transition-colors cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span>Nhập URL ảnh</span>
                  </button>

                  {/* Remove Avatar Button */}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Xóa ảnh</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-gray-400">
                  Hỗ trợ 3 định dạng hình ảnh: <strong>.jpg, .png, .webp</strong>. Dung lượng tối đa 5MB.
                </p>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Image URL Input Form */}
                {showUrlInput && (
                  <div className="flex gap-2 pt-1 animate-in fade-in">
                    <input
                      type="url"
                      value={avatarInputUrl}
                      onChange={(e) => setAvatarInputUrl(e.target.value)}
                      placeholder="Dán đường dẫn ảnh: https://..."
                      className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-colors cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#2E7D32]" />
                <span>Thông Tin Cơ Bản</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Số điện thoại liên hệ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ví dụ: 0912345678..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
              </div>

              {/* Email (Read-Only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 block">
                    Email tài khoản
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Đã kích hoạt
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed font-mono"
                />
              </div>

              {/* Account Role (Read-Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Phân quyền tài khoản
                </label>
                <input
                  type="text"
                  disabled
                  value={
                    isAdmin
                      ? "QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN)"
                      : isStaff
                        ? "NHÂN VIÊN VẬN HÀNH (STAFF)"
                        : "KHÁCH HÀNG THÂN THIẾT (CUSTOMER)"
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-bold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu thông tin...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi Thông Tin</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Delivery Addresses */}
      {activeTab === "ADDRESSES" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2E7D32]" />
                <span>Sổ Địa Chỉ Giao Hàng</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Lưu các địa chỉ nhận hàng để hệ thống tự động điền sẵn vào ô thông tin khi bạn đặt hàng và thanh toán nông sản.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAddAddressForm(!showAddAddressForm);
                if (!newRecipientName && user) {
                  setNewRecipientName(user.fullName || "");
                  setNewRecipientPhone(user.phoneNumber || "");
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddAddressForm ? "Đóng biểu mẫu" : "Thêm Địa Chỉ Mới"}</span>
            </button>
          </div>

          {/* Form thêm địa chỉ mới */}
          {showAddAddressForm && (
            <form
              onSubmit={handleAddAddress}
              className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span>Nhập thông tin địa chỉ giao hàng mới</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tên người nhận hàng *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRecipientName}
                    onChange={(e) => setNewRecipientName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Số điện thoại nhận hàng *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newRecipientPhone}
                    onChange={(e) => setNewRecipientPhone(e.target.value)}
                    placeholder="VD: 0912345678"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Địa chỉ chi tiết (Số nhà, ngõ/ngách, tên đường) *
                </label>
                <input
                  type="text"
                  required
                  value={newStreetAddress}
                  onChange={(e) => setNewStreetAddress(e.target.value)}
                  placeholder="VD: Số 123 Đường Trần Duy Hưng"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Phường / Xã
                  </label>
                  <input
                    type="text"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    placeholder="VD: Phường Trung Hòa"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    placeholder="VD: Cầu Giấy"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Tỉnh / Thành phố
                  </label>
                  <input
                    type="text"
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    placeholder="VD: Hà Nội"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAddressCheckbox"
                  checked={newIsDefault}
                  onChange={(e) => setNewIsDefault(e.target.checked)}
                  className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32] cursor-pointer"
                />
                <label
                  htmlFor="defaultAddressCheckbox"
                  className="text-xs font-semibold text-gray-800 cursor-pointer"
                >
                  Đặt làm địa chỉ nhận hàng mặc định (tự động điền ưu tiên khi đặt hàng)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressForm(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingAddress ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu Địa Chỉ Này</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Danh sách địa chỉ đã lưu */}
          {isLoadingAddresses ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
              <p className="text-xs font-medium">Đang tải sổ địa chỉ...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">
                Chưa có địa chỉ nhận hàng nào được lưu
              </h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Thêm địa chỉ nhà riêng hoặc văn phòng của bạn. Hệ thống sẽ tự động điền sẵn tên, số điện thoại và địa chỉ nhận hàng mỗi khi bạn thanh toán.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowAddAddressForm(true);
                  if (!newRecipientName && user) {
                    setNewRecipientName(user.fullName || "");
                    setNewRecipientPhone(user.phoneNumber || "");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm địa chỉ đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => {
                const fullText = [
                  addr.streetAddress,
                  addr.ward,
                  addr.district,
                  addr.province,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      addr.isDefault
                        ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          {addr.recipientName}
                          <span className="text-xs font-medium text-gray-500">
                            ({addr.phoneNumber})
                          </span>
                        </span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] text-[10px] font-bold border border-emerald-300">
                            <Check className="w-3 h-3" />
                            <span>Mặc định</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fullText}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[#2E7D32] hover:underline font-semibold cursor-pointer"
                        >
                          Thiết lập mặc định
                        </button>
                      ) : (
                        <span className="text-emerald-700 text-[11px] font-medium">
                          ✓ Ưu tiên điền khi đặt hàng
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1 cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Password Security */}
      {activeTab === "PASSWORD" && (
        <form onSubmit={handleSavePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#2E7D32]" />
              <span>Đổi Mật Khẩu Đăng Nhập</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Để bảo mật tài khoản, vui lòng chọn mật khẩu mạnh gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Mật khẩu hiện tại <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu bạn đang dùng..."
                  className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự..."
                  className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div className="space-y-1 pt-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Độ mạnh mật khẩu:</span>
                    <span className="font-bold text-gray-700">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại chính xác mật khẩu mới..."
                  className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-[11px] text-rose-500 font-medium">
                  Mật khẩu xác nhận chưa khớp với mật khẩu mới.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving || (confirmPassword !== "" && confirmPassword !== newPassword)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang cập nhật mật khẩu...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Cập Nhật Mật Khẩu Mới</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
