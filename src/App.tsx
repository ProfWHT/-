/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import Admission from './pages/Admission';
import Donation from './pages/Donation';
import Donors from './pages/Donors';
import Contact from './pages/Contact';
import PublicGallery from './pages/Gallery';
import PublicTeachers from './pages/Teachers';
import StudentsPublic from './pages/StudentsPublic';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Students from './pages/admin/Students';
import AdmissionsList from './pages/admin/AdmissionsList';
import Settings from './pages/admin/Settings';
import AdminGallery from './pages/admin/Gallery';
import DonationsList from './pages/admin/DonationsList';
import AdminTeachers from './pages/admin/Teachers';
import CoverImages from './pages/admin/CoverImages';
import AdminManagement from './pages/admin/AdminManagement';
import DonorsManagement from './pages/admin/DonorsManagement';
import Profile from './pages/admin/Profile';
import LandDonors from './pages/admin/LandDonors';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="a" element={<About />} />
          <Route path="t" element={<PublicTeachers />} />
          <Route path="s" element={<StudentsPublic />} />
          <Route path="d" element={<Departments />} />
          <Route path="ad" element={<Admission />} />
          <Route path="g" element={<PublicGallery />} />
          <Route path="do" element={<Donation />} />
          <Route path="dn" element={<Donors />} />
          <Route path="c" element={<Contact />} />
          <Route path="sl" element={<StudentLogin />} />
          <Route path="sd" element={<StudentDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="t" element={<AdminTeachers />} />
          <Route path="s" element={<Students />} />
          <Route path="ad" element={<AdmissionsList />} />
          <Route path="do" element={<DonationsList />} />
          <Route path="g" element={<AdminGallery />} />
          <Route path="ci" element={<CoverImages />} />
          <Route path="am" element={<AdminManagement />} />
          <Route path="dm" element={<DonorsManagement />} />
          <Route path="ld" element={<LandDonors />} />
          <Route path="p" element={<Profile />} />
          <Route path="se" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
