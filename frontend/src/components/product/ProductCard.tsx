'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Badge } from './Badge';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const formattedPrice = (product.salePrice ?? product.price).toLocaleString('vi-VN');

  return (
    <div
      className={`group relative bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* Corner Certification Badge */}
      {product.certification && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <Badge certification={product.certification} />
        </div>
      )}

      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square bg-[#FBFDFB] flex items-center justify-center p-4 overflow-hidden"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={220}
          height={220}
          className="object-contain w-full h-full max-h-[190px] group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Product Name & Specification */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">
            {product.specification}
          </p>

          {/* Unit & Stock info (Exact match to real screenshots) */}
          <div className="mt-2 text-[11px] text-gray-500 space-y-0.5">
            <div>
              Khối lượng: <span className="text-gray-700 font-medium">{product.unit}</span>
            </div>
            <div>
              Số lượng kho: <span className="text-gray-700 font-medium">{product.stockQuantity}</span>
            </div>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="text-sm sm:text-base font-extrabold text-[#2E7D32]">
              {formattedPrice}đ <span className="text-xs font-normal text-gray-500">/ {product.unit}</span>
            </div>
            {product.salePrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          {/* "Thêm" Button */}
          <button
            onClick={handleAddToCart}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <ShoppingCart className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
