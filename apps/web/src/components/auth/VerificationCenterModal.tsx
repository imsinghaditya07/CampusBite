'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface VerificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReverification?: () => void;
}

export default function VerificationCenterModal({
  isOpen,
  onClose,
  onStartReverification,
}: VerificationCenterModalProps) {
  const {
    collegeName,
    verificationStatus,
    isVerified,
    email,
    studentId,
    setVerificationStatus,
  } = useStore();

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-[#171717] w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8E8E3] animate-in zoom-in-95 duration-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#171717]">Campus Verification Center</h3>
              <p className="text-[11px] text-[#6B6B6B]">CampusBite Institutional Identity Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF7]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Verification Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            verificationStatus === 'COLLEGE_VERIFIED'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : verificationStatus === 'EMAIL_VERIFIED'
              ? 'bg-blue-50/80 border-blue-200 text-blue-900'
              : verificationStatus === 'UNDER_REVIEW'
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-red-50/80 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2
              className={`w-6 h-6 shrink-0 ${
                verificationStatus === 'COLLEGE_VERIFIED'
                  ? 'text-[#16A34A]'
                  : verificationStatus === 'EMAIL_VERIFIED'
                  ? 'text-blue-600'
                  : 'text-amber-600'
              }`}
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                Current Status
              </span>
              <h4 className="font-black text-sm uppercase tracking-wide">
                {verificationStatus.replace('_', ' ')}
              </h4>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white text-xs font-bold border shadow-xs">
            {isVerified ? 'Access Granted' : 'Pending Review'}
          </span>
        </div>

        {/* Verified College Details Grid */}
        <div className="space-y-3 bg-[#FAFAF7] p-4 rounded-2xl border border-[#E8E8E3] text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E3]">
            <span className="text-[#6B6B6B] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#171717]" /> Verified Campus
            </span>
            <span className="font-bold text-[#171717]">{collegeName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E8E8E3]">
            <span className="text-[#6B6B6B] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#171717]" /> College Email
            </span>
            <span className="font-bold text-emerald-700">student@iitb.ac.in ✓</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E8E8E3]">
            <span className="text-[#6B6B6B] flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#171717]" /> College ID Card
            </span>
            <span className="font-mono font-bold text-[#171717]">Roll #{studentId}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[#6B6B6B] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#171717]" /> Access Policy
            </span>
            <span className="font-semibold text-emerald-700">Multi-Tenant Isolated</span>
          </div>
        </div>

        {/* Verification Explanation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-[#171717] leading-relaxed">
          <p className="font-bold mb-0.5">Why is verification required?</p>
          <p className="text-[#6B6B6B]">
            CampusBite enforces strict institutional verification to ensure private canteen pricing, kitchen queues, and promo offers are reserved exclusively for authorized college members.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-[#E8E8E3] flex flex-col sm:flex-row gap-2">
          {onStartReverification && (
            <button
              onClick={() => {
                onClose();
                onStartReverification();
              }}
              className="flex-1 py-2.5 rounded-xl border border-[#E8E8E3] hover:bg-[#FAFAF7] text-[#171717] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Update / Re-verify College</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Close Verification Center</span>
          </button>
        </div>

      </div>
    </div>
  );
}
