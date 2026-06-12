import React, { useEffect, useState } from 'react';
import { Trash2, Image as ImageIcon, Upload } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [photoPreview, setPhotoPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhotoPreview(e.target.value);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) {
      alert("অনুগ্রহ করে ছবি নির্বাচন করুন");
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photoPreview, caption })
      });
      setPhotoPreview('');
      setCaption('');
      (document.getElementById('file-upload') as HTMLInputElement).value = "";
      loadData();
    } catch (err) {
      alert('Upload failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('আপনি কি ছবিটি মুছতে চান?')) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">গ্যালারি পরিচালনা</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8 max-w-2xl">
         <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Upload size={20} /> নতুন ছবি আপলোড</h2>
         <form onSubmit={handleUpload} className="space-y-4">
            <div>
               <label className="block text-sm font-semibold mb-2 text-slate-700">ছবির লিঙ্ক (Image URL)</label>
               <input type="text" onChange={handlePhotoChange} value={photoPreview} className="w-full text-sm border p-2 rounded-md" placeholder="https://i.ibb.co/..." />
            </div>
            {photoPreview && (
               <div className="w-48 h-32 bg-slate-100 rounded-md border overflow-hidden mt-2">
                 <img src={photoPreview} className="w-full h-full object-cover" />
               </div>
            )}
            <div>
               <label className="block text-sm font-semibold mb-2 text-slate-700">ছবির টাইটেল / ক্যাপশন</label>
               <input 
                  type="text" 
                  value={caption} 
                  onChange={e => setCaption(e.target.value)} 
                  className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
                  placeholder="যেমন: বার্ষিক পুরস্কার প্রদান অনুষ্ঠান"
               />
            </div>
            <button disabled={loading} type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-bold transition-colors">
               আপলোড করুন
            </button>
         </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(img => (
          <div key={img.id} className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 relative group">
             <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border">
                <img src={img.image} className="w-full h-full object-cover" alt={img.caption} />
             </div>
             <div className="mt-2 text-center text-sm font-semibold text-slate-700 line-clamp-1">{img.caption || 'No Caption'}</div>
             <button 
                onClick={() => handleDelete(img.id)}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
             >
                <Trash2 size={16} />
             </button>
          </div>
        ))}
        {images.length === 0 && <div className="col-span-full py-10 text-center text-slate-500">গ্যালারিতে কোনো ছবি নেই</div>}
      </div>
    </div>
  );
}
