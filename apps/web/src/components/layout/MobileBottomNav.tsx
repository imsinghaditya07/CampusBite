'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Utensils, MapPin, ShoppingBag, UserCheck, Clock, ArrowRight } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCart: () => void;
  onOpenCollegeModal: () => void;
  onOpenRoleModal: () => void;
  activeOrderId: string | null;
  onViewOrder: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileBottomNav({
  onOpenCart,
  onOpenCollegeModal,
  onOpenRoleModal,
  activeOrderId,
  onViewOrder,
  activeTab,
  setActiveTab,
}: MobileBottomNavProps) {
  const { cart, role, collegeName } = useStore();

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pointer-events-none">
      <div className="max-w-md mx-auto px-3 pb-2 space-y-2 pointer-events-auto">
        
        {/* Floating Sticky Cart Tray (Appears whenever cart has items & user is in Student mode) */}
        {role === 'STUDENT' && totalCartCount > 0 && (
          <div
            onClick={onOpenCart}
            className="bg-charcoal-950 text-surface p-3 rounded-2xl shadow-2xl border border-charcoal-800 flex items-center justify-between cursor-pointer transform hover:scale-[1.02] transition-all animate-in slide-in-from-bottom-4 duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-charcoal-950 flex items-center justify-center font-black text-xs">
                {totalCartCount}
              </div>
              <div>
                <span className="text-xs font-bold text-surface block">
                  {totalCartCount} {totalCartCount === 1 ? 'Item' : 'Items'} Added
                </span>
                <span className="text-[11px] text-amber-400 font-bold">₹{totalCartPrice} plus taxes</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-charcoal-950 font-black text-xs">
              <span>View Tray</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Mobile App Bottom Navigation Bar */}
        <div className="bg-surface/95 backdrop-blur-md border border-charcoal-200/80 rounded-2xl shadow-xl px-2 py-1.5 flex items-center justify-around text-[10px] font-bold text-charcoal-600">
          
          {/* 1. Menu Tab */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'explore'
                ? 'text-amber-600 font-black scale-105'
                : 'hover:text-charcoal-950'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu</span>
          </button>

          {/* 2. Campus & Map Location */}
          <button
            onClick={onOpenCollegeModal}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl hover:text-charcoal-950 transition-all"
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="truncate max-w-[60px]">Campus</span>
          </button>

          {/* 3. Live Order / Cart Tab */}
          {activeOrderId ? (
            <button
              onClick={onViewOrder}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-amber-600 font-black relative animate-pulse"
            >
              <Clock className="w-4 h-4" />
              <span>Live Order</span>
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          ) : (
            <button
              onClick={onOpenCart}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl hover:text-charcoal-950 transition-all relative"
            >
              <ShoppingBag className="w-4 h-4 text-charcoal-800" />
              <span>Cart ({totalCartCount})</span>
              {totalCartCount > 0 && (
                <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          )}

          {/* 4. Switch Portal / Role */}
          <button
            onClick={onOpenRoleModal}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl hover:text-charcoal-950 transition-all text-charcoal-700"
          >
            <UserCheck className="w-4 h-4 text-charcoal-900" />
            <span className="truncate max-w-[65px]">{role === 'STUDENT' ? 'Portals' : role.replace('_', ' ')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
