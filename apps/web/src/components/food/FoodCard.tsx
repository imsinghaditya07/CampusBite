'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Clock, Plus, Flame, Check, Ban, Utensils } from 'lucide-react';
import { useStore } from '@/store/useStore';

export interface FoodItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable?: boolean;
  rating: number;
  prepTimeMinutes: number;
  image: string;
  calories?: number;
  spiceLevel?: string;
  category?: { name: string };
}

export default function FoodCard({ item }: { item: FoodItemProps }) {
  const { addToCart, cart } = useStore();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image);
  const [imgError, setImgError] = useState(false);

  const isAvailable = item.isAvailable !== false;
  const cartItem = cart.find((c) => c.foodItemId === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart({
      foodItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className={`group bg-surface rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
        isAvailable
          ? 'border-charcoal-100 shadow-xs hover:shadow-soft hover:border-charcoal-300'
          : 'border-red-100 bg-charcoal-50/70 opacity-85'
      }`}
    >
      {/* 55-60% Aspect Ratio Dish Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-charcoal-100 flex items-center justify-center">
        {!imgError ? (
          <Image
            src={imgSrc || item.image}
            alt={item.name}
            fill
            onError={() => {
              setImgError(true);
              setImgSrc('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80');
            }}
            className={`object-cover object-center transition-transform duration-500 ${
              isAvailable ? 'group-hover:scale-105' : 'grayscale'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 text-amber-900 p-4">
            <Utensils className="w-8 h-8 text-amber-500 mb-1" />
            <span className="text-[11px] font-bold text-center">{item.name}</span>
          </div>
        )}

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-2.5 left-2.5 bg-surface/95 backdrop-blur-md px-2 py-1 rounded-md border border-charcoal-200/80 flex items-center gap-1.5 shadow-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full border ${
              item.isVeg ? 'bg-veg border-emerald-700' : 'bg-nonveg border-red-700'
            }`}
          />
          <span className="text-[10px] font-black tracking-wide text-charcoal-900 uppercase">
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Rating / Availability Badge */}
        {!isAvailable ? (
          <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <Ban className="w-3 h-3" /> SOLD OUT
          </div>
        ) : (
          <div className="absolute top-2.5 right-2.5 bg-surface/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-charcoal-200/80 flex items-center gap-1 text-xs font-bold text-charcoal-900 shadow-xs">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{item.rating || 4.8}</span>
          </div>
        )}
      </div>

      {/* Card Body with Clean Typography Alignment */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-bold text-sm text-charcoal-950 line-clamp-1 group-hover:text-brand-600 transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-[11px] text-charcoal-500 line-clamp-2 mt-1 leading-relaxed min-h-[32px]">
            {item.description}
          </p>
        </div>

        {/* Footer: Prep time + Calories & Price + Add Button */}
        <div className="space-y-2 pt-1 border-t border-charcoal-100">
          <div className="flex items-center justify-between text-[10px] font-semibold text-charcoal-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-charcoal-400" />
              {item.prepTimeMinutes || 5} mins
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              {item.calories || 250} kcal
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[9px] text-charcoal-400 uppercase font-black tracking-wider block">Price</span>
              <p className="font-black text-base text-charcoal-950 leading-none">₹{item.price}</p>
            </div>

            <button
              onClick={handleAdd}
              disabled={!isAvailable}
              className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
                !isAvailable
                  ? 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed border border-charcoal-200'
                  : added
                  ? 'bg-veg text-surface'
                  : currentQuantity > 0
                  ? 'bg-brand-500 text-charcoal-950 hover:bg-brand-600'
                  : 'bg-charcoal-950 text-surface hover:bg-charcoal-800'
              }`}
            >
              {!isAvailable ? (
                'Unavailable'
              ) : added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : currentQuantity > 0 ? (
                <>
                  <Plus className="w-3.5 h-3.5" /> ({currentQuantity})
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
