import React, { useEffect, useState } from 'react';

export default function Donors() {
  const [donors, setDonors] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/donors')
      .then(res => res.json())
      .then(data => setDonors(data));
  }, []);

  return (
    <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">আমাদের সম্মানিত দানবীরগণ</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map(donor => (
                <div key={donor.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex gap-4 items-center">
                    <img src={donor.photo || '/placeholder-user.png'} alt={donor.name} className="w-16 h-16 rounded-full object-cover"/>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{donor.name}</h3>
                        {donor.phone && <p className="text-sm text-gray-600">ফোন: {donor.phone}</p>}
                        {donor.address && <p className="text-sm text-gray-600">ঠিকানা: {donor.address}</p>}
                        <p className="text-primary font-semibold mt-1">সর্বমোট দান: ৳{donor.total_donated}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
