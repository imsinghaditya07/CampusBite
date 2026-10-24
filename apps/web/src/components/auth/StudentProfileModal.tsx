'use client';

import React, { useState } from 'react';
import {
  User,
  Building2,
  BookOpen,
  Lock,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  LogOut,
  X,
  Edit2,
  Save,
  RefreshCw,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerification?: () => void;
}

export default function StudentProfileModal({
  isOpen,
  onClose,
  onOpenVerification,
}: StudentProfileModalProps) {
  const { name, email, collegeName, studentId, verificationStatus } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'security' | 'privacy'>('profile');
  const [editing, setEditing] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(name);
  const [phone, setPhone] = useState('+91 9876543210');
  const [dob, setDob] = useState('2003-08-14');
  const [course, setCourse] = useState('B.Tech Computer Science & Engineering');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [semester, setSemester] = useState('Semester 6');
  const [dietaryPref, setDietaryPref] = useState('VEG');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // Active Sessions
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Chrome · macOS Monterey (Current Device)', ip: '127.0.0.1', lastActive: 'Active now' },
    { id: 'sess-2', device: 'CampusBite App · iPhone 15 Pro', ip: '103.22.40.12', lastActive: '2 hours ago' },
  ]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    }, 600);
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const handleLogoutAll = () => {
    setSessions(sessions.filter((s) => s.id === 'sess-1'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-[#171717] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E8E3] animate-in zoom-in-95 duration-200 space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#D97706] flex items-center justify-center font-black text-lg overflow-hidden shrink-0">
              <span>{name.charAt(0)}</span>
              <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[8px] py-0.5 text-center flex items-center justify-center gap-0.5">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl text-[#171717]">{name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-[#6B6B6B]">{email} · Roll #{studentId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF7]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 border-b border-[#E8E8E3] pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'profile', label: 'Personal & College', icon: User },
            { id: 'academic', label: 'Academic & Diet', icon: BookOpen },
            { id: 'security', label: 'Sessions & Security', icon: Lock },
            { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
          ].map((t) => {
            const IconComponent = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === t.id
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF7]'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 text-[#F5B51B]" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* TAB 1: PERSONAL & COLLEGE INFO */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!editing}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden disabled:bg-[#FAFAF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Date of Birth</label>
                <input
                  type="date"
                  disabled={!editing}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden disabled:bg-[#FAFAF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Verified College</label>
                <input
                  type="text"
                  disabled
                  value={collegeName}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] text-xs font-bold bg-[#FAFAF7] text-[#171717]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Institutional Email</label>
                <input
                  type="text"
                  disabled
                  value="student@iitb.ac.in ✓"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs font-bold bg-emerald-50/50 text-emerald-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E8E3] flex items-center justify-between">
              {onOpenVerification && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVerification();
                  }}
                  className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> View Verification Details
                </button>
              )}

              {editing ? (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#F5B51B] hover:bg-[#e0a417] text-[#171717] text-xs font-black transition-all flex items-center gap-1.5 shadow-xs"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#F5B51B]" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* TAB 2: ACADEMIC & DIETARY PREFERENCES */}
        {activeTab === 'academic' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Course Program</label>
                <input
                  type="text"
                  disabled={!editing}
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden disabled:bg-[#FAFAF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Department</label>
                <input
                  type="text"
                  disabled={!editing}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden disabled:bg-[#FAFAF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Academic Year</label>
                <input
                  type="text"
                  disabled={!editing}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden disabled:bg-[#FAFAF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Dietary Preference</label>
                <select
                  disabled={!editing}
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden disabled:bg-[#FAFAF7]"
                >
                  <option value="VEG">100% Vegetarian (Pure Veg)</option>
                  <option value="NON_VEG">Non-Vegetarian & Veg</option>
                  <option value="EGG">Eggitarian</option>
                  <option value="JAIN">Jain Special (No Root Veggies)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E8E3] flex justify-end">
              {editing ? (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#F5B51B] hover:bg-[#e0a417] text-[#171717] text-xs font-black transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" /> Save Preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-bold hover:bg-[#262626] flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#F5B51B]" /> Edit Preferences
                </button>
              )}
            </div>
          </form>
        )}

        {/* TAB 3: ACTIVE SESSIONS & SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#171717]">Active Logged-In Sessions</h4>
                <p className="text-[11px] text-[#6B6B6B]">Devices currently authenticated to your CampusBite account.</p>
              </div>
              <button
                onClick={handleLogoutAll}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Revoke Other Devices
              </button>
            </div>

            <div className="space-y-2">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl border border-[#E8E8E3] bg-[#FAFAF7] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-[#D97706]" />
                    <div>
                      <span className="font-bold text-[#171717] block">{s.device}</span>
                      <span className="text-[10px] text-[#6B6B6B]">IP: {s.ip} · {s.lastActive}</span>
                    </div>
                  </div>
                  {s.id !== 'sess-1' && (
                    <button
                      onClick={() => handleRevokeSession(s.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 font-bold text-[11px]"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRIVACY & ACCOUNT DEACTIVATION */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2 text-[#171717]">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D97706]" /> Identity Privacy Protection
              </h4>
              <p className="text-[#6B6B6B] text-[11px] leading-relaxed">
                Your uploaded College ID Card, Date of Birth, and Roll Number are encrypted and stored in private storage. Canteen operators only receive your pickup order number.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-red-200 bg-red-50/50 space-y-2">
              <h4 className="font-bold text-xs text-red-800 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-600" /> Account Deactivation
              </h4>
              <p className="text-[11px] text-red-700">
                Deactivating your account will archive your student profile and revoke active campus canteen memberships.
              </p>
              <button
                onClick={() => alert('Account deactivation request logged.')}
                className="px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition-colors shadow-xs"
              >
                Request Account Deactivation
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
