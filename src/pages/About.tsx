export default function About() {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-primary-dark mb-8">আমাদের সম্পর্কে</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="prose prose-lg text-gray-700">
           <p>তাহফিজুল কুরআন মডেল মাদ্রাসা একটি অত্যাধুনিক ইসলামিক শিক্ষা প্রতিষ্ঠান। মুসলিম নগর, বুড়িরডাঙ্গা, দিগরাজ, মোংলা, বাগেরহাট ঠিকানায় অবস্থিত এই প্রতিষ্ঠানটি দ্বীনি শিক্ষার এক বিশ্বস্ত নাম।</p>
           <h3 className="text-2xl font-bold mt-8 mb-4">লক্ষ্য ও উদ্দেশ্য</h3>
           <ul>
             <li>কুরআনের সহীহ তিলাওয়াত ও হিফজ নিশ্চিত করা।</li>
             <li>ইসলামিক আদর্শ ও নৈতিক মূল্যবোধের বিকাশ সাধন।</li>
             <li>আধুনিক শিক্ষার সাথে ইসলামিক শিক্ষার সমন্বয়।</li>
           </ul>
        </div>
        <div className="bg-slate-100 rounded-lg p-8">
           <h3 className="text-2xl font-bold mb-6 text-primary">প্রতিষ্ঠানের বৈশিষ্ট্য</h3>
           <ul className="space-y-4">
              <li className="flex gap-3"><span className="text-gold">★</span> মনোরম ও নিরিবিলি পরিবেশ</li>
              <li className="flex gap-3"><span className="text-gold">★</span> সার্বক্ষণিক নিরাপত্তা ও সিসি ক্যামেরা নিয়ন্ত্রিত</li>
              <li className="flex gap-3"><span className="text-gold">★</span> অভিজ্ঞ ও দক্ষ শিক্ষকমণ্ডলী দ্বারা পরিচালিত</li>
              <li className="flex gap-3"><span className="text-gold">★</span> স্বাস্থ্যসম্মত ও পুষ্টিকর খাবার পরিবেশন</li>
           </ul>
        </div>
      </div>
    </div>
  );
}
