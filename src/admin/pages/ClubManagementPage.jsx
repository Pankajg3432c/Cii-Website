// src/admin/pages/ClubManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { getClubs, addClub, updateClub, deleteClub } from '../services/clubService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUsers } from 'react-icons/fa'; // Added FaUsers

const ClubManagementPage = () => {
  // ... (keep all existing useState, useEffect, and handler functions:
  // clubs, isLoading, error, isModalOpen, currentClub, formData,
  // fetchClubs, handleInputChange, openAddModal, openEditModal, closeModal, handleSubmit, handleDelete
  // ) ...

  // Ensure all existing state and functions are here
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClub, setCurrentClub] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leaderEmail: '',
  });

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getClubs();
      setClubs(data);
    } catch (err) {
      setError('Failed to fetch clubs.');
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
    setCurrentClub(null);
    setFormData({ name: '', description: '', leaderEmail: '' });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (club) => {
    setCurrentClub(club);
    setFormData({ 
        name: club.name, 
        description: club.description, 
        leaderEmail: club.leaderEmail || '' 
    });
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentClub(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
        setError("Club Name and Description cannot be empty.");
        return;
    }
    setIsLoading(true);
    setError(''); 
    try {
      if (currentClub) {
        await updateClub(currentClub.id, formData);
      } else {
        await addClub(formData);
      }
      fetchClubs();
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${currentClub ? 'update' : 'add'} club.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (clubId) => {
    if (window.confirm('Are you sure you want to delete this club? This might affect associated students and projects.')) {
      setIsLoading(true);
      setError('');
      try {
        await deleteClub(clubId);
        fetchClubs();
      } catch (err) {
        setError('Failed to delete club.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Club Management</h1>
        <button
          onClick={openAddModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150"
        >
          <FaPlus className="mr-2" /> Add Club
        </button>
      </div>

      {/* ... (isLoading, error, no clubs messages remain the same) ... */}
      {isLoading && !isModalOpen && <p className="text-center text-gray-600 py-4">Loading clubs...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      {!isLoading && !error && clubs.length === 0 && (
        <p className="text-center text-gray-500 py-4">No clubs found. Add one to get started!</p>
      )}


      {!isLoading && clubs.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Leader Email</th>
                <th className="py-3 px-6 text-center">Students</th> {/* New Column */}
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {clubs.map((club) => (
                <tr key={club.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{club.name}</td>
                  <td className="py-3 px-6 text-left">{club.description}</td>
                  <td className="py-3 px-6 text-left">{club.leaderEmail || 'N/A'}</td>
                  <td className="py-3 px-6 text-center">
                    <Link
                      to={`/admin/students?clubId=${club.id}`} // Link to students page with clubId query
                      className="text-indigo-600 hover:text-indigo-800 transition duration-150"
                      title="View Students"
                    >
                      <FaUsers size={18} />
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => openEditModal(club)}
                      className="text-blue-500 hover:text-blue-700 mr-4 transition duration-150"
                      aria-label="Edit Club"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(club.id)}
                      className="text-red-500 hover:text-red-700 transition duration-150"
                      aria-label="Delete Club"
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

      {/* Modal for Add/Edit Club (remains the same) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentClub ? 'Edit Club' : 'Add New Club'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-3 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Club Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="leaderEmail" className="block text-sm font-medium text-gray-700">Leader Email (Optional)</label>
                <input
                  type="email"
                  name="leaderEmail"
                  id="leaderEmail"
                  value={formData.leaderEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="leader@example.com"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                >
                  {isLoading && !currentClub && ( 
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  )}
                  {isLoading && currentClub && <FaSave className="mr-2" />}
                  {!isLoading && <FaSave className="mr-2" />}
                  {currentClub ? 'Save Changes' : 'Add Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagementPage;