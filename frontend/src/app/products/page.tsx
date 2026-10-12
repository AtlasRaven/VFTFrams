'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../../components/product/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../data/mockData';
import { Filter, SlidersHorizontal, Check } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedCert, setSelectedCert] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Search query
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const catId = Number(selectedCategory);
      result = result.filter((p) => {
        if (p.categoryId === catId) return true;
        // Check subcategory match if parent was selected
        const parent = MOCK_CATEGORIES.find((c) => c.id === catId);
        if (parent?.subcategories) {
          return parent.subcategories.some((sub) => sub.id === p.categoryId);
        }
        return false;
      });
    }

    // Certification filter
    if (selectedCert !== 'all') {
      result = result.filter((p) => p.certification === selectedCert);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchParam, selectedCategory, selectedCert, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {searchParam ? `Kết quả tìm kiếm cho: "${searchParam}"` : 'Tất Cả Sản Phẩm Nông Sản'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Hiển thị {filteredProducts.length} sản phẩm tươi sạch đạt chuẩn an toàn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-200 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 font-bold text-gray-900 text-base">
            <Filter className="w-4 h-4 text-[#2E7D32]" />
            <span>Bộ Lọc Sản Phẩm</span>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Danh mục
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>Tất cả</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>
              {MOCK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === String(cat.id)
                      ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === String(cat.id) && <Check className="w-3.5 h-3.5" />}
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
              {['all', 'VietGAP', 'VfSC'].map((cert) => (
                <button
                  key={cert}
                  onClick={() => setSelectedCert(cert)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCert === cert
                      ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cert === 'all' ? 'Tất cả chứng nhận' : cert}</span>
                  {selectedCert === cert && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 font-medium">
              Tìm thấy <strong className="text-gray-900">{filteredProducts.length}</strong> sản phẩm
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

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-500 text-sm">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCert('all');
                }}
                className="mt-4 text-xs font-bold text-[#2E7D32] underline cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Đang tải sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
