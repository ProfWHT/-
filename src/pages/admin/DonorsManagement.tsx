import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

export default function DonorsManagement() {
  const [donors, setDonors] = useState<any[]>([]);
  const [newDonor, setNewDonor] = useState({ name: '', photo: '', phone: '', address: '', total_donated: 0 });

  useEffect(() => {
    fetch('/api/donors')
        .then(res => res.json())
        .then(setDonors);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDonor)
    });
    setNewDonor({ name: '', photo: '', phone: '', address: '', total_donated: 0 });
    fetch('/api/donors').then(res => res.json()).then(setDonors);
  };

  return (
    <div>
        <h1 className="text-2xl font-bold mb-6">দানবীর ব্যবস্থাপনা</h1>
        <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-bold mb-4">নতুন দানবীর যোগ করুন</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="নাম" className="border p-2 rounded" value={newDonor.name} onChange={e => setNewDonor({...newDonor, name: e.target.value})}/>
                <input type="text" placeholder="লিঙ্ক (ছবির)" className="border p-2 rounded" value={newDonor.photo} onChange={e => setNewDonor({...newDonor, photo: e.target.value})}/>
                <input type="text" placeholder="ফোন" className="border p-2 rounded" value={newDonor.phone} onChange={e => setNewDonor({...newDonor, phone: e.target.value})}/>
                <input type="text" placeholder="ঠিকানা" className="border p-2 rounded" value={newDonor.address} onChange={e => setNewDonor({...newDonor, address: e.target.value})}/>
                <input type="number" placeholder="সর্বমোট দান" className="border p-2 rounded" value={newDonor.total_donated} onChange={e => setNewDonor({...newDonor, total_donated: parseFloat(e.target.value)})}/>
                <button type="submit" className="bg-primary text-white p-2 rounded flex items-center gap-2 col-span-2"><Save size={20}/> যোগ করুন</button>
            </form>
        </div>
        
        <table className="w-full bg-white text-left">
            <thead><tr className="bg-slate-100">
                <th className="p-3">নাম</th>
                <th className="p-3">ফোন</th>
                <th className="p-3">সর্বমোট দান</th>
            </tr></thead>
            <tbody>
                {donors.map(d => (
                    <tr key={d.id} className="border-b">
                        <td className="p-3">{d.name}</td>
                        <td className="p-3">{d.phone}</td>
                        <td className="p-3">৳{d.total_donated}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}
