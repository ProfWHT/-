import { useEffect, useState } from 'react';

export default function AdmissionsList() {
  const [admissions, setAdmissions] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/admissions')
      .then(res => res.json())
      .then(data => setAdmissions(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admissions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('আপনি কি এই আবেদনটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Error deleting');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ভর্তি আবেদন সমূহ</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">আইডি</th>
                <th className="px-6 py-4 font-semibold text-gray-600">ছাত্রের নাম</th>
                <th className="px-6 py-4 font-semibold text-gray-600">অভিভাবক</th>
                <th className="px-6 py-4 font-semibold text-gray-600">মোবাইল</th>
                <th className="px-6 py-4 font-semibold text-gray-600">বিভাগ / পেমেন্ট</th>
                <th className="px-6 py-4 font-semibold text-gray-600">স্ট্যাটাস</th>
                <th className="px-6 py-4 font-semibold text-gray-600">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">কোনো আবেদন নেই</td></tr>
              ) : (
                admissions.map((ad: any) => (
                  <tr key={ad.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">#{ad.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{ad.student_name}</td>
                    <td className="px-6 py-4 text-gray-600">{ad.guardian_name}</td>
                    <td className="px-6 py-4 text-gray-600">{ad.contact_number}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold mb-1 block w-max">{ad.department}</span>
                      {ad.payment_method && (
                        <div className="text-xs text-gray-500 mt-1">
                          {ad.payment_method}: <span className="font-mono text-gray-800">{ad.trx_id}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${ad.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{ad.status === 'published' ? 'গৃহীত' : 'পেন্ডিং'}</span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                       {ad.status !== 'published' && (
                         <button onClick={() => updateStatus(ad.id, 'published')} className="text-sm text-green-600 font-semibold hover:underline bg-green-50 px-2 py-1 rounded border border-green-200">
                           Approve
                         </button>
                       )}
                       <button onClick={() => handleDelete(ad.id)} className="text-sm text-red-600 font-semibold hover:underline bg-red-50 px-2 py-1 rounded border border-red-200">
                         Delete
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
