import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Go up two levels
const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-xl text-gray-700">
            Welcome back, <span className="font-semibold">{user.name}</span>!
          </p>
          <p className="text-gray-600">
            Your role is: <span className="font-medium text-indigo-600">{user.role.replace('_', ' ')}</span>
          </p>
          {user.role === 'CLUB_LEADER' && user.clubId && (
            <p className="text-gray-600">
              You are managing club: <span className="font-medium text-indigo-600">{user.clubId}</span>
            </p>
          )}
          <p className="mt-4 text-gray-700">This is your central hub for managing CII activities.</p>
        </div>
      )}
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Quick Stats</h2>
          <p className="text-gray-600 mb-1">Total Students: <span className="font-semibold text-blue-500">(Coming Soon)</span></p>
          <p className="text-gray-600 mb-1">Active Clubs: <span className="font-semibold text-blue-500">(Coming Soon)</span></p>
          <p className="text-gray-600">Ongoing Projects: <span className="font-semibold text-blue-500">(Coming Soon)</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Recent Activity</h2>
          <ul className="text-gray-600 list-disc list-inside pl-2 space-y-1">
            <li>(No recent activity to display)</li>
            {/* Example: <li>User X added a new project.</li> */}
          </ul>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Useful Links</h2>
          <ul className="text-blue-600 list-disc list-inside pl-2 space-y-1">
            <li><a href="#" className="hover:underline">Documentation</a></li>
            <li><a href="#" className="hover:underline">Support Center</a></li>
            <li><a href="#" className="hover:underline">Community Forum</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;