'use client';

import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface FinalCTASectionProps {
  onStartOrdering: () => void;
}

export default function FinalCTASection({ onStartOrdering }: FinalCTASectionProps) {
  return (
    <section className="py-10 sm:py-16 my-8 rounded-3xl bg-[#171717] text-white p-8 sm:p-14 text-center space-y-6 shadow-premium relative overflow-hidden">
      {/* Background Yellow Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5B51B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-4 relative z-10">
        <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
          Ready to Eat?
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Your next meal is already waiting.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
          Order ahead, skip the long break lines, and pick up fresh hot food directly from your campus canteens.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onStartOrdering}
            className="px-8 py-4 rounded-2xl bg-[#F5B51B] text-[#171717] font-black text-sm hover:bg-[#e0a417] transition-all shadow-soft flex items-center gap-2 group"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Ordering Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
