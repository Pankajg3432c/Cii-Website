import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Path to AuthContext from within admin/routes

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a generic admin page or an "Unauthorized" page
    // For now, a simple message or redirect to dashboard
    // console.warn(`User with role ${user.role} tried to access a route restricted to ${allowedRoles.join(', ')}`);
    return <Navigate to="/admin/dashboard" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;