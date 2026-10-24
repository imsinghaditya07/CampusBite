'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E8E8E3] pt-12 pb-8 px-4 sm:px-8 text-xs text-[#6B6B6B]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white shadow-soft border border-[#E8E8E3] p-0.5 shrink-0">
                <Image
                  src="/logo.png"
                  alt="CampusBite"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="font-black text-lg text-[#171717] tracking-tight flex items-center gap-0.5 leading-none">
                  Campus<span className="text-[#F5B51B]">Bite</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block mb-1" />
                </span>
                <span className="text-[9px] font-black tracking-widest text-[#6B6B6B] uppercase block mt-0.5">
                  Tap • Order • Eat
                </span>
              </div>
            </div>
            
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-sm">
              Tap. Order. Eat. <br />
              India's digital campus food operating system connecting students, canteen operators, and university governance.
            </p>
          </div>

          {/* Links Column 1: Product */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-[#171717] uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><a href="#cravings" className="hover:text-[#171717] transition-colors">Menu Categories</a></li>
              <li><a href="#favourites" className="hover:text-[#171717] transition-colors">Today's Favourites</a></li>
              <li><a href="#offers" className="hover:text-[#171717] transition-colors">Student Combos</a></li>
              <li><a href="#how-it-works" className="hover:text-[#171717] transition-colors">Live Order Tracker</a></li>
            </ul>
          </div>

          {/* Links Column 2: For Campuses */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-[#171717] uppercase tracking-wider">For Campuses</h4>
            <ul className="space-y-2">
              <li><span className="text-[#6B6B6B]">Canteen Vendors</span></li>
              <li><span className="text-[#6B6B6B]">Kitchen KDS Systems</span></li>
              <li><span className="text-[#6B6B6B]">College Administration</span></li>
              <li><span className="text-[#6B6B6B]">University Partners</span></li>
            </ul>
          </div>

          {/* Links Column 3: Support & Grievance */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-[#171717] uppercase tracking-wider">Support & Hygiene</h4>
            <ul className="space-y-2">
              <li><a href="mailto:support@campusbite.in" className="hover:text-[#171717] transition-colors">CampusBite Support</a></li>
              <li>
                <a 
                  href="https://foscos.fssai.gov.in/consumergrievance/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#D97706] hover:text-[#B45309] font-bold transition-colors group"
                >
                  <span>FSSAI Hygiene Grievance</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li><span className="text-[#6B6B6B]">Privacy Policy</span></li>
              <li><span className="text-[#6B6B6B]">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Dedicated Student Hygiene & Quality Support Grievance Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-[#D97706]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-[#171717] flex items-center gap-2">
                Food Quality & Hygiene Complaint Portal
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-wide">FSSAI Official</span>
              </h5>
              <p className="text-xs text-[#6B6B6B] mt-0.5 max-w-2xl">
                If you receive unhygienic or substandard food at any campus canteen, you can lodge an official grievance directly on the Government FSSAI portal.
              </p>
            </div>
          </div>
          <a
            href="https://foscos.fssai.gov.in/consumergrievance/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Report Hygiene Issue (FSSAI)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Bottom Rights & Discreet Credit */}
        <div className="pt-6 border-t border-[#E8E8E3] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B6B6B]">
          <p>© 2026 CampusBite Operating Systems Inc. All rights reserved.</p>
          <p className="text-[10px] text-[#6B6B6B]">
            Crafted with ❤️ by <span className="font-semibold text-[#171717]">Team Byte Breaker</span>: Aditya Singh · Anand Kumar Jha · Rishabh Kumar
          </p>
        </div>

      </div>
    </footer>
  );
}
