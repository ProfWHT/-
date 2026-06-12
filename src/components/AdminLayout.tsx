import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, LogOut, FileText, HeartHandshake, Image as ImageIcon, BookOpen, User, Grid } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('adminToken');
    if (!token && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>;
  }

  // If we are exactly on the login page
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const menuItems = [
    { name: 'ড্যাশবোর্ড', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'শিক্ষক ও স্টাফ', path: '/admin/t', icon: <BookOpen size={20} /> },
    { name: 'ভর্তি আবেদন', path: '/admin/ad', icon: <UserPlus size={20} /> },
    { name: 'শিক্ষার্থী তথ্য', path: '/admin/s', icon: <Users size={20} /> },
    { name: 'ডোনেশন সমূহ', path: '/admin/do', icon: <HeartHandshake size={20} /> },
    { name: 'দানবীর ব্যবস্থাপনা', path: '/admin/dm', icon: <HeartHandshake size={20} /> },
    { name: 'জমি দাতা ব্যবস্থাপনা', path: '/admin/ld', icon: <Grid size={20} /> },
    { name: 'গ্যালারি', path: '/admin/g', icon: <ImageIcon size={20} /> },
    { name: 'কভার ইমেজ', path: '/admin/ci', icon: <ImageIcon size={20} /> },
    { name: 'অ্যাডমিন', path: '/admin/am', icon: <Users size={20} /> },
    { name: 'আমার প্রোফাইল', path: '/admin/p', icon: <User size={20} /> },
    { name: 'সেটিং', path: '/admin/se', icon: <FileText size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-bangla text-slate-700">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen hidden md:flex border-r border-slate-800">
        <div className="h-16 flex items-center px-4 gap-2.5 border-b border-slate-800 bg-slate-950">
          <img 
            src="https://i.ibb.co/xtVT4r02/1-20260612-202052-0000.png" 
            alt="তাহফিজুল কুরআন মডেল মাদ্রাসা লোগো" 
            className="w-9 h-9 object-contain bg-white/10 p-1 rounded-full border border-white/5 filter drop-shadow shrink-0"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-lg font-bold text-white tracking-wider">Admin Panel</h2>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="font-semibold text-slate-800">তাহফিজুল কুরআন মডেল মাদ্রাসা</div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">A</div>
             <span className="text-sm font-medium text-slate-600">Super Admin</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
