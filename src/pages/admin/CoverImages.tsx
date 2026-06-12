import React, { useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';

export default function CoverImages() {
  const [images, setImages] = useState({
    cover_image_1: '',
    cover_image_2: '',
    cover_image_3: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setImages({
          cover_image_1: data.cover_image_1 || '',
          cover_image_2: data.cover_image_2 || '',
          cover_image_3: data.cover_image_3 || ''
        });
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setImages(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(images)
      });
      alert('সফলভাবে সেভ হয়েছে!');
    } catch (err) {
      alert('সার্ভার এরর');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">কভার ইমেজ সেটিং</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">কভার ইমেজ {i}</label>
              <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-md">
                 <div className="h-20 w-32 bg-slate-100 border rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                   {images[`cover_image_${i}` as keyof typeof images] ? (
                     <img src={images[`cover_image_${i}` as keyof typeof images]} className="w-full h-full object-cover" alt={`Cover ${i}`} />
                   ) : (
                     <span className="text-xs text-gray-400">No Image</span>
                   )}
                 </div>
                 <input 
                    type="text" 
                    onChange={(e) => handleImageChange(e, `cover_image_${i}`)}
                    className="text-sm w-full border p-2 rounded"
                    placeholder="https://i.ibb.co/..."
                    value={images[`cover_image_${i}` as keyof typeof images]}
                 />
              </div>
            </div>
          ))}
          <button disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2">
            <Save size={20} /> সেভ করুন
          </button>
        </form>
      </div>
    </div>
  );
}
