'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Tag, Clock, Sparkles, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (couponCode: string, slotId: string, specialNotes: string) => void;
}

export default function CartDrawer({ isOpen, onClose, onProceedToCheckout }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('slot-1');
  const [specialNotes, setSpecialNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = couponApplied ? Math.min(Math.round(subtotal * 0.2), 60) : 0;
  const tax = Math.round(subtotal * 0.05);
  const finalTotal = Math.max(subtotal - discount + tax, 0);

  const handleApplyCoupon = (codeToApply?: string) => {
    const targetCode = (codeToApply || coupon).toUpperCase().trim();
    if (targetCode === 'WELCOME50' || targetCode === 'CAMPUS20') {
      setCoupon(targetCode);
      setCouponApplied(true);
    } else {
      alert('Invalid Coupon Code. Tap "WELCOME50" below for 20% off!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-xs flex justify-end">
      <div className="bg-surface w-full sm:max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-charcoal-100 flex items-center justify-between bg-charcoal-950 text-surface">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-white overflow-hidden p-0.5 border border-charcoal-800 shrink-0">
              <Image src="/logo.png" alt="CampusBite" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg leading-tight">Your Order Tray</h2>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">CampusBite · Tap. Order. Eat.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-surface hover:bg-charcoal-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="font-bold text-base text-charcoal-950 mb-1">Your tray is empty</h3>
            <p className="text-xs text-charcoal-500 mb-5 max-w-xs">
              Add authentic campus dishes from the 12 food regions to start your order.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-charcoal-950 font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
            >
              Explore Canteen Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* Item List */}
              <div className="space-y-2.5">
                {cart.map((item) => (
                  <div
                    key={item.foodItemId}
                    className="flex items-center justify-between p-3 rounded-2xl border border-charcoal-100 bg-charcoal-50/50 hover:bg-charcoal-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-charcoal-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-3 h-3 rounded-[2px] border flex items-center justify-center shrink-0 ${
                              item.isVeg ? 'border-emerald-600 bg-white' : 'border-red-600 bg-white'
                            }`}
                          >
                            <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          </div>
                          <h4 className="font-bold text-xs text-charcoal-950 truncate">{item.name}</h4>
                        </div>
                        <p className="text-xs font-black text-charcoal-950 mt-0.5">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-surface px-2 py-1 rounded-xl border border-charcoal-200 shrink-0 ml-2">
                      <button
                        onClick={() => updateQuantity(item.foodItemId, -1)}
                        className="text-charcoal-600 hover:text-charcoal-950 p-1 hover:bg-charcoal-100 rounded-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black text-charcoal-950 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.foodItemId, 1)}
                        className="text-charcoal-600 hover:text-charcoal-950 p-1 hover:bg-charcoal-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pickup Slot Selection */}
              <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-charcoal-950">Pickup Time Slot</span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    Express Pickup
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {['12:00 - 12:15 PM', '12:15 - 12:30 PM', '12:30 - 12:45 PM', '12:45 - 01:00 PM'].map((slot, idx) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(`slot-${idx}`)}
                      className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-all ${
                        selectedSlot === `slot-${idx}`
                          ? 'border-amber-500 bg-amber-500 text-charcoal-950 font-bold shadow-xs'
                          : 'border-charcoal-200 bg-surface text-charcoal-700 hover:border-charcoal-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code with 1-Tap Preset */}
              <div className="p-3.5 rounded-2xl border border-charcoal-100 bg-surface space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-charcoal-950">Campus Promo Code</span>
                  </div>
                  {!couponApplied && (
                    <button
                      onClick={() => handleApplyCoupon('WELCOME50')}
                      className="text-[10px] text-amber-700 font-bold hover:underline"
                    >
                      Apply WELCOME50
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. WELCOME50)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500 uppercase font-bold"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-3.5 py-1.5 rounded-xl bg-charcoal-950 text-surface text-xs font-bold hover:bg-charcoal-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponApplied && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    ✓ Promo WELCOME50 applied! Saved ₹{discount}
                  </p>
                )}
              </div>

              {/* Special Instructions for Kitchen */}
              <div className="p-3.5 rounded-2xl border border-charcoal-100 bg-surface space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-950">
                  Custom Request / Notes for Kitchen
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Less spicy, extra coconut chutney, separate parcel..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500 resize-none bg-charcoal-50/50"
                />
              </div>

              {/* Bill Details Breakdown */}
              <div className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-charcoal-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-charcoal-900">₹{subtotal}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Promo Discount (20%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-600">
                  <span>GST & Campus Convenience (5%)</span>
                  <span className="font-semibold text-charcoal-900">₹{tax}</span>
                </div>
                <div className="pt-2 border-t border-charcoal-200 flex justify-between font-black text-sm text-charcoal-950">
                  <span>Total Payable</span>
                  <span className="text-base text-amber-600">₹{finalTotal}</span>
                </div>
              </div>
            </div>

            {/* Bottom Checkout CTA */}
            <div className="p-4 border-t border-charcoal-100 bg-surface space-y-2">
              <button
                onClick={() => onProceedToCheckout(coupon, selectedSlot, specialNotes)}
                className="w-full py-3 rounded-2xl bg-amber-500 text-charcoal-950 font-black text-sm hover:bg-amber-600 transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                Proceed to Checkout · ₹{finalTotal}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl text-charcoal-600 hover:text-charcoal-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Food Menu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
