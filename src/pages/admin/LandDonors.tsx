import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Check, Trash2, Calendar, MapPin, Phone, User, Landmark, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export default function LandDonors() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'land_donors'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error loading land donors in admin:", error);
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'land_donors');
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("আপনি কি এই জমিদাতার আবেদনটি অনুমোদিত করতে চান?")) return;
    try {
      const docRef = doc(db, 'land_donors', id);
      await updateDoc(docRef, { status: 'approved' });
      alert("আবেদনটি সফলভাবে অনুমোদিত হয়েছে!");
    } catch (err) {
      console.error(err);
      alert("অনুমোদন করতে ত্রুটি হয়েছে।");
      handleFirestoreError(err, OperationType.UPDATE, `land_donors/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("আপনি কি এই জমিদাতার তথ্য স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    try {
      const docRef = doc(db, 'land_donors', id);
      await deleteDoc(docRef);
      alert("তথ্যটি সফলভাবে মুছে ফেলা হয়েছে।");
    } catch (err) {
      console.error(err);
      alert("মুছে ফেলতে ত্রুটি হয়েছে।");
      handleFirestoreError(err, OperationType.DELETE, `land_donors/${id}`);
    }
  };

  // Convert English numbers to Bangla digits helper
  const toBanglaDigits = (num: any) => {
    if (num === undefined || num === null) return '';
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().replace(/\d/g, (d: string) => banglaDigits[parseInt(d)]);
  };

  // Stats
  const approvedList = submissions.filter(s => s.status === 'approved');
  const totalSqFtSecured = approvedList.reduce((sum, s) => sum + (s.sq_ft || 0), 0);
  const totalFundsRaised = approvedList.reduce((sum, s) => sum + (s.total_price || (s.sq_ft * 850) || 0), 0);
  const totalPending = submissions.filter(s => s.status === 'pending').length;

  return (
    <div className="font-bangla">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">স্থায়ী জমিদাতা ব্যবস্থাপনা</h1>
          <p className="text-slate-500 text-sm mt-1">মাদ্রাসার ১০ কাঠা স্থায়ী ক্যাম্পাসের জন্য জমিদাতাদের অনুদান আবেদন পর্যবেক্ষণ ও মানদণ্ড অনুমোদন করুন।</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-5 rounded-2xl text-white shadow-sm">
          <p className="text-teal-100 text-sm font-semibold">সংগৃহীত জমি (মোট ৭,২০০ SqFt)</p>
          <p className="text-3xl font-black mt-2">{toBanglaDigits(totalSqFtSecured)} <span className="text-base font-normal">Sq Ft</span></p>
          <div className="w-full bg-teal-700/40 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-white h-full" style={{ width: `${Math.min(100, (totalSqFtSecured / 7200) * 100)}%` }}></div>
          </div>
          <p className="text-xs text-teal-100 mt-2 font-mono">{toBanglaDigits(((totalSqFtSecured / 7200) * 100).toFixed(1))}% সম্পূর্ণ</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-sm font-semibold">মোট প্রাপ্ত জমিদান ফান্ড</p>
          <p className="text-3xl font-black text-slate-800 mt-2">৳ {toBanglaDigits(totalFundsRaised.toLocaleString())}</p>
          <p className="text-xs text-slate-400 mt-2">সদকায়ে জারিয়া ফান্ড</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-sm font-semibold">অনুমোদিত জমিদাতা</p>
          <p className="text-3xl font-black text-primary mt-2">{toBanglaDigits(approvedList.length)} <span className="text-base font-normal text-slate-500">জন</span></p>
          <p className="text-xs text-slate-400 mt-2">সদস্য তালিকায় স্থায়ী</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl shadow-sm">
          <p className="text-amber-800 text-sm font-semibold">যাচাই অপেক্ষমান আবেদন</p>
          <p className="text-3xl font-black text-amber-600 mt-2">{toBanglaDigits(totalPending)} <span className="text-base font-normal text-amber-800">টি</span></p>
          <p className="text-xs text-amber-600 mt-2">রিভিও করা প্রয়োজন</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">জমিদানের আবেদন তালিকা</h3>
          <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">মোট সর্বমোট: {toBanglaDigits(submissions.length)}টি রেকর্ড</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-center">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">তারিখ ও সময়</th>
                <th className="px-6 py-4 font-bold text-slate-600">দাতার বিবরণ</th>
                <th className="px-6 py-4 font-bold text-slate-600">পিতার নাম</th>
                <th className="px-6 py-4 font-bold text-slate-600">ঠিকানা ও কন্টাক্ট</th>
                <th className="px-6 py-4 font-bold text-slate-600">পরিমাণ (SqFt)</th>
                <th className="px-6 py-4 font-bold text-slate-600">বাজেট ও মেথড</th>
                <th className="px-6 py-4 font-bold text-slate-600">TrxID / রিসিট নং</th>
                <th className="px-6 py-4 font-bold text-slate-600">স্ট্যাটাস</th>
                <th className="px-6 py-4 font-bold text-slate-600">অ্যাকশন ও নিয়ন্ত্রণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-center">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-slate-400">লোডিং হচ্ছে...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-slate-400 font-medium">কোনো জমিদানের ফর্ম সাবমিট করা হয়নি।</td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                      <div className="flex flex-col items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{new Date(s.date).toLocaleDateString('bn-BD')}</span>
                        <span className="text-[10px] text-slate-400">{new Date(s.date).toLocaleTimeString('bn-BD', {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <User size={14} className="text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-800">{s.donor_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{s.father_name || '—'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs leading-relaxed max-w-[200px] truncate">
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-center gap-1">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <span className="truncate">{s.address}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-slate-400 font-mono">
                          <Phone size={11} className="text-slate-400 shrink-0" />
                          <span>{s.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-50 text-amber-800 border border-amber-200/50 px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap">
                        {toBanglaDigits(s.sq_ft)} স্কয়ার ফিট
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-teal-700">৳ {toBanglaDigits(s.total_price ? s.total_price.toLocaleString() : (s.sq_ft * 850).toLocaleString())}</div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.payment_method}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-slate-100 px-2 py-1.5 rounded font-mono text-xs text-slate-700 border border-slate-200 select-all max-w-[120px] truncate uppercase font-bold text-center inline-block">
                        {s.trx_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {s.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap">
                          <ShieldCheck size={13} /> স্থায়ী জমিদাতা
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap animate-pulse">
                          <AlertCircle size={13} /> পেন্ডিং যাচাই
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {s.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(s.id)}
                            className="bg-green-50 text-green-600 border border-green-200 p-2 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors shrink-0 cursor-pointer"
                            title="অনুমোদন করুন"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(s.id)}
                          className="bg-red-50 text-red-600 border border-red-200 p-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors shrink-0 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
