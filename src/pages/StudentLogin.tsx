import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

export default function StudentLogin() {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roll_number: rollNumber, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('studentId', data.student.id);
        navigate('/student/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-bangla">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <img 
            src="https://i.ibb.co/YTWCM1Gd/Green-Minimalist-Al-Quran-Logo-20260612-183641-0000.png" 
            alt="তাফসীরুল কুরআন মাদ্রাসা লোগো" 
            className="w-20 h-20 object-contain mx-auto mb-4 filter drop-shadow"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-2xl font-bold text-gray-800">শিক্ষার্থী লগইন</h2>
          <p className="text-gray-500 text-sm mt-1">আপনার রোল নাম্বার ও পাসওয়ার্ড দিন</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">রোল নাম্বার / স্টুডেন্ট আইডি</label>
            <input 
               type="text" 
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
               value={rollNumber}
               onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input 
               type="password" 
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition-colors">
            লগইন করুন
          </button>
        </form>
      </div>
    </div>
  );
}
