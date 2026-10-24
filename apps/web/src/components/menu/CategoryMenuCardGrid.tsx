'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, Search, MapPin, Compass, Clock, X, ArrowLeft, RotateCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import CollegeMapModal from '@/components/college/CollegeMapModal';

// Metadata configuration for each of the 12 categories
export const CATEGORY_CONFIG: Record<
  string,
  { tagline: string; headerImage: string }
> = {
  'North Indian': {
    tagline: 'RICH FLAVOURS, TIMELESS CLASSICS',
    headerImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  },
  'South Indian': {
    tagline: 'LIGHT. HEALTHY. DELICIOUS.',
    headerImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },
  'West Indian': {
    tagline: 'VIBRANT TASTES, EVERY BITE',
    headerImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
  },
  'East Indian': {
    tagline: 'UNIQUE FLAVOURS, RICH HERITAGE',
    headerImage: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
  },
  'Street Food': {
    tagline: 'CAMPUS FAVOURITES',
    headerImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  },
  'Rice & Biryani': {
    tagline: 'FOR THE RICE LOVERS',
    headerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  },
  Chinese: {
    tagline: 'BOLD. SPICY. ALWAYS A HIT.',
    headerImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
  },
  Beverages: {
    tagline: 'REFRESH. RECHARGE.',
    headerImage: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
  },
  'Snacks & Quick Bites': {
    tagline: 'PERFECT FOR A SHORT BREAK',
    headerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  Desserts: {
    tagline: 'SWEET ENDINGS',
    headerImage: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80',
  },
  'Meal Combos': {
    tagline: 'GREAT FOOD. BETTER VALUE.',
    headerImage: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  },
  'Diet & Healthy Options': {
    tagline: 'NUTRITION FOR A BETTER YOU',
    headerImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
};

export default function CategoryMenuCardGrid() {
  const { categories, collegeName, collegeCity, collegeState, addToCart, cart } = useStore();
  const [search, setSearch] = useState('');
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc'>('popularity');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [showCampusModal, setShowCampusModal] = useState(false);

  const handleAddItem = (item: any) => {
    if (item.isAvailable === false) return;
    addToCart({
      foodItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
    });

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 900);
  };

  // Filter & Sort categories and items
  const processedCategories = categories
    .filter((cat) => selectedRegion === 'ALL' || cat.name === selectedRegion)
    .map((cat) => {
      let items = cat.foodItems.filter((item) => {
        if (dietFilter === 'VEG' && !item.isVeg) return false;
        if (dietFilter === 'NON_VEG' && item.isVeg) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
        }
        return true;
      });

      if (sortBy === 'price_asc') {
        items = [...items].sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        items = [...items].sort((a, b) => b.price - a.price);
      } else {
        items = [...items].sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
      }

      return {
        ...cat,
        foodItems: items,
      };
    })
    .filter((cat) => cat.foodItems.length > 0);

  const totalFoodItemsCount = processedCategories.reduce((acc, c) => acc + c.foodItems.length, 0);

  const regionTabs = [
    { id: 'ALL', label: 'All 12 Regions' },
    { id: 'North Indian', label: 'NORTH INDIAN' },
    { id: 'South Indian', label: 'SOUTH INDIAN' },
    { id: 'West Indian', label: 'WEST INDIAN' },
    { id: 'East Indian', label: 'EAST INDIAN' },
    { id: 'Street Food', label: 'STREET FOOD' },
    { id: 'Rice & Biryani', label: 'RICE & BIRYANI' },
    { id: 'Chinese', label: 'CHINESE' },
    { id: 'Beverages', label: 'BEVERAGES' },
    { id: 'Snacks & Quick Bites', label: 'SNACKS & QUICK BITES' },
    { id: 'Desserts', label: 'DESSERTS' },
    { id: 'Meal Combos', label: 'MEAL COMBOS' },
    { id: 'Diet & Healthy Options', label: 'DIET & HEALTHY' },
  ];

  return (
    <div id="menu-catalog" className="space-y-4 sm:space-y-6 pt-4">
      
      {/* 1. TOP COLLEGE TITLE HERO BANNER */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#E8E8E3] shadow-soft space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAF7] border border-[#E8E8E3]">
            <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white shrink-0 p-0.5 border border-[#E8E8E3]">
              <Image src="/logo.png" alt="CampusBite" width={20} height={20} className="object-contain" />
            </div>
            <div className="flex items-center gap-1.5 text-[#171717] font-black text-[10px] sm:text-xs uppercase tracking-wider">
              <span>CAMPUSBITE</span>
              <span className="text-[#F5B51B]">•</span>
              <span className="text-[#6B6B6B] font-bold">LIVE MENU CATALOG</span>
            </div>
          </div>

          <button
            onClick={() => setShowCampusModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#D97706] bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-full transition-all border border-amber-200"
          >
            <Compass className="w-3.5 h-3.5 text-[#F5B51B]" />
            <span>Change Campus / GPS Map</span>
          </button>
        </div>

        <div className="relative z-10 space-y-1">
          <h2 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight">
            {collegeName || 'IIT Bombay Main Campus'}
          </h2>
          
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-2xl leading-relaxed">
            Explore our complete 12-region food court catalog with real-time stock availability, instant INR pricing, and 1-tap tray checkout.
          </p>
        </div>

        {/* Quick Highlights Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-[#6B6B6B] relative z-10">
          <span className="px-2.5 py-1 rounded-lg bg-[#FAFAF7] border border-[#E8E8E3] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#F5B51B]" /> {collegeCity}, {collegeState}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" /> Campus Canteen Open
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FAFAF7] border border-[#E8E8E3] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#F5B51B]" /> Avg Prep 7-10 Mins
          </span>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E8E8E3] shadow-soft space-y-3">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Dosa, Biryani, Momos, Cold Coffee, Thali..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs rounded-xl border border-[#E8E8E3] focus:outline-none focus:border-[#F5B51B] bg-[#FAFAF7]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#171717]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Diet + Sort */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            
            {/* Diet Filter Selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#171717]">
              <span className="text-[#6B6B6B] font-bold hidden sm:inline">Diet:</span>
              <div className="flex gap-1 bg-[#FAFAF7] p-1 rounded-full border border-[#E8E8E3]">
                <button
                  onClick={() => setDietFilter('ALL')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    dietFilter === 'ALL'
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'text-[#6B6B6B] hover:text-[#171717]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietFilter('VEG')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    dietFilter === 'VEG'
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'text-[#6B6B6B] hover:text-[#171717]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300" /> Veg
                </button>
                <button
                  onClick={() => setDietFilter('NON_VEG')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    dietFilter === 'NON_VEG'
                      ? 'bg-[#DC2626] text-white shadow-xs'
                      : 'text-[#6B6B6B] hover:text-[#171717]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-300" /> Non-Veg
                </button>
              </div>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAFAF7] border border-[#E8E8E3] text-[#171717] focus:outline-none focus:border-[#F5B51B]"
            >
              <option value="popularity">Popularity ★</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none border-t border-[#E8E8E3] pt-3">
          {regionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                selectedRegion === tab.id
                  ? 'bg-[#F5B51B] text-[#171717] font-black shadow-xs'
                  : 'bg-[#FAFAF7] text-[#6B6B6B] hover:text-[#171717] border border-[#E8E8E3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Clear Banner */}
      {(selectedRegion !== 'ALL' || search.trim() || dietFilter !== 'ALL') && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-[#171717]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedRegion('ALL');
                setSearch('');
                setDietFilter('ALL');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#171717] text-white text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All 12 Regions</span>
            </button>
            <span className="font-bold text-[#171717] hidden sm:inline">
              Showing: {selectedRegion !== 'ALL' ? selectedRegion : 'Filtered Dishes'} ({totalFoodItemsCount} items)
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedRegion('ALL');
              setSearch('');
              setDietFilter('ALL');
            }}
            className="text-xs text-[#D97706] hover:underline font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear All Filters
          </button>
        </div>
      )}

      {/* MENU CATEGORY COLUMNS GRID */}
      {processedCategories.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E8E3] space-y-3">
          <p className="text-sm font-bold text-[#171717]">No food dishes found matching your search or diet filter.</p>
          <button
            onClick={() => {
              setSearch('');
              setDietFilter('ALL');
              setSelectedRegion('ALL');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5B51B] text-[#171717] text-xs font-black hover:bg-[#e0a417] transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Full Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {processedCategories.map((cat) => {
            const config = CATEGORY_CONFIG[cat.name] || {
              tagline: 'CAMPUS DELIGHTS',
              headerImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
            };

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-[#E8E8E3] shadow-soft overflow-hidden flex flex-col hover:border-[#171717] transition-all"
              >
                {/* Category Card Clean Header (No Rainbow Colors!) */}
                <div className="p-3 text-center bg-[#171717] text-white shrink-0">
                  <h3 className="font-black text-xs uppercase tracking-wider">{cat.name}</h3>
                  <p className="text-[9px] font-semibold tracking-widest uppercase text-zinc-400 mt-0.5">
                    {config.tagline}
                  </p>
                </div>

                {/* Category Hero Image */}
                <div className="relative w-full h-28 bg-[#FAFAF7] overflow-hidden shrink-0">
                  <Image
                    src={config.headerImage}
                    alt={cat.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
                </div>

                {/* Food Items Rows inside Card */}
                <div className="p-3 divide-y divide-[#E8E8E3] space-y-1 flex-1">
                  {cat.foodItems.map((item) => {
                    const isAvail = item.isAvailable !== false;
                    const isAdded = addedItemIds[item.id];
                    const inCartItem = cart.find((c) => c.foodItemId === item.id);
                    const cartQty = inCartItem?.quantity || 0;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleAddItem(item)}
                        className={`pt-2 pb-1.5 flex items-center justify-between gap-2 group cursor-pointer transition-colors ${
                          !isAvail ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FAFAF7] rounded-lg px-1.5'
                        }`}
                      >
                        {/* Left: Veg/Non-Veg Icon + Item Name */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 ${
                              item.isVeg ? 'border-[#16A34A] bg-white' : 'border-[#DC2626] bg-white'
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isVeg ? 'bg-[#16A34A]' : 'bg-[#DC2626]'
                              }`}
                            />
                          </div>

                          <span
                            className={`text-xs font-bold text-[#171717] truncate group-hover:text-[#D97706] transition-colors ${
                              !isAvail ? 'line-through text-[#6B6B6B]' : ''
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        {/* Right: Price & Circular Add Button */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-black text-[#171717]">₹{item.price}</span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddItem(item);
                            }}
                            disabled={!isAvail}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-xs ${
                              !isAvail
                                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                : isAdded
                                ? 'bg-[#16A34A] text-white scale-110'
                                : cartQty > 0
                                ? 'bg-[#F5B51B] text-[#171717] font-bold ring-2 ring-[#F5B51B]/40'
                                : 'bg-[#171717] text-white hover:bg-[#F5B51B] hover:text-[#171717]'
                            }`}
                          >
                            {isAdded ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : cartQty > 0 ? (
                              cartQty
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* College & Map Location Modal */}
      <CollegeMapModal
        isOpen={showCampusModal}
        onClose={() => setShowCampusModal(false)}
      />
    </div>
  );
}
