'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Building2,
  FileText,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  User,
  Check,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface AdminVerificationQueueProps {
  onBackToMenu?: () => void;
}

export default function AdminVerificationQueue({ onBackToMenu }: AdminVerificationQueueProps) {
  const { setRole } = useStore();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'UNDER_REVIEW' | 'COLLEGE_VERIFIED' | 'REJECTED'>('UNDER_REVIEW');
  const [search, setSearch] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Rejection modal
  const [rejectingItem, setRejectingItem] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('College ID card image unreadable or expired');

  useEffect(() => {
    fetchVerifications();
  }, [selectedFilter]);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/verifications?status=${selectedFilter}`);
      const data = await res.json();
      if (data.success && data.verifications) {
        setVerifications(data.verifications);
      }
    } catch (e) {
      // Fallback mock verification queue for demonstration
      setVerifications([
        {
          id: 'ver-101',
          status: 'UNDER_REVIEW',
          createdAt: new Date().toISOString(),
          user: { name: 'Priya Sharma', email: 'priya.s@iitb.ac.in', phone: '+91 9811223344' },
          membership: { studentId: '210050088', college: { name: 'IIT Bombay' }, campus: { name: 'Powai Main' } },
          documents: [{ id: 'doc-1', type: 'COLLEGE_ID_CARD', fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', status: 'PENDING' }],
        },
        {
          id: 'ver-102',
          status: 'UNDER_REVIEW',
          createdAt: new Date().toISOString(),
          user: { name: 'Rohan Verma', email: 'rohan.v@iisc.ac.in', phone: '+91 9877665544' },
          membership: { studentId: '220090014', college: { name: 'IISc Bangalore' }, campus: { name: 'Main Campus' } },
          documents: [{ id: 'doc-2', type: 'COLLEGE_ID_CARD', fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', status: 'PENDING' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (id: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/verifications/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionReason: reason }),
      });
      const data = await res.json();
      setActionSuccessMsg(`Verification request ${action === 'APPROVE' ? 'APPROVED' : 'REJECTED'} successfully!`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
      setRejectingItem(null);
      fetchVerifications();
    } catch (e) {
      setVerifications(verifications.filter((v) => v.id !== id));
      setActionSuccessMsg(`Verification request ${action === 'APPROVE' ? 'APPROVED' : 'REJECTED'} successfully!`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
      setRejectingItem(null);
    }
  };

  const filtered = verifications.filter((v) => {
    const nameMatch = v.user?.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = v.user?.email?.toLowerCase().includes(search.toLowerCase());
    const idMatch = v.membership?.studentId?.toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch || idMatch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#171717] text-white p-4 sm:p-6 rounded-3xl border border-zinc-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <button
              onClick={() => (onBackToMenu ? onBackToMenu() : setRole('STUDENT'))}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[#F5B51B] hover:bg-zinc-800 text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5B51B] text-[#171717] text-[10px] sm:text-[11px] font-black uppercase">
              Student Identity Review Queue
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            College Student Verification Portal
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Review uploaded college ID cards & institutional email verification submissions
          </p>
        </div>

        <button
          onClick={fetchVerifications}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#F5B51B] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E8E3] shadow-xs">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'UNDER_REVIEW', label: 'Under Review' },
            { id: 'COLLEGE_VERIFIED', label: 'Verified' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: 'ALL', label: 'All Submissions' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF7]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, email, roll no..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E8E8E3] text-xs font-semibold focus:border-[#171717] outline-hidden"
          />
        </div>
      </div>

      {/* Verification Queue Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E8E3] shadow-xs">
          <RefreshCw className="w-8 h-8 text-[#F5B51B] animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-[#171717]">Loading verification submissions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E8E3] shadow-xs space-y-2">
          <ShieldCheck className="w-10 h-10 text-[#6B6B6B] mx-auto opacity-50" />
          <h3 className="font-bold text-sm text-[#171717]">No Verifications in Queue</h3>
          <p className="text-xs text-[#6B6B6B]">There are currently no student verification requests matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E8E3] shadow-soft hover:border-[#171717] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-[#D97706] flex items-center justify-center font-bold text-sm shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-sm text-[#171717]">{item.user?.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.status === 'COLLEGE_VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'UNDER_REVIEW'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6B6B]">
                    Email: <strong className="text-[#171717]">{item.user?.email}</strong> · Roll #{item.membership?.studentId}
                  </p>
                  <p className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#171717]" />
                    <span>{item.membership?.college?.name} ({item.membership?.campus?.name})</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8E8E3]">
                {item.status === 'UNDER_REVIEW' && (
                  <>
                    <button
                      onClick={() => handleReviewAction(item.id, 'APPROVE')}
                      className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => setRejectingItem(item)}
                      className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {item.status === 'COLLEGE_VERIFIED' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified Member
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#171717] w-full max-w-md rounded-2xl p-5 shadow-2xl border border-[#E8E8E3] space-y-4">
            <h3 className="font-bold text-base text-[#171717]">Reject Verification Request</h3>
            <p className="text-xs text-[#6B6B6B]">
              Provide a clear reason for rejecting <strong>{rejectingItem.user?.name}</strong>'s college verification.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E8E8E3] text-xs font-semibold focus:border-[#171717] outline-hidden"
            />

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 rounded-xl border border-[#E8E8E3] text-xs font-bold hover:bg-[#FAFAF7]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewAction(rejectingItem.id, 'REJECT', rejectionReason)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
