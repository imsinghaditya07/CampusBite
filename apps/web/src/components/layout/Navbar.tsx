'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { ShoppingBag, Search, UserCheck, ChevronDown, Compass, Menu, X, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCollegeModal?: () => void;
  onOpenRoleModal?: () => void;
  onOpenProfile?: () => void;
  onOpenVerification?: () => void;
  onOpenOnboarding?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export default function Navbar({
  onOpenCart,
  activeTab,
  setActiveTab,
  onOpenCollegeModal,
  onOpenRoleModal,
  onOpenProfile,
  onOpenVerification,
  onOpenOnboarding,
  onScrollToSection,
}: NavbarProps) {
  const { role, setRole, collegeName, collegeCity, cart, verificationStatus, isVerified, name } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const openRole = () => {
    if (onOpenRoleModal) onOpenRoleModal();
  };

  const openCollege = () => {
    if (onOpenCollegeModal) onOpenCollegeModal();
  };

  const handleNavClick = (tabId: string, sectionId?: string) => {
    setActiveTab(tabId);
    if (sectionId && onScrollToSection) {
      onScrollToSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E8E8E3] px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Brand Logo & Campus Selector Pill */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white shadow-soft border border-[#E8E8E3] group-hover:scale-105 transition-transform flex items-center justify-center p-0.5 shrink-0">
              <Image
                src="/logo.png"
                alt="CampusBite"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="hidden xs:flex flex-col justify-center">
              <span className="font-black text-lg sm:text-xl tracking-tight leading-none text-[#171717] flex items-center gap-0.5">
                Campus<span className="text-[#F5B51B]">Bite</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block mb-1" />
              </span>
              <span className="text-[9px] font-black tracking-widest text-[#6B6B6B] uppercase mt-0.5">
                Tap • Order • Eat
              </span>
            </div>
          </Link>

          {/* Campus & Map Selector Pill */}
          <button
            onClick={openCollege}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E8E3] text-xs font-semibold text-[#171717] hover:border-[#F5B51B] hover:bg-amber-50/50 transition-all shadow-xs min-w-0 max-w-[160px] sm:max-w-[260px]"
          >
            <Compass className="w-3.5 h-3.5 text-[#F5B51B] shrink-0" />
            <span className="truncate font-bold text-xs">{collegeName}</span>
            <span className="text-[10px] text-[#6B6B6B] hidden md:inline shrink-0">({collegeCity})</span>
            <ChevronDown className="w-3 h-3 text-[#6B6B6B] shrink-0" />
          </button>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F4F4F5] p-1 rounded-full border border-[#E8E8E3] text-xs font-semibold">
          <button
            onClick={() => handleNavClick('explore', 'hero')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'explore'
                ? 'bg-white text-[#171717] shadow-xs font-bold'
                : 'text-[#6B6B6B] hover:text-[#171717]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('explore', 'menu-catalog')}
            className={`px-4 py-1.5 rounded-full transition-all text-[#6B6B6B] hover:text-[#171717]`}
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('explore', 'offers')}
            className={`px-4 py-1.5 rounded-full transition-all text-[#6B6B6B] hover:text-[#171717]`}
          >
            Offers
          </button>
          <button
            onClick={() => handleNavClick('explore', 'how-it-works')}
            className={`px-4 py-1.5 rounded-full transition-all text-[#6B6B6B] hover:text-[#171717]`}
          >
            How It Works
          </button>
        </nav>

        {/* Right Side Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Verified Student Badge & Profile Button */}
          {role === 'STUDENT' && (
            <>
              {isVerified ? (
                <button
                  onClick={onOpenVerification}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-all shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>College Verified</span>
                </button>
              ) : (
                <button
                  onClick={onOpenOnboarding}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-black transition-all shadow-xs animate-pulse"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                  <span>Verify Student Identity</span>
                </button>
              )}

              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E8E3] hover:border-[#171717] text-xs font-bold text-[#171717] transition-all shadow-xs"
                title="Student Identity Profile & Active Sessions"
              >
                <User className="w-3.5 h-3.5 text-[#F5B51B] shrink-0" />
                <span className="hidden xl:inline">{name.split(' ')[0]}</span>
              </button>
            </>
          )}

          {/* Persona Role Switcher Pill */}
          <button
            onClick={openRole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-[#262626] transition-colors shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#F5B51B] shrink-0" />
            <span className="hidden sm:inline text-zinc-400 font-normal">Role:</span>
            <span className="font-bold text-[#F5B51B] truncate max-w-[90px] sm:max-w-none">
              {role.replace('_', ' ')}
            </span>
          </button>

          {/* Cart Button */}
          {role === 'STUDENT' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5B51B] text-[#171717] text-xs font-black hover:bg-[#e0a417] transition-all shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="flex items-center gap-0.5 bg-[#171717] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5">
                  {totalCartCount} · ₹{totalCartPrice}
                </span>
              )}
            </button>
          )}

          {/* Mobile Navigation Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl border border-[#E8E8E3] text-[#171717] hover:bg-[#F4F4F5]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-[#E8E8E3] space-y-2 text-xs animate-in slide-in-from-top-1 duration-150">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleNavClick('explore', 'hero')}
              className="px-3 py-1.5 rounded-full bg-[#171717] text-white font-bold"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('explore', 'menu-catalog')}
              className="px-3 py-1.5 rounded-full bg-white border border-[#E8E8E3] text-[#171717] font-semibold"
            >
              Menu Catalog
            </button>
            <button
              onClick={() => handleNavClick('explore', 'offers')}
              className="px-3 py-1.5 rounded-full bg-white border border-[#E8E8E3] text-[#171717] font-semibold"
            >
              Offers
            </button>
            <button
              onClick={() => handleNavClick('explore', 'how-it-works')}
              className="px-3 py-1.5 rounded-full bg-white border border-[#E8E8E3] text-[#171717] font-semibold"
            >
              How It Works
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
