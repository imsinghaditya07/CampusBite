'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';

// Storytelling Home Sections
import HeroSection from '@/components/home/HeroSection';
import CravingCategoryRail from '@/components/home/CravingCategoryRail';
import TodaysFavourites from '@/components/home/TodaysFavourites';
import IndiaCampusSection from '@/components/home/IndiaCampusSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import LiveTrackerPreview from '@/components/home/LiveTrackerPreview';
import SmartRecommendations from '@/components/home/SmartRecommendations';
import WasteSection from '@/components/home/WasteSection';
import OffersSection from '@/components/home/OffersSection';
import FinalCTASection from '@/components/home/FinalCTASection';

// Verification & Auth Modals
import StudentOnboardingModal from '@/components/auth/StudentOnboardingModal';
import VerificationCenterModal from '@/components/auth/VerificationCenterModal';
import StudentProfileModal from '@/components/auth/StudentProfileModal';
import AdminVerificationQueue from '@/components/portal/AdminVerificationQueue';

// Menu & Portals
import CategoryMenuCardGrid from '@/components/menu/CategoryMenuCardGrid';
import CartDrawer from '@/components/cart/CartDrawer';
import RazorpayModal from '@/components/payment/RazorpayModal';
import LiveOrderTracker from '@/components/order/LiveOrderTracker';
import OwnerPortal from '@/components/portal/OwnerPortal';
import KDSPortal from '@/components/portal/KDSPortal';
import CollegeAdminPortal from '@/components/portal/CollegeAdminPortal';
import SuperAdminControlTower from '@/components/portal/SuperAdminControlTower';
import CollegeMapModal from '@/components/college/CollegeMapModal';
import { useStore } from '@/store/useStore';
import io from 'socket.io-client';
import { ArrowLeft, Sparkles, UserCheck } from 'lucide-react';

export default function Home() {
  const {
    role,
    setRole,
    cart,
    clearCart,
    setMenuData,
    updateItemPriceAndAvailability,
  } = useStore();

  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Fetch complete 12-category menu from backend database & connect Socket.IO
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/canteens/campusbite-central-iitb');
        const data = await res.json();
        if (data.success && data.canteen?.categories) {
          const allItems: any[] = [];
          data.canteen.categories.forEach((cat: any) => {
            cat.foodItems.forEach((item: any) => {
              allItems.push({ ...item, category: { name: cat.name } });
            });
          });
          setMenuData(data.canteen.categories, allItems);
        }
      } catch (e) {
        console.error('Menu load error:', e);
      }
    };

    fetchMenu();

    // Listen to real-time price & stock updates from Canteen Owner
    const socket = io('http://localhost:4000');
    socket.on('menu.item_updated', (updatedItem: any) => {
      updateItemPriceAndAvailability(updatedItem.id, updatedItem.price, updatedItem.isAvailable);
    });

    return () => {
      socket.disconnect();
    };
  }, [setMenuData, updateItemPriceAndAvailability]);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false);
    try {
      const res = await fetch('http://localhost:4000/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'student-id-001',
          canteenId: 'campusbite-central-iitb',
          items: cart,
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        setActiveOrderId(data.order.id);
      }
    } catch (e) {
      clearCart();
      setActiveOrderId('ord-8801');
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roles = [
    { id: 'STUDENT', label: 'Student Portal', desc: 'Order food, track live queue & scan QR' },
    { id: 'CANTEEN_OWNER', label: 'Canteen Owner Portal', desc: 'Live operations, edit prices & stock availability' },
    { id: 'KITCHEN_STAFF', label: 'Kitchen KDS Display', desc: 'Tablet kitchen queue & station status' },
    { id: 'COLLEGE_ADMIN', label: 'College Admin Portal', desc: 'Campus food policy & vendor approvals' },
    { id: 'SUPER_ADMIN', label: 'Super Admin Control Tower', desc: 'India geographic view & platform GMV' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#171717]">
      
      {/* 1. Floating/Sticky Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCollegeModal={() => setShowCollegeModal(true)}
        onOpenRoleModal={() => setShowRoleModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenVerification={() => setShowVerificationModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* 2. Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 md:px-8 space-y-6">
        
        {/* Role Specific Portals */}
        {role === 'CANTEEN_OWNER' && (
          <OwnerPortal onBackToMenu={() => { setRole('STUDENT'); setActiveTab('explore'); }} />
        )}
        {role === 'KITCHEN_STAFF' && (
          <KDSPortal onBackToMenu={() => { setRole('STUDENT'); setActiveTab('explore'); }} />
        )}
        {role === 'COLLEGE_ADMIN' && (
          <div className="space-y-6">
            <CollegeAdminPortal onBackToMenu={() => { setRole('STUDENT'); setActiveTab('explore'); }} />
            <AdminVerificationQueue onBackToMenu={() => { setRole('STUDENT'); setActiveTab('explore'); }} />
          </div>
        )}
        {role === 'SUPER_ADMIN' && (
          <div className="space-y-6">
            <SuperAdminControlTower onBackToMenu={() => { setRole('STUDENT'); setActiveTab('explore'); }} />
            <AdminVerificationQueue onBackToMenu={() => { setRole('STUDENT'); setActiveTab('explore'); }} />
          </div>
        )}

        {/* Student View (Storytelling Landing Experience) */}
        {role === 'STUDENT' && (
          <>
            {activeOrderId ? (
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center bg-amber-50 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                  <span className="text-xs font-bold text-[#171717] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
                    Live Order Tracker Active
                  </span>
                  <button
                    onClick={() => setActiveOrderId(null)}
                    className="text-xs text-[#D97706] hover:underline font-bold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Full Menu
                  </button>
                </div>
                <LiveOrderTracker
                  orderId={activeOrderId}
                  onBackToMenu={() => setActiveOrderId(null)}
                />
              </div>
            ) : (
              /* Storytelling Product Experience Stack */
              <div className="space-y-4 sm:space-y-8">
                
                {/* Hero Section */}
                <HeroSection
                  onOrderNow={() => handleScrollToSection('menu-catalog')}
                  onExploreMenu={() => handleScrollToSection('menu-catalog')}
                />

                {/* Craving Categories Rail */}
                <CravingCategoryRail
                  selectedCategory={selectedCategoryFilter}
                  onSelectCategory={(cat) => {
                    setSelectedCategoryFilter(cat);
                    handleScrollToSection('menu-catalog');
                  }}
                />

                {/* Today's Favourites Food Grid */}
                <TodaysFavourites
                  onViewAllMenu={() => handleScrollToSection('menu-catalog')}
                />

                {/* Taste India on Campus Editorial */}
                <IndiaCampusSection
                  onSelectRegion={(reg) => {
                    setSelectedCategoryFilter(reg);
                    handleScrollToSection('menu-catalog');
                  }}
                />

                {/* How CampusBite Works */}
                <HowItWorksSection />

                {/* Live Order Tracker Demonstration Widget */}
                <LiveTrackerPreview />

                {/* Complete 12-Category Menu Catalog */}
                <CategoryMenuCardGrid />

                {/* Smart Recommendations */}
                <SmartRecommendations />

                {/* Sustainability & Less Waste */}
                <WasteSection />

                {/* Combos & Student Offers */}
                <OffersSection
                  onExploreOffers={() => handleScrollToSection('menu-catalog')}
                />

                {/* Final Closing CTA */}
                <FinalCTASection
                  onStartOrdering={() => handleScrollToSection('menu-catalog')}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Mobile Bottom Navigation & Cart Bar */}
      <MobileBottomNav
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCollegeModal={() => setShowCollegeModal(true)}
        onOpenRoleModal={() => setShowRoleModal(true)}
        activeOrderId={activeOrderId}
        onViewOrder={() => {
          if (activeOrderId) setActiveTab('explore');
        }}
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          if (t === 'explore' && role !== 'STUDENT') {
            setRole('STUDENT');
          }
        }}
      />

      {/* College & Map Selector Modal */}
      <CollegeMapModal
        isOpen={showCollegeModal}
        onClose={() => setShowCollegeModal(false)}
      />

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Razorpay Payment Checkout Modal */}
      <RazorpayModal
        isOpen={isPaymentOpen}
        amount={cart.reduce((acc, i) => acc + i.price * i.quantity, 0)}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setIsPaymentOpen(false)}
      />

      {/* Persona Role Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white text-[#171717] w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#E8E8E3] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F5B51B]" />
                <h3 className="font-bold text-base sm:text-lg text-[#171717]">Switch CampusBite Persona</h3>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-[#6B6B6B] hover:text-[#171717] p-1">
                ✕
              </button>
            </div>
            
            <p className="text-xs text-[#6B6B6B] mb-4">
              Select any role to test live price changes, kitchen KDS tickets, or student 1-tap ordering.
            </p>

            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id as any);
                    setShowRoleModal(false);
                    if (r.id === 'STUDENT') setActiveTab('explore');
                    else if (r.id === 'CANTEEN_OWNER') setActiveTab('owner-portal');
                    else if (r.id === 'KITCHEN_STAFF') setActiveTab('kds-portal');
                    else if (r.id === 'COLLEGE_ADMIN') setActiveTab('college-admin');
                    else if (r.id === 'SUPER_ADMIN') setActiveTab('control-tower');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    role === r.id
                      ? 'border-[#F5B51B] bg-amber-50/70 shadow-xs'
                      : 'border-[#E8E8E3] hover:border-[#171717] hover:bg-[#FAFAF7]'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#171717]">{r.label}</h4>
                    <p className="text-[11px] text-[#6B6B6B]">{r.desc}</p>
                  </div>
                  {role === r.id && <span className="w-2.5 h-2.5 rounded-full bg-[#F5B51B] shrink-0" />}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E8E3] mt-4">
              <button
                onClick={() => setShowRoleModal(false)}
                className="w-full py-2.5 rounded-xl border border-[#E8E8E3] hover:bg-[#FAFAF7] text-[#171717] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Onboarding & Verification Modals */}
      <StudentOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
      <VerificationCenterModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* 3. SaaS Product Footer */}
      <Footer />

    </div>
  );
}

