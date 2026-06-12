import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Printer } from 'lucide-react';

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));

    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/student/login');
      return;
    }

    fetch('/api/auth/student/me', {
      headers: {
        'x-student-id': studentId
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.student) setStudent(data.student);
        else navigate('/student/login');
      })
      .catch(() => navigate('/student/login'));
  }, [navigate]);

  const printAdmitCard = () => {
    if (!student) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let signatureHtml = '<p style="margin-top: 30px; text-align: right; margin-right: 20px; border-top: 1px dashed #000; display: inline-block; padding-top: 5px;">অধ্যক্ষের স্বাক্ষর</p>';
    if (settings.principal_signature) {
      signatureHtml = `<div style="text-align: right; margin-top: 30px; margin-right: 20px;"><img src="${settings.principal_signature}" style="height: 40px; display: block; margin-left: auto; margin-bottom: 5px;"/><p style="border-top: 1px dashed #000; display: inline-block; padding-top: 5px; margin: 0;">অধ্যক্ষের স্বাক্ষর</p></div>`;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Admit Card - ${student.name}</title>
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
             <h1>তাফসীরুল কুরআন মাদ্রাসা</h1>
             <h2>Admit Card (প্রবেশপত্র)</h2>
             ${student.photo ? '<img src="' + student.photo + '" class="photo"/>' : '<div class="photo" style="display:flex;align-items:center;justify-content:center;background:#eee;">No Photo</div>'}
             <table>
                <tr><th>নাম:</th><td>${student.name || ''}</td></tr>
                <tr><th>রোল নং:</th><td>${student.roll_number || ''}</td></tr>
                <tr><th>বিভাগ:</th><td>${student.department || ''}</td></tr>
                <tr><th>ক্লাস/বর্ষ:</th><td>${student.class_name || ''} - ${student.academic_year || ''}</td></tr>
             </table>
             ${signatureHtml}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  if (!student) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-primary text-white pt-10 pb-20 px-4">
         <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">স্টুডেন্ট ড্যাশবোর্ড</h1>
            <button 
              onClick={() => {
                localStorage.removeItem('studentToken');
                localStorage.removeItem('studentId');
                navigate('/student/login');
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
               <LogOut size={18} /> লগআউট
            </button>
         </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 -mt-12">
         <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
             
             <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-xl overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={64} className="text-slate-300" />
                )}
             </div>

             <div className="flex-1 w-full text-slate-800">
                <div className="border-b pb-4 mb-4 flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">{student.name}</h2>
                    <p className="text-primary font-bold text-lg">রোল: {student.roll_number}</p>
                  </div>
                  <button 
                     onClick={printAdmitCard}
                     className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-blue-200"
                  >
                     <Printer size={18} /> প্রবেশপত্র
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                   <div>
                     <p className="text-slate-500 font-semibold mb-1">বিভাগ</p>
                     <p className="font-medium text-base">{student.department || '-'}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 font-semibold mb-1">ক্লাস (বর্ষ)</p>
                     <p className="font-medium text-base">{student.class_name || '-'} ({student.academic_year || '-'})</p>
                   </div>
                   <div>
                     <p className="text-slate-500 font-semibold mb-1">অভিভাবক</p>
                     <p className="font-medium text-base">{student.guardian_name || '-'}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 font-semibold mb-1">অভিভাবকের মোবাইল</p>
                     <p className="font-medium text-base">{student.guardian_phone || '-'}</p>
                   </div>
                </div>
             </div>
         </div>

         <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
               <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">অ্যাকাডেমিক ফলাফল</h3>
               {student.result ? (
                 <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg font-bold text-xl text-center border-2 border-green-200">
                    {student.result}
                 </div>
               ) : (
                 <p className="text-slate-500 text-center py-4">এখনও কোনো ফলাফল প্রকাশ করা হয়নি</p>
               )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
               <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">ফি ও পেমেন্ট</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded text-sm">
                    <span className="font-semibold text-slate-600">পরিশোধিত ফি:</span>
                    <span className="font-bold text-slate-800">৳ {student.fee_paid || 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-3 rounded text-sm">
                    <span className="font-semibold text-orange-800">বকেয়া ফি:</span>
                    <span className="font-bold text-orange-600">৳ {student.fee_due || 0}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
