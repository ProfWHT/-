import React, { useEffect, useState } from 'react';
import { Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentsPublic() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data.filter((s:any) => s.status !== 'completed')))
      .catch(console.error);
  }, []);

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mb-4"
          >
            <GraduationCap size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            আমাদের বর্তমান শিক্ষার্থী
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            মাদরাসার সকল ছাত্রের তালিকা ও প্রাথমিক তথ্য
          </motion.p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 border-b border-slate-100">
                 <tr>
                   <th className="px-6 py-4 font-semibold text-gray-600">ছবি</th>
                   <th className="px-6 py-4 font-semibold text-gray-600">নাম</th>
                   <th className="px-6 py-4 font-semibold text-gray-600">বিভাগ</th>
                   <th className="px-6 py-4 font-semibold text-gray-600">ক্লাস / বর্ষ</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {students.length === 0 ? (
                   <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি</td></tr>
                 ) : (
                   students.map((st: any) => (
                     <tr key={st.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4">
                         {st.photo ? <img src={st.photo} className="w-10 h-10 rounded-full object-cover border" /> : <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><Users size={16}/></div>}
                       </td>
                       <td className="px-6 py-4 font-medium text-gray-800">{st.name}</td>
                       <td className="px-6 py-4 text-gray-600">{st.department}</td>
                       <td className="px-6 py-4 text-gray-600">{st.class_name} <span className="text-xs">({st.academic_year})</span></td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}
