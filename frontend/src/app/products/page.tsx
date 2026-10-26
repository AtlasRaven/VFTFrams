'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '../../components/product/ProductCard';
import { productService, categoryService } from '../../services/api';
import type { Product, Category, PaginationInfo } from '../../types';
import {
  Filter,
  SlidersHorizontal,
  Check,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const pageParam = searchParams.get('page');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState<number>(pageParam ? Number(pageParam) : 1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedCert, setSelectedCert] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Đồng bộ query param category trên URL vào state
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
    setCurrentPage(1);
  }, [categoryParam]);

  // Đồng bộ query param page trên URL vào state
  useEffect(() => {
    if (pageParam) {
      setCurrentPage(Number(pageParam) || 1);
    }
  }, [pageParam]);

  // Tải danh sách 10 danh mục từ API
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getAll()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error('Lỗi tải danh mục:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Tải danh sách sản phẩm theo trang và bộ lọc từ Backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const catId = selectedCategory !== 'all' ? Number(selectedCategory) : undefined;
    const cert = selectedCert !== 'all' ? selectedCert : undefined;

    productService
      .getPaginated({
        categoryId: catId,
        certification: cert,
        search: searchParam || undefined,
        limit: ITEMS_PER_PAGE,
        page: currentPage,
      })
      .then((res) => {
        if (isMounted) {
          setProducts(res.items || []);
          setPagination(
            res.pagination || {
              total: res.items.length,
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              totalPages: 1,
            },
          );
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Lỗi tải sản phẩm:', err);
          setError('Không thể kết nối đến máy chủ nông sản. Vui lòng thử lại sau.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedCert, searchParam, currentPage]);

  // Sắp xếp dữ liệu của trang hiện tại
  const sortedProducts = useMemo(() => {
    const result = [...products];
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [products, sortBy]);

  // Tìm tên danh mục đang chọn để hiển thị tiêu đề
  const currentCategoryName = useMemo(() => {
    if (selectedCategory === 'all') return null;
    const cat = categories.find((c) => String(c.id) === selectedCategory);
    return cat ? cat.name : null;
  }, [selectedCategory, categories]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    if (catId === 'all') {
      router.push('/products');
    } else {
      router.push(`/products?category=${catId}`);
    }
  };

  const handleSelectCert = (cert: string) => {
    setSelectedCert(cert);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {searchParam
              ? `Kết quả tìm kiếm cho: "${searchParam}"`
              : currentCategoryName
                ? `Nông Sản: ${currentCategoryName}`
                : 'Tất Cả Sản Phẩm Nông Sản'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isLoading
              ? 'Đang kết nối hệ thống dữ liệu...'
              : `Hiển thị ${sortedProducts.length} trên tổng số ${pagination.total} nông sản đạt chuẩn an toàn`}
          </p>
        </div>

        {/* Quick Total Badges */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="bg-emerald-50 text-[#2E7D32] px-3 py-1 rounded-full font-bold border border-emerald-200">
            Trang {pagination.page} / {Math.max(1, pagination.totalPages)}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
            Tổng {pagination.total} sản phẩm
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-200 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 font-bold text-gray-900 text-base">
            <Filter className="w-4 h-4 text-[#2E7D32]" />
            <span>Bộ Lọc Sản Phẩm</span>
          </div>

          {/* 10 Agricultural Categories Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                10 Danh mục nông nghiệp
              </h3>
              <Layers className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleSelectCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold shadow-xs'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>Tất cả nông sản</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(String(cat.id))}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === String(cat.id)
                      ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate pr-1">{cat.name}</span>
                  {selectedCategory === String(cat.id) && (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Certification Filter */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Chứng nhận an toàn
            </h3>
            <div className="space-y-1">
              {[
                { label: 'Tất cả chứng nhận', value: 'all' },
                { label: 'Chuẩn VietGAP', value: 'VietGAP' },
                { label: 'Chuỗi an toàn VfSC', value: 'VfSC' },
                { label: 'Hữu cơ Organic', value: 'Organic' },
                { label: 'Kiểm nghiệm HACCP', value: 'HACCP' },
              ].map((cert) => (
                <button
                  key={cert.value}
                  onClick={() => handleSelectCert(cert.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCert === cert.value
                      ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cert.label}</span>
                  {selectedCert === cert.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Product Grid & Pagination */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">
              Đang hiển thị <strong className="text-gray-900">{sortedProducts.length}</strong> nông sản trên trang {pagination.page}
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm border-none bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="default">Mặc định: Phổ biến nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name">Tên: A - Z</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-lg p-4 space-y-3 animate-pulse"
                >
                  <div className="w-full aspect-square bg-gray-200 rounded-md" />
                  <div className="h-4 bg-gray-200 rounded-sm w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-sm w-1/2" />
                  <div className="h-4 bg-gray-200 rounded-sm w-1/3 pt-2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-xs">
              <p className="text-gray-500 text-sm font-medium">
                Không tìm thấy nông sản nào phù hợp với bộ lọc đã chọn.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCert('all');
                  setCurrentPage(1);
                  router.push('/products');
                }}
                className="mt-4 inline-block bg-[#2E7D32] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#1B5E20] transition-colors cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="pt-6 pb-2 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-500">
                    Trang <strong className="text-gray-900">{pagination.page}</strong> / {pagination.totalPages} (Tổng cộng {pagination.total} nông sản)
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        currentPage <= 1
                          ? 'text-gray-300 border border-gray-200 cursor-not-allowed bg-gray-50'
                          : 'text-gray-700 border border-gray-300 hover:bg-[#E8F5E9] hover:text-[#2E7D32] hover:border-[#2E7D32]'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Trước</span>
                    </button>

                    {/* Numbered Page Buttons */}
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#2E7D32] text-white shadow-xs'
                              : 'text-gray-700 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= pagination.totalPages}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        currentPage >= pagination.totalPages
                          ? 'text-gray-300 border border-gray-200 cursor-not-allowed bg-gray-50'
                          : 'text-gray-700 border border-gray-300 hover:bg-[#E8F5E9] hover:text-[#2E7D32] hover:border-[#2E7D32]'
                      }`}
                    >
                      <span>Sau</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
          <p className="text-sm font-medium">Đang tải danh sách nông sản...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
