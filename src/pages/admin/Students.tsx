import React, { useEffect, useState } from 'react';
import { Edit, Printer, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active'|'completed'>('active');
  const [photoPreview, setPhotoPreview] = useState('');
  const [settings, setSettings] = useState<any>({});

  const loadData = () => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(console.error);
      
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setPhotoPreview(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Add photo
    if(photoPreview) {
       data.photo = photoPreview;
    } else if (editingStudent?.photo) {
       data.photo = editingStudent.photo;
    }

    try {
      if (editingStudent?.id) {
        await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
      } else {
        await fetch(`/api/students`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      alert('Error updating');
    }
  };

  const handleEdit = (st: any) => {
    setEditingStudent(st);
    setPhotoPreview('');
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingStudent(null);
    setPhotoPreview('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('আপনি কি সত্যিই এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      alert('Error deleting student');
    }
  };

  const printAdmitCard = (st: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let signatureHtml = '<p style="margin-top: 30px; text-align: right; margin-right: 20px; border-top: 1px dashed #000; display: inline-block; padding-top: 5px;">অধ্যক্ষের স্বাক্ষর</p>';
    if (settings.principal_signature) {
      signatureHtml = `<div style="text-align: right; margin-top: 30px; margin-right: 20px;"><img src="${settings.principal_signature}" style="height: 40px; display: block; margin-left: auto; margin-bottom: 5px;"/><p style="border-top: 1px dashed #000; display: inline-block; padding-top: 5px; margin: 0;">অধ্যক্ষের স্বাক্ষর</p></div>`;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Admit Card - ${st.name}</title>
          <style>
             body { font-family: sans-serif; text-align: center; padding: 40px; }
             .card { border: 2px solid #000; padding: 20px; max-width: 500px; margin: 0 auto; border-radius: 10px; }
             h1 { color: #047857; margin-bottom: 5px; }
             h2 { color: #f59e0b; font-size: 18px; margin-top: 0; }
             .photo { width: 100px; height: 100px; object-fit: cover; border: 1px solid #ccc; border-radius: 8px; margin: 10px auto; display: block; }
             table { width: 100%; text-align: left; margin-top: 20px; border-collapse: collapse; }
             th, td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="card">
             <h1>তাহফিজুল কুরআন মডেল মাদ্রাসা</h1>
             <h2>Admit Card (প্রবেশপত্র)</h2>
             ${st.photo ? '<img src="' + st.photo + '" class="photo"/>' : '<div class="photo" style="display:flex;align-items:center;justify-content:center;background:#eee;">No Photo</div>'}
             <table>
                <tr><th>নাম:</th><td>${st.name || ''}</td></tr>
                <tr><th>রোল নং:</th><td>${st.roll_number || ''}</td></tr>
                <tr><th>বিভাগ:</th><td>${st.department || ''}</td></tr>
                <tr><th>ক্লাস/বর্ষ:</th><td>${st.class_name || ''} - ${st.academic_year || ''}</td></tr>
             </table>
             ${signatureHtml}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  const filteredStudents = students.filter(st => {
     if (activeTab === 'active') return st.status !== 'completed';
     return st.status === 'completed';
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">শিক্ষার্থী তথ্য পরিচালনা</h1>
        <button onClick={handleNew} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
          নতুন শিক্ষার্থী যুক্ত করুন
        </button>
      </div>

      <div className="flex gap-4 mb-4">
         <button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-500'}`}>Live Students</button>
         <button onClick={() => setActiveTab('completed')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'completed' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-500'}`}>Completed Students</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">ছবি</th>
                <th className="px-6 py-4 font-semibold text-gray-600">রোল</th>
                <th className="px-6 py-4 font-semibold text-gray-600">নাম</th>
                <th className="px-6 py-4 font-semibold text-gray-600">বিভাগ / ক্লাস</th>
                <th className="px-6 py-4 font-semibold text-gray-600">ফলাফল</th>
                <th className="px-6 py-4 font-semibold text-gray-600">ফি</th>
                <th className="px-6 py-4 font-semibold text-gray-600">স্ট্যাটাস</th>
                <th className="px-6 py-4 font-semibold text-gray-600">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">কোনো শিক্ষার্থী নেই</td></tr>
              ) : (
                filteredStudents.map((st: any) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {st.photo ? <img src={st.photo} className="w-10 h-10 rounded-full object-cover border" /> : <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><ImageIcon size={16}/></div>}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-600">{st.roll_number}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{st.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                       <span className="block">{st.department}</span>
                       <span className="text-xs text-gray-500">{st.class_name} ({st.academic_year})</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{st.result || '-'}</td>
                    <td className="px-6 py-4">
                       <div className="text-xs">
                          <span className="text-green-600 font-bold">Paid: {st.fee_paid || 0}</span><br/>
                          <span className="text-red-500 font-bold">Due: {st.fee_due || 0}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${st.status === 'completed' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{st.status || 'Active'}</span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                       <button onClick={() => handleEdit(st)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                         <Edit size={18} />
                       </button>
                       <button onClick={() => printAdmitCard(st)} className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="Admit Card">
                         <Printer size={18} />
                       </button>
                       <button onClick={() => handleDelete(st.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-start py-10 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 w-full max-w-3xl my-auto">
            <h2 className="text-xl font-bold mb-4">{editingStudent ? 'শিক্ষার্থীর তথ্য এডিট' : 'নতুন শিক্ষার্থী'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2 flex items-center gap-4 border p-4 rounded-lg bg-slate-50">
                   <div className="w-20 h-20 bg-white rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                      {photoPreview || editingStudent?.photo ? (
                         <img src={photoPreview || editingStudent?.photo} className="w-full h-full object-cover" />
                      ) : (
                         <span className="text-xs text-slate-400">No Image</span>
                      )}
                   </div>
                   <div>
                      <label className="block text-sm font-semibold mb-1">শিক্ষার্থীর ছবি লিঙ্ক</label>
                      <input type="text" value={photoPreview || editingStudent?.photo || ''} onChange={handlePhotoChange} className="text-sm w-full border p-2 rounded" placeholder="https://i.ibb.co/..." />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">নাম</label>
                  <input required name="name" defaultValue={editingStudent?.name || ''} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">রোল নাম্বার (Login ID)</label>
                  <input required name="roll_number" defaultValue={editingStudent?.roll_number || ''} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">পাসওয়ার্ড (Login Password)</label>
                  <input name="password" defaultValue={editingStudent?.password || ''} className="w-full border p-2 rounded" placeholder="e.g. 12345" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">বিভাগ</label>
                  <input required name="department" defaultValue={editingStudent?.department || ''} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ক্লাস (Class)</label>
                  <input name="class_name" defaultValue={editingStudent?.class_name || ''} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">শিক্ষাবর্ষ</label>
                  <input name="academic_year" defaultValue={editingStudent?.academic_year || ''} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ফলাফল (Result)</label>
                  <input name="result" defaultValue={editingStudent?.result || ''} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">স্ট্যাটাস</label>
                  <select name="status" defaultValue={editingStudent?.status || 'active'} className="w-full border p-2 rounded bg-white">
                    <option value="active">Active (Live)</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="col-span-2 border-t pt-4 mt-2">
                   <h3 className="font-bold text-blue-800 mb-2">ফি সংগ্রহ</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">পরিশোধিত ফি (Paid)</label>
                        <input type="number" name="fee_paid" defaultValue={editingStudent?.fee_paid || 0} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">বকেয়া ফি (Due)</label>
                        <input type="number" name="fee_due" defaultValue={editingStudent?.fee_due || 0} className="w-full border p-2 rounded" />
                      </div>
                   </div>
                </div>

                <div className="col-span-2 border-t pt-4 mt-2">
                  <h3 className="font-bold mb-2 text-slate-700">অন্যান্য তথ্য</h3>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">অভিভাবকের নাম</label>
                  <input name="guardian_name" defaultValue={editingStudent?.guardian_name || ''} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">অভিভাবকের মোবাইল</label>
                  <input name="guardian_phone" defaultValue={editingStudent?.guardian_phone || ''} className="w-full border p-2 rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">বিস্তারিত ঠিকানা</label>
                  <input name="address" defaultValue={editingStudent?.address || ''} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">বাতিল</button>
                 <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded">সেভ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
