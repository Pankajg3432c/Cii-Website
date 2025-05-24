// src/admin/services/clubService.js

// In-memory store for clubs (simulates a database)
let clubs = [
  { id: 'club_alpha', name: 'Alpha Innovators', description: 'Focusing on cutting-edge AI and ML projects.', leaderEmail: 'clubleader@example.com' },
  { id: 'club_beta', name: 'Beta Builders', description: 'Dedicated to web and mobile app development.', leaderEmail: 'leaderbeta@example.com' },
  { id: 'club_gamma', name: 'Gamma Geeks', description: 'Exploring IoT, robotics, and hardware.', leaderEmail: 'gamma_leader@example.com' },
];

// Simulate API delay
const API_DELAY = 400;

const generateId = () => `club_${Date.now()}${Math.floor(Math.random() * 100)}`;

export const getClubs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...clubs]); // Return a copy
    }, API_DELAY);
  });
};

export const getClubById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const club = clubs.find(c => c.id === id);
      if (club) {
        resolve({ ...club }); // Return a copy
      } else {
        reject(new Error('Club not found'));
      }
    }, API_DELAY);
  });
};

export const addClub = async (clubData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic validation
      if (!clubData.name || !clubData.description) {
        return reject(new Error('Club name and description are required.'));
      }
      const newClub = { id: generateId(), ...clubData };
      clubs.push(newClub);
      resolve({ ...newClub }); // Return a copy
    }, API_DELAY);
  });
};

export const updateClub = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = clubs.findIndex(c => c.id === id);
      if (index !== -1) {
        // Basic validation
        if (updatedData.name === '' || updatedData.description === '') {
            return reject(new Error('Club name and description cannot be empty.'));
        }
        clubs[index] = { ...clubs[index], ...updatedData };
        resolve({ ...clubs[index] }); // Return a copy
      } else {
        reject(new Error('Club not found for update'));
      }
    }, API_DELAY);
  });
};

export const deleteClub = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = clubs.length;
      clubs = clubs.filter(c => c.id !== id);
      if (clubs.length < initialLength) {
        resolve({ message: 'Club deleted successfully' });
      } else {
        reject(new Error('Club not found for deletion'));
      }
    }, API_DELAY);
  });
};