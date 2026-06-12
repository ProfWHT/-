import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<any>({
    header_text: '',
    phone_number: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      });
  }, []);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    return data.url;
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFile(file);
      setSettings({...settings, director_photo: url});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert('সফলভাবে সেভ হয়েছে!');
    } catch (err) {
      alert('সার্ভার এরর');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">সাইট সেটিং</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">হেডারের লিখা (আরবি)</label>
            <input 
               type="text" 
               className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
               value={settings.header_text || ''}
               onChange={e => setSettings({...settings, header_text: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">মোবাইল নাম্বারসমূহ (কমা দিয়ে)</label>
            <input 
               type="text" 
               className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
               value={settings.phone_number || ''}
               onChange={e => setSettings({...settings, phone_number: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">মাদরাসার ঠিকানা (ফুটার, কন্টাক্ট)</label>
            <input 
               type="text" 
               className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
               value={settings.address || ''}
               onChange={e => setSettings({...settings, address: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">নোটিশ বোর্ড (হোম পেজ)</label>
            <textarea 
               className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
               rows={3}
               value={settings.notice_text || ''}
               onChange={e => setSettings({...settings, notice_text: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">সাইট টাইটেল (SEO)</label>
            <input 
               type="text" 
               className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
               value={settings.seo_title || ''}
               onChange={e => setSettings({...settings, seo_title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">মেটা ডেসক্রিপশন (SEO)</label>
            <textarea 
               className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
               rows={3}
               value={settings.seo_description || ''}
               onChange={e => setSettings({...settings, seo_description: e.target.value})}
            />
          </div>


          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">পরিচালকের তথ্যাবলি</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পরিচালকের নাম</label>
                <input 
                   type="text" 
                   className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
                   value={settings.director_name || ''}
                   onChange={e => setSettings({...settings, director_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পরিচালকের পদবি</label>
                <input 
                   type="text" 
                   className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary outline-none"
                   value={settings.director_title || ''}
                   onChange={e => setSettings({...settings, director_title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পরিচালকের ছবি আপলোড</label>
                <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-md">
                   <div className="w-20 h-20 bg-slate-100 border rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                     {settings.director_photo ? (
                       <img src={settings.director_photo} className="w-full h-full object-cover" alt="Director" />
                     ) : (
                       <span className="text-xs text-center text-gray-400">No photo</span>
                     )}
                   </div>
                   <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-sm"
                   />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">অধ্যক্ষের স্বাক্ষর আপলোড (Admit Card এর জন্য)</label>
                <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-md">
                   <div className="h-16 w-32 bg-slate-100 border rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                     {settings.principal_signature ? (
                       <img src={settings.principal_signature} className="w-full h-full object-contain" alt="Signature" />
                     ) : (
                       <span className="text-xs text-center text-gray-400">No Signature</span>
                     )}
                   </div>
                   <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const url = await uploadFile(file);
                           setSettings({...settings, principal_signature: url});
                         }
                      }}
                      className="text-sm"
                   />
                </div>
              </div>
            </div>
          </div>

          <button disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2">
            <Save size={20} /> সেভ করুন
          </button>
        </form>
      </div>
    </div>
  );
}
