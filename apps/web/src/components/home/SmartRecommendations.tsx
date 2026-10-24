'use client';

import React from 'react';
import FoodCard from '@/components/food/FoodCard';
import { useStore } from '@/store/useStore';

export default function SmartRecommendations() {
  const { foodItems } = useStore();

  // Selected recommendations (e.g. items 4 to 8)
  const recommendations = foodItems.slice(3, 7);

  return (
    <section className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="border-b border-[#E8E8E3] pb-3">
          <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
            Personalized Campus Selection
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
            Picked for you
          </h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Based on what students are loving on your campus today
          </p>
        </div>

        {/* Recommended Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
