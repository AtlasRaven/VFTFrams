'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { HERO_SLIDES } from '../../data/mockData';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
              {slide.title}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 max-w-xl font-normal leading-relaxed opacity-90">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={slide.link}
                className="bg-[#4CAF50] hover:bg-[#388E3C] text-white text-sm sm:text-base font-extrabold px-6 py-3.5 rounded-lg flex items-center gap-2.5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <Link
                href="/products"
                className="border border-white/30 hover:bg-white/10 text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-lg transition-all"
              >
                Tất Cả Nông Sản
              </Link>
            </div>

            {/* Bullet features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs sm:text-sm text-emerald-100">
              <div>
                <span className="font-bold text-white block text-base">100%</span>
                Chứng nhận VietGAP
              </div>
              <div>
                <span className="font-bold text-white block text-base">2 Giờ</span>
                Giao hàng nội thành
              </div>
              <div>
                <span className="font-bold text-white block text-base">Đổi trả 24h</span>
                Cam kết hoàn tiền
              </div>
            </div>
          </div>

          {/* Banner Graphic Illustration */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5 backdrop-blur-xs flex items-center justify-center p-4">
              <Image
                src={slide.image}
                alt={slide.title}
                width={500}
                height={350}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        aria-label="Slide trước"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        aria-label="Slide tiếp theo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === idx ? 'w-8 bg-white' : 'bg-white/40'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
