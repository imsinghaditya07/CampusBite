'use client';

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import FoodHero3D from '@/components/3d/FoodHero3D';

interface HeroSectionProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
}

export default function HeroSection({ onOrderNow, onExploreMenu }: HeroSectionProps) {
  return (
    <section id="hero" className="relative py-6 md:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Editorial Brand Headline & CTAs */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 z-10">
          
          {/* Micro Campus Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-bold text-[#171717] shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
            <span>Live Campus Food Operating System</span>
            <span className="text-[#6B6B6B]">·</span>
            <span className="text-[#D97706] font-black uppercase tracking-wider">Tap • Order • Eat</span>
          </div>

          {/* Large Platform Brand Headline */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-[#171717] tracking-tight leading-[1.02]">
              Campus<span className="text-[#F5B51B] relative inline-block">
                Bite
                <span className="absolute -top-2 right-4 text-[#16A34A] text-2xl sm:text-4xl select-none">🍃</span>
              </span>
              <span className="block text-xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-[#171717] mt-3 uppercase">
                Tap <span className="text-[#F5B51B]">•</span> Order <span className="text-[#F5B51B]">•</span> Eat
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-lg font-medium pt-2">
              Order your campus favourites ahead of time and pick them up fresh when they're ready. Skip lines, save time.
            </p>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            <button
              onClick={onOrderNow}
              className="px-7 py-3.5 rounded-2xl bg-[#F5B51B] text-[#171717] font-black text-sm hover:bg-[#e0a417] transition-all shadow-soft flex items-center gap-2 group"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreMenu}
              className="px-7 py-3.5 rounded-2xl bg-white border border-[#E8E8E3] text-[#171717] font-bold text-sm hover:border-[#171717] transition-all shadow-xs flex items-center gap-2"
            >
              <span>Explore Menu</span>
            </button>
          </div>

          {/* Supporting Micro Value Badges */}
          <div className="pt-4 border-t border-[#E8E8E3] grid grid-cols-3 gap-3 text-xs font-semibold text-[#6B6B6B]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>12+ Food Regions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Live Availability</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Smart QR Pickup</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean 3D Interactive Showcase Container */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          
          {/* Organic Warm Yellow Backdrop Shape */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 via-amber-100/30 to-orange-100/20 rounded-[48px] rotate-2 scale-95 -z-10 blur-xs" />

          {/* Clean 3D Canvas Box */}
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-premium border border-white/80 bg-white p-2.5">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <FoodHero3D />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
