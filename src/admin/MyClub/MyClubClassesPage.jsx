// src/admin/pages/MyClub/MyClubClassesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
    getClassSchedulesByClub, 
    addClassSchedule, 
    updateClassSchedule, 
    deleteClassSchedule 
} from '@/admin/services/classScheduleService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaCalendarAlt } from 'react-icons/fa';

const MyClubClassesPage = () => {
  const { user } = useAuth();
  const clubIdForLeader = user?.clubId;

  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    day: '',
    time: '',
    location: '',
    instructor: '',
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    if (clubIdForLeader) {
      fetchClubClassSchedules();
    } else if (user) {
      setError("Club ID not associated with your account. Cannot fetch class schedules.");
    }
  }, [clubIdForLeader, user]);

  const fetchClubClassSchedules = async () => {
    if (!clubIdForLeader) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getClassSchedulesByClub(clubIdForLeader);
      setSchedules(data);
    } catch (err) {
      setError(`Failed to fetch class schedules for your club.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setCurrentSchedule(null);
    setFormData({ topic: '', day: '', time: '', location: '', instructor: '' });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (schedule) => {
    setCurrentSchedule(schedule);
    setFormData({ 
        topic: schedule.topic, 
        day: schedule.day, 
        time: schedule.time, 
        location: schedule.location || '',
        instructor: schedule.instructor || ''
    });
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSchedule(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.day.trim() || !formData.time.trim()) {
        setError("Topic, Day, and Time are required fields.");
        return;
    }
    setIsLoading(true);
    setError('');
    const schedulePayload = { ...formData, clubId: clubIdForLeader };
    try {
      if (currentSchedule) {
        await updateClassSchedule(currentSchedule.id, schedulePayload);
      } else {
        await addClassSchedule(schedulePayload);
      }
      fetchClubClassSchedules();
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${currentSchedule ? 'update' : 'add'} class schedule.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this class schedule?')) {
      setIsLoading(true);
      setError('');
      try {
        await deleteClassSchedule(scheduleId);
        fetchClubClassSchedules();
      } catch (err) {
        setError('Failed to delete class schedule.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (!user) return <p>Loading user information...</p>;
  if (user.role === 'CLUB_LEADER' && !clubIdForLeader) {
    return <div className="text-red-500 font-semibold p-4">Error: No Club ID associated with your account.</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-600"/> My Club Classes
        </h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150"
        >
          <FaPlus className="mr-2" /> Add Class Schedule
        </button>
      </div>

      {isLoading && !isModalOpen && <p className="text-center text-gray-600 py-4">Loading class schedules...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      {!isLoading && !error && schedules.length === 0 && (
        <p className="text-center text-gray-500 py-4">No class schedules found for your club. Add one to get started!</p>
      )}

      {!isLoading && schedules.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Topic</th>
                <th className="py-3 px-6 text-left">Day</th>
                <th className="py-3 px-6 text-left">Time</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Instructor</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{schedule.topic}</td>
                  <td className="py-3 px-6 text-left">{schedule.day}</td>
                  <td className="py-3 px-6 text-left">{schedule.time}</td>
                  <td className="py-3 px-6 text-left">{schedule.location || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{schedule.instructor || 'N/A'}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => openEditModal(schedule)}
                      className="text-blue-500 hover:text-blue-700 mr-4 transition duration-150"
                      aria-label="Edit Schedule"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-500 hover:text-red-700 transition duration-150"
                      aria-label="Delete Schedule"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Class Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentSchedule ? 'Edit Class Schedule' : 'Add New Class Schedule'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-3 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic / Subject</label>
                <input
                  type="text" name="topic" id="topic" value={formData.topic} onChange={handleInputChange} required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day of Week</label>
                  <select
                    name="day" id="day" value={formData.day} onChange={handleInputChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="text" name="time" id="time" value={formData.time} onChange={handleInputChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 2:00 PM - 3:00 PM"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location / Room / Link</label>
                <input
                  type="text" name="location" id="location" value={formData.location} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Room A101 or Online Meet URL"
                />
              </div>
              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">Instructor (Optional)</label>
                <input
                  type="text" name="instructor" id="instructor" value={formData.instructor} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" > Cancel </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center" >
                  {isLoading ? ( <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : <FaSave className="mr-2" />}
                  {currentSchedule ? 'Save Changes' : 'Add Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubClassesPage;