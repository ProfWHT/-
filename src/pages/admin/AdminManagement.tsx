import React, { useEffect, useState } from 'react';
import { Save, UserPlus, Trash2, Key } from 'lucide-react';

export default function AdminManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [changePassword, setChangePassword] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    fetch('/api/admins')
      .then(res => res.json())
      .then(data => setAdmins(data));
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdmin),
    });
    if (res.ok) {
      alert('সফলভাবে যোগ করা হয়েছে!');
      setNewAdmin({ username: '', password: '' });
      fetch('/api/admins').then(res => res.json()).then(data => setAdmins(data));
    } else {
        alert('ত্রুটি হয়েছে');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password change
    const adminToken = localStorage.getItem('adminToken');
    const res = await fetch('/api/admins/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify(changePassword),
    });
    if (res.ok) {
        alert('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!');
        setChangePassword({ oldPassword: '', newPassword: '' });
    } else {
        alert('পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে');
    }
  };

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">অ্যাডমিন ম্যানেজমেন্ট</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Key /> পাসওয়ার্ড পরিবর্তন</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <input type="password" placeholder="পুরানো পাসওয়ার্ড" className="w-full px-4 py-2 border rounded" value={changePassword.oldPassword} onChange={e => setChangePassword({...changePassword, oldPassword: e.target.value})}/>
                    <input type="password" placeholder="নতুন পাসওয়ার্ড" className="w-full px-4 py-2 border rounded" value={changePassword.newPassword} onChange={e => setChangePassword({...changePassword, newPassword: e.target.value})}/>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded">পরিবর্তন করুন</button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UserPlus /> নতুন অ্যাডমিন যোগ করুন</h2>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                    <input type="text" placeholder="ইউজারনেম" className="w-full px-4 py-2 border rounded" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}/>
                    <input type="password" placeholder="পাসওয়ার্ড" className="w-full px-4 py-2 border rounded" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}/>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded">যোগ করুন</button>
                </form>
            </div>
        </div>
    </div>
  );
}
