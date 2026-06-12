import React, { useEffect, useState } from 'react';
import { Heart, CheckCircle, XCircle } from 'lucide-react';

export default function DonationsList() {
  const [donations, setDonations] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => setDonations(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch(`/api/donations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      loadData();
    } catch (err) {
      alert('Status update failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">দান / ডোনেশন তালিকা</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">তারিখ</th>
                <th className="px-6 py-4 font-semibold text-gray-600">দাতার নাম</th>
                <th className="px-6 py-4 font-semibold text-gray-600">দানের খাত</th>
                <th className="px-6 py-4 font-semibold text-gray-600">পরিমাণ</th>
                <th className="px-6 py-4 font-semibold text-gray-600">পেমেন্ট মেথড</th>
                <th className="px-6 py-4 font-semibold text-gray-600">TrxID</th>
                <th className="px-6 py-4 font-semibold text-gray-600">স্ট্যাটাস</th>
                <th className="px-6 py-4 font-semibold text-gray-600">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">কোনো ডোনেশন নেই</td></tr>
              ) : (
                donations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-gray-500">{new Date(d.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{d.donor_name}</td>
                    <td className="px-6 py-4 text-gray-600">{d.donation_type}</td>
                    <td className="px-6 py-4 font-bold text-primary">৳ {d.amount}</td>
                    <td className="px-6 py-4 text-gray-600">{d.payment_method}</td>
                    <td className="px-6 py-4 font-mono text-xs">{d.trx_id}</td>
                    <td className="px-6 py-4">
                      {d.status === 'received' ? (
                         <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">গৃহীত</span>
                      ) : d.status === 'rejected' ? (
                         <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">বাতিল</span>
                      ) : (
                         <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">পেন্ডিং</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {d.status === 'pending' || !d.status ? (
                        <>
                          <button onClick={() => handleStatusChange(d.id, 'received')} className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 hover:bg-green-100 text-xs font-bold">
                             <CheckCircle size={14} /> গ্রহণ
                          </button>
                          <button onClick={() => handleStatusChange(d.id, 'rejected')} className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200 hover:bg-red-100 text-xs font-bold">
                             <XCircle size={14} /> বাতিল
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">অ্যাকশন সম্পন্ন</span>
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
  );
}
