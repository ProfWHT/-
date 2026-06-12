import React, { useState, useEffect } from 'react';
import { Heart, Loader2, MapPin, Calculator, Trophy, CheckCircle, ShieldAlert, Award, Grid } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Donation() {
  const [activeTab, setActiveTab] = useState<'land' | 'general'>('land');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sqFt, setSqFt] = useState<number>(5);
  const [landDonors, setLandDonors] = useState<any[]>([]);

  // Calculate price based on input sq ft: 1 Sq Ft = 850 BDT
  const PRICE_PER_SQFT = 850;
  const totalPrice = sqFt * PRICE_PER_SQFT;

  // Real-time listener for Land Donors list
  useEffect(() => {
    const q = query(
      collection(db, 'land_donors'),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLandDonors(docs);
    }, (error) => {
      console.error("Error loading land donors from Firestore:", error);
      handleFirestoreError(error, OperationType.LIST, 'land_donors');
    });
    return () => unsubscribe();
  }, []);

  const handleGeneralSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert('কোথাও সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
      }
    } catch (error) {
      alert('সার্ভার এরর');
    } finally {
      setLoading(false);
    }
  };

  const handleLandSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const donor_name = formData.get('donor_name') as string;
    const father_name = formData.get('father_name') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const sq_ft = Number(formData.get('sq_ft'));
    const payment_method = formData.get('payment_method') as string;
    const trx_id = formData.get('trx_id') as string;

    try {
      await addDoc(collection(db, 'land_donors'), {
        donor_name,
        father_name,
        address,
        phone,
        sq_ft,
        total_price: sq_ft * PRICE_PER_SQFT,
        payment_method,
        trx_id,
        date: new Date().toISOString(),
        status: 'pending'
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error saving land donor:", error);
      alert('তথ্য সংরক্ষণ করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      handleFirestoreError(error, OperationType.CREATE, 'land_donors');
    } finally {
      setLoading(false);
    }
  };

  // Convert English numbers to Bangla digits helper
  const toBanglaDigits = (num: any) => {
    if (num === undefined || num === null) return '';
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().replace(/\d/g, (d: string) => banglaDigits[parseInt(d)]);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen font-bangla">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Page title and navigation tabs */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">আপনার অনুদানে গড়ে উঠুক কুরআনের আলো</h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
            আজই ডোনেশন করুন এবং কুরআনের খেদমতে অংশগ্রহণ করুন। আপনার সহযোগিতা শিক্ষার্থীদের শিক্ষা, আবাসন ও দৈনন্দিন প্রয়োজন পূরণে সহায়তা করবে।
          </p>
          
          <div className="flex bg-slate-200 p-1.5 rounded-xl mt-8 max-w-lg mx-auto border border-slate-300">
            <button 
              onClick={() => { setActiveTab('land'); setSuccess(false); }}
              className={`flex-1 py-3 text-center rounded-lg font-bold transition-all text-sm md:text-base flex items-center justify-center gap-2 ${activeTab === 'land' ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-slate-300'}`}
            >
              <Grid size={18} />
              স্থায়ী ক্যাম্পাস জমি দান প্রকল্প
            </button>
            <button 
              onClick={() => { setActiveTab('general'); setSuccess(false); }}
              className={`flex-1 py-3 text-center rounded-lg font-bold transition-all text-sm md:text-base flex items-center justify-center gap-2 ${activeTab === 'general' ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-slate-300'}`}
            >
              <Heart size={18} />
              সাধারণ দান ও সদকাহ
            </button>
          </div>
        </div>

        {activeTab === 'land' ? (
          <div>
            <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
              
              {/* Left Column: Information and values explanation */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full flex items-center justify-center">
                    <Award className="text-primary/40 -mr-4 -mt-4" size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center gap-2">
                    স্থায়ী ক্যাম্পাস নির্মাণ প্রকল্প
                  </h2>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    তাফসীরুল কুরআন মাদ্রাসার একটি স্থায়ী দ্বীনি মজবুত ভিত্তি স্থাপনে আমাদের চিরস্থায়ী ক্যাম্পাস নির্মাণ প্রকল্প হাতে নেওয়া হয়েছে। আপনার প্রদত্ত জমি দান হবে আপনার এবং আপনার পরিবারের জন্য একটি সদকায়ে জারিয়া, যার সওয়াব কিয়ামত পর্যন্ত জারি থাকবে ইন้าআল্লাহ।
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 border-t border-b border-slate-100 py-6 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">প্রয়োজনীয় মোট জমি</h4>
                        <p className="text-lg font-bold text-slate-900 mt-0.5">{toBanglaDigits("১০")} কাঠা</p>
                        <p className="text-xs text-slate-500">({toBanglaDigits("৭,২০০")} স্কয়ার ফিট)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <Calculator size={22} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">হিসাব ও পরিমাণ</h4>
                        <p className="text-sm text-slate-600 mt-1">১ কাঠা = {toBanglaDigits("৭২০")} স্কয়ার ফিট</p>
                        <p className="text-sm text-slate-600">১ কাঠার মূল্য: {toBanglaDigits("৬,১২,০০০")} ৳</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 flex gap-4 items-center">
                    <div className="bg-primary rounded-full p-2 text-white font-bold shrink-0">
                      {toBanglaDigits("৳")}
                    </div>
                    <div>
                      <p className="text-slate-700 text-sm">প্রতি স্কয়ার ফিট জমির মূল্য:</p>
                      <p className="text-xl font-bold text-primary-dark">{toBanglaDigits("৮৫০")} টাকা মাত্র</p>
                    </div>
                  </div>
                </div>

                {/* Sponsoring target selector */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2 border-b pb-3 border-slate-100">
                    <Calculator className="text-primary" size={20} />
                    সহজে আপনার বাজেট হিসাব করুন
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">আপনি কত স্কয়ার ফিট দান করতে চান?</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="1" 
                          max="100" 
                          value={sqFt} 
                          onChange={(e) => setSqFt(Number(e.target.value))}
                          className="flex-1 accent-primary cursor-pointer"
                        />
                        <div className="w-24 shrink-0 flex items-center gap-1">
                          <input 
                            type="number" 
                            min="1" 
                            value={sqFt} 
                            onChange={(e) => setSqFt(Math.max(1, Number(e.target.value)))}
                            className="w-full text-center py-2 border border-slate-200 rounded-lg font-bold text-slate-800 outline-none focus:border-primary"
                          />
                          <span className="text-xs text-slate-500 font-bold">SqFt</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                        <span>১ স্কয়ার ফিট</span>
                        <span>১০০ স্কয়ার ফিট</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
                      <div>
                        <p className="text-slate-700 text-sm">স্থায়ী জমিদাতার জন্য নির্বাচিত জমির মান:</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{toBanglaDigits(sqFt)} স্কয়ার ফিট</p>
                      </div>
                      <div className="text-right md:text-right text-left">
                        <p className="text-slate-500 text-sm">মোট প্রয়োজনীয় অনুদান:</p>
                        <p className="text-3xl font-extrabold text-amber-600">৳ {toBanglaDigits(totalPrice.toLocaleString())}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank / bKash information */}
                <div className="bg-slate-800 text-slate-200 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">অনুদান পাঠানোর মাধ্যম</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex border-b border-slate-700 pb-3 justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-400">বিকাশ (Personal)</p>
                        <p className="text-lg font-bold text-primary font-mono select-all">01824141497</p>
                      </div>
                      <span className="bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 text-xs rounded font-bold">Send Money</span>
                    </div>
                    <div className="flex border-b border-slate-700 pb-3 justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-400">নগদ (Personal)</p>
                        <p className="text-lg font-bold text-amber-400 font-mono select-all">01824141497</p>
                      </div>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 text-xs rounded font-bold">Send Money</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">ব্যাংক ট্রান্সফার</p>
                      <p className="text-white font-medium mt-1">ইসলামী ব্যাংক বাংলাদেশ লিমিটেড</p>
                      <p className="text-slate-300 font-mono">হিসাব নম্বর: ২০৫০১*******৭৮৯</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Donation Confirmation Form */}
              <div className="lg:col-span-5 h-full">
                {success ? (
                  <div className="bg-white p-10 rounded-2xl shadow-lg text-center border-t-8 border-primary border">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                     <h3 className="text-2xl font-bold text-slate-800 mb-2">জাঝাকাল্লাহ খাইরান</h3>
                     <p className="text-slate-600 mb-6 font-medium">
                       স্থায়ী ক্যাম্পাস জমি দান প্রকল্পে আপনার আবেদনটি সফলভাবে নিবন্ধিত হয়েছে। ট্রানজেকশন আইডি ভেরিফিকেশনের পর সম্মানিত জমিদাতাদের তালিকায় আপনার নাম স্থায়ীভাবে যুক্ত করা হবে।
                     </p>
                     <button onClick={()=>setSuccess(false)} className="w-auto px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all">
                       নতুন আবেদন এন্ট্রি করুন
                     </button>
                  </div>
                ) : (
                  <form onSubmit={handleLandSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 block border-b pb-3">জমি ক্রয়ে শরিক হোন</h3>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">স্থায়ী জমিদাতার নাম *</label>
                      <input required name="donor_name" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="উদা: আব্দুল্লাহ আল কারীম" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">পিতার নাম *</label>
                      <input required name="father_name" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="উদা: মোঃ আব্দুর রহমান" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">বর্তমান ঠিকানা / দেশ *</label>
                      <input required name="address" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="উদা: মুসলিম নগর, দিগরাজ, মোংলা" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">মোবাইল নাম্বার *</label>
                        <input required name="phone" type="tel" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="017********" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">জমির পরিমাণ (SqFt) *</label>
                        <input 
                          required 
                          name="sq_ft" 
                          type="number" 
                          min="1" 
                          value={sqFt}
                          onChange={(e) => setSqFt(Math.max(1, Number(e.target.value)))}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none font-bold" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">পেমেন্ট পদ্ধতি</label>
                      <select required name="payment_method" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                        <option value="বিকাশ (Personal)">বিকাশ (Personal)</option>
                        <option value="নগদ (Personal)">নগদ (Personal)</option>
                        <option value="রকেট (Personal)">রকেট (Personal)</option>
                        <option value="ব্যাংক ডিপোজিট">ব্যাংক ডিপোজিট (IBBL)</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
                       <p className="text-xs font-semibold text-slate-600">
                          টাকা পাঠানোর পর বিকাশ/নগদ এর ট্রানজেকশন আইডি (TrxID) অথবা ব্যাংক রিসিট নম্বর দিন:
                       </p>
                       <input 
                          required 
                          name="trx_id" 
                          type="text" 
                          className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-lg focus:ring-2 focus:ring-primary outline-none font-mono text-sm uppercase placeholder-slate-400" 
                          placeholder="যেমন: AH1D6F88E" 
                       />
                    </div>

                    <div className="pt-2">
                      <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold text-base flex justify-center items-center gap-2 shadow-sm whitespace-nowrap transition-all cursor-pointer">
                        {loading ? <Loader2 className="animate-spin" /> : `৳ ${toBanglaDigits(totalPrice.toLocaleString())} পরিশোধ সাবমিট করুন`}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

            {/* Permanent Land Donors List registry */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mt-12 mb-8">
              <div className="text-center md:text-left mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                     <Trophy className="text-amber-500" size={24} />
                     স্থায়ী জমিদাতা মহোদয়গণের তালিকা
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    স্থায়ী ক্যাম্পাস নির্মাণ প্রকল্পে জমিদানকারী সম্মানিত দাতা মহোদয়গণের পূর্ণাঙ্গ ও চিরস্থায়ী সিলসিলা।
                  </p>
                </div>
                <div className="bg-primary/10 border border-primary/20 text-primary-dark px-4 py-2 rounded-lg font-bold text-sm inline-block self-center">
                  মোট জমাদানকারী: {toBanglaDigits(landDonors.filter(d=>d.status === 'approved').length)} জন
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-700 text-center">নং</th>
                      <th className="px-6 py-4 font-bold text-slate-700 text-center">দাতার নাম</th>
                      <th className="px-6 py-4 font-bold text-slate-700 text-center">পিতার নাম</th>
                      <th className="px-6 py-4 font-bold text-slate-700 text-center">ঠিকানা ও দেশ</th>
                      <th className="px-6 py-4 font-bold text-slate-700 text-center">দানকৃত জমি</th>
                      <th className="px-6 py-4 font-bold text-slate-700 text-center">জমির মূল্য</th>
                      <th className="px-6 py-4 font-bold text-slate-700 text-center">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-center">
                    {landDonors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                          এখন পর্যন্ত কোনো স্থায়ী জমিদাতা নিবন্ধিত হয়নি। প্রথম দাতা হতে আজই অবদান রাখুন।
                        </td>
                      </tr>
                    ) : (
                      landDonors.map((d, index) => (
                        <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-slate-500 font-bold">{toBanglaDigits(index + 1)}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{d.donor_name}</td>
                          <td className="px-6 py-4 text-slate-600">{d.father_name || '—'}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{d.address}</td>
                          <td className="px-6 py-4">
                            <span className="bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full text-xs border border-amber-200/50">
                              {toBanglaDigits(d.sq_ft)} স্কয়ার ফিট
                            </span>
                          </td>
                          <td className="px-6 py-4 font-extrabold text-primary-dark">৳ {toBanglaDigits(d.total_price ? d.total_price.toLocaleString() : (d.sq_ft * 850).toLocaleString())}</td>
                          <td className="px-6 py-4">
                            {d.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded text-xs font-bold">
                                <CheckCircle size={12} /> অনুমোদিত ও স্থায়ী
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded text-xs font-bold">
                                <ShieldAlert size={12} /> ভেরিফিকেশন অপেক্ষমান
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* General Sadaka left side info */}
            <div>
               <div className="text-gold mb-6"><Heart size={64} fill="currentColor" /></div>
               <h2 className="text-3xl font-bold text-slate-800 mb-6">আপনার সাধারণ অনুদান মাদরাসার উন্নয়নে সহায়ক হোক</h2>
               <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                 আপনার যাকাত, সদকা, এবং সাধারণ অনুদান দ্বারা এতিম ও দরিদ্র ছাত্রদের এখানে বিনামূল্যে থাকা-খাওয়া ও দ্বীনি কুরআন শিক্ষা প্রদান করা হয়। আপনার সামান্য দানও হতে পারে আখিরাতের নাজাতের উসিলা।
               </p>

               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                 <h3 className="font-bold text-xl border-b pb-3 mb-4">অনুদান পাঠানোর মাধ্যম</h3>
                 <div className="flex border-b border-slate-100 pb-3 justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">বিকাশ (Personal)</p>
                      <p className="font-mono text-primary font-bold text-xl select-all">01824141497</p>
                    </div>
                    <span className="bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 text-xs rounded font-bold">Send Money</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">নগদ (Personal)</p>
                      <p className="font-mono text-amber-500 font-bold text-xl select-all">01824141497</p>
                    </div>
                    <span className="bg-amber-500/20 text-amber-600 border border-amber-500/30 px-2.5 py-1 text-xs rounded font-bold">Send Money</span>
                 </div>
               </div>
            </div>

            {/* General form */}
            <div>
              {success ? (
                <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-200 text-center border-t-8 border-primary">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">জাযাকাল্লাহ খাইরান</h3>
                   <p className="text-slate-600">আপনার অনুদানের আবেদনের তথ্য আমরা পেয়েছি। আমরা দ্রুতই পেমেন্ট ভেরিফাই করবো ইনশাআল্লাহ।</p>
                   <button onClick={()=>setSuccess(false)} className="mt-8 text-primary font-bold hover:underline">নতুন অনুদান এন্ট্রি করুন</button>
                </div>
              ) : (
                <form onSubmit={handleGeneralSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-5">
                   <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">অনুদান নিশ্চিত করুন</h3>
                   
                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">আপনার নাম (ঐচ্ছিক)</label>
                     <input name="donor_name" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="নাম অথবা বেনামে" />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">পরিমাণ (৳) *</label>
                       <input required name="amount" type="number" min="10" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="1000" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">খাত *</label>
                       <select required name="donation_type" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                          <option value="সাধারণ">সাধারণ দান</option>
                          <option value="যাকাত">যাকাত</option>
                          <option value="সদকা">সদকা</option>
                          <option value="এতিম">এতিম ফান্ড</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">পেমেন্ট মেথড</label>
                     <input type="text" readOnly value="বিকাশ (Personal)" className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 outline-none" />
                     <input type="hidden" name="payment_method" value="বিকাশ" />
                   </div>

                   <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-blue-800 mb-2">
                         অনুগ্রহ করে আমাদের <strong>01824141497</strong> নাম্বারে <strong>Send Money</strong> করার পর ট্রানজেকশন আইডি (TrxID) নিচে দিন।
                      </p>
                      <input 
                         required 
                         name="trx_id" 
                         type="text" 
                         className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none mt-2 font-mono text-sm uppercase placeholder-slate-400" 
                         placeholder="যেমন: 8N25ABCDE1" 
                      />
                   </div>

                   <div className="pt-4">
                     <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-lg font-bold text-lg flex justify-center items-center gap-2 transition-all cursor-pointer shadow-sm">
                       {loading ? <Loader2 className="animate-spin" /> : 'সাবমিট করুন'}
                     </button>
                   </div>
                </form>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
