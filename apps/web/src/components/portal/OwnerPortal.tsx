'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import Dashboard3D from '@/components/3d/Dashboard3D';
import {
  TrendingUp,
  Utensils,
  AlertTriangle,
  Plus,
  Edit2,
  CheckCircle2,
  Clock,
  DollarSign,
  Ban,
  Check,
  ToggleLeft,
  ToggleRight,
  Search,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';

interface OwnerPortalProps {
  onBackToMenu?: () => void;
}

export default function OwnerPortal({ onBackToMenu }: OwnerPortalProps) {
  const { foodItems, categories, updateItemPriceAndAvailability, setMenuData, setRole } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'overview'>('menu');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const handleBack = () => {
    if (onBackToMenu) onBackToMenu();
    else setRole('STUDENT');
  };

  // Editing modal state
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [newAvailability, setNewAvailability] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Fetch canteen menu on mount
  useEffect(() => {
    fetch('http://localhost:4000/api/v1/canteens/campusbite-central-iitb')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.canteen?.categories) {
          const allItems: any[] = [];
          data.canteen.categories.forEach((cat: any) => {
            cat.foodItems.forEach((item: any) => {
              allItems.push({ ...item, category: { name: cat.name } });
            });
          });
          setMenuData(data.canteen.categories, allItems);
        }
      })
      .catch(() => {});
  }, [setMenuData]);

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setNewPrice(String(item.price));
    setNewAvailability(item.isAvailable !== false);
  };

  const handleToggleAvailabilityDirect = async (item: any) => {
    const updatedStatus = !(item.isAvailable !== false);
    updateItemPriceAndAvailability(item.id, item.price, updatedStatus);

    try {
      await fetch(`http://localhost:4000/api/v1/canteens/items/${item.id}/price-availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: item.price, isAvailable: updatedStatus }),
      });
      setSaveSuccessMsg(`Updated ${item.name} to ${updatedStatus ? 'AVAILABLE' : 'SOLD OUT'}`);
      setTimeout(() => setSaveSuccessMsg(null), 2500);
    } catch (e) {}
  };

  const handleSavePriceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    const parsedPrice = parseFloat(newPrice) || editingItem.price;

    updateItemPriceAndAvailability(editingItem.id, parsedPrice, newAvailability);

    try {
      await fetch(`http://localhost:4000/api/v1/canteens/items/${editingItem.id}/price-availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parsedPrice, isAvailable: newAvailability }),
      });
      setSaveSuccessMsg(`Saved changes for ${editingItem.name}: ₹${parsedPrice} (${newAvailability ? 'Available' : 'Sold Out'})`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      setEditingItem(null);
    } catch (err) {
      alert('Failed to save price');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = foodItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category?.name === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header Banner */}
      <div className="bg-charcoal-950 text-surface p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-charcoal-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 border border-charcoal-700 text-amber-400 hover:bg-charcoal-800 text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Student Menu</span>
            </button>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-charcoal-950 text-[10px] sm:text-[11px] font-black uppercase">
              Canteen Owner Command Center
            </span>
            <span className="text-xs text-charcoal-400">Campus Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white overflow-hidden p-1 border border-charcoal-700 shadow-xs shrink-0">
              <Image src="/logo.png" alt="CampusBite" width={44} height={44} className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">CampusBite Central Food Hub</h1>
              <p className="text-xs text-charcoal-400 mt-0.5">Owner: Rajesh Patel · Manage Menu Prices & Live Stock Availability</p>
            </div>
          </div>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'menu', label: 'Price & Stock' },
            { id: 'overview', label: 'Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? 'bg-amber-500 text-charcoal-950 shadow-xs'
                  : 'bg-charcoal-900 border border-charcoal-800 text-charcoal-300 hover:text-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {saveSuccessMsg}
        </div>
      )}

      {/* 1. Menu Price & Stock Availability Manager Subtab */}
      {activeSubTab === 'menu' && (
        <div className="bg-surface p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-charcoal-200/80 shadow-xs space-y-4 sm:space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-bold text-base sm:text-lg text-charcoal-950">Live Menu Catalog ({foodItems.length} Dishes)</h2>
              <p className="text-xs text-charcoal-500">Edit selling prices and toggle live available / sold-out state in real-time</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food item to edit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500 bg-charcoal-50/50"
              />
            </div>
          </div>

          {/* 12-Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-charcoal-100 scrollbar-none text-xs font-medium">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-bold ${
                selectedCategory === 'ALL'
                  ? 'bg-charcoal-950 text-surface shadow-xs'
                  : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              All Categories ({foodItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1 transition-all text-xs font-semibold ${
                  selectedCategory === cat.name
                    ? 'bg-amber-500 text-charcoal-950 font-bold shadow-xs'
                    : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.foodItems?.length || 0})</span>
              </button>
            ))}
          </div>

          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-charcoal-200 text-charcoal-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Food Item</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price (₹)</th>
                  <th className="py-2.5 px-3">Dietary</th>
                  <th className="py-2.5 px-3">Live Stock</th>
                  <th className="py-2.5 px-3 text-right">Edit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {filteredItems.map((item) => {
                  const isAvail = item.isAvailable !== false;
                  return (
                    <tr key={item.id} className="hover:bg-charcoal-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-sm text-charcoal-950 block">{item.name}</span>
                        <span className="text-[11px] text-charcoal-500 line-clamp-1">{item.description}</span>
                      </td>

                      <td className="py-3 px-3 text-charcoal-600 font-medium">
                        {item.category?.name || 'General'}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-black text-sm text-charcoal-950">₹{item.price}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleAvailabilityDirect(item)}
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isAvail
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {isAvail ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Available
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5 text-red-600" /> Sold Out
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-3 py-1.5 rounded-lg bg-charcoal-100 text-charcoal-800 hover:bg-charcoal-200 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Visible on mobile) */}
          <div className="sm:hidden space-y-2.5">
            {filteredItems.map((item) => {
              const isAvail = item.isAvailable !== false;
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-charcoal-200 bg-charcoal-50/40 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}
                        />
                        <h4 className="font-bold text-xs text-charcoal-950 truncate">{item.name}</h4>
                      </div>
                      <span className="text-[10px] text-charcoal-500">{item.category?.name}</span>
                    </div>

                    <span className="text-sm font-black text-charcoal-950 shrink-0">₹{item.price}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-charcoal-100">
                    <button
                      onClick={() => handleToggleAvailabilityDirect(item)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        isAvail
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isAvail ? <Check className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      {isAvail ? 'Available' : 'Sold Out'}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 rounded-lg bg-charcoal-200 text-charcoal-900 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit ₹
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Item Price Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl border border-charcoal-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base sm:text-lg text-charcoal-950">Edit Item Details</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-charcoal-400 hover:text-charcoal-950 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-charcoal-500 mb-4">{editingItem.name}</p>

            <form onSubmit={handleSavePriceEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-950 mb-1">
                  Selling Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="5"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-950 mb-1">
                  Availability Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAvailability(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      newAvailability
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-charcoal-200 text-charcoal-600'
                    }`}
                  >
                    <Check className="w-4 h-4 text-emerald-600" /> Available
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAvailability(false)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !newAvailability
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-charcoal-200 text-charcoal-600'
                    }`}
                  >
                    <Ban className="w-4 h-4 text-red-600" /> Sold Out
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-charcoal-200 text-charcoal-700 text-xs font-bold hover:bg-charcoal-50 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Cancel / Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-charcoal-950 text-xs font-black hover:bg-amber-600 shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Overview Subtab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSubTab('menu')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Price & Stock Manager
            </button>
            <span className="text-xs text-charcoal-500 font-semibold">Live Analytics Overview</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-charcoal-500">Today's Revenue</span>
              <p className="text-xl sm:text-2xl font-black text-charcoal-950 mt-0.5">₹14,280</p>
              <span className="text-[10px] text-emerald-600 font-bold">↑ +18.4% vs yesterday</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-charcoal-500">Live Orders</span>
              <p className="text-xl sm:text-2xl font-black text-charcoal-950 mt-0.5">14 Orders</p>
              <span className="text-[10px] text-amber-600 font-bold">5 in kitchen prep</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-charcoal-500">Avg Prep Time</span>
              <p className="text-xl sm:text-2xl font-black text-charcoal-950 mt-0.5">7.8 Mins</p>
              <span className="text-[10px] text-blue-600 font-bold">Optimal kitchen load</span>
            </div>
            <div className="bg-surface p-4 rounded-2xl border border-charcoal-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-charcoal-500">Total Dishes</span>
              <p className="text-xl sm:text-2xl font-black text-charcoal-950 mt-0.5">{foodItems.length}</p>
              <span className="text-[10px] text-emerald-600 font-bold">12 Active Regions</span>
            </div>
          </div>

          {/* 3D Kitchen Node Telemetry Mesh */}
          <Dashboard3D height="h-[240px] sm:h-[280px]" badgeText="3D Kitchen & KDS Dispatch Mesh Live" />
        </div>
      )}
    </div>
  );
}
