// src/admin/services/studentService.js

// In-memory store for students (simulates a database)
let students = [
  { id: 's1', name: 'Alice Wonderland', email: 'alice@example.com', clubId: 'club_alpha', year: '2nd', branch: 'CSE' },
  { id: 's2', name: 'Bob The Builder', email: 'bob@example.com', clubId: 'club_beta', year: '3rd', branch: 'ECE' },
  { id: 's3', name: 'Charlie Brown', email: 'charlie@example.com', clubId: 'club_alpha', year: '1st', branch: 'ME' },
];

// Simulate API delay
const API_DELAY = 500;

const generateId = () => `s${Date.now()}${Math.floor(Math.random() * 100)}`;

export const getStudents = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...students]); // Return a copy
    }, API_DELAY);
  });
};

export const getStudentById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = students.find(s => s.id === id);
      if (student) {
        resolve({ ...student }); // Return a copy
      } else {
        reject(new Error('Student not found'));
      }
    }, API_DELAY);
  });
};

export const addStudent = async (studentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStudent = { id: generateId(), ...studentData };
      students.push(newStudent);
      resolve({ ...newStudent }); // Return a copy
    }, API_DELAY);
  });
};

export const updateStudent = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = students.findIndex(s => s.id === id);
      if (index !== -1) {
        students[index] = { ...students[index], ...updatedData };
        resolve({ ...students[index] }); // Return a copy
      } else {
        reject(new Error('Student not found for update'));
      }
    }, API_DELAY);
  });
};

export const deleteStudent = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = students.length;
      students = students.filter(s => s.id !== id);
      if (students.length < initialLength) {
        resolve({ message: 'Student deleted successfully' });
      } else {
        reject(new Error('Student not found for deletion'));
      }
    }, API_DELAY);
  });
};

// For club leaders to get students of their specific club
export const getStudentsByClub = async (clubId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clubStudents = students.filter(s => s.clubId === clubId);
        resolve([...clubStudents]); // Return a copy
      }, API_DELAY);
    });
  };