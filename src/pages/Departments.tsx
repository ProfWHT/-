import { BookOpen } from 'lucide-react';

export default function Departments() {
  const depts = [
    { title: 'নূরানী বিভাগ', desc: 'শিশুদের জন্য কুরআনের প্রাথমিক পাঠ ও বুনিয়াদি শিক্ষা। এখানে আর্ট, গনিত, বাংলা, ও ইংরেজিও শেখানো হয়।', duration: '৩ বছর' },
    { title: 'নাজেরা বিভাগ', desc: 'কুরআন দেখে সহীহ-শুদ্ধভাবে তিলাওয়াত শিক্ষার বিশেষ ব্যবস্থা। তাজবীদ ও মাখরাজের ওপর বিশেষ জোর।', duration: '১-২ বছর' },
    { title: 'হিফজ বিভাগ', desc: 'আন্তরিক যত্নে দ্রুত কুরআন মুখস্ত করার আবাসিক ব্যবস্থা। আন্তর্জাতিক মানের হাফেজ তৈরির প্রজেক্ট।', duration: '৩-৪ বছর' },
    { title: 'হিফজ রিভিশন বিভাগ', desc: 'হিফজ সম্পন্নকারী ছাত্রদের জন্য বিশেষ ইয়াদ বা রিভিশন কোর্স।', duration: '১ বছর' },
    { title: 'আফটার স্কুল মক্তব বিভাগ', desc: 'স্কুলে পড়াশোনার পাশাপাশি দ্বীনি শিক্ষার বিশেষ আয়োজন।', duration: 'অনির্দিষ্ট' },
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 bg-slate-50 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary-dark mb-4">আমাদের বিভাগসমূহ</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">প্রত্যেক শিক্ষার্থীর মেধা ও বয়স বিবেচনা করে আমাদের রয়েছে সুপরিকল্পিত শিক্ষা ব্যবস্থা।</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {depts.map((d, i) => (
          <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex gap-6">
             <div className="w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
               <BookOpen size={32} />
             </div>
             <div>
               <h3 className="text-2xl font-bold text-gray-800 mb-2">{d.title}</h3>
               <p className="text-sm font-semibold text-gold mb-3">কোর্সের মেয়াদ: {d.duration}</p>
               <p className="text-gray-600 leading-relaxed">{d.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
