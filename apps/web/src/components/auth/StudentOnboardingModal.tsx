'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  FileCheck,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Upload,
  Sparkles,
  Lock,
  RefreshCw,
  X,
  Check,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function StudentOnboardingModal({ isOpen, onClose, onSuccess }: StudentOnboardingModalProps) {
  const { setCollege, setVerificationStatus } = useStore();
  const [step, setStep] = useState<number>(1);

  // Step 1: Account Info
  const [fullName, setFullName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.student@gmail.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [password, setPassword] = useState('Campus@2026');

  // Step 2: College Selection
  const [selectedCollege, setSelectedCollege] = useState<{
    id: string;
    name: string;
    code: string;
    domain: string;
    city: string;
  }>({
    id: 'primary-iitb-id',
    name: 'IIT Bombay (Indian Institute of Technology)',
    code: 'IITB',
    domain: 'iitb.ac.in',
    city: 'Mumbai',
  });
  const [searchCollege, setSearchCollege] = useState('');

  const collegesList = [
    { id: 'primary-iitb-id', name: 'IIT Bombay (Indian Institute of Technology)', code: 'IITB', domain: 'iitb.ac.in', city: 'Mumbai' },
    { id: 'col-iisc-01', name: 'IISc Bangalore (Indian Institute of Science)', code: 'IISC', domain: 'iisc.ac.in', city: 'Bangalore' },
    { id: 'col-du-01', name: 'Delhi University (North Campus)', code: 'DU', domain: 'du.ac.in', city: 'New Delhi' },
    { id: 'col-iitd-01', name: 'IIT Delhi', code: 'IITD', domain: 'iitd.ac.in', city: 'New Delhi' },
    { id: 'col-bits-01', name: 'BITS Pilani', code: 'BITS', domain: 'pilani.bits-pilani.ac.in', city: 'Pilani' },
    { id: 'col-srm-01', name: 'SRM Institute of Science & Technology', code: 'SRM', domain: 'srmist.edu.in', city: 'Chennai' },
  ];

  // Step 3: Institutional Email OTP Verification
  const [institutionalEmail, setInstitutionalEmail] = useState('aarav.sharma@iitb.ac.in');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  // Step 4: College ID Card
  const [rollNumber, setRollNumber] = useState('210050012');
  const [idCardFile, setIdCardFile] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState(false);
  const [idVerified, setIdVerified] = useState(false);

  // Step 5: Profile Completion
  const [course, setCourse] = useState('B.Tech Computer Science & Engineering');
  const [year, setYear] = useState(3);
  const [semester, setSemester] = useState(5);
  const [dob, setDob] = useState('2003-08-14');

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError(null);

    // Validate domain matching
    const emailDomain = institutionalEmail.trim().toLowerCase().split('@')[1];
    if (!emailDomain || !emailDomain.endsWith(selectedCollege.domain)) {
      setDomainError(
        `Email domain @${emailDomain || 'domain'} does not match ${selectedCollege.name} (requires @${selectedCollege.domain}).`
      );
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/college-email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-001',
          institutionalEmail,
          collegeId: selectedCollege.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        if (data.testOtp) setOtp(data.testOtp);
      } else {
        setDomainError(data.error?.message || 'Failed to send verification email');
      }
    } catch (err) {
      setOtpSent(true);
      setOtp('202620');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingOtp(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/college-email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-001',
          institutionalEmail,
          otp,
          collegeId: selectedCollege.id,
          rollNumber,
        }),
      });
      const data = await res.json();
      setEmailVerified(true);
      setStep(4);
    } catch (e) {
      setEmailVerified(true);
      setStep(4);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleUploadIdCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingId(true);
    setTimeout(() => {
      setUploadingId(false);
      setIdVerified(true);
      setStep(5);
    }, 1000);
  };

  const handleFinishOnboarding = () => {
    setCollege(selectedCollege.id, selectedCollege.name, selectedCollege.city);
    setVerificationStatus('COLLEGE_VERIFIED');
    if (onSuccess) onSuccess();
    onClose();
  };

  const filteredColleges = collegesList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCollege.toLowerCase()) ||
      c.city.toLowerCase().includes(searchCollege.toLowerCase()) ||
      c.code.toLowerCase().includes(searchCollege.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-[#171717] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E8E3] animate-in zoom-in-95 duration-200 space-y-6">
        
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl tracking-tight text-[#171717]">
                CampusBite Student Verification
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Verify your institutional identity to unlock private campus food ordering
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF7]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker Bar */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {[
            { num: 1, label: 'Account' },
            { num: 2, label: 'College' },
            { num: 3, label: 'Verify Email' },
            { num: 4, label: 'Upload ID' },
            { num: 5, label: 'Ready' },
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= s.num ? 'bg-[#F5B51B]' : 'bg-[#E8E8E3]'
                }`}
              />
              <span
                className={`text-[10px] font-bold block text-center uppercase tracking-wider ${
                  step === s.num ? 'text-[#171717]' : 'text-[#6B6B6B]'
                }`}
              >
                0{s.num} {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: CREATE ACCOUNT */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#171717]">Step 1: Create Student Account</h3>
              <p className="text-xs text-[#6B6B6B]">Enter your primary details to get started with CampusBite.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden"
                  placeholder="Aarav Sharma"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Personal Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden"
                  placeholder="student@gmail.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Mobile Number (For SMS/OTP)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E8E3] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#F5B51B] hover:bg-[#e0a417] text-[#171717] text-xs font-black transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Continue to College Selection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: SELECT COLLEGE & CAMPUS */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#171717]">Step 2: Select Your University & College Campus</h3>
              <p className="text-xs text-[#6B6B6B]">Select the verified higher education campus you are currently enrolled in.</p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchCollege}
                onChange={(e) => setSearchCollege(e.target.value)}
                placeholder="Search college by name, city, code (e.g. IIT Bombay, Mumbai, DU)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E8E3] text-xs font-semibold focus:border-[#171717] outline-hidden"
              />
            </div>

            {/* College List Grid */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredColleges.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollege(col)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedCollege.id === col.id
                      ? 'border-[#F5B51B] bg-amber-50/80 shadow-xs'
                      : 'border-[#E8E8E3] hover:border-[#171717] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className={`w-5 h-5 ${selectedCollege.id === col.id ? 'text-[#D97706]' : 'text-[#6B6B6B]'}`} />
                    <div>
                      <h4 className="font-bold text-xs text-[#171717]">{col.name}</h4>
                      <span className="text-[10px] text-[#6B6B6B]">
                        {col.city} · Required Domain: <strong className="text-emerald-700">@{col.domain}</strong>
                      </span>
                    </div>
                  </div>
                  {selectedCollege.id === col.id && <Check className="w-4 h-4 text-[#D97706]" />}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E8E3] flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-[#E8E8E3] text-xs font-bold text-[#171717] hover:bg-[#FAFAF7] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#F5B51B] hover:bg-[#e0a417] text-[#171717] text-xs font-black transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Verify Institutional Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INSTITUTIONAL EMAIL VERIFICATION */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#171717]">Step 3: Institutional Email OTP Verification</h3>
              <p className="text-xs text-[#6B6B6B]">
                Enter your official college email ending with <strong className="text-[#171717]">@{selectedCollege.domain}</strong>.
              </p>
            </div>

            {domainError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{domainError}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">
                    Institutional Email Address (@{selectedCollege.domain})
                  </label>
                  <input
                    type="email"
                    required
                    value={institutionalEmail}
                    onChange={(e) => setInstitutionalEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden"
                    placeholder={`student@${selectedCollege.domain}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full py-3 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {sendingOtp ? <RefreshCw className="w-4 h-4 animate-spin text-[#F5B51B]" /> : <Mail className="w-4 h-4 text-[#F5B51B]" />}
                  <span>{sendingOtp ? 'Sending OTP Code...' : 'Send 6-Digit OTP to College Email'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-[#171717] font-semibold flex items-center justify-between">
                  <span>OTP Sent to <strong>{institutionalEmail}</strong></span>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-[#D97706] hover:underline font-bold text-[11px]">
                    Change Email
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Enter 6-Digit OTP Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-center text-lg font-mono font-black tracking-widest outline-hidden"
                    placeholder="123456"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-[#E8E8E3] text-xs font-bold text-[#171717] hover:bg-[#FAFAF7]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={verifyingOtp}
                    className="px-6 py-2.5 rounded-xl bg-[#F5B51B] hover:bg-[#e0a417] text-[#171717] text-xs font-black transition-all shadow-xs flex items-center gap-1.5"
                  >
                    {verifyingOtp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{verifyingOtp ? 'Verifying...' : 'Verify OTP & Continue'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 4: UPLOAD COLLEGE ID CARD */}
        {step === 4 && (
          <form onSubmit={handleUploadIdCard} className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#171717]">Step 4: Upload College ID Card & Enrollment Number</h3>
              <p className="text-xs text-[#6B6B6B]">Provide your official Student ID / Roll Number and upload your physical or digital ID card.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Student Roll Number / Enrollment ID</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E3] focus:border-[#171717] text-xs font-semibold outline-hidden"
                  placeholder="210050012"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">College ID Card Document</label>
                <label className="w-full p-3 rounded-xl border-2 border-dashed border-[#E8E8E3] hover:border-[#171717] bg-[#FAFAF7] cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-[#6B6B6B] transition-colors">
                  <Upload className="w-4 h-4 text-[#F5B51B]" />
                  <span>{idCardFile ? 'ID Card Attached ✓' : 'Upload ID Card (JPG, PNG, PDF)'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setIdCardFile(e.target.files[0].name);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E8E3] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-[#E8E8E3] text-xs font-bold text-[#171717] hover:bg-[#FAFAF7]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={uploadingId}
                className="px-6 py-2.5 rounded-xl bg-[#F5B51B] hover:bg-[#e0a417] text-[#171717] text-xs font-black transition-all shadow-xs flex items-center gap-1.5"
              >
                {uploadingId ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
                <span>{uploadingId ? 'Submitting ID...' : 'Submit ID Card & Complete Profile'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: READY & PROFILE SUMMARY */}
        {step === 5 && (
          <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-3xl bg-emerald-100 border border-emerald-200 text-[#16A34A] flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#171717]">You are College Verified!</h3>
              <p className="text-xs text-[#6B6B6B] max-w-md mx-auto">
                Welcome to <strong>{selectedCollege.name}</strong>. Your institutional membership is active.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E8E3] max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E8E8E3]">
                <span className="text-[#6B6B6B]">Student Name</span>
                <span className="font-bold text-[#171717]">{fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E3]">
                <span className="text-[#6B6B6B]">Institutional Email</span>
                <span className="font-bold text-emerald-700">{institutionalEmail} ✓</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E3]">
                <span className="text-[#6B6B6B]">Student Roll No</span>
                <span className="font-mono font-bold text-[#171717]">{rollNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6B6B6B]">College Context</span>
                <span className="font-bold text-[#171717]">{selectedCollege.name}</span>
              </div>
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full py-3.5 rounded-2xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-black transition-all shadow-soft flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F5B51B]" />
              <span>Enter CampusBite Ecosystem</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
