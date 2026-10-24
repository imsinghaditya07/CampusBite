'use client';

import React from 'react';
import { TrendingDown, Leaf, ShieldCheck, Cpu } from 'lucide-react';

export default function WasteSection() {
  const points = [
    {
      title: 'Predict Demand',
      desc: 'Smart algorithms analyze class timetables, weather, and historical campus consumption patterns.',
      icon: Cpu,
    },
    {
      title: 'Prepare Fresh',
      desc: 'Canteen kitchens receive precise morning prep quantities, ensuring ingredients are cooked fresh per order window.',
      icon: ShieldCheck,
    },
    {
      title: 'Zero Food Waste',
      desc: 'Reduces end-of-day food wastage by up to 34% across participating campus canteens and hostels.',
      icon: Leaf,
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white border border-[#E8E8E3] rounded-3xl my-6 p-6 sm:p-10 shadow-soft">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#16A34A] uppercase tracking-wider block">
            Sustainability & Efficiency
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            Smarter food. Less waste.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B]">
            CampusBite helps canteen operators prepare the right amount of food at the right time, minimizing waste and keeping prices affordable.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {points.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E8E3] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#171717]">{p.title}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
