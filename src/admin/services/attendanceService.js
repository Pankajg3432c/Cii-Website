// src/admin/services/attendanceService.js

// Stores attendance records.
// Each record: { id, clubId, classScheduleId, date (YYYY-MM-DD), studentAttendances: [{ studentId, status: 'present' | 'absent' | 'excused' }] }
let attendanceRecords = [
    { 
        id: 'ar1', 
        clubId: 'club_alpha', 
        classScheduleId: 'cs1', // Corresponds to 'Introduction to Python'
        date: '2024-05-20', 
        studentAttendances: [
            { studentId: 's1', status: 'present' }, // Alice
            { studentId: 's3', status: 'absent' },  // Charlie
        ] 
    },
    { 
        id: 'ar2', 
        clubId: 'club_beta', 
        classScheduleId: 'cs3', // Corresponds to 'React Basics'
        date: '2024-05-21', 
        studentAttendances: [
            { studentId: 's2', status: 'present' }, // Bob
        ] 
    },
];

const API_DELAY = 300;
const generateId = () => `ar${Date.now()}${Math.floor(Math.random() * 100)}`;

// Get all attendance records for a specific club
export const getAttendanceByClub = async (clubId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = attendanceRecords.filter(ar => ar.clubId === clubId)
                                      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date
      resolve([...records]);
    }, API_DELAY);
  });
};

// Get a specific attendance record (e.g., for a specific class on a specific date)
export const getAttendanceRecord = async (clubId, classScheduleId, date) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const record = attendanceRecords.find(
                ar => ar.clubId === clubId && ar.classScheduleId === classScheduleId && ar.date === date
            );
            resolve(record ? { ...record } : null); // Return a copy or null
        }, API_DELAY);
    });
};

// Add or update an attendance record
// If a record for the same club, classSchedule, and date exists, it updates it. Otherwise, adds new.
export const saveAttendanceRecord = async (recordData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!recordData.clubId || !recordData.classScheduleId || !recordData.date || !recordData.studentAttendances) {
        return reject(new Error('Club ID, Class Schedule ID, Date, and Student Attendances are required.'));
      }

      const existingRecordIndex = attendanceRecords.findIndex(
        ar => ar.clubId === recordData.clubId && 
              ar.classScheduleId === recordData.classScheduleId && 
              ar.date === recordData.date
      );

      if (existingRecordIndex !== -1) {
        // Update existing record
        attendanceRecords[existingRecordIndex] = { 
            ...attendanceRecords[existingRecordIndex], 
            studentAttendances: recordData.studentAttendances,
            lastModified: new Date().toISOString()
        };
        resolve({ ...attendanceRecords[existingRecordIndex] });
      } else {
        // Add new record
        const newRecord = { id: generateId(), ...recordData, createdAt: new Date().toISOString() };
        attendanceRecords.push(newRecord);
        resolve({ ...newRecord });
      }
    }, API_DELAY);
  });
};

// Note: Deleting an entire attendance record might be an option, or editing individual student statuses.
// For now, we focus on saving/updating a full day's record.
export const deleteAttendanceRecordById = async (recordId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = attendanceRecords.length;
        attendanceRecords = attendanceRecords.filter(ar => ar.id !== recordId);
        if (attendanceRecords.length < initialLength) {
          resolve({ message: 'Attendance record deleted successfully.' });
        } else {
          reject(new Error('Attendance record not found for deletion.'));
        }
      }, API_DELAY);
    });
  };