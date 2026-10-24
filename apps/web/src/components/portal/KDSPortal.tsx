'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, CheckCircle, ChefHat, AlertCircle, Play, Check, Flame, ArrowLeft } from 'lucide-react';
import io from 'socket.io-client';
import { useStore } from '@/store/useStore';

interface KDSPortalProps {
  onBackToMenu?: () => void;
}

export default function KDSPortal({ onBackToMenu }: KDSPortalProps) {
  const { setRole } = useStore();
  const [activeMobileCol, setActiveMobileCol] = useState<'ACCEPTED' | 'PREPARING' | 'READY'>('ACCEPTED');

  const handleBack = () => {
    if (onBackToMenu) onBackToMenu();
    else setRole('STUDENT');
  };

  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ord-8801',
      orderNumber: 'CB-2026-8801',
      studentName: 'Aarav Sharma',
      status: 'PREPARING',
      counter: 'Counter A',
      timeAgo: '4 mins ago',
      items: [{ name: 'Paneer Butter Masala Combo Thali', qty: 1, note: 'Less spicy paneer' }],
    },
    {
      id: 'ord-8802',
      orderNumber: 'CB-2026-8802',
      studentName: 'Priya Verma',
      status: 'ACCEPTED',
      counter: 'Counter B',
      timeAgo: '2 mins ago',
      items: [
        { name: 'Crispy Butter Masala Dosa', qty: 2, note: 'Extra coconut chutney' },
        { name: 'Thick Chocolate Cold Coffee', qty: 1 },
      ],
    },
    {
      id: 'ord-8803',
      orderNumber: 'CB-2026-8803',
      studentName: 'Rohan Gupta',
      status: 'READY',
      counter: 'Express Counter',
      timeAgo: '7 mins ago',
      items: [{ name: 'Hyderabadi Dum Chicken Biryani', qty: 1 }],
    },
  ]);

  useEffect(() => {
    const socket = io('http://localhost:4000');
    socket.emit('join_kds', 'campusbite-central-iitb');

    socket.on('order.updated', (updated: any) => {
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.id === updated.id);
        if (index > -1) {
          const newOrders = [...prev];
          newOrders[index] = updated;
          return newOrders;
        }
        return [updated, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:4000/api/v1/kds/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {}

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const columns = [
    { key: 'ACCEPTED', label: 'NEW ORDERS', color: 'border-blue-500 bg-blue-50/30' },
    { key: 'PREPARING', label: 'COOKING / PREP', color: 'border-amber-500 bg-amber-50/30' },
    { key: 'READY', label: 'READY AT COUNTER', color: 'border-emerald-500 bg-emerald-50/30' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Tablet/Mobile Header Bar */}
      <div className="bg-charcoal-950 text-surface p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white overflow-hidden p-1 border border-charcoal-700 shadow-xs shrink-0">
            <Image src="/logo.png" alt="CampusBite" width={44} height={44} className="object-contain" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 border border-charcoal-700 text-amber-400 hover:bg-charcoal-800 text-xs font-bold transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Student Menu</span>
              </button>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-charcoal-950 text-[10px] font-black uppercase">
                Kitchen KDS
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">KDS · Kitchen Display System</h1>
            <p className="text-xs text-charcoal-400">CampusBite Central · Main Kitchen Station</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 border border-charcoal-800 text-amber-400 font-bold">
            <Clock className="w-3.5 h-3.5" /> Live Socket Sync Active
          </span>
        </div>
      </div>

      {/* Mobile Segment Tab Switcher (Visible on small screens) */}
      <div className="flex md:hidden bg-charcoal-100 p-1 rounded-xl border border-charcoal-200 text-xs font-bold">
        {columns.map((col) => {
          const count = orders.filter((o) => o.status === col.key).length;
          return (
            <button
              key={col.key}
              onClick={() => setActiveMobileCol(col.key as any)}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeMobileCol === col.key
                  ? 'bg-amber-500 text-charcoal-950 shadow-xs font-black'
                  : 'text-charcoal-600'
              }`}
            >
              <span>{col.label.split(' ')[0]}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-charcoal-950/20 text-[10px]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 3-Column KDS Board (Desktop/Tablet) or 1 Column on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          const isMobileVisible = activeMobileCol === col.key;

          return (
            <div
              key={col.key}
              className={`rounded-2xl border-2 p-4 ${col.color} min-h-[420px] sm:min-h-[500px] flex flex-col ${
                isMobileVisible ? 'flex' : 'hidden md:flex'
              }`}
            >
              
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-charcoal-200">
                <h3 className="font-black text-xs sm:text-sm text-charcoal-950">{col.label}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-surface text-charcoal-950 font-black text-xs shadow-xs">
                  {colOrders.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOrders.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-xs text-charcoal-400">
                    No active orders in this queue.
                  </div>
                ) : (
                  colOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-surface p-4 rounded-xl border border-charcoal-200 shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-base text-charcoal-950">#{ord.orderNumber}</span>
                          <span className="text-xs font-mono text-charcoal-500">{ord.timeAgo}</span>
                        </div>
                        <p className="text-xs font-bold text-amber-700">{ord.counter}</p>

                        <div className="mt-2 space-y-1 pt-2 border-t border-charcoal-100 text-xs">
                          {ord.items.map((it: any, idx: number) => (
                            <div key={idx} className="font-semibold text-charcoal-900">
                              {it.qty}x {it.name}
                              {it.note && <p className="text-[11px] text-amber-700 font-bold italic">Note: {it.note}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div>
                        {ord.status === 'ACCEPTED' && (
                          <button
                            onClick={() => updateStatus(ord.id, 'PREPARING')}
                            className="w-full py-2.5 rounded-xl bg-amber-500 text-charcoal-950 font-black text-xs hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5" /> Start Preparing
                          </button>
                        )}
                        {ord.status === 'PREPARING' && (
                          <button
                            onClick={() => updateStatus(ord.id, 'READY')}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Ready for Counter
                          </button>
                        )}
                        {ord.status === 'READY' && (
                          <div className="text-center py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                            ✓ Ready for Student Pickup
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
