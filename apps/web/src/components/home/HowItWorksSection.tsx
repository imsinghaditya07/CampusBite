'use client';

import React from 'react';
import { Smartphone, CreditCard, QrCode } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Choose your food',
      desc: 'Browse live campus menus across 12 regions, customize dietary options, and check real-time canteen wait times.',
      icon: Smartphone,
    },
    {
      step: '02',
      title: 'Order & Pay',
      desc: 'Pay instantly via UPI (GPay, PhonePe, Paytm) or cards. Your order is dispatched directly to the kitchen display screen.',
      icon: CreditCard,
    },
    {
      step: '03',
      title: 'Pick it up',
      desc: 'Receive a live notification when your food is ready. Scan your cryptographic QR code at the counter and enjoy!',
      icon: QrCode,
    },
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
            Seamless Ordering Flow
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight">
            From craving to pickup in seconds.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B]">
            Designed specifically for student routines and fast campus break windows
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-6 rounded-3xl bg-white border border-[#E8E8E3] shadow-soft hover:border-[#171717] transition-all space-y-4 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-[#F5B51B]">{s.step}</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#171717] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-5 h-5 text-[#F5B51B]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#171717] tracking-tight">{s.title}</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
