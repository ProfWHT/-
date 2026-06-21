import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Star, Bell, GraduationCap, Heart, UserPlus, QrCode, Scan } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCodeBranded from '../components/QRCodeBranded';
import QRModal from '../components/QRModal';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [settings, setSettings] = useState<any>({});
  const [stats, setStats] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrTab, setQrTab] = useState<'view' | 'scan'>('view');
  
  const heroImages = [
    "https://i.ibb.co/PsD9cGWz/Whats-App-Image-2026-06-21-at-1-41-15-PM.jpg",
    "https://i.ibb.co/35C7PY16/Whats-App-Image-2026-06-21-at-1-41-16-PM-1.jpg",
    "https://i.ibb.co/NdG5wZhg/Whats-App-Image-2026-06-21-at-1-41-16-PM.jpg",
    "https://i.ibb.co/tPDTBQSS/Whats-App-Image-2026-06-21-at-2-16-51-PM.jpg",
    "https://i.ibb.co/gM8d0YSL/Whats-App-Image-2026-06-21-at-2-16-50-PM.jpg"
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
      
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <>
      {/* Notice Ticker */}
      <div className="bg-gold/20 border-b border-gold/30 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded shrink-0 mr-3 flex items-center gap-1">
            <Bell size={12} /> নোটিশ
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-[marquee_20s_linear_infinite] inline-block text-sm font-medium text-primary-dark">
              {settings.notice_text || 'নোটিশ এখানে প্রদর্শিত হবে।'}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-primary-dark text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")'}}></div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial="initial" animate="animate" variants={fadeIn}>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold mb-6 inline-block backdrop-blur-sm">
              ২০২৬ সেশনের ভর্তি চলছে!
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              তাহফিজুল কুরআন মডেল মাদ্রাসায় <br/>
              <span className="text-gold">স্বাগতম</span>
            </h1>
            <p className="text-lg opacity-90 mb-8 max-w-xl">
              মাদরাসার প্ল্যাটফর্মের মাধ্যমে সহজে পরিচালনা করুন হিফজ বিভাগ, কুরআন শিক্ষা, শিক্ষার্থী উপস্থিতি, দৈনিক সাবক, রিপোর্ট এবং অভিভাবক যোগাযোগ। আধুনিক প্রযুক্তিনির্ভর এই ইসলামিক শিক্ষা সফটওয়্যার মাদ্রাসা ও মক্তব পরিচালনাকে করে আরও সহজ, দ্রুত ও কার্যকর।
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/ad" className="bg-gold hover:bg-gold-light text-white px-8 py-3 rounded-md font-bold transition-colors shadow-lg flex items-center gap-2">
                অনলাইন ভর্তি <ArrowRight size={20} />
              </Link>
              <Link to="/a" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-md font-bold transition-colors backdrop-blur-sm">
                আরও জানুন
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="aspect-square rounded-full border border-gold/30 absolute inset-0 animate-[spin_60s_linear_infinite]"></div>
            <div className="aspect-square rounded-full border border-white/20 absolute inset-4 animate-[spin_40s_linear_infinite_reverse]"></div>
            <motion.img 
              key={heroImages[currentHeroIndex]}
              src={heroImages[currentHeroIndex]}
              alt="Madrasah" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="rounded-full w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] mx-auto relative z-10 border-4 border-white/10 shadow-2xl object-cover aspect-square"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Director's Message */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 items-center">
          <div>
            <div className="w-48 h-48 mx-auto md:w-full md:h-[400px] rounded-lg overflow-hidden shrink-0 shadow-xl border-4 border-slate-100">
               {settings.director_photo ? (
                  <img src={settings.director_photo} alt="Director" className="w-full h-full object-cover" />
               ) : (
                  <img src="https://i.ibb.co/2Y0t2k0h/Whats-App-Image-2026-06-21-at-2-12-21-PM.jpg" alt="Director" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               )}
            </div>
            <div className="text-center mt-4">
              <h3 className="font-bold text-xl text-primary-dark">{settings.director_name || 'হাফেজ মাওলানা ফেরদাউস হোসাইন মাহমুদী'}</h3>
              <p className="text-sm text-gray-500">{settings.director_title || 'পরিচালক'}</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-primary pl-4">পরিচালকের বাণী</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="italic text-xl text-gray-500 mb-6 font-arabic arabic-text">
                "তোমাদের মধ্যে সর্বোত্তম ঐ ব্যক্তি, যে কুরআন শেখে এবং অন্যকে শেখায়।" - (সহীহ বুখারী)
              </p>
              <p className="mb-4">
                বিসমিল্লাহির রাহমানির রাহিম। তাহফিজুল কুরআন মডেল মাদ্রাসা একটি অত্যাধুনিক ইসলামিক শিক্ষা প্রতিষ্ঠান, 
                যেখানে দ্বীনি শিক্ষার পাশাপাশি যুগোপযোগী সাধারণ শিক্ষার সমন্বয় ঘটানো হয়েছে। আমাদের লক্ষ্য এমন এক 
                প্রজন্ম তৈরি করা, যারা কুরআনের আলোয় আলোকিত হয়ে দেশ ও জাতির সেবায় নিজেদের আত্মনিয়োগ করবে।
              </p>
              <p>
                আমরা প্রতিটি ছাত্রের ব্যক্তিগত যত্ন, উন্নত আবাসিক পরিবেশ এবং মানসম্মত শিক্ষাদান নিশ্চিত করতে বদ্ধপরিকর। 
                আপনাদের সন্তানের দ্বীনি ও জাগতিক শিক্ষার জন্য আমাদের মাদরাসা হতে পারে সেরা একটি মাধ্যম।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      {stats && (
        <section className="py-12 bg-white border-y border-slate-100 relative z-20 -mt-8 mx-4 md:mx-auto max-w-7xl rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
             <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                   <GraduationCap size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">৩৪+</h3>
                <p className="text-gray-500 font-semibold text-sm">শিক্ষার্থী (আবাসিক ১০ জন, অনাবাসিক ২৪ জন)</p>
             </div>
             <div className="text-center">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                   <BookOpen size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">৫+</h3>
                <p className="text-gray-500 font-semibold text-sm">শিক্ষক ও স্টাফ</p>
             </div>
             <div className="text-center">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                   <Heart size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">৳{stats.totalDonations}</h3>
                <p className="text-gray-500 font-semibold text-sm">মোট অনুদান</p>
             </div>
          </div>
        </section>
      )}

      {/* Digital QR Code Portal Highlight Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-white to-gold/10 relative overflow-hidden">
        {/* Background Decorative Islamic Accents */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")'}}></div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="md:col-span-7 space-y-6">
              <span className="bg-gold/15 text-gold-dark text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30 flex gap-1.5 items-center w-max">
                <QrCode size={14} className="animate-spin" /> মাদরাসা ডিজিটাল কিউআর পোর্টাল
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                সহজে স্ক্যান করুন ও মাদরাসার <br />
                <span className="text-primary-dark">ডিজিটাল সেবাসমূহ</span> উপভোগ করুন
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                আমাদের মাদরাসার অফিশিয়াল ডিজিটাল কিউআর কোডটি এখন সর্বসাধারণের জন্য উন্মুক্ত। আপনার যেকোনো কিউআর স্ক্যানার বা নিচে দেওয়া আমাদের বিশেষ ক্যামেরা স্ক্যানারটির মাধ্যমে এটি স্ক্যান করলেই সরাসরি এই অনলাইন হিফজ ও কুরআন শিক্ষা পোর্টালটি চালু হয়ে যাবে। 
              </p>
              
              {/* Feature Points Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3 items-start">
                  <div className="p-1 px-[2px] md:px-[5px] mt-0.5 bg-primary/10 rounded-lg text-primary-dark">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm">লোগো সম্বলিত কিউআর</h4>
                    <p className="text-[11px] text-slate-500">ডিজিটাল ভেরিফাইড আইডি</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1 px-[2px] md:px-[5px] mt-0.5 bg-primary/10 rounded-lg text-primary-dark">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm">ইনস্ট্যান্ট স্ক্যানিং</h4>
                    <p className="text-[11px] text-slate-500">সরাসরি ব্রাউজ করার সুবিধা</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1 px-[2px] md:px-[5px] mt-0.5 bg-primary/10 rounded-lg text-primary-dark">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm">মোবাইল-বান্ধব</h4>
                    <p className="text-[11px] text-slate-500">অংশগ্রহণ করুন যেকোনো স্থান থেকে</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1 px-[2px] md:px-[5px] mt-0.5 bg-primary/10 rounded-lg text-primary-dark">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm">স্মার্ট কিউআর ডাউনলোড</h4>
                    <p className="text-[11px] text-slate-500">প্রিন্ট ও বিতরণের বিশেষ সংস্করণ</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => { setQrTab('scan'); setIsModalOpen(true); }}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer text-sm md:text-base"
                >
                  <Scan size={18} className="animate-pulse" />
                  কিউআর স্ক্যানার চালু করুন
                </button>
                <button
                  onClick={() => { setQrTab('view'); setIsModalOpen(true); }}
                  className="bg-white hover:bg-slate-50 border-2 border-primary/20 text-primary-dark font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-sm md:text-base"
                >
                  <QrCode size={18} />
                  ডিজিটাল আইডি দেখুন
                </button>
              </div>
            </div>

            {/* Right Display Column with Highlighted QR Code Card */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group p-1.5 rounded-[2.2rem] bg-gradient-to-tr from-primary via-gold to-primary-dark shadow-2xl transition-all duration-500 hover:scale-[1.03]">
                {/* Luminous Animated Scanner glow bar */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] bg-gold text-white font-extrabold tracking-widest px-3 py-1 rounded-full shadow-md select-none animate-pulse z-10">স্ক্যান করুন</span>
                <QRCodeBranded size={180} className="rounded-[2rem] border-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Local QRModal for interactive home triggers */}
      <QRModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={qrTab}
      />

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              মাদরাসার এক ঝলক
              <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gold rounded-full"></span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <img src="https://i.ibb.co/PsD9cGWz/Whats-App-Image-2026-06-21-at-1-41-15-PM.jpg" alt="Activity 1" className="rounded-xl shadow-lg w-full h-64 object-cover" referrerPolicy="no-referrer" />
            <img src="https://i.ibb.co/35C7PY16/Whats-App-Image-2026-06-21-at-1-41-16-PM-1.jpg" alt="Activity 2" className="rounded-xl shadow-lg w-full h-64 object-cover" referrerPolicy="no-referrer" />
            <img src="https://i.ibb.co/NdG5wZhg/Whats-App-Image-2026-06-21-at-1-41-16-PM.jpg" alt="Activity 3" className="rounded-xl shadow-lg w-full h-64 object-cover" referrerPolicy="no-referrer" />
            <img src="https://i.ibb.co/tPDTBQSS/Whats-App-Image-2026-06-21-at-2-16-51-PM.jpg" alt="Activity 4" className="rounded-xl shadow-lg w-full h-64 object-cover" referrerPolicy="no-referrer" />
            <img src="https://i.ibb.co/gM8d0YSL/Whats-App-Image-2026-06-21-at-2-16-50-PM.jpg" alt="Activity 5" className="rounded-xl shadow-lg w-full h-64 object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 inline-block relative">
              আমাদের বিভাগসমূহ
              <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gold rounded-full"></span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'নূরানী বিভাগ', desc: 'শিশুদের জন্য কুরআনের প্রাথমিক পাঠ ও বুনিয়াদি শিক্ষা।' },
              { title: 'নাজেরা বিভাগ', desc: 'কুরআন দেখে সহীহ-শুদ্ধভাবে তিলাওয়াত শিক্ষার বিশেষ ব্যবস্থা।' },
              { title: 'হিফজ বিভাগ', desc: 'আন্তরিক যত্নে দ্রুত কুরআন মুখস্ত করার আবাসিক ব্যবস্থা।' },
              { title: 'আফটার স্কুল মক্তব বিভাগ', desc: 'স্কুলে পড়াশোনার পাশাপাশি দ্বীনি শিক্ষার বিশেষ আয়োজন।' },
            ].map((dept, i) => (
              <motion.div 
                key={i} 
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <BookOpen />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{dept.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {dept.desc}
                </p>
                <Link to="/d" className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  বিস্তারিত <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Donation */}
      <section className="py-20 bg-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Star className="text-gold w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">আপনার দান হতে পারে সদকায়ে জারিয়া</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
            এতিম ও গরীব ছাত্রদের দ্বীনি শিক্ষার প্রসারে আপনার যাকাত, ফিতরা ও সাধারণ দান মাদরাসার তহবিলে প্রদান করে অশেষ নেকির অংশীদার হোন।
          </p>
          <Link to="/do" className="bg-white text-primary-dark px-10 py-4 rounded-full font-bold text-lg hover:bg-gold hover:text-white transition-colors shadow-xl">
            অনলাইনে দান করুন
          </Link>
        </div>
      </section>
      
      {/* Add Custom keyframes for marquee in a style tag */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </>
  );
}
