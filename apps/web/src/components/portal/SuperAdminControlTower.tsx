'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Globe,
  Server,
  Activity,
  ShieldCheck,
  MapPin,
  Database,
  Award,
  ArrowUpRight,
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Check,
  Lock,
  Cpu,
  CreditCard,
  Bell,
  Sparkles,
  RefreshCw,
  X,
  SlidersHorizontal,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Keyboard,
  Command,
  FileText,
  Key,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Battery,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Dashboard3D from '@/components/3d/Dashboard3D';

interface SuperAdminControlTowerProps {
  onBackToMenu?: () => void;
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'button' | 'metric';
  value?: boolean;
  buttonLabel?: string;
  badge?: string;
}

interface SettingsSection {
  id: string;
  title: string;
  icon: any;
  iconBg: string;
  tagline: string;
  items: SettingItem[];
}

type DeviceRatio = 'auto' | 'desktop' | 'tablet' | 'phone';

export default function SuperAdminControlTower({ onBackToMenu }: SuperAdminControlTowerProps) {
  const { setRole } = useStore();
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('safety');
  
  // Device Ratio state (Auto, Desktop 16:10, Tablet 4:3, Phone 9:19.5)
  const [deviceRatio, setDeviceRatio] = useState<DeviceRatio>('auto');
  
  // Phone drill-down state (list view <-> detail view)
  const [phoneView, setPhoneView] = useState<'list' | 'detail'>('detail');
  
  // History stack for < and > navigation
  const [history, setHistory] = useState<string[]>(['safety']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modals & Feedback
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showKeysModal, setShowKeysModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Dynamic toggle states (Mac/iOS switches)
  const [settingsState, setSettingsState] = useState<Record<string, boolean>>({
    'comm-safety': true,
    'improve-safety': false,
    'fssai-audit': true,
    'auto-refund': true,
    'upi-intent': true,
    'kds-socket': true,
    'ai-forecast': true,
    'waste-alert': true,
    'rate-limit': true,
    'ssl-256': true,
    'sound-fx': true,
    'haptic-feedback': true,
  });

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/admin/superadmin-control-tower')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .catch(() => {});
  }, []);

  const handleBack = () => {
    if (onBackToMenu) onBackToMenu();
    else setRole('STUDENT');
  };

  const handleToggle = (id: string, title: string) => {
    setSettingsState((prev) => {
      const nextVal = !prev[id];
      setFeedbackToast(`${title}: ${nextVal ? 'ENABLED' : 'DISABLED'}`);
      setTimeout(() => setFeedbackToast(null), 2400);
      return { ...prev, [id]: nextVal };
    });
  };

  // Category definitions with exact items matching user screenshot
  const sections: SettingsSection[] = useMemo(
    () => [
      {
        id: 'safety',
        title: 'Communication Safety',
        icon: ShieldCheck,
        iconBg: 'bg-blue-500',
        tagline: 'Student Welfare & Food Safety',
        items: [
          {
            id: 'comm-safety',
            title: 'Communication Safety',
            description:
              "Communication Safety can detect nude photos, allergen violations, and unauthorized messages before they're sent or viewed on campus devices, and provide guidance and age-appropriate resources to help make a safe choice. Apple and CampusBite do not have access to private student messages.",
            type: 'toggle',
          },
          {
            id: 'safety-resources',
            title: 'Child Safety Resources',
            description:
              'Official compliance manuals, student emergency helplines, and FSSAI hygiene guidelines for campus vendors and food committees.',
            type: 'button',
            buttonLabel: 'View Resources',
          },
          {
            id: 'improve-safety',
            title: 'Improve Communication Safety',
            description:
              'Help improve Communication Safety and food service reliability by sharing aggregated usage analytics and inspection metrics. Analytics are aggregated in a form that is not personally identifiable. No messages or media are shared.',
            type: 'toggle',
          },
        ],
      },
      {
        id: 'keyboard',
        title: 'Keyboard & Shortcuts',
        icon: Keyboard,
        iconBg: 'bg-zinc-600',
        tagline: 'Quick Actions & Access Keys',
        items: [
          {
            id: 'cmd-k-search',
            title: 'Global Search Palette (⌘ + K)',
            description:
              'Open quick canteen search, dish jump, and dietary filters anywhere on the platform using standard hotkeys.',
            type: 'toggle',
          },
          {
            id: 'quick-checkout',
            title: 'Quick Checkout Accelerator (Shift + Enter)',
            description:
              'Instantly trigger Razorpay 1-Tap UPI flow when cart has valid items without opening drawer.',
            type: 'toggle',
          },
          {
            id: 'sound-fx',
            title: 'Terminal Audio Feedback & Tones',
            description:
              'Play subtle audible chime when kitchen ticket is acknowledged or UPI settlement clears.',
            type: 'toggle',
          },
        ],
      },
      {
        id: 'payments',
        title: 'Razorpay Gateway & Payouts',
        icon: CreditCard,
        iconBg: 'bg-amber-500',
        tagline: 'UPI Fast Checkout & Webhooks',
        items: [
          {
            id: 'upi-intent',
            title: 'UPI Fast Checkout Intent & QR',
            description:
              'Zero-latency campus payments supporting GPay, PhonePe, Paytm, and BHIM with 99.4% settlement success rate.',
            type: 'toggle',
          },
          {
            id: 'auto-refund',
            title: 'Instant Automated Refunds',
            description:
              'Automatically issue refunds to original UPI VPA/cards if order is rejected or cancelled by canteen before cooking.',
            type: 'toggle',
          },
          {
            id: 'gateway-keys',
            title: 'Razorpay API Credentials',
            description:
              'Connected Key ID: rzp_test_campusbite2026. HMAC SHA-256 Webhook synchronization actively processing live settlements.',
            type: 'button',
            buttonLabel: 'Configure Keys',
          },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen KDS & Socket Queue',
        icon: Cpu,
        iconBg: 'bg-orange-500',
        tagline: 'Station Routing & Orders SLA',
        items: [
          {
            id: 'kds-socket',
            title: 'Real-Time Socket.IO Kitchen Dispatch',
            description:
              'Broadcast new paid orders instantaneously to station display tablets across Main Kitchen, Dosa, and Beverages.',
            type: 'toggle',
          },
          {
            id: 'kds-metrics',
            title: 'Average Preparation Speed Benchmark',
            description:
              'Target prep time: 7-10 minutes per ticket. Peak hour lunch throttling active between 12:45 PM and 1:30 PM.',
            type: 'button',
            buttonLabel: 'View Station SLA',
          },
        ],
      },
      {
        id: 'geo',
        title: 'Geographic States & Footprint',
        icon: Globe,
        iconBg: 'bg-emerald-500',
        tagline: 'All-India Campus Network',
        items: [
          {
            id: 'geo-metrics',
            title: 'Active Geographic Hubs',
            description:
              'Operating across Maharashtra (IITB, VJTI, COEP), Karnataka (IISc, RVCE, PES), and Delhi NCR (IITD, DTU, DU). Expanding to Tamil Nadu & West Bengal.',
            type: 'button',
            buttonLabel: 'Audit States',
          },
          {
            id: 'gmv-stats',
            title: 'Nationwide Campus GMV',
            description:
              'Platform GMV currently at ₹1,84,500 (+24.1% MoM). 0 vendor suspensions across 3 active university clusters.',
            type: 'button',
            buttonLabel: 'Download Ledger',
          },
        ],
      },
      {
        id: 'ai',
        title: 'AI Copilot & Waste Engine',
        icon: Sparkles,
        iconBg: 'bg-purple-500',
        tagline: 'Demand Forecasting & Margins',
        items: [
          {
            id: 'ai-forecast',
            title: 'Automated Demand Prediction',
            description:
              'ML model predicts item quantity targets every morning based on weather, exam schedule, and day-of-week trends.',
            type: 'toggle',
          },
          {
            id: 'waste-alert',
            title: 'Perishable Waste Alert Engine',
            description:
              'Automatically triggers dynamic 15% afternoon flash discounts on high-stock perishables (e.g. paneer, dairy).',
            type: 'toggle',
          },
        ],
      },
      {
        id: 'security',
        title: 'Security, Cryptography & Logs',
        icon: Lock,
        iconBg: 'bg-indigo-500',
        tagline: 'Zero-Trust Campus Security',
        items: [
          {
            id: 'ssl-256',
            title: '256-Bit SSL Encrypted Communication',
            description:
              'All client orders, JWT access tokens, and cryptographic QR pickup signatures are verified with constant-time HMAC.',
            type: 'toggle',
          },
          {
            id: 'rate-limit',
            title: 'DDoS & Rate Limiting Shields',
            description:
              'Enforces 100 req/min thresholds on checkout endpoints and prevents double-claim QR code exploits.',
            type: 'toggle',
          },
        ],
      },
    ],
    []
  );

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            sec.title.toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => sec.items.length > 0 || sec.title.toLowerCase().includes(q));
  }, [sections, searchQuery]);

  const activeSection = useMemo(() => {
    return (
      sections.find((s) => s.id === activeSectionId) ||
      filteredSections[0] ||
      sections[0]
    );
  }, [sections, filteredSections, activeSectionId]);

  const navigateTo = (secId: string) => {
    if (secId === activeSectionId) {
      setPhoneView('detail');
      return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(secId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setActiveSectionId(secId);
    setPhoneView('detail');
  };

  const goBackHistory = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setActiveSectionId(history[prevIdx]);
    }
  };

  const goForwardHistory = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setActiveSectionId(history[nextIdx]);
    }
  };

  const handleActionButton = (item: SettingItem) => {
    if (item.id === 'safety-resources') {
      setShowResourcesModal(true);
    } else if (item.id === 'gateway-keys') {
      setShowKeysModal(true);
    } else {
      setFeedbackToast(`Action initiated: ${item.buttonLabel}`);
      setTimeout(() => setFeedbackToast(null), 2000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback Notification */}
      {feedbackToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1E1E22] border border-[#3A3A3E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Header & Dashboard Alignment Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-charcoal-200 text-charcoal-900 hover:bg-amber-50 hover:border-amber-400 text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-600" />
            <span>Back to Student Menu</span>
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-500">
            <span>/</span>
            <span>Super Admin Control Tower & System Settings</span>
          </span>
        </div>

        {/* Device Ratio Switcher: Auto, Desktop, Tablet, Phone */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-charcoal-200 shadow-xs text-xs font-semibold">
          <span className="text-[11px] font-bold text-charcoal-400 px-2 hidden md:inline">
            Viewport Ratio:
          </span>
          <button
            onClick={() => setDeviceRatio('auto')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              deviceRatio === 'auto'
                ? 'bg-charcoal-950 text-white shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-950'
            }`}
            title="Auto Responsive to current screen size"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Auto</span>
          </button>
          <button
            onClick={() => setDeviceRatio('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              deviceRatio === 'desktop'
                ? 'bg-charcoal-950 text-white shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-950'
            }`}
            title="macOS Desktop Ratio (16:10)"
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceRatio('tablet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              deviceRatio === 'tablet'
                ? 'bg-charcoal-950 text-white shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-950'
            }`}
            title="iPad Tablet Ratio (4:3)"
          >
            <Tablet className="w-3 h-3" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => {
              setDeviceRatio('phone');
              setPhoneView('detail');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              deviceRatio === 'phone'
                ? 'bg-charcoal-950 text-white shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-950'
            }`}
            title="iPhone Phone Ratio (9:19.5)"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">Phone</span>
          </button>
        </div>
      </div>

      {/* Platform KPIs Strip (Aligns with Website Dashboard) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-charcoal-100 shadow-soft">
          <span className="text-[11px] font-semibold text-charcoal-500 block">Platform GMV</span>
          <p className="text-xl sm:text-2xl font-black text-charcoal-950 mt-0.5">₹1,84,500</p>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +24.1% MoM</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-charcoal-100 shadow-soft">
          <span className="text-[11px] font-semibold text-charcoal-500 block">Active States</span>
          <p className="text-xl sm:text-2xl font-black text-charcoal-950 mt-0.5">3 States</p>
          <span className="text-[10px] text-charcoal-500 font-medium">MH, KA, DL</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-charcoal-100 shadow-soft">
          <span className="text-[11px] font-semibold text-charcoal-500 block">Universities</span>
          <p className="text-xl sm:text-2xl font-black text-charcoal-950 mt-0.5">3 Clusters</p>
          <span className="text-[10px] text-charcoal-500 font-medium">IITB, IISc, DU</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-charcoal-100 shadow-soft">
          <span className="text-[11px] font-semibold text-charcoal-500 block">Active Canteens</span>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">3 Canteens</p>
          <span className="text-[10px] text-emerald-600 font-bold">0 Suspended</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-charcoal-100 shadow-soft col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-charcoal-500 block">Gateway Success</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">99.4%</p>
          <span className="text-[10px] text-emerald-600 font-bold">Razorpay UPI OK</span>
        </div>
      </div>

      {/* 3D WebGL Dashboard Telemetry Animation Box */}
      <Dashboard3D height="h-[220px] sm:h-[260px]" badgeText="3D India Campus Control Tower Mesh Live" />

      {/* ========================================================================= */}
      {/* 🍎 SYSTEM SETTINGS CANVAS - ADAPTIVE ACROSS PHONE / TABLET / DESKTOP RATIOS */}
      {/* ========================================================================= */}
      <div className="flex justify-center w-full">

        {/* ----------------------------------------------------------------------- */}
        {/* CASE A: PHONE RATIO (When deviceRatio === 'phone' OR mobile screen < 768px in 'auto') */}
        {/* ----------------------------------------------------------------------- */}
        <div
          className={`w-full max-w-[410px] mx-auto ${
            deviceRatio === 'phone'
              ? 'block'
              : deviceRatio === 'auto'
              ? 'block md:hidden'
              : 'hidden'
          }`}
        >
          {/* Authentic iPhone Device Frame Wrapper */}
          <div className="bg-[#121214] p-3 rounded-[44px] shadow-2xl border-4 border-[#2A2A2E]">
            {/* Phone Screen Glass */}
            <div className="bg-[#161619] rounded-[34px] overflow-hidden border border-[#2B2B30] flex flex-col min-h-[720px] text-white select-none">
              
              {/* iPhone Status Bar with Dynamic Island */}
              <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>9:41</span>
                {/* Dynamic Island Capsule */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#18181B] border border-zinc-700/50" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">5G</span>
                  <Battery className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* View Switcher: Settings Master List vs. Setting Detail Screen */}
              {phoneView === 'list' ? (
                /* 📱 PHONE LEVEL 1: Settings Navigation List */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tight text-white">Settings</h1>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      CampusBite
                    </span>
                  </div>

                  {/* Search Bar Pill */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 bg-[#252528] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* iOS Grouped Table View */}
                  <div className="bg-[#202024] rounded-2xl border border-[#2F2F35] overflow-hidden divide-y divide-[#2B2B30]">
                    {filteredSections.map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => navigateTo(sec.id)}
                          className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-[#28282D] active:bg-[#303036] transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg ${sec.iconBg} flex items-center justify-center text-white shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-bold text-white block truncate">{sec.title}</span>
                              <span className="text-[10px] text-zinc-400 block truncate">{sec.tagline}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Phone Footer Info */}
                  <div className="pt-2 text-center text-[10px] text-zinc-500 space-y-1">
                    <p>CampusBite OS v2.6 · iOS Mobile Profile</p>
                    <p>Tap • Order • Eat</p>
                  </div>
                </div>
              ) : (
                /* 📱 PHONE LEVEL 2: Settings Detail Screen (Exact User Screenshot UX) */
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
                  <div className="space-y-4">
                    {/* Navigation Bar with Back Chevron */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2E]">
                      <button
                        onClick={() => setPhoneView('list')}
                        className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <h2 className="text-sm font-black text-white truncate max-w-[170px]">
                        {activeSection.title}
                      </h2>
                      <button
                        onClick={() => setShowHelpModal(true)}
                        className="w-6 h-6 rounded-full bg-[#28282D] text-zinc-400 flex items-center justify-center text-xs"
                      >
                        ?
                      </button>
                    </div>

                    {/* Setting Cards (Exact match of screenshot layout) */}
                    <div className="space-y-3">
                      {activeSection.items.map((item) => {
                        const isChecked = settingsState[item.id] ?? false;
                        return (
                          <div
                            key={item.id}
                            className="bg-[#242428] p-4 rounded-2xl border border-[#333338] space-y-3"
                          >
                            <div>
                              <h4 className="font-bold text-xs text-white leading-snug">{item.title}</h4>
                              <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                                {item.description}
                              </p>
                            </div>

                            {/* Control row */}
                            <div className="flex items-center justify-end pt-1">
                              {item.type === 'toggle' ? (
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={isChecked}
                                  onClick={() => handleToggle(item.id, item.title)}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    isChecked ? 'bg-[#34C759]' : 'bg-[#39393D]'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                      isChecked ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleActionButton(item)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#3A3A3E] hover:bg-[#48484E] text-white text-xs font-bold border border-[#4E4E54] transition-all flex items-center gap-1.5"
                                >
                                  <span>{item.buttonLabel || 'View'}</span>
                                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone Bottom Footer */}
                  <div className="pt-4 border-t border-[#2A2A2E] flex items-center justify-between">
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#2A2A2E] hover:bg-[#343438] text-xs font-bold text-zinc-300"
                    >
                      Learn More...
                    </button>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="w-7 h-7 rounded-full bg-[#2A2A2E] hover:bg-[#343438] text-zinc-300 flex items-center justify-center text-xs"
                    >
                      ?
                    </button>
                  </div>
                </div>
              )}

              {/* iPhone Home Indicator Bar */}
              <div className="py-2 flex justify-center">
                <div className="w-32 h-1 bg-zinc-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CASE B: TABLET RATIO (When deviceRatio === 'tablet' OR 768px <= screen < 1024px in 'auto') */}
        {/* ----------------------------------------------------------------------- */}
        <div
          className={`w-full max-w-4xl mx-auto ${
            deviceRatio === 'tablet'
              ? 'block'
              : deviceRatio === 'auto'
              ? 'hidden md:block lg:hidden'
              : 'hidden'
          }`}
        >
          {/* iPad Device Frame */}
          <div className="bg-[#121214] p-4 rounded-[32px] shadow-2xl border-4 border-[#2A2A2E]">
            <div className="bg-[#161619] rounded-[24px] overflow-hidden border border-[#2F2F35] flex flex-col min-h-[640px] text-white">
              
              {/* iPad Top Chrome */}
              <div className="bg-[#1D1D20] px-5 py-3 border-b border-[#2F2F35] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <span className="text-xs font-bold text-zinc-400 ml-2">
                    iPadOS System Settings · CampusBite Tower
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">
                  Tablet Ratio 4:3
                </span>
              </div>

              {/* iPad Dual Pane Body */}
              <div className="flex-1 flex min-h-0">
                {/* Tablet Sidebar */}
                <div className="w-64 bg-[#1B1B1E] border-r border-[#2F2F35] p-3 flex flex-col justify-between shrink-0">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-[#252528] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      {filteredSections.map((sec) => {
                        const Icon = sec.icon;
                        const isActive = activeSection.id === sec.id;
                        return (
                          <button
                            key={sec.id}
                            onClick={() => navigateTo(sec.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                              isActive
                                ? 'bg-[#007AFF] text-white font-bold shadow-xs'
                                : 'text-zinc-300 hover:bg-[#252529]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-6 h-6 rounded-md ${sec.iconBg} flex items-center justify-center text-white shrink-0`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs truncate">{sec.title}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2F2F35] flex items-center gap-2">
                    <Image src="/logo.png" alt="CampusBite" width={24} height={24} className="object-contain" />
                    <span className="text-[11px] font-bold text-zinc-400">CampusBite OS</span>
                  </div>
                </div>

                {/* Tablet Detail Pane */}
                <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-5 max-w-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-[#2F2F35]">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-[#242428] p-0.5 rounded-lg border border-[#333338]">
                          <button
                            onClick={goBackHistory}
                            disabled={historyIndex === 0}
                            className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={goForwardHistory}
                            disabled={historyIndex >= history.length - 1}
                            className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <h2 className="text-lg font-black text-white tracking-tight">{activeSection.title}</h2>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {activeSection.items.map((item) => {
                        const isChecked = settingsState[item.id] ?? false;
                        return (
                          <div
                            key={item.id}
                            className="bg-[#242428] hover:bg-[#27272C] transition-colors p-4 rounded-2xl border border-[#333338] flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1 flex-1 pr-2">
                              <h4 className="font-bold text-xs text-white">{item.title}</h4>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>
                            </div>
                            <div className="shrink-0">
                              {item.type === 'toggle' ? (
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={isChecked}
                                  onClick={() => handleToggle(item.id, item.title)}
                                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    isChecked ? 'bg-[#34C759]' : 'bg-[#39393D]'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                      isChecked ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleActionButton(item)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#3A3A3E] hover:bg-[#48484E] text-white text-xs font-bold border border-[#4E4E54] transition-all flex items-center gap-1.5"
                                >
                                  <span>{item.buttonLabel || 'Configure'}</span>
                                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2F2F35] flex items-center justify-between">
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#2A2A2E] hover:bg-[#343438] text-xs font-bold text-white border border-[#3A3A3E]"
                    >
                      Learn More...
                    </button>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="w-7 h-7 rounded-full bg-[#2A2A2E] hover:bg-[#343438] text-zinc-300 flex items-center justify-center text-xs"
                    >
                      ?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CASE C: DESKTOP RATIO (When deviceRatio === 'desktop' OR screen >= 1024px in 'auto') */}
        {/* ----------------------------------------------------------------------- */}
        <div
          className={`w-full max-w-6xl mx-auto ${
            deviceRatio === 'desktop'
              ? 'block'
              : deviceRatio === 'auto'
              ? 'hidden lg:block'
              : 'hidden'
          }`}
        >
          {/* macOS Window Shell */}
          <div className="bg-[#161619] rounded-2xl sm:rounded-3xl border border-[#2F2F35] shadow-2xl overflow-hidden flex flex-col min-h-[640px] text-white">
            
            {/* Title Bar with macOS Traffic Lights */}
            <div className="bg-[#1D1D20] px-4 py-3 border-b border-[#2F2F35] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  title="Close & Return to Menu"
                  className="w-3 h-3 rounded-full bg-[#FF5F56] hover:opacity-80 transition-opacity flex items-center justify-center group"
                >
                  <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="text-[11px] font-bold text-zinc-400 ml-2">
                  CampusBite System Settings
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#26262B] text-zinc-300 text-[10px] font-mono font-bold border border-zinc-700/60">
                  macOS Sequoia 15.0 · Desktop Ratio
                </span>
              </div>
            </div>

            {/* Desktop Dual-Pane Body */}
            <div className="flex-1 flex min-h-0">
              
              {/* Left Sidebar (Exact screenshot search pill & items) */}
              <div className="w-64 lg:w-72 bg-[#1B1B1E] border-r border-[#2F2F35] p-3 sm:p-4 flex flex-col justify-between shrink-0">
                <div className="space-y-3">
                  {/* Search Input Bar (Matching screenshot search pill with clear button) */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search settings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 bg-[#252528] border border-zinc-700/50 rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Navigation Category List */}
                  <div className="space-y-1 overflow-y-auto max-h-[460px] scrollbar-none pr-1">
                    {filteredSections.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500">
                        No settings match "{searchQuery}"
                      </div>
                    ) : (
                      filteredSections.map((sec) => {
                        const Icon = sec.icon;
                        const isActive = activeSection.id === sec.id;
                        return (
                          <button
                            key={sec.id}
                            onClick={() => navigateTo(sec.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                              isActive
                                ? 'bg-[#007AFF] text-white shadow-xs font-bold'
                                : 'text-zinc-300 hover:bg-[#252529] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                  isActive ? 'bg-white/20 text-white' : `${sec.iconBg} text-white`
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <span className="text-xs block truncate">{sec.title}</span>
                                <span
                                  className={`text-[10px] block truncate ${
                                    isActive ? 'text-white/80' : 'text-zinc-500'
                                  }`}
                                >
                                  {sec.tagline}
                                </span>
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? 'text-white/80' : 'text-zinc-600'
                              }`}
                            />
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Sidebar Bottom Brand Identity */}
                <div className="pt-3 border-t border-[#2F2F35] flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white p-0.5 shrink-0">
                    <Image src="/logo.png" alt="CampusBite" width={28} height={28} className="object-contain" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block leading-tight">CampusBite OS</span>
                    <span className="text-[10px] text-zinc-400 block truncate">Tap • Order • Eat</span>
                  </div>
                </div>
              </div>

              {/* Right Main Settings Panel (Exact Screenshot Structure) */}
              <div className="flex-1 bg-[#161619] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6 max-w-3xl">
                  
                  {/* Header with Navigation Chevrons (< >) and Section Title */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2E]">
                    <div className="flex items-center gap-3">
                      {/* Chevron Navigation Buttons */}
                      <div className="flex items-center gap-1 bg-[#242428] p-0.5 rounded-lg border border-[#333338]">
                        <button
                          onClick={goBackHistory}
                          disabled={historyIndex === 0}
                          className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-300 transition-colors"
                          title="Back in history"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={goForwardHistory}
                          disabled={historyIndex >= history.length - 1}
                          className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-300 transition-colors"
                          title="Forward in history"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <h2 className="text-lg lg:text-xl font-black text-white tracking-tight">
                        {activeSection.title}
                      </h2>
                    </div>
                  </div>

                  {/* Grouped Settings Cards (Exact reproduction of screenshot cards) */}
                  <div className="space-y-4">
                    {activeSection.items.map((item) => {
                      const isChecked = settingsState[item.id] ?? false;

                      return (
                        <div
                          key={item.id}
                          className="bg-[#242428] hover:bg-[#27272C] transition-colors p-4 sm:p-5 rounded-2xl border border-[#333338] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft"
                        >
                          {/* Left Title & Description */}
                          <div className="space-y-1 flex-1 pr-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{item.title}</h4>
                              {item.badge && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                              {item.description}
                            </p>
                          </div>

                          {/* Right Control: macOS Switch or Action Button */}
                          <div className="shrink-0 flex items-center justify-end sm:justify-center">
                            {item.type === 'toggle' ? (
                              <button
                                type="button"
                                role="switch"
                                aria-checked={isChecked}
                                onClick={() => handleToggle(item.id, item.title)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  isChecked ? 'bg-[#34C759]' : 'bg-[#39393D]'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                                    isChecked ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleActionButton(item)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#3A3A3E] hover:bg-[#48484E] text-white text-xs font-bold border border-[#4E4E54] transition-all shadow-xs flex items-center gap-1.5"
                              >
                                <span>{item.buttonLabel || 'Configure'}</span>
                                <ExternalLink className="w-3 h-3 text-zinc-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Geographic Footprint Cards when in Geo section */}
                  {activeSection.id === 'geo' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        { state: 'Maharashtra', city: 'Mumbai', college: 'IIT Bombay Powai Main Campus', canteens: 1, gmv: '₹94,200' },
                        { state: 'Karnataka', city: 'Bengaluru', college: 'Indian Institute of Science Main', canteens: 1, gmv: '₹52,800' },
                        { state: 'Delhi NCR', city: 'New Delhi', college: 'University of Delhi North Campus', canteens: 1, gmv: '₹37,500' },
                      ].map((loc) => (
                        <div key={loc.state} className="p-3.5 rounded-xl border border-[#333338] bg-[#1E1E22] space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase">
                              {loc.state}
                            </span>
                            <span className="font-mono text-xs font-bold text-white">{loc.gmv}</span>
                          </div>
                          <h5 className="font-bold text-xs text-white truncate">{loc.college}</h5>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-500" /> {loc.city} · {loc.canteens} Hub
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Footer: "Learn More..." and '?' help icon (Matching user screenshot) */}
                <div className="pt-6 mt-6 border-t border-[#2A2A2E] flex items-center justify-between">
                  <button
                    onClick={() => setShowHelpModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#2A2A2E] hover:bg-[#343438] border border-[#3A3A3E] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Learn More...
                  </button>

                  <button
                    onClick={() => setShowHelpModal(true)}
                    className="w-7 h-7 rounded-full bg-[#2A2A2E] hover:bg-[#343438] border border-[#3A3A3E] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                    title="System Settings Help"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: macOS System Settings "Learn More..." Sheet */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1D1D20] text-white w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#38383E] animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base sm:text-lg">CampusBite System Settings</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              CampusBite Control Tower provides full-stack governance over digital canteen operations, FSSAI food hygiene verification, and automated payments across Indian colleges.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#252529] border border-[#333338] text-zinc-300">
                <strong className="text-white block mb-0.5">Real-Time State Sync:</strong>
                All toggle settings propagate instantly across active kitchen displays and student terminals via WebSockets.
              </div>
              <div className="p-3 rounded-xl bg-[#252529] border border-[#333338] text-zinc-300">
                <strong className="text-white block mb-0.5">Responsive Ratio Support:</strong>
                Supports Phone ratio (iOS drill-down), Tablet ratio (iPadOS split view), and Desktop ratio (macOS window).
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-charcoal-950 font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: "View Resources" FSSAI & Student Safety Guidelines Sheet */}
      {/* ========================================================================= */}
      {showResourcesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1D1D20] text-white w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#38383E] animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Campus Food Safety & Hygiene Guidelines</h3>
              </div>
              <button
                onClick={() => setShowResourcesModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Official reference materials and emergency compliance protocols governing all vendor stalls:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#252529] border border-[#333338] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">FSSAI Schedule 4 Standards</span>
                  <span className="text-[11px] text-zinc-400">Kitchen hygiene, clean potable water & pest control</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-[#252529] border border-[#333338] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Allergen Notification Protocol</span>
                  <span className="text-[11px] text-zinc-400">Mandatory dairy, nut, and gluten labeling on ticket dispatch</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-[#252529] border border-[#333338] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Student Grievance & Food Committee</span>
                  <span className="text-[11px] text-zinc-400">24/7 incident hotline: safety@campusbite.in</span>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">24x7</span>
              </div>
            </div>

            <button
              onClick={() => setShowResourcesModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-charcoal-950 font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
            >
              Close Resources
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: "Configure Keys" Razorpay API Credentials Sheet */}
      {/* ========================================================================= */}
      {showKeysModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1D1D20] text-white w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#38383E] animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Razorpay Gateway Credentials</h3>
              </div>
              <button
                onClick={() => setShowKeysModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Standard payments integration configuration for all university campus food vendor accounts:
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Razorpay Key ID</label>
                <input
                  type="text"
                  readOnly
                  value="rzp_test_campusbite2026"
                  className="w-full px-3 py-2 bg-[#252528] rounded-xl text-xs font-mono text-amber-400 border border-[#333338]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Webhook Secret (HMAC SHA-256)</label>
                <input
                  type="password"
                  readOnly
                  value="sec_campusbite_webhook_sha256_live"
                  className="w-full px-3 py-2 bg-[#252528] rounded-xl text-xs font-mono text-zinc-300 border border-[#333338]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#252529] border border-[#333338] text-[11px] text-zinc-400">
                Settlements automatically batched daily at 23:59 IST to verified vendor current accounts via Razorpay Route.
              </div>
            </div>

            <button
              onClick={() => setShowKeysModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-charcoal-950 font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
            >
              Close Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
