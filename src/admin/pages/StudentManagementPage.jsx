// src/admin/pages/StudentManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { getStudents, addStudent, updateStudent, deleteStudent } from '../students/studentService'; // Corrected path
import { getClubs as getClubOptions } from '../services/clubService'; // For club dropdown
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // To store all students initially
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', clubId: '', year: '', branch: '',
  });
  const [clubOptions, setClubOptions] = useState([]);
  
  const [searchParams] = useSearchParams(); // Get query parameters
  const filterClubId = searchParams.get('clubId'); // Get clubId from URL

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const [studentsData, clubsData] = await Promise.all([
                getStudents(),
                getClubOptions()
            ]);
            setAllStudents(studentsData); // Store all students
            setClubOptions(clubsData);

            if (filterClubId) {
                setStudents(studentsData.filter(s => s.clubId === filterClubId));
            } else {
                setStudents(studentsData);
            }
        } catch (err) {
            setError('Failed to fetch initial data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [filterClubId]); // Re-fetch or re-filter when filterClubId changes

  const fetchStudentsAndFilter = async () => { // Renamed to avoid conflict
    setIsLoading(true);
    setError('');
    try {
      const data = await getStudents();
      setAllStudents(data); // Update all students cache
      if (filterClubId) {
        setStudents(data.filter(s => s.clubId === filterClubId));
      } else {
        setStudents(data);
      }
    } catch (err) {
      setError('Failed to fetch students.');
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
    setFormData({ name: '', email: '', clubId: filterClubId || '', year: '', branch: '' }); // Pre-fill clubId if filtered
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (student) => {
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
    setIsLoading(true);
    setError('');
    try {
      if (currentStudent) {
        await updateStudent(currentStudent.id, formData);
      } else {
        await addStudent(formData);
      }
      fetchStudentsAndFilter(); // Use the combined fetch and filter
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${currentStudent ? 'update' : 'add'} student.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setIsLoading(true);
      setError('');
      try {
        await deleteStudent(studentId);
        fetchStudentsAndFilter(); // Use the combined fetch and filter
      } catch (err) {
        setError('Failed to delete student.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getClubName = (clubId) => {
    const club = clubOptions.find(c => c.id === clubId);
    return club ? club.name : 'N/A';
  };

  const filteredClubName = filterClubId ? getClubName(filterClubId) : null;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
            Student Management {filteredClubName && <span className="text-xl text-gray-600">- {filteredClubName}</span>}
        </h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150"
        >
          <FaPlus className="mr-2" /> Add Student
        </button>
      </div>

      {isLoading && !isModalOpen && <p className="text-center text-gray-600">Loading students...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {!isLoading && !error && students.length === 0 && (
        <p className="text-center text-gray-500">{filterClubId ? `No students found for ${filteredClubName}.` : "No students found."}</p>
      )}

      {!isLoading && students.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            {/* Table Head remains the same */}
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Club</th>
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
                  <td className="py-3 px-6 text-left">{getClubName(student.clubId)}</td>
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
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-500 hover:text-red-700 transition duration-150"
                      aria-label="Delete"
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

      {/* Modal for Add/Edit Student (Club dropdown uses clubOptions) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name, Email, Year, Branch inputs remain the same */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="clubId" className="block text-sm font-medium text-gray-700">Club</label>
                <select
                    name="clubId"
                    id="clubId"
                    value={formData.clubId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Select Club (Optional)</option>
                    {clubOptions.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                </select>
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
                {/* Buttons remain the same */}
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

export default StudentManagementPage;