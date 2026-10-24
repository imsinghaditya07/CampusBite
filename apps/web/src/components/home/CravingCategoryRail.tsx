'use client';

import React from 'react';
import Image from 'next/image';

interface CravingCategoryRailProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CRAVING_CATEGORIES = [
  { name: 'Breakfast', icon: '🥞', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
  { name: 'North Indian', icon: '🍲', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
  { name: 'South Indian', icon: '🥞', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80' },
  { name: 'Street Food', icon: '🍢', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
  { name: 'Rice & Biryani', icon: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chinese', icon: '🍜', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },
  { name: 'Snacks & Quick Bites', icon: '🥪', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
  { name: 'Beverages', icon: '🧃', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Desserts', icon: '🍨', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Diet & Healthy Options', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
];

export default function CravingCategoryRail({
  selectedCategory,
  onSelectCategory,
}: CravingCategoryRailProps) {
  return (
    <section id="cravings" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-3">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
              Curated Menu Categories
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              What are you craving?
            </h2>
          </div>
          <span className="text-xs text-[#6B6B6B] font-semibold hidden sm:inline">
            Scroll or tap to filter
          </span>
        </div>

        {/* Clean Neutral Horizontal Rail (No Rainbow UI!) */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('ALL')}
            className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl border transition-all shrink-0 min-w-[90px] ${
              selectedCategory === 'ALL'
                ? 'bg-[#171717] text-white border-[#171717] shadow-soft font-bold'
                : 'bg-white text-[#171717] border-[#E8E8E3] hover:border-[#171717]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-xl shrink-0">
              🍽️
            </div>
            <span className="text-xs font-bold whitespace-nowrap">All Items</span>
          </button>

          {CRAVING_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl border transition-all shrink-0 min-w-[100px] ${
                  isSelected
                    ? 'bg-white border-[#F5B51B] shadow-soft text-[#171717] ring-2 ring-[#F5B51B]/40'
                    : 'bg-white border-[#E8E8E3] text-[#171717] hover:border-[#171717]'
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#F5B51B] border border-white" />
                  )}
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
