import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      console.log('response ok:', response.ok);
      let data;
      if (!response.ok) {
        let errorMsg = 'Login failed';
        try {
            const errorData = await response.clone().json();
            errorMsg = errorData.error || errorData.details || errorMsg;
        } catch (e) {
            errorMsg = `Server returned status ${response.status}`;
        }
        setError(errorMsg);
        return;
      }

      data = await response.clone().json();
      localStorage.setItem('adminToken', data.token);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(`Client error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-bangla">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <img 
            src="https://i.ibb.co/xtVT4r02/1-20260612-202052-0000.png" 
            alt="তাহফিজুল কুরআন মডেল মাদ্রাসা লোগো" 
            className="w-20 h-20 object-contain mx-auto mb-4 filter drop-shadow"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-2xl font-bold text-gray-800">অ্যাডমিন প্যানেল</h2>
          <p className="text-gray-500 text-sm mt-1">লগইন করুন</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ইউজারনেম</label>
            <input 
               type="text" 
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input 
               type="password" 
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg mt-4 transition-colors">
            লগইন করুন
          </button>
        </form>
      </div>
    </div>
  );
}
