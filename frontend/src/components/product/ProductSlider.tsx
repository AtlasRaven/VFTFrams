'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductSliderProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  products,
  viewAllLink = '/products',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-white" id="ban-chay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-6 bg-[#2E7D32] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>

          {/* Circular Navigation Buttons (< and >) */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#2E7D32] hover:bg-[#E8F5E9] hover:text-[#2E7D32] text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#2E7D32] hover:bg-[#E8F5E9] hover:text-[#2E7D32] text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider / Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-thin no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[240px] sm:w-[260px] md:w-[280px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Center "Xem thêm" Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center justify-center px-8 py-2.5 border border-[#2E7D32] text-sm font-bold text-[#2E7D32] bg-white hover:bg-[#2E7D32] hover:text-white rounded-md shadow-xs transition-colors duration-200 cursor-pointer"
          >
            Xem thêm
          </Link>
        </div>
      </div>
    </section>
  );
};
