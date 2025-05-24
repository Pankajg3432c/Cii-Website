// src/admin/pages/MyClub/MyClubAttendancePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentsByClub } from '@/admin/students/studentService';
import { getClassSchedulesByClub } from '@/admin/services/classScheduleService';
import { getAttendanceRecord, saveAttendanceRecord, getAttendanceByClub, deleteAttendanceRecordById } from '@/admin/services/attendanceService';
import { FaCalendarCheck, FaPlus, FaSave, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

const MyClubAttendancePage = () => {
  const { user } = useAuth();
  const clubIdForLeader = user?.clubId;

  const [students, setStudents] = useState([]);
  const [classSchedules, setClassSchedules] = useState([]);
  
  const [selectedClassScheduleId, setSelectedClassScheduleId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  
  const [studentAttendances, setStudentAttendances] = useState({}); // { studentId: status }
  const [currentAttendanceRecordId, setCurrentAttendanceRecordId] = useState(null); // To know if we are updating

  const [pastRecords, setPastRecords] = useState([]);
  const [isViewingRecord, setIsViewingRecord] = useState(false);
  const [viewedRecordDetails, setViewedRecordDetails] = useState(null);


  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch initial data: students and class schedules for the club
  useEffect(() => {
    if (clubIdForLeader) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [studentsData, schedulesData, pastAttendanceData] = await Promise.all([
            getStudentsByClub(clubIdForLeader),
            getClassSchedulesByClub(clubIdForLeader),
            getAttendanceByClub(clubIdForLeader)
          ]);
          setStudents(studentsData);
          setClassSchedules(schedulesData);
          if (schedulesData.length > 0 && !selectedClassScheduleId) {
            setSelectedClassScheduleId(schedulesData[0].id); // Select first class by default
          }
          setPastRecords(pastAttendanceData);
        } catch (err) {
          setError("Failed to load initial data for attendance.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else if (user) {
      setError("Club ID not associated with your account.");
    }
  }, [clubIdForLeader, user]);

  // Fetch attendance data when selected class or date changes
  const loadAttendanceForSelection = useCallback(async () => {
    if (!clubIdForLeader || !selectedClassScheduleId || !selectedDate) {
      setStudentAttendances({}); // Clear previous attendance
      setCurrentAttendanceRecordId(null);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const record = await getAttendanceRecord(clubIdForLeader, selectedClassScheduleId, selectedDate);
      if (record) {
        const newAttendances = {};
        record.studentAttendances.forEach(sa => {
          newAttendances[sa.studentId] = sa.status;
        });
        setStudentAttendances(newAttendances);
        setCurrentAttendanceRecordId(record.id);
      } else {
        // Default all to 'present' or 'absent' if no record found
        const defaultAttendances = {};
        students.forEach(student => {
          defaultAttendances[student.id] = 'present'; // Or 'absent' or ''
        });
        setStudentAttendances(defaultAttendances);
        setCurrentAttendanceRecordId(null);
      }
    } catch (err) {
      setError("Failed to load attendance data for the selected class/date.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [clubIdForLeader, selectedClassScheduleId, selectedDate, students]); // Added students as dependency

  useEffect(() => {
    loadAttendanceForSelection();
  }, [loadAttendanceForSelection]);


  const handleStatusChange = (studentId, status) => {
    setStudentAttendances(prev => ({ ...prev, [studentId]: status }));
    setSuccessMessage(''); // Clear success message on change
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!selectedClassScheduleId || !selectedDate) {
      setError("Please select a class and date.");
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    const formattedAttendances = Object.entries(studentAttendances).map(([studentId, status]) => ({
      studentId,
      status: status || 'absent', // Default to absent if no status explicitly set
    }));

    const recordData = {
      clubId: clubIdForLeader,
      classScheduleId: selectedClassScheduleId,
      date: selectedDate,
      studentAttendances: formattedAttendances,
    };

    try {
      await saveAttendanceRecord(recordData);
      setSuccessMessage(`Attendance for ${selectedDate} saved successfully!`);
      setCurrentAttendanceRecordId(recordData.id || currentAttendanceRecordId); // Update if a new record was created
      // Refresh past records
      const updatedPastRecords = await getAttendanceByClub(clubIdForLeader);
      setPastRecords(updatedPastRecords);
    } catch (err) {
      setError(err.message || "Failed to save attendance.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewRecord = (record) => {
    setViewedRecordDetails(record);
    setIsViewingRecord(true);
  };
  
  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this entire attendance record?')) {
        setIsLoading(true);
        try {
            await deleteAttendanceRecordById(recordId);
            const updatedPastRecords = await getAttendanceByClub(clubIdForLeader);
            setPastRecords(updatedPastRecords);
            // If the deleted record was the one currently being edited/viewed for its date/class
            if (viewedRecordDetails?.id === recordId) {
              setIsViewingRecord(false);
              setViewedRecordDetails(null);
            }
            if (currentAttendanceRecordId === recordId) {
              loadAttendanceForSelection(); // Reload/reset current selection
            }
            setSuccessMessage("Attendance record deleted.");
        } catch (err) {
            setError("Failed to delete attendance record.");
        } finally {
            setIsLoading(false);
        }
    }
  };


  const getStudentName = (studentId) => students.find(s => s.id === studentId)?.name || 'Unknown Student';
  const getClassTopic = (scheduleId) => classSchedules.find(cs => cs.id === scheduleId)?.topic || 'Unknown Class';


  if (!user) return <p>Loading user information...</p>;
  if (user.role === 'CLUB_LEADER' && !clubIdForLeader) {
    return <div className="text-red-500 font-semibold p-4">Error: No Club ID associated.</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaCalendarCheck className="mr-3 text-green-600"/> My Club Attendance
      </h1>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{successMessage}</p>}

      {/* Section for Marking New/Editing Today's Attendance */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Mark Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="classSchedule" className="block text-sm font-medium text-gray-700">Select Class</label>
            <select
              id="classSchedule"
              value={selectedClassScheduleId}
              onChange={(e) => { setSelectedClassScheduleId(e.target.value); setSuccessMessage(''); }}
              disabled={isLoading || classSchedules.length === 0}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {classSchedules.length === 0 && <option value="">No classes scheduled for your club</option>}
              {classSchedules.map(cs => (
                <option key={cs.id} value={cs.id}>{cs.topic} ({cs.day} {cs.time})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="attendanceDate" className="block text-sm font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              id="attendanceDate"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSuccessMessage('');}}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {isLoading && <p className="text-gray-600">Loading attendance data...</p>}
        
        {!isLoading && selectedClassScheduleId && students.length > 0 && (
          <form onSubmit={handleSubmitAttendance}>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2">
              {students.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                  <span className="text-gray-700">{student.name}</span>
                  <div className="flex space-x-2">
                    {['present', 'absent', 'excused'].map(status => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => handleStatusChange(student.id, status)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
                          ${studentAttendances[student.id] === status 
                            ? (status === 'present' ? 'bg-green-500 text-white' : status === 'absent' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white')
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || students.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-150 disabled:opacity-50"
            >
              {isSubmitting ? ( <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>) : <FaSave className="mr-2" />}
              Save Attendance
            </button>
          </form>
        )}
         {!isLoading && selectedClassScheduleId && students.length === 0 && (
            <p className="text-center text-gray-500 py-4">No students found in your club to mark attendance for.</p>
        )}
      </div>

      {/* Section for Past Attendance Records */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Attendance Records</h2>
        {isLoading && pastRecords.length === 0 && <p>Loading past records...</p>}
        {!isLoading && pastRecords.length === 0 && <p className="text-gray-500">No past attendance records found for your club.</p>}
        {pastRecords.length > 0 && (
          <ul className="space-y-2">
            {pastRecords.map(record => (
              <li key={record.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50">
                <div>
                  <span className="font-medium">{getClassTopic(record.classScheduleId)}</span>
                  <span className="text-sm text-gray-600 ml-2">on {new Date(record.date + 'T00:00:00').toLocaleDateString()}</span>
                </div>
                <div>
                <button
                    onClick={() => handleViewRecord(record)}
                    className="text-blue-500 hover:text-blue-700 mr-3 p-1"
                    title="View Details"
                >
                    <FaEye size={16} />
                </button>
                <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Record"
                >
                    <FaTrash size={16} />
                </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Viewing Record Details */}
      {isViewingRecord && viewedRecordDetails && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    Attendance for {getClassTopic(viewedRecordDetails.classScheduleId)} on {new Date(viewedRecordDetails.date + 'T00:00:00').toLocaleDateString()}
                </h2>
                <button onClick={() => setIsViewingRecord(false)} className="text-gray-500 hover:text-gray-700"><FaTimes size={20}/></button>
            </div>
            <ul className="space-y-1">
                {viewedRecordDetails.studentAttendances.map(sa => (
                    <li key={sa.studentId} className="flex justify-between text-sm p-1">
                        <span>{getStudentName(sa.studentId)}:</span>
                        <span className={`font-medium ${
                            sa.status === 'present' ? 'text-green-600' :
                            sa.status === 'absent' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                            {sa.status.charAt(0).toUpperCase() + sa.status.slice(1)}
                        </span>
                    </li>
                ))}
            </ul>
          </div>
         </div>
      )}

    </div>
  );
};

export default MyClubAttendancePage;