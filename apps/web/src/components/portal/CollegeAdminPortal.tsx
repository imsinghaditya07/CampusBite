'use client';

import React from 'react';
import Image from 'next/image';
import { Building2, ShieldCheck, FileText, AlertCircle, CheckCircle2, UserX, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface CollegeAdminPortalProps {
  onBackToMenu?: () => void;
}

export default function CollegeAdminPortal({ onBackToMenu }: CollegeAdminPortalProps) {
  const { setRole } = useStore();

  const handleBack = () => {
    if (onBackToMenu) onBackToMenu();
    else setRole('STUDENT');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner */}
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
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-charcoal-950 text-[10px] font-black uppercase">
              College Food Governance
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white overflow-hidden p-1 border border-charcoal-700 shadow-xs shrink-0">
              <Image src="/logo.png" alt="CampusBite" width={44} height={44} className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">IIT Bombay Campus Food Administration</h1>
              <p className="text-xs text-charcoal-400 mt-0.5">Administrator: Dr. Meenakshi Sundaram (Dean of Student Affairs)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-charcoal-100 shadow-xs">
          <span className="text-xs font-semibold text-charcoal-500">Approved Canteens</span>
          <p className="text-2xl font-black text-charcoal-950">3 Active Hubs</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-charcoal-100 shadow-xs">
          <span className="text-xs font-semibold text-charcoal-500">Vendor Applications</span>
          <p className="text-2xl font-black text-amber-600">1 Pending Approval</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-charcoal-100 shadow-xs">
          <span className="text-xs font-semibold text-charcoal-500">Hygiene & Safety Audit Score</span>
          <p className="text-2xl font-black text-emerald-600">98 / 100</p>
        </div>
      </div>

      {/* Pending Vendor Requests */}
      <div className="bg-surface p-6 rounded-2xl border border-charcoal-100 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-charcoal-950">Pending Campus Canteen Applications</h3>
        <div className="p-4 rounded-xl border border-charcoal-100 bg-charcoal-50 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-charcoal-950">North Flavors & Paratha House</h4>
            <p className="text-xs text-charcoal-500">Applicant: Harpreet Singh · Proposed Location: Hostel 14 Quad</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700">
              Approve Vendor
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-charcoal-200 text-charcoal-800 font-bold text-xs hover:bg-charcoal-300">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
