'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, QrCode, Utensils, AlertCircle, RefreshCw, ArrowLeft, Sparkles, Navigation } from 'lucide-react';
import Image from 'next/image';
import io from 'socket.io-client';

interface LiveOrderTrackerProps {
  orderId: string;
  initialOrder?: any;
  onBackToMenu?: () => void;
}

export default function LiveOrderTracker({ orderId, initialOrder, onBackToMenu }: LiveOrderTrackerProps) {
  const [order, setOrder] = useState<any>(initialOrder || null);
  const [loading, setLoading] = useState(!initialOrder);

  useEffect(() => {
    // Fetch initial order details
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error('Fetch order error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Connect to Socket.IO for real-time live order status updates
    const socket = io('http://localhost:4000');
    socket.emit('join_order', orderId);

    socket.on('order.updated', (updatedOrder: any) => {
      if (updatedOrder.id === orderId) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  if (loading || !order) {
    return (
      <div className="p-8 text-center bg-surface rounded-3xl border border-charcoal-200/80 shadow-soft max-w-2xl mx-auto">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-charcoal-700">Connecting to Canteen Kitchen Stream...</p>
        <span className="text-[10px] text-charcoal-400 mt-1 block">Listening for real-time KDS status</span>
      </div>
    );
  }

  const steps = ['PAID', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 1;

  return (
    <div className="bg-surface rounded-2xl sm:rounded-3xl border border-charcoal-200/80 overflow-hidden shadow-soft max-w-2xl mx-auto space-y-0">
      
      {/* Tracker Header */}
      <div className="bg-charcoal-950 text-surface p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 border border-charcoal-700 text-amber-400 hover:bg-charcoal-800 text-xs font-bold transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Menu</span>
              </button>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-charcoal-950 text-[10px] sm:text-[11px] font-black uppercase">
              {order.status}
            </span>
            <span className="text-xs text-charcoal-400 font-mono">#{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <div className="relative w-8 h-8 rounded-xl bg-white overflow-hidden p-0.5 border border-charcoal-800 shrink-0">
              <Image src="/logo.png" alt="CampusBite" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">{order.canteen?.name || 'CampusBite Central Food Hub'}</h2>
              <p className="text-xs text-charcoal-400">Pickup Counter: {order.counter?.name || 'Counter A (Ground Floor)'}</p>
            </div>
          </div>
        </div>

        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl sm:rounded-2xl p-3 text-left sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
          <div className="text-[10px] text-charcoal-400 font-semibold uppercase">Estimated Prep</div>
          <div className="text-base sm:text-lg font-black text-amber-400 flex items-center justify-end gap-1">
            <Clock className="w-4 h-4" />
            {order.estimatedReadyTime || '8 mins'}
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="p-4 sm:p-6 border-b border-charcoal-100 bg-charcoal-50/30">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-charcoal-200 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-500 -z-0"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            return (
              <div key={step} className="flex flex-col items-center gap-1 relative z-10">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? 'bg-amber-500 text-charcoal-950 shadow-sm font-black'
                      : 'bg-surface border-2 border-charcoal-300 text-charcoal-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-bold ${isDone ? 'text-charcoal-950 font-black' : 'text-charcoal-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Queue Position & QR Section */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center bg-amber-50/20">
        
        {/* Queue Info */}
        <div className="space-y-3">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-charcoal-200/80 space-y-2">
            <div className="text-[10px] sm:text-xs font-black text-charcoal-500 uppercase tracking-wider">
              Live Queue Tracker
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-charcoal-700">Orders ahead of you</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-black text-xs sm:text-sm">
                {order.queuePosition || 2} orders
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-charcoal-700">Pickup Counter</span>
              <span className="font-bold text-xs text-charcoal-950">Counter A Desk</span>
            </div>
          </div>

          <div className="text-xs text-charcoal-600 bg-amber-50 p-3 rounded-2xl border border-amber-200/80">
            💡 Show the QR code at the counter when order status changes to <strong>READY</strong>.
          </div>
        </div>

        {/* QR Code Pickup Verification Card */}
        <div className="bg-surface p-4 rounded-2xl border border-charcoal-200 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="text-xs font-bold text-charcoal-950 mb-2 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-amber-600" /> Secure Pickup QR Token
          </div>

          <div className="w-32 h-32 sm:w-36 sm:h-36 relative bg-white p-2 rounded-xl border border-charcoal-200 mb-2">
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${order.qrCodeToken}`}
              alt="Order QR Code"
              fill
              className="object-contain p-1"
            />
          </div>

          <span className="text-[10px] font-mono font-bold text-charcoal-600 bg-charcoal-100 px-2 py-0.5 rounded border border-charcoal-200">
            {order.qrCodeToken}
          </span>
        </div>
      </div>

      {/* Order Item Summary */}
      <div className="p-4 sm:p-6 border-t border-charcoal-100">
        <h4 className="font-bold text-xs sm:text-sm text-charcoal-950 mb-3">Order Summary ({order.items?.length} dishes)</h4>
        <div className="space-y-2 mb-4">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-charcoal-100/50">
              <span className="font-medium text-charcoal-800">
                {item.quantity}x {item.foodItem?.name || 'Food Item'}
              </span>
              <span className="font-bold text-charcoal-950">₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 font-black text-sm text-charcoal-950 border-t border-charcoal-100">
          <span>Total Paid</span>
          <span className="text-base text-amber-600">₹{order.finalAmount}</span>
        </div>
      </div>

      {/* Hygiene & Food Quality Complaint Support Box */}
      <div className="p-3.5 sm:p-4 bg-amber-50/60 border-t border-amber-200/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-charcoal-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Food hygiene or quality issue with this order?</span>
        </div>
        <a
          href="https://foscos.fssai.gov.in/consumergrievance/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-700 hover:text-amber-900 font-bold underline shrink-0 hover:scale-102 transition-transform"
        >
          Lodge FSSAI Complaint ↗
        </a>
      </div>

      {/* Back Button */}
      {onBackToMenu && (
        <div className="p-3.5 sm:p-4 bg-charcoal-50 border-t border-charcoal-100 text-center">
          <button
            onClick={onBackToMenu}
            className="px-6 py-2.5 rounded-xl bg-charcoal-950 text-surface text-xs font-bold hover:bg-charcoal-800 transition-colors shadow-xs"
          >
            Order More Food / Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
