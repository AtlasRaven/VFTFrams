'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_PRODUCTS } from '../../../data/mockData';
import { productService } from '../../../services/api';
import { Badge } from '../../../components/product/Badge';
import { ProductCard } from '../../../components/product/ProductCard';
import { useCartStore } from '../../../store/useCartStore';
import { TraceabilityModal } from '../../../components/products/TraceabilityModal';
import type { Product } from '../../../types';
import {
  ShoppingCart,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Hash,
  Loader2,
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    productService
      .getBySlug(slug)
      .then((data) => {
        if (data) {
          setProduct(data);
          // Tải sản phẩm liên quan theo danh mục thực tế
          productService
            .getAll({ categoryId: data.categoryId, limit: 5 })
            .then((list) => {
              if (Array.isArray(list)) {
                setRelatedProducts(list.filter((p) => p.id !== data.id).slice(0, 4));
              }
            })
            .catch(() => {
              setRelatedProducts(MOCK_PRODUCTS.filter((p) => p.id !== data.id).slice(0, 4));
            });
        } else {
          const fallback = MOCK_PRODUCTS.find((p) => p.slug === slug);
          setProduct(fallback || null);
          if (fallback) {
            setRelatedProducts(MOCK_PRODUCTS.filter((p) => p.id !== fallback.id).slice(0, 4));
          }
        }
      })
      .catch(() => {
        const fallback = MOCK_PRODUCTS.find((p) => p.slug === slug);
        setProduct(fallback || null);
        if (fallback) {
          setRelatedProducts(MOCK_PRODUCTS.filter((p) => p.id !== fallback.id).slice(0, 4));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
        <p className="text-sm font-medium">Đang tải thông tin nông sản...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.</p>
        <Link href="/products" className="bg-[#2E7D32] text-white px-6 py-2.5 rounded-lg text-sm font-bold">
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const price = product.salePrice ?? product.price;
  const imageSrc = product.imageUrl || '/images/products/cabbage.svg';
  const isSvg = imageSrc.toLowerCase().endsWith('.svg');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#2E7D32]">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#2E7D32]">Sản phẩm</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{product.name}</span>
      </nav>

      {/* Main Detail Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
        {/* Left: Product Image */}
        <div className="relative flex flex-col items-center justify-center bg-[#FBFDFB] rounded-xl p-8 border border-gray-100">
          {product.certification && (
            <div className="absolute top-4 left-4 z-10">
              <Badge certification={product.certification} />
            </div>
          )}
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={product.name}
              width={340}
              height={340}
              unoptimized={isSvg}
              className="object-contain max-h-[300px]"
              priority
            />
          </div>
        </div>

        {/* Right: Info & Purchase */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Nông sản kiểm định VFT Farms</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-3 border-b border-gray-100">
              <span>Xuất xứ: <strong className="text-gray-800">{product.origin || 'Lâm Đồng, VN'}</strong></span>
              <span>•</span>
              <span>Quy cách: <strong className="text-gray-800">{product.specification}</strong></span>
              <span>•</span>
              <span>Tồn kho: <strong className="text-[#2E7D32]">{product.stockQuantity}</strong></span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-[#2E7D32]">
                {price.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-sm font-medium text-gray-500">
                / {product.unit}
              </span>
              {product.salePrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Quantity, AddToCart, Traceability */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-gray-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    <span>Đã thêm vào giỏ!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Thêm vào giỏ hàng</span>
                  </>
                )}
              </button>

              {/* Traceability SHA-256 Trigger */}
              <button
                type="button"
                onClick={() => setIsTraceModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Nguồn gốc SHA-256</span>
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-2 bg-[#F1F8E9] p-3.5 rounded-xl text-center text-xs text-[#2E7D32] font-semibold">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Chứng nhận an toàn</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Giao hàng 2 giờ</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4" />
              <span>Đổi trả 24 giờ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Sản Phẩm Cùng Loại
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Traceability Modal */}
      <TraceabilityModal
        productId={product.id}
        productName={product.name}
        isOpen={isTraceModalOpen}
        onClose={() => setIsTraceModalOpen(false)}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Đang tải sản phẩm...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
