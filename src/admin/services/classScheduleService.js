// src/admin/services/classScheduleService.js

let classSchedules = [
  { id: 'cs1', clubId: 'club_alpha', topic: 'Introduction to Python', day: 'Monday', time: '4:00 PM - 5:00 PM', location: 'Room A101', instructor: 'Dr. AI Expert' },
  { id: 'cs2', clubId: 'club_alpha', topic: 'Advanced Algorithms', day: 'Wednesday', time: '3:00 PM - 4:30 PM', location: 'Lab C2', instructor: 'Prof. Algo' },
  { id: 'cs3', clubId: 'club_beta', topic: 'React Basics', day: 'Tuesday', time: '5:00 PM - 6:00 PM', location: 'Online', instructor: 'Mr. Web Dev' },
  { id: 'cs4', clubId: 'club_beta', topic: 'Node.js Backend', day: 'Thursday', time: '4:00 PM - 5:30 PM', location: 'Room B203', instructor: 'Ms. Server Side' },
];

const API_DELAY = 300;
const generateId = () => `cs${Date.now()}${Math.floor(Math.random() * 100)}`;

export const getClassSchedulesByClub = async (clubId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const schedules = classSchedules.filter(cs => cs.clubId === clubId);
      resolve([...schedules]);
    }, API_DELAY);
  });
};

export const addClassSchedule = async (scheduleData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!scheduleData.clubId || !scheduleData.topic || !scheduleData.day || !scheduleData.time) {
        return reject(new Error('Club ID, Topic, Day, and Time are required.'));
      }
      const newSchedule = { id: generateId(), ...scheduleData };
      classSchedules.push(newSchedule);
      resolve({ ...newSchedule });
    }, API_DELAY);
  });
};

export const updateClassSchedule = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = classSchedules.findIndex(cs => cs.id === id);
      if (index !== -1) {
        if (!updatedData.topic || !updatedData.day || !updatedData.time) {
            return reject(new Error('Topic, Day, and Time cannot be empty.'));
        }
        classSchedules[index] = { ...classSchedules[index], ...updatedData };
        resolve({ ...classSchedules[index] });
      } else {
        reject(new Error('Class schedule not found for update.'));
      }
    }, API_DELAY);
  });
};

export const deleteClassSchedule = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = classSchedules.length;
      classSchedules = classSchedules.filter(cs => cs.id !== id);
      if (classSchedules.length < initialLength) {
        resolve({ message: 'Class schedule deleted successfully.' });
      } else {
        reject(new Error('Class schedule not found for deletion.'));
      }
    }, API_DELAY);
  });
};

// Optional: If Super Admin needs to see all class schedules
export const getAllClassSchedules = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...classSchedules]);
      }, API_DELAY);
    });
  };