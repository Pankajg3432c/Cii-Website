// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const MOCK_USERS = {
  'rehan@admin': { password: '123', role: 'SUPER_ADMIN', name: 'Super Admin' },
  'rehan@club': { password: '123', role: 'CLUB_LEADER', name: 'Club Leader Alpha', clubId: 'club_alpha' },
  'leaderbeta@example.com': { password: 'password123', role: 'CLUB_LEADER', name: 'Club Leader Beta', clubId: 'club_beta' },
};

const getInitialUser = () => {
  try {
    const item = localStorage.getItem('cii-admin-user');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    localStorage.removeItem('cii-admin-user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser());
  const navigate = useNavigate(); // This is okay now because AuthProvider is a child of Router

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS[email];
        if (foundUser && foundUser.password === password) {
          const userData = { email, role: foundUser.role, name: foundUser.name, clubId: foundUser.clubId };
          localStorage.setItem('cii-admin-user', JSON.stringify(userData));
          setUser(userData);
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('cii-admin-user');
    setUser(null);
    navigate('/admin/login');
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};