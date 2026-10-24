'use client';

import React from 'react';
import FoodCard, { FoodItemProps } from '@/components/food/FoodCard';
import { useStore } from '@/store/useStore';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TodaysFavouritesProps {
  onViewAllMenu: () => void;
}

export default function TodaysFavourites({ onViewAllMenu }: TodaysFavouritesProps) {
  const { foodItems } = useStore();

  // Select top 8 popular dishes across campus
  const favourites = foodItems.slice(0, 8);

  return (
    <section id="favourites" className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E8E3] pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
              Trending Campus Orders
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Today's Favourites
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              What students across your campus are ordering right now
            </p>
          </div>

          <button
            onClick={onViewAllMenu}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E8E8E3] text-[#171717] hover:border-[#171717] text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>View Full Menu ({foodItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Premium Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {favourites.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
