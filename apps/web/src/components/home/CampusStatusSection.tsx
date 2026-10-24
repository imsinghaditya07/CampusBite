'use client';

import React from 'react';
import { Clock, Navigation, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function CampusStatusSection() {
  const { collegeName } = useStore();

  const canteens = [
    { name: 'Main Campus Canteen', status: 'OPEN', waitTime: '6 min', ordersInQueue: 4, badge: 'Popular' },
    { name: 'Central Food Court', status: 'OPEN', waitTime: '11 min', ordersInQueue: 9, badge: 'Express' },
    { name: 'Hostel Block Cafe 01', status: 'OPEN', waitTime: '4 min', ordersInQueue: 2, badge: 'Fast' },
    { name: 'Fresh Juice & Snacks Corner', status: 'BUSY', waitTime: '13 min', ordersInQueue: 14, badge: 'Throttled' },
  ];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E3] pb-3">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
              Real-Time Campus Telemetry
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              What's cooking on your campus?
            </h2>
          </div>
          <span className="text-xs text-[#6B6B6B] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
            <span>Connected to {collegeName} Kitchen Queue</span>
          </span>
        </div>

        {/* Real-Time Operational Canteen Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {canteens.map((c) => (
            <div
              key={c.name}
              className="p-4 rounded-2xl bg-white border border-[#E8E8E3] shadow-soft hover:border-[#171717] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-[#171717] line-clamp-1">{c.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                    c.status === 'OPEN'
                      ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#E8E8E3] text-xs">
                <span className="text-[#6B6B6B] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#171717]" /> ~{c.waitTime} wait
                </span>
                <span className="font-mono text-[11px] font-bold text-[#171717]">
                  {c.ordersInQueue} active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
