import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setImages(data))
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
            <ImageIcon size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            ফটো গ্যালারি
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            মাদরাসার বিভিন্ন অনুষ্ঠান, ক্লাস ও প্রতিযোগিতার কিছু মুহূর্ত
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img, i) => (
             <motion.div 
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-slate-100"
             >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                   <img src={img.image} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold px-4 text-center">{img.caption}</span>
                   </div>
                </div>
                <div className="p-4 bg-white">
                   <p className="font-semibold text-gray-800 line-clamp-1">{img.caption || 'মাদরাসার ছবি'}</p>
                </div>
             </motion.div>
          ))}
        </div>
        
        {images.length === 0 && (
          <div className="text-center text-slate-500 py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
             <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
             <p className="text-xl font-bold">গ্যালারিতে এখনও কোনো ছবি যুক্ত করা হয়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
