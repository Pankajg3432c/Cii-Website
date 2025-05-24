// src/admin/services/hackathonService.js

let hackathons = [
  { 
    id: 'hack1', 
    name: 'InnovateFest 2024', 
    theme: 'Sustainable Solutions', 
    description: 'A 24-hour hackathon focused on creating technology for a sustainable future.', 
    startDate: '2024-07-15T09:00:00Z', 
    endDate: '2024-07-16T17:00:00Z',
    registrationOpenDate: '2024-06-01T00:00:00Z',
    registrationCloseDate: '2024-07-10T23:59:59Z',
    location: 'GITS Auditorium & Online',
    status: 'Upcoming' // Upcoming, Active, Completed, Cancelled
  },
  { 
    id: 'hack2', 
    name: 'CodeBlitz AI Challenge', 
    theme: 'Artificial Intelligence in Healthcare', 
    description: 'Develop AI-powered solutions to improve healthcare outcomes.', 
    startDate: '2024-09-01T10:00:00Z', 
    endDate: '2024-09-02T18:00:00Z', 
    registrationOpenDate: '2024-07-20T00:00:00Z',
    registrationCloseDate: '2024-08-25T23:59:59Z',
    location: 'Online',
    status: 'Upcoming'
  },
];

const API_DELAY = 300;
const generateId = () => `hack${Date.now()}${Math.floor(Math.random() * 100)}`;

export const getHackathons = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sort by start date, most recent first or upcoming first
      const sortedHackathons = [...hackathons].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      resolve(sortedHackathons);
    }, API_DELAY);
  });
};

export const getHackathonById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const hackathon = hackathons.find(h => h.id === id);
      if (hackathon) {
        resolve({ ...hackathon });
      } else {
        reject(new Error('Hackathon not found'));
      }
    }, API_DELAY);
  });
};

export const addHackathon = async (hackathonData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!hackathonData.name || !hackathonData.theme || !hackathonData.startDate || !hackathonData.endDate) {
        return reject(new Error('Name, Theme, Start Date, and End Date are required.'));
      }
      const newHackathon = { 
        id: generateId(), 
        status: 'Upcoming', // Default status
        ...hackathonData 
      };
      hackathons.push(newHackathon);
      resolve({ ...newHackathon });
    }, API_DELAY);
  });
};

export const updateHackathon = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = hackathons.findIndex(h => h.id === id);
      if (index !== -1) {
        if (!updatedData.name || !updatedData.theme || !updatedData.startDate || !updatedData.endDate) {
            return reject(new Error('Name, Theme, Start Date, and End Date cannot be empty.'));
        }
        hackathons[index] = { ...hackathons[index], ...updatedData };
        resolve({ ...hackathons[index] });
      } else {
        reject(new Error('Hackathon not found for update.'));
      }
    }, API_DELAY);
  });
};

export const deleteHackathon = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = hackathons.length;
      hackathons = hackathons.filter(h => h.id !== id);
      if (hackathons.length < initialLength) {
        resolve({ message: 'Hackathon deleted successfully.' });
      } else {
        reject(new Error('Hackathon not found for deletion.'));
      }
    }, API_DELAY);
  });
};