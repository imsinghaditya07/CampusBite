'use client';

import React from 'react';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';

interface OffersSectionProps {
  onExploreOffers: () => void;
}

export default function OffersSection({ onExploreOffers }: OffersSectionProps) {
  const offers = [
    {
      title: 'South Indian Breakfast Combo',
      desc: '1x Masala Dosa + 1x Hot Filter Coffee',
      price: '₹85',
      originalPrice: '₹100',
      badge: 'Student Combo',
      code: 'CB-DOSA85',
    },
    {
      title: 'First Campus Order Discount',
      desc: 'Flat 15% OFF on your first 1-tap UPI order',
      price: '15% OFF',
      originalPrice: '',
      badge: 'New Student',
      code: 'FIRSTBITES',
    },
    {
      title: 'Exam Night Lunch & Snack Pack',
      desc: 'Chole Bhature + Cold Coffee + Chips',
      price: '₹110',
      originalPrice: '₹135',
      badge: 'Exam Combo',
      code: 'EXAMPACK',
    },
  ];

  return (
    <section id="offers" className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-3">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
              Campus Savings & Combos
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              Student Combos & Offers
            </h2>
          </div>
        </div>

        {/* Compact Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((o) => (
            <div
              key={o.title}
              className="p-5 rounded-2xl bg-white border border-[#E8E8E3] shadow-soft hover:border-[#171717] transition-all flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-[#D97706] text-[10px] font-black uppercase border border-amber-200">
                  {o.badge}
                </span>
                <span className="font-mono text-xs font-bold text-[#171717] bg-[#F4F4F5] px-2 py-0.5 rounded">
                  {o.code}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#171717]">{o.title}</h3>
                <p className="text-xs text-[#6B6B6B]">{o.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E3]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-lg text-[#171717]">{o.price}</span>
                  {o.originalPrice && (
                    <span className="line-through text-xs text-[#6B6B6B]">{o.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={onExploreOffers}
                  className="px-3 py-1.5 rounded-xl bg-[#F5B51B] text-[#171717] font-bold text-xs hover:bg-[#e0a417] transition-colors shadow-xs flex items-center gap-1"
                >
                  <span>Apply Offer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
