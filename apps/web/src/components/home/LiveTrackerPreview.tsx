'use client';

import React from 'react';
import { Clock, CheckCircle2, QrCode, Navigation, Sparkles } from 'lucide-react';

export default function LiveTrackerPreview() {
  const steps = [
    { label: 'Placed', done: true },
    { label: 'Payment', done: true },
    { label: 'Accepted', done: true },
    { label: 'Preparing', active: true },
    { label: 'Ready', done: false },
    { label: 'Picked Up', done: false },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#171717] text-white rounded-3xl my-6 overflow-hidden relative shadow-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Explanation Column */}
        <div className="lg:col-span-6 space-y-4">
          <span className="px-3 py-1 rounded-full bg-[#F5B51B] text-[#171717] text-[10px] font-black uppercase inline-block">
            Real-Time Order Tracking
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Know exactly when to walk to the counter.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
            Track live kitchen status from your lecture hall or hostel room. Receive instant alerts when your dish is hot and ready.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F5B51B]" />
              <span>Zero Queue Waiting</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F5B51B]" />
              <span>Counter Number Assigned</span>
            </div>
          </div>
        </div>

        {/* Right Live Product UI Widget */}
        <div className="lg:col-span-6">
          <div className="bg-[#242428] rounded-2xl p-5 border border-zinc-700/80 shadow-2xl space-y-4">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
              <div>
                <span className="text-[10px] font-mono text-[#F5B51B] font-bold block">
                  ORDER #CB204 · IIT BOMBAY MAIN CANTEEN
                </span>
                <h3 className="font-bold text-sm text-white">1x Masala Dosa, 1x Cold Coffee</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block">Estimated Time</span>
                <span className="font-mono text-base font-black text-emerald-400 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-400 animate-pulse" /> 04:32
                </span>
              </div>
            </div>

            {/* Progress Step Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
                {steps.map((s, idx) => (
                  <span
                    key={s.label}
                    className={s.active ? 'text-[#F5B51B] font-black' : s.done ? 'text-white' : 'text-zinc-600'}
                  >
                    {s.label}
                  </span>
                ))}
              </div>

              {/* Progress bar track */}
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                <div className="h-full bg-[#F5B51B] w-3/5 rounded-full transition-all duration-500" />
              </div>
            </div>

            {/* Counter & QR Code Footer */}
            <div className="pt-2 flex items-center justify-between bg-[#1D1D20] p-3 rounded-xl border border-zinc-700/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                  02
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Pickup Location</span>
                  <span className="text-xs font-bold text-white">Station Counter #02</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white text-[#171717] px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold shadow-xs">
                <QrCode className="w-4 h-4 text-[#171717]" />
                <span>QR Token Ready</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
