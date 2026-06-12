import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { BookOpen, ShieldCheck } from 'lucide-react';

interface QRCodeBrandedProps {
  size?: number;
  className?: string;
}

export default function QRCodeBranded({ size = 200, className = "" }: QRCodeBrandedProps) {
  // SVG representing an open Quran/Book in green for center logo of QR code
  const quranLogoUrl = `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%23047857" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;

  return (
    <div className={`flex flex-col items-center bg-white p-6 rounded-2xl border-4 border-primary/20 shadow-xl relative overflow-hidden ${className}`}>
      {/* Decorative Traditional Corner Slates */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg"></div>

      {/* Madrasah Banner Label (Curved styling or header) */}
      <div className="text-center mb-4 min-w-full">
        <span className="bg-primary/10 text-primary-dark text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-primary/20 flex gap-1 items-center justify-center mx-auto w-max mb-1.5">
          <ShieldCheck size={13} className="text-gold" /> অফিসিয়াল ডিজিটাল আইডি
        </span>
        <h3 className="font-bold text-gray-800 text-sm md:text-base tracking-tight select-all">
          তাহফিজুল কুরআন মডেল মাদ্রাসা
        </h3>
        <p className="text-[10px] text-slate-400 font-sans tracking-wider mt-0.5">ESTD. 2026</p>
      </div>

      {/* QR Code with custom logo center */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shadow-inner relative group cursor-pointer">
        <QRCodeSVG
          value="https://tahfizulquran.profwht.info/"
          size={size}
          bgColor="#F8FAFC" // Soft light grey/slate-50 to match design exactly
          fgColor="#047857" // Primary dark emerald green
          level="H" // High error correction
          includeMargin={true}
          imageSettings={{
            src: "https://i.ibb.co/xtVT4r02/1-20260612-202052-0000.png",
            height: size * 0.22,
            width: size * 0.22,
            excavate: true,
          }}
        />
        {/* Subtle Animated Glow */}
        <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300"></div>
      </div>

      {/* Web Link Information */}
      <div className="text-center mt-4">
        <p className="text-[11px] text-slate-500 font-medium">ওয়েবসাইট ঠিকানা</p>
        <a 
          href="https://tahfizulquran.profwht.info/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs font-semibold text-primary-dark hover:text-gold transition-colors font-sans tracking-wide mt-0.5 block hover:underline"
        >
          tahfizulquran.profwht.info
        </a>
      </div>
    </div>
  );
}
