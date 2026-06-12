import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Admission() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert FormData to JSON
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setPaymentMethod('');
      } else {
        alert('কোথাও কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (error) {
      alert('সার্ভার এরর: ' + error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-32 px-4 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">আলহামদুলিল্লাহ!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          আপনার ভর্তির আবেদনটি সফলভাবে গৃহীত হয়েছে। মাদরাসা কর্তৃপক্ষ খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।
        </p>
        <button onClick={() => setSuccess(false)} className="bg-primary text-white px-8 py-3 rounded-md font-bold">
          নতুন আবেদন করুন
        </button>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary-dark mb-2">অনলাইন ভর্তি ফর্ম</h1>
          <p className="text-gray-500">ফরমটি সঠিক তথ্য দিয়ে পূরণ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ছাত্রের সম্পূর্ণ নাম <span className="text-red-500">*</span></label>
              <input required name="student_name" type="text" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="মোঃ আব্দুল্লাহ" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">জন্ম তারিখ <span className="text-red-500">*</span></label>
              <input required name="dob" type="date" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">পিতা/অভিভাবকের নাম <span className="text-red-500">*</span></label>
              <input required name="guardian_name" type="text" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="পিতার নাম" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">যোগাযোগের নাম্বার <span className="text-red-500">*</span></label>
              <input required name="contact_number" type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="01XXX-XXXXXX" />
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">যে বিভাগে ভর্তি হতে ইচ্ছুক <span className="text-red-500">*</span></label>
             <select required name="department" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white">
                <option value="">নির্বাচন করুন</option>
                <option value="নূরানী">নূরানী বিভাগ</option>
                <option value="নাজেরা">নাজেরা বিভাগ</option>
                <option value="হিফজ">হিফজ বিভাগ</option>
                <option value="আফটার স্কুল মক্তব">আফটার স্কুল মক্তব বিভাগ</option>
             </select>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">ভর্তি ফি পেমেন্ট (১০০০৳)</h3>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                 <p className="text-sm font-semibold text-blue-800 mb-3">
                    অনুগ্রহ করে বিকাশ অ্যাপ থেকে <strong>1000 Taka</strong> নিচে দেওয়া নাম্বারে <strong>Send Money</strong> করুন। 
                    টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) নিচে দিন।
                 </p>
                 <div className="flex gap-4 mb-4">
                    <div className="bg-white px-3 py-2 rounded border border-blue-100 flex-1">
                      <p className="text-xs text-gray-500">বিকাশ (Personal)</p>
                      <p className="font-mono font-bold text-primary">01824141497</p>
                    </div>
                 </div>
                 
                 <label className="block text-sm font-semibold text-gray-700 mb-1">ট্রানজেকশন আইডি (TrxID) <span className="text-red-500">*</span></label>
                 <input 
                    required 
                    name="trx_id" 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-mono text-sm uppercase placeholder-gray-400" 
                    placeholder="যেমন: 8N25ABCDE1" 
                 />
                 <input type="hidden" name="payment_method" value="বিকাশ" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
             <button 
               type="submit" 
               disabled={loading}
               className={`bg-primary hover:bg-primary-dark text-white px-10 py-3 rounded-md font-bold text-lg transition-colors shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
             >
               {loading ? 'অপেক্ষা করুন...' : 'আবেদন জমা দিন'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
