// src/admin/pages/MyClub/MyClubStudentsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Using alias
import { getStudentsByClub, addStudent, updateStudent /*, deleteStudent */ } from '../students/studentService'; // Using alias
// Note: Club leader might not have delete permission, or it might be a "request removal"
import { FaPlus, FaEdit, FaTimes, FaSave } from 'react-icons/fa';

const MyClubStudentsPage = () => {
  const { user } = useAuth();
  const clubIdForLeader = user?.clubId; // Get the leader's clubId

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clubId: clubIdForLeader || '', // Pre-fill clubId for new students
    year: '',
    branch: '',
  });

  useEffect(() => {
    if (clubIdForLeader) {
      fetchClubStudents();
    } else if(user) { // User is loaded but no clubId (should ideally not happen for club leader role)
        setError("You are not assigned to a club. Please contact the administrator.");
    }
    // If no user, ProtectedRoute should handle it.
  }, [clubIdForLeader, user]); // Depend on clubIdForLeader and user to ensure they are loaded

  const fetchClubStudents = async () => {
    if (!clubIdForLeader) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getStudentsByClub(clubIdForLeader);
      setStudents(data);
    } catch (err) {
      setError(`Failed to fetch students for your club.`);
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
    setCurrentStudent(null);
    setFormData({ name: '', email: '', clubId: clubIdForLeader, year: '', branch: '' }); // Ensure clubId is set
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (student) => {
    // Ensure club leader can only edit students from their own club
    if (student.clubId !== clubIdForLeader) {
        setError("You can only edit students within your own club.");
        return;
    }
    setCurrentStudent(student);
    setFormData({ 
        name: student.name, 
        email: student.email, 
        clubId: student.clubId, 
        year: student.year,
        branch: student.branch
    });
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure clubId in form data matches leader's club, especially for add
    if (formData.clubId !== clubIdForLeader) {
        setError("Cannot assign student to a different club.");
        return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (currentStudent) {
        await updateStudent(currentStudent.id, formData);
      } else {
        await addStudent(formData); // studentService.addStudent already uses formData.clubId
      }
      fetchClubStudents();
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${currentStudent ? 'update' : 'add'} student.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Club leaders typically might not delete students directly, or this action could be different.
  // For now, let's disable it for club leaders in this example.
  // const handleDelete = async (studentId) => { ... };


  if (!user) { // Should be handled by ProtectedRoute, but good for robustness
    return <p>Loading user data...</p>;
  }
  if (user.role === 'CLUB_LEADER' && !clubIdForLeader) {
    return <div className="text-red-500 font-semibold p-4">Error: Club ID not found for your account. Please contact an administrator.</div>;
  }


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Club Students</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150"
        >
          <FaPlus className="mr-2" /> Add Student to My Club
        </button>
      </div>

      {isLoading && !isModalOpen && <p className="text-center text-gray-600">Loading students...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {!isLoading && !error && students.length === 0 && (
        <p className="text-center text-gray-500">No students found in your club.</p>
      )}

      {!isLoading && students.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Year</th>
                <th className="py-3 px-6 text-left">Branch</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{student.name}</td>
                  <td className="py-3 px-6 text-left">{student.email}</td>
                  <td className="py-3 px-6 text-left">{student.year}</td>
                  <td className="py-3 px-6 text-left">{student.branch}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => openEditModal(student)}
                      className="text-blue-500 hover:text-blue-700 mr-3 transition duration-150"
                      aria-label="Edit"
                    >
                      <FaEdit size={18} />
                    </button>
                    {/* Club leader delete might be disabled or different logic */}
                    {/* 
                    <button
                      onClick={() => handleDelete(student.id)} // If implemented
                      className="text-red-500 hover:text-red-700 transition duration-150"
                      aria-label="Delete"
                    >
                      <FaTrash size={18} />
                    </button> 
                    */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentStudent ? 'Edit Student' : 'Add Student to My Club'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name, Email, Year, Branch inputs - clubId is hidden or read-only */}
              <input type="hidden" name="clubId" value={formData.clubId} />
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <select name="year" id="year" value={formData.year} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
              </div>
               <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                <input type="text" name="branch" id="branch" value={formData.branch} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., CSE, ECE, ME" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" > Cancel </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center" >
                  {isLoading ? ( <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : <FaSave className="mr-2" />}
                  {currentStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubStudentsPage;