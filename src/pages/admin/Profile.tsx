import React, { useEffect, useState } from 'react';
import { Save, User } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({ username: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, fetch current admin profile
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
        alert('প্রোফাইল আপডেট হয়েছে!');
    } else {
        alert('ত্রুটি হয়েছে');
    }
    setLoading(false);
  };

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">আমার প্রোফাইল</h1>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-lg">
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ইউজারনেম</label>
                  <input type="text" className="w-full px-4 py-2 border rounded" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})}/>
                </div>
                <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded flex items-center gap-2">
                    <Save size={20} /> আপডেট করুন
                </button>
            </form>
        </div>
    </div>
  );
}
