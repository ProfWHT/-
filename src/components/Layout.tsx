import { Link, Outlet } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Menu, X, Heart, QrCode } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRModal from './QRModal';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrInitialTab, setQrInitialTab] = useState<'view' | 'scan'>('view');
  const [settings, setSettings] = useState<any>({
    header_text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم',
    phone_number: '01824141497, 01633930308',
    address: 'তাফসীরুল কুরআন মাদ্রাসা, মুসলিম নগর, বুড়িরডাঙ্গা, দিগরাজ, মোংলা, বাগেরহাট'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if(data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      })
      .catch(console.error);
  }, []);

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'আমাদের সম্পর্কে', path: '/a' },
    { name: 'শিক্ষকগণ', path: '/t' },
    { name: 'শিক্ষার্থী', path: '/s' },
    { name: 'বিভাগসমূহ', path: '/d' },
    { name: 'ভর্তি তথ্য', path: '/ad' },
    { name: 'গ্যালারি', path: '/g' },
    { name: 'ডোনেশন', path: '/do' },
    { name: 'দানবীরগণ', path: '/dn' },
    { name: 'যোগাযোগ', path: '/c' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-bangla bg-white text-slate-800">
      {/* Donation Floating Button */}
      <Link 
        to="/do" 
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-50 flex items-center gap-2 font-bold"
        aria-label="ডোনেশন করুন"
        title="ডোনেশন করুন"
      >
        <Heart size={24} />
      </Link>

      {/* Responsive QR and Scanning Modal */}
      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        initialTab={qrInitialTab}
      />

      {/* Top Bar */}
      <div className="bg-primary px-4 py-2 text-white text-sm hidden md:flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><MapPin size={16} /> {settings.address}</span>
          <span className="flex items-center gap-1"><Phone size={16} /> {settings.phone_number?.split(',')[0]}</span>
        </div>
        <div>
           {settings.header_text}
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/YTWCM1Gd/Green-Minimalist-Al-Quran-Logo-20260612-183641-0000.png" 
              alt="তাফসীরুল কুরআন মাদ্রাসা লোগো" 
              className="h-12 w-12 object-contain shrink-0 filter drop-shadow hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary-dark">তাফসীরুল কুরআন মাদ্রাসা</h1>
              <p className="text-xs text-slate-500 arabic-text text-xl -mt-1 text-primary">مدرسة تفسير القرآن</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="font-semibold text-slate-700 hover:text-primary transition-colors text-sm lg:text-base">
                {link.name}
              </Link>
            ))}
            <div className="flex gap-2 shrink-0 items-center">
              <button 
                onClick={() => { setQrInitialTab('view'); setIsQRModalOpen(true); }}
                className="bg-gold hover:bg-gold-light text-white px-3 py-2 rounded-md font-bold transition-colors text-xs lg:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode size={16} />
                ডিজিটাল কিউআর
              </button>
              <Link to="/sl" className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-md font-bold transition-colors text-xs lg:text-sm">
                শিক্ষার্থী লগইন
              </Link>
              <Link to="/admin" className="bg-primary-dark hover:bg-primary text-white px-3 py-2 rounded-md font-bold transition-colors text-xs lg:text-sm">
                শিক্ষক লগইন
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white shadow-lg overflow-hidden absolute top-[88px] w-full z-40"
          >
            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="font-semibold text-slate-700 border-b pb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={() => { setMobileMenuOpen(false); setQrInitialTab('view'); setIsQRModalOpen(true); }}
                  className="bg-gold hover:bg-gold-light text-white text-center py-2.5 rounded-md font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer w-full"
                >
                  <QrCode size={18} />
                  ডিজিটাল কিউআর কোড
                </button>
                <Link 
                  to="/sl" 
                  className="bg-primary hover:bg-primary-dark text-white text-center py-2.5 rounded-md font-bold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  শিক্ষার্থী লগইন
                </Link>
                <Link 
                  to="/admin" 
                  className="bg-primary-dark hover:bg-primary text-white text-center py-2.5 rounded-md font-bold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  শিক্ষক লগইন
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="flex-1 bg-slate-50 relative z-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://i.ibb.co/YTWCM1Gd/Green-Minimalist-Al-Quran-Logo-20260612-183641-0000.png" 
                alt="তাফসীরুল কুরআন মাদ্রাসা লোগো" 
                className="h-12 w-12 object-contain shrink-0 bg-white/10 p-1 rounded-full border border-white/10 filter drop-shadow"
                referrerPolicy="no-referrer"
              />
              <h2 className="text-xl font-bold">তাফসীরুল কুরআন মাদ্রাসা</h2>
            </div>
            <p className="text-sm opacity-80 mb-4 max-w-sm">
              কুরআনের আলোয় আলোকিত সমাজ গড়ার প্রত্যয়ে আমাদের এই প্রতিষ্ঠান। আসুন, আপনার সন্তানকে একজন আদর্শ হাফেজে কুরআন হিসেবে গড়ে তুলি।
            </p>
            <div className="mt-5">
              <span className="text-[11px] font-bold text-slate-300 block mb-2 uppercase tracking-wider font-sans">Official Android App</span>
              <a 
                href="https://play.google.com/store/apps/details?id=tahfizul.quranmadrasha" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 bg-black hover:bg-slate-900 border border-white/10 hover:border-white/30 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-black/35 group active:scale-[0.98]"
              >
                <svg className="w-6 h-6 text-white group-hover:scale-105 transition-all duration-300" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58 33.1-60.1-60.1L472.2 216c16.2-9.3 26.5-25.3 26.5-43.7 0-18.4-10.3-34.4-26.5-43.7l-155.6 89.3 60.1 60.1 58 33.1c16.2 9.3 16.2 34.3 0 43.6zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
                </svg>
                <div className="text-left font-sans">
                  <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">GET IT ON</div>
                  <div className="text-sm font-black tracking-wide -mt-1 whitespace-nowrap">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white border-b border-white/20 pb-2 inline-block">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm opacity-80 cursor-pointer">
              <li><Link to="/a">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/d">বিভাগসমূহ</Link></li>
              <li><Link to="/ad">ভর্তি তথ্য</Link></li>
              <li><Link to="/do">ডোনেশন</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white border-b border-white/20 pb-2 inline-block">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2"><MapPin size={18} className="shrink-0 mt-0.5" /> {settings.address}</li>
              <li className="flex items-center gap-2"><Phone size={18} /> {settings.phone_number}</li>
              <li className="flex items-center gap-2"><Mail size={18} /> tahfizulquranmongla@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>
      {/* Credit Section with White Background and Green Text */}
      <div className="bg-white py-6 border-t border-slate-100 text-center text-sm text-primary-dark font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="text-primary-dark font-semibold text-base py-0.5">© 2026 তাফসীরুল কুরআন মাদ্রাসা। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-primary text-sm font-sans tracking-wide mt-1">
            Development by <a href="https://taksid.com" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-primary-dark">Walid Hasan Taksid</a> | <a href="https://taksid.com" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-primary-dark">Taksid.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
