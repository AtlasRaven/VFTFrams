'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../data/mockData';

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string, categoryId?: number) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = '', onSearch }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      const catId = selectedCategory === 'all' ? undefined : Number(selectedCategory);
      onSearch(searchTerm, catId);
    } else {
      const catParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      router.push(`/products?search=${encodeURIComponent(searchTerm)}${catParam}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`relative flex items-center w-full max-w-2xl border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#2E7D32] focus-within:border-[#2E7D32] shadow-xs transition-all ${className}`}
    >
      {/* Category selector dropdown */}
      <div className="relative border-r border-gray-200 shrink-0">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="appearance-none bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium py-2.5 pl-3 pr-7 focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          aria-label="Chọn danh mục tìm kiếm"
        >
          <option value="all">Tất cả danh mục</option>
          {MOCK_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
          ▼
        </span>
      </div>

      {/* Text input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tìm sản phẩm..."
        className="w-full px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
      />

      {/* Search button with magnifying glass */}
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2.5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
      </button>
    </form>
  );
};
