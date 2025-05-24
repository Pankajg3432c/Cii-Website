import React from 'react';
import { useAuth } from '../../../contexts/AuthContext'; // Adjusted path

const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-xl text-gray-700">
            Welcome back, <span className="font-semibold">{user.name}</span>!
          </p>
          <p className="text-gray-600">Your role is: <span className="font-medium">{user.role}</span></p>
          {user.role === 'CLUB_LEADER' && user.clubId && (
            <p className="text-gray-600">You are managing club: <span className="font-medium">{user.clubId}</span></p>
          )}
          <p className="mt-4">This is your central hub for managing CII activities.</p>
        </div>
      )}
       {/* Placeholder for future widgets/summaries */}
       <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Quick Stats</h2>
          <p className="text-gray-600">Total Students: (coming soon)</p>
          <p className="text-gray-600">Active Clubs: (coming soon)</p>
          <p className="text-gray-600">Ongoing Projects: (coming soon)</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Recent Activity</h2>
          <p className="text-gray-600">(Activity feed coming soon)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;