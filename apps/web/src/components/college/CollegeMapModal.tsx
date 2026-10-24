'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  MapPin,
  Search,
  Plus,
  Check,
  Navigation,
  Compass,
  X,
  Globe,
  Sparkles,
  ArrowLeft,
  Radar,
  ChevronRight,
  Layers,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface CollegeMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollegeMapModal({ isOpen, onClose }: CollegeMapModalProps) {
  const { collegeId, collegeName, collegeCity, collegeState, collegeLat, collegeLng, setCollege } = useStore();
  const [colleges, setColleges] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'list' | 'map'>('list');

  // Custom typed college state
  const [customName, setCustomName] = useState('');
  const [customCity, setCustomCity] = useState('New Delhi');
  const [customState, setCustomState] = useState('Delhi NCR');
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:4000/api/v1/colleges')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setColleges(data.colleges);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const states = [
    'ALL',
    'Maharashtra',
    'Delhi NCR',
    'Karnataka',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Telangana',
    'West Bengal',
    'Rajasthan',
    'Gujarat',
    'Punjab',
  ];

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.state?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === 'ALL' || c.city?.state?.name === selectedState;
    return matchesSearch && matchesState;
  });

  const handleSelectCollege = (col: any) => {
    setCollege(
      col.id,
      col.name,
      col.city?.name || 'Mumbai',
      col.city?.state?.name || 'Maharashtra',
      col.latitude || 19.1334,
      col.longitude || 72.9133
    );
    onClose();
  };

  const handleCreateCustomCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    setLoadingAdd(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/colleges/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customName,
          cityName: customCity,
          stateName: customState,
          latitude: 28.545,
          longitude: 77.1926,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCollege(data.college.id, data.college.name, customCity, customState, 28.545, 77.1926);
        onClose();
      }
    } catch (e) {
      setCollege(`custom-${Date.now()}`, customName, customCity, customState, 28.545, 77.1926);
      onClose();
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-surface w-full max-w-5xl max-h-[92vh] rounded-2xl md:rounded-3xl shadow-2xl border border-charcoal-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Modal Header (Aligned with Website Dashboard Brand Header) */}
        <div className="p-4 sm:p-5 border-b border-charcoal-800 bg-[#161619] text-surface flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-charcoal-950 flex items-center justify-center font-black shadow-md shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg tracking-tight">Select Campus & Map Location</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                  CampusBite OS
                </span>
              </div>
              <p className="text-xs text-charcoal-400 mt-0.5">
                Discover canteens across 30+ Indian colleges or add your custom campus
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white flex items-center justify-center transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile View Switcher Tabs (Visible on phone/tablet ratios) */}
        <div className="flex lg:hidden border-b border-charcoal-200 bg-charcoal-50 p-1">
          <button
            onClick={() => setActiveMobileTab('list')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMobileTab === 'list'
                ? 'bg-charcoal-950 text-surface shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-950'
            }`}
          >
            College Search ({colleges.length})
          </button>
          <button
            onClick={() => setActiveMobileTab('map')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeMobileTab === 'map'
                ? 'bg-amber-500 text-charcoal-950 shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-950'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Interactive Map
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: College Directory & Search */}
          {/* ========================================================================= */}
          <div
            className={`lg:col-span-6 p-4 sm:p-6 flex flex-col overflow-hidden border-r border-charcoal-100 ${
              activeMobileTab === 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Mode Switcher Pills */}
            <div className="flex gap-2 mb-4 shrink-0 bg-charcoal-100/60 p-1 rounded-2xl border border-charcoal-200/60">
              <button
                onClick={() => setIsCustomMode(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isCustomMode
                    ? 'bg-surface text-charcoal-950 shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                All-India Directory
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isCustomMode
                    ? 'bg-amber-500 text-charcoal-950 shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-950'
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> Type Custom Campus
              </button>
            </div>

            {!isCustomMode ? (
              <>
                {/* Search Bar Pill */}
                <div className="relative mb-3 shrink-0">
                  <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search college, city (e.g. IIT, DTU, Mumbai, Pune)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 text-xs rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500 bg-charcoal-50/50"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-950"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* State Filters */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 text-[11px] scrollbar-none shrink-0">
                  {states.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedState(st)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-semibold transition-all ${
                        selectedState === st
                          ? 'bg-amber-500 text-charcoal-950 font-bold shadow-xs'
                          : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* College Items List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[240px]">
                  {filtered.length === 0 ? (
                    <div className="text-center py-10 text-xs text-charcoal-500 space-y-2">
                      <p>No matching colleges found for "{search}".</p>
                      <button
                        onClick={() => setIsCustomMode(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-charcoal-950 font-bold text-xs hover:bg-amber-600 transition-colors"
                      >
                        + Type & Register Custom Campus
                      </button>
                    </div>
                  ) : (
                    filtered.map((col) => {
                      const isSelected = collegeName === col.name;
                      return (
                        <div
                          key={col.id}
                          onClick={() => handleSelectCollege(col)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/80 shadow-xs'
                              : 'border-charcoal-100 hover:border-charcoal-300 hover:bg-charcoal-50/80'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs sm:text-sm text-charcoal-950 truncate block">
                                {col.name}
                              </span>
                              {isSelected && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-charcoal-950 text-[9px] font-black shrink-0">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-charcoal-500 flex items-center gap-1 mt-1 truncate">
                              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{col.city?.name || 'City'}, {col.city?.state?.name || 'State'}</span>
                              <span className="text-charcoal-300">·</span>
                              <span className="font-mono text-[10px] text-charcoal-400">
                                {col.latitude?.toFixed(2)}°N, {col.longitude?.toFixed(2)}°E
                              </span>
                            </p>
                          </div>

                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                              isSelected
                                ? 'bg-amber-500 text-charcoal-950 shadow-xs'
                                : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              /* Custom College Registration Form */
              <form onSubmit={handleCreateCustomCollege} className="space-y-4 py-2 overflow-y-auto flex-1">
                <div className="flex items-center justify-between pb-2 border-b border-charcoal-100">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 text-xs font-bold transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
                  </button>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Custom Campus Registration
                  </span>
                </div>

                <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <Sparkles className="w-4 h-4 inline mr-1 text-amber-600" />
                  Type your Indian college name and city to register and pinpoint on the campus map!
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-950 mb-1">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DTU (Delhi Technological University) or Bengal College..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500 bg-surface"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-950 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi, Durgapur, Mumbai"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500 bg-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-950 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi NCR, West Bengal, Maharashtra"
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-charcoal-200 focus:outline-none focus:border-amber-500 bg-surface"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingAdd}
                  className="w-full py-3 rounded-xl bg-amber-500 text-charcoal-950 font-black text-xs hover:bg-amber-600 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save & Set Active Campus
                </button>
              </form>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Ultra-Premium Interactive GPS Campus Map Visualizer */}
          {/* ========================================================================= */}
          <div
            className={`lg:col-span-6 p-4 sm:p-6 bg-charcoal-50 flex flex-col justify-between space-y-4 overflow-y-auto ${
              activeMobileTab === 'list' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="space-y-3">
              {/* Map Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-charcoal-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>INTERACTIVE CAMPUS MAP</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black tracking-wide flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>GPS ACTIVE</span>
                </span>
              </div>

              {/* Ultra-Sleek GPS Map Box (Matches attached user image design system) */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-[#0D1117] border-2 border-charcoal-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-4">
                
                {/* Dark Tactical Grid Lines Background */}
                <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#383838_1px,transparent_1px),linear-gradient(to_bottom,#383838_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Concentric Radar Scanning Circles */}
                <div className="absolute w-56 h-36 border border-amber-500/25 rounded-2xl -rotate-12 animate-pulse" />
                <div className="absolute w-44 h-44 border border-blue-500/25 rounded-full" />
                <div className="absolute w-64 h-64 border border-zinc-700/30 rounded-full" />

                {/* Radar Sweep Effect */}
                <div className="absolute w-48 h-48 rounded-full border border-amber-500/10 animate-ping" />

                {/* Center Campus Marker */}
                <div className="relative z-10 flex flex-col items-center max-w-[95%]">
                  {/* Glowing Radar Pulse Ring */}
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center animate-ping absolute" />
                  
                  {/* Pin Circle */}
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-charcoal-950 flex items-center justify-center shadow-2xl relative shrink-0 border-2 border-charcoal-950">
                    <MapPin className="w-5 h-5 fill-charcoal-950 stroke-amber-500" />
                  </div>

                  {/* Pin Location Card Pill (Exact user image styling) */}
                  <div className="mt-2.5 bg-black/90 backdrop-blur-md text-surface text-xs font-black px-4 py-1.5 rounded-full border border-white/20 shadow-xl truncate max-w-full tracking-tight">
                    {collegeName}
                  </div>
                  
                  {/* Coordinates Pill */}
                  <span className="text-[11px] font-mono font-bold text-amber-400 mt-1 tracking-wide">
                    {collegeLat ? collegeLat.toFixed(4) : '28.7501'}° N, {collegeLng ? collegeLng.toFixed(4) : '77.1177'}° E
                  </span>
                </div>

                {/* Sub Canteen Pickup Location Badge (Bottom Right) */}
                <div className="absolute bottom-3 right-3 bg-emerald-950/90 backdrop-blur-xs text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-700/80 flex items-center gap-1.5 shadow-lg">
                  <Navigation className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>Canteen (350m)</span>
                </div>

                {/* Sub Station Badge (Top Left) */}
                <div className="absolute top-3 left-3 bg-charcoal-900/80 backdrop-blur-xs text-charcoal-300 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-charcoal-700 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-amber-400" />
                  <span>IITB/DTU Hub</span>
                </div>
              </div>
            </div>

            {/* Selected Campus Info Metrics Box */}
            <div className="p-4 rounded-2xl bg-surface border border-charcoal-200/80 shadow-xs space-y-2.5 text-xs">
              <div className="flex justify-between items-center gap-2">
                <span className="text-charcoal-500 font-semibold shrink-0">Selected Campus</span>
                <span className="font-bold text-charcoal-950 truncate text-right">{collegeName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-charcoal-500 font-semibold">Location Region</span>
                <span className="font-bold text-charcoal-900">{collegeCity}, {collegeState}</span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-charcoal-100">
                <span className="text-charcoal-500 font-semibold">Active Canteen Hub</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> CampusBite Central (Open)
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-charcoal-950 text-surface font-black text-xs hover:bg-charcoal-800 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Confirm & Browse Canteen Menu</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
