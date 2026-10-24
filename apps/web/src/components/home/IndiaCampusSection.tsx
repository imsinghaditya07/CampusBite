'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Globe } from 'lucide-react';

interface IndiaCampusSectionProps {
  onSelectRegion: (regionName: string) => void;
}

export default function IndiaCampusSection({ onSelectRegion }: IndiaCampusSectionProps) {
  const regions = [
    {
      name: 'North Indian',
      label: 'North India',
      desc: 'Chole Bhature, Dal Makhani & Tandoori Parathas',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      span: 'sm:col-span-2 lg:col-span-2',
    },
    {
      name: 'South Indian',
      label: 'South India',
      desc: 'Crispy Dosa, Idli Sambar & Filter Coffee',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
      span: 'sm:col-span-1 lg:col-span-1',
    },
    {
      name: 'West Indian',
      label: 'West India',
      desc: 'Vada Pav, Pav Bhaji & Misal Pav',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
      span: 'sm:col-span-1 lg:col-span-1',
    },
    {
      name: 'East Indian',
      label: 'East & Central India',
      desc: 'Kathi Rolls, Fish Fry & Rosogolla',
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
      span: 'sm:col-span-2 lg:col-span-2',
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E8E3] pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#F5B51B] uppercase tracking-wider block">
              Culinary Diversity
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Taste India on Your Campus
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Authentic regional food traditions prepared fresh in your campus kitchens
            </p>
          </div>
        </div>

        {/* Editorial Asymmetric Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {regions.map((r) => (
            <div
              key={r.name}
              onClick={() => onSelectRegion(r.name)}
              className={`group relative h-64 sm:h-72 rounded-3xl overflow-hidden border border-[#E8E8E3] cursor-pointer shadow-soft ${r.span}`}
            >
              <Image
                src={r.image}
                alt={r.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5B51B] text-[#171717] text-[10px] font-black uppercase inline-block">
                  {r.label}
                </span>
                <h3 className="text-lg font-black tracking-tight">{r.desc}</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                  <span>Explore Region</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
