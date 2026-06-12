import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(console.error);
  }, []);

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4"
          >
            <BookOpen size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            আমাদের সুযোগ্য শিক্ষক মণ্ডলী
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            যারা শিক্ষার্থীদের আদর্শ মানুষ হিসেবে গড়ে তুলতে নিরলস পরিশ্রম করে যাচ্ছেন
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teachers.map((t, i) => (
             <motion.div 
                key={t.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center border border-slate-100 group"
             >
                <div className="w-32 h-32 mx-auto bg-slate-100 rounded-full overflow-hidden border-4 border-slate-50 mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
                   {t.photo ? (
                      <img src={t.photo} className="w-full h-full object-cover" alt={t.name} />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen size={32} />
                      </div>
                   )}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-1 line-clamp-1">{t.name}</h3>
                <p className="text-primary font-semibold">{t.title}</p>
             </motion.div>
          ))}
        </div>
        
        {teachers.length === 0 && (
          <div className="text-center text-slate-500 py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
             <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
             <p className="text-xl font-bold">শিক্ষকদের তালিকা খুব শীঘ্রই আপডেট করা হবে</p>
          </div>
        )}
      </div>
    </div>
  );
}
