import { useEffect, useState } from 'react';
import { Users, UserPlus, Heart, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  const cards = [
    { title: 'মোট ছাত্র', value: stats.totalStudents, icon: <Users size={24} />, color: 'bg-blue-500' },
    { title: 'নতুন ভর্তি আবেদন', value: stats.pendingAdmissions, icon: <UserPlus size={24} />, color: 'bg-orange-500' },
    { title: 'মোট দান (৳)', value: stats.totalDonations, icon: <Heart size={24} />, color: 'bg-green-500' },
    { title: 'শিক্ষক সংখ্যা', value: stats.totalTeachers, icon: <BookOpen size={24} />, color: 'bg-indigo-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ড্যাশবোর্ড ওভারভিউ</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
            <div className={`w-14 h-14 ${card.color} text-white rounded-xl flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-center min-h-[300px]">
         <div className="text-center text-gray-400">
            <p className="mb-2">Advanced Charts (Revenue & Admission growth) will be here</p>
         </div>
      </div>
    </div>
  );
}
