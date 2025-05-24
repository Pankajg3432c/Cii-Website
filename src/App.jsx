// src/App.jsx
import React from 'react'; // Ensure React is imported
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Main Site Components
import Header from './components/Header';
import Header2 from './components/Header-2';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SocialIcon from './components/Socialicons';

// Main Site Pages
import Home from './pages/homepage';
import About from './pages/about';
import Projects from './pages/projects';
import HackathonsPage from './admin/pages/HackathonManagementPage'; // Public hackathons page
import Contact from './pages/contact';

// Admin Panel Imports
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './admin/layouts/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import ProtectedRoute from './admin/routes/ProtectedRoute';

// Admin Management Pages
import StudentManagementPage from './admin/pages/StudentManagementPage';
import ClubManagementPage from './admin/pages/ClubManagementPage';
import ProjectManagementPage from './admin/pages/ProjectManagementPage';
import HackathonManagementPage from './admin/pages/HackathonManagementPage';

// Club Leader Specific Pages
import MyClubStudentsPage from "./admin/MyClub/MyClubStudentsPage";
import MyClubClassesPage from './admin/MyClub/MyClubClassesPage';
import MyClubNotesPage from './admin/MyClub/MyClubNotesPage';
import MyClubAttendancePage from './admin/MyClub/MyClubAttendancePage';
import MyClubProjectsPage from './admin/MyClub/MyClubProjectsPage';

// Main site layout component
const MainLayout = () => (
  <>
    <Header />
    <Header2 />
    <Navbar />
    <SocialIcon />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Main Site Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/hackathons" element={<HackathonsPage />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Panel Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CLUB_LEADER']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                
                <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                  <Route path="students" element={<StudentManagementPage />} />
                  <Route path="clubs" element={<ClubManagementPage />} />
                  <Route path="projects" element={<ProjectManagementPage />} />
                  <Route path="hackathons" element={<HackathonManagementPage />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['CLUB_LEADER']} />}>
                  <Route path="my-club/:clubId/students" element={<MyClubStudentsPage />} />
                  <Route path="my-club/:clubId/classes" element={<MyClubClassesPage />} />
                  <Route path="my-club/:clubId/notes" element={<MyClubNotesPage />} />
                  <Route path="my-club/:clubId/attendance" element={<MyClubAttendancePage />} />
                  <Route path="my-club/:clubId/projects" element={<MyClubProjectsPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;