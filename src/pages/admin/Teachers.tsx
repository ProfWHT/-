import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus, Upload, Shield } from 'lucide-react';

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    photo: '',
    phone: '',
    username: '',
    password: '',
    has_admin_access: false
  });

  const loadData = () => {
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, photo: e.target.value});
  };

  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setFormData({
      name: t.name || '',
      title: t.title || '',
      photo: t.photo || '',
      phone: t.phone || '',
      username: t.username || '',
      password: '',
      has_admin_access: t.has_admin_access === 1
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('আপনি কি এই শিক্ষককে মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/teachers/${editingId}` : '/api/teachers';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        name: '', title: '', photo: '', phone: '', username: '', password: '', has_admin_access: false
      });
      loadData();
    } catch (err) {
      alert('Failed to save');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">শিক্ষক ও স্টাফ পরিচালনা</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', title: '', photo: '', phone: '', username: '', password: '', has_admin_access: false });
            setIsFormOpen(!isFormOpen);
          }} 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          {isFormOpen ? 'বাতিল করুন' : <><UserPlus size={20} /> নতুন শিক্ষক যুক্ত করুন</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'শিক্ষক আপডেট করুন' : 'নতুন শিক্ষক নিবন্ধন'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-semibold mb-2">নাম</label>
                   <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-semibold mb-2">পদবি (যেমন: সহকারী শিক্ষক)</label>
                   <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primary outline-none" />
                </div>
             </div>
             <div>
                <label className="block text-sm font-semibold mb-2">ফোন নম্বর</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primary outline-none" />
             </div>
             
             <div className="pt-4 border-t">
                <label className="flex flex-row items-center gap-2 font-bold text-lg mb-4 text-slate-800">
                   <input type="checkbox" checked={formData.has_admin_access} onChange={e => setFormData({...formData, has_admin_access: e.target.checked})} className="w-5 h-5 text-primary" />
                   <Shield size={20} className="text-primary"/> অ্যাডমিন প্যানেল এক্সেস দিন
                </label>
                
                {formData.has_admin_access && (
                   <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                         <label className="block text-sm font-semibold mb-2 text-slate-700">ইউজারনেম (লগইন এর জন্য)</label>
                         <input required={formData.has_admin_access} type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold mb-2 text-slate-700">পাসওয়ার্ড {editingId && <span className="text-xs text-orange-500 font-normal">(নতুন পাল্টাতে চাইলে দিন)</span>}</label>
                         <input required={formData.has_admin_access && !editingId} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                   </div>
                )}
             </div>

             <div className="pt-4 border-t">
                <label className="block text-sm font-semibold mb-2">ছবির লিঙ্ক (Image URL)</label>
                <div className="flex items-center gap-4">
                  {formData.photo && (
                    <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden border">
                       <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input type="text" value={formData.photo} onChange={handlePhotoChange} className="w-full border p-2 rounded-md" placeholder="https://i.ibb.co/..."/>
                </div>
             </div>
             <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md font-bold hover:bg-primary-dark mt-4">
                সেভ করুন
             </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teachers.map(t => (
          <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
             <div className="w-24 h-24 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 mb-4 relative">
                {t.photo ? (
                  <img src={t.photo} className="w-full h-full object-cover" alt={t.name} />
                ) : (
                  <span className="flex w-full h-full items-center justify-center text-slate-400">No Photo</span>
                )}
                {t.has_admin_access === 1 && (
                  <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-full" title="Admin Access">
                     <Shield size={12} />
                  </div>
                )}
             </div>
             <h3 className="font-bold text-lg text-slate-800 text-center">{t.name}</h3>
             <p className="text-sm text-primary font-semibold mb-2 text-center">{t.title}</p>
             <p className="text-xs text-slate-500 mb-4">{t.phone || 'Phone not provided'}</p>
             <div className="flex gap-2 w-full mt-auto">
                <button onClick={() => handleEdit(t)} className="flex-1 border border-blue-200 bg-blue-50 text-blue-600 rounded-md py-1.5 flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors text-sm font-bold">
                   <Pencil size={14} /> এডিট
                </button>
                <button onClick={() => handleDelete(t.id)} className="flex-1 border border-red-200 bg-red-50 text-red-600 rounded-md py-1.5 flex items-center justify-center gap-1 hover:bg-red-100 transition-colors text-sm font-bold">
                   <Trash2 size={14} /> ডিলিট
                </button>
             </div>
          </div>
        ))}
        {teachers.length === 0 && <div className="col-span-full py-10 text-center text-slate-500">কোনো শিক্ষক যুক্ত করা হয়নি</div>}
      </div>
    </div>
  );
}
