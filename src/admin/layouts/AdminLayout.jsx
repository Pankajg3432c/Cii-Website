import React from 'react';
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom'; // Added NavLink
import { useAuth } from '../../contexts/AuthContext'; // Go up two levels
import { FaTachometerAlt, FaUsers, FaProjectDiagram, FaUserShield, FaCalendarAlt, FaSignOutAlt, FaChalkboardTeacher, FaStickyNote, FaTrophy } from 'react-icons/fa';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // navigate('/admin/login'); // logout in AuthContext already navigates
  };
  
  const baseLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  ];

  const superAdminLinks = [
    ...baseLinks,
    { to: '/admin/students', label: 'Students', icon: <FaUsers /> },
    { to: '/admin/clubs', label: 'Clubs', icon: <FaProjectDiagram /> }, // Can be generic icon
    { to: '/admin/projects', label: 'All Projects', icon: <FaProjectDiagram /> },
    { to: '/admin/hackathons', label: 'Hackathons', icon: <FaTrophy /> },
  ];

  const clubLeaderLinks = [
    ...baseLinks,
    { to: `/admin/my-club/${user?.clubId}/students`, label: 'My Club Students', icon: <FaUsers /> },
    { to: `/admin/my-club/${user?.clubId}/classes`, label: 'My Club Classes', icon: <FaChalkboardTeacher /> },
    { to: `/admin/my-club/${user?.clubId}/notes`, label: 'My Club Notes', icon: <FaStickyNote /> },
    { to: `/admin/my-club/${user?.clubId}/attendance`, label: 'Attendance', icon: <FaCalendarAlt /> },
    { to: `/admin/my-club/${user?.clubId}/projects`, label: 'My Club Projects', icon: <FaProjectDiagram /> },
  ];

  const navLinks = user?.role === 'SUPER_ADMIN' ? superAdminLinks : 
                   user?.role === 'CLUB_LEADER' ? clubLeaderLinks : baseLinks;


  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="text-2xl font-semibold mb-6 text-center border-b border-gray-700 pb-4">
          CII Admin
        </div>
        <nav className="flex-grow">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to} className="mb-1">
                <NavLink // Use NavLink for active styling
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded transition-colors duration-200 ease-in-out text-sm
                    ${isActive ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700 hover:text-gray-100'}`
                  }
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto border-t border-gray-700 pt-4">
           {user && (
            <div className="p-2 mb-3 text-sm text-center">
              <p className="font-medium">Welcome, {user.name}</p>
              <p className="text-xs text-gray-400">({user.role.replace('_', ' ')})</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white text-sm"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto"> {/* Added overflow-y-auto */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;