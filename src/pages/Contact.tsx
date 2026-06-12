import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="py-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">যোগাযোগ করুন</h1>
          <p className="text-gray-600">যেকোনো তথ্যের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0"><MapPin /></div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">ঠিকানা</h3>
                  <p className="text-gray-600">তাফসীরুল কুরআন মাদ্রাসা<br/>মুসলিম নগর, বুড়িরডাঙ্গা, দিগরাজ, মোংলা, বাগেরহাট</p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0"><Phone /></div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">মোবাইল</h3>
                  <p className="text-gray-600">01824-141497<br/>01633-930308</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0"><Mail /></div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">ইমেইল</h3>
                  <p className="text-gray-600">tahfizulquranmongla@gmail.com</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">ম্যাসেজ পাঠান</h2>
             <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message!"); }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">নাম</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">মোবাইল নাম্বার</label>
                    <input type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ম্যাসেজ</label>
                  <textarea rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none resize-none" required></textarea>
                </div>
                <button className="bg-primary text-white font-bold px-8 py-3 rounded-md hover:bg-primary-dark transition-colors">
                  পাঠিয়ে দিন
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
