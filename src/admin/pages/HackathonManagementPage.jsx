// src/admin/pages/HackathonManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { 
    getHackathons, 
    addHackathon, 
    updateHackathon, 
    deleteHackathon 
} from '@/admin/services/hackathonService'; // Using alias
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaTrophy } from 'react-icons/fa';

const hackathonStatuses = ["Upcoming", "Active", "Completed", "Cancelled"];

const HackathonManagementPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHackathon, setCurrentHackathon] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationOpenDate: '',
    registrationCloseDate: '',
    location: '',
    status: 'Upcoming',
  });

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getHackathons();
      setHackathons(data);
    } catch (err) {
      setError('Failed to fetch hackathons.');
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
    setCurrentHackathon(null);
    setFormData({ 
        name: '', theme: '', description: '', 
        startDate: '', endDate: '', 
        registrationOpenDate: '', registrationCloseDate: '',
        location: '', status: 'Upcoming' 
    });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (hackathon) => {
    setCurrentHackathon(hackathon);
    setFormData({ 
        name: hackathon.name, 
        theme: hackathon.theme, 
        description: hackathon.description || '',
        startDate: hackathon.startDate ? hackathon.startDate.split('T')[0] : '', // Handle datetime string
        endDate: hackathon.endDate ? hackathon.endDate.split('T')[0] : '',
        registrationOpenDate: hackathon.registrationOpenDate ? hackathon.registrationOpenDate.split('T')[0] : '',
        registrationCloseDate: hackathon.registrationCloseDate ? hackathon.registrationCloseDate.split('T')[0] : '',
        location: hackathon.location || '',
        status: hackathon.status || 'Upcoming'
    });
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentHackathon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.theme.trim() || !formData.startDate || !formData.endDate) {
        setError("Name, Theme, Start Date, and End Date are required.");
        return;
    }
    // Basic date validation
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError("End Date cannot be before Start Date.");
        return;
    }
    if (formData.registrationCloseDate && new Date(formData.registrationCloseDate) < new Date(formData.registrationOpenDate)) {
        setError("Registration Close Date cannot be before Registration Open Date.");
        return;
    }
    if (formData.registrationOpenDate && new Date(formData.startDate) < new Date(formData.registrationOpenDate)) {
        setError("Start Date cannot be before Registration Open Date.");
        return;
    }


    setIsLoading(true);
    setError('');
    // Ensure dates are sent in ISO format if time is included, or just YYYY-MM-DD
    const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        registrationOpenDate: formData.registrationOpenDate ? new Date(formData.registrationOpenDate).toISOString() : null,
        registrationCloseDate: formData.registrationCloseDate ? new Date(formData.registrationCloseDate).toISOString() : null,
    };

    try {
      if (currentHackathon) {
        await updateHackathon(currentHackathon.id, payload);
      } else {
        await addHackathon(payload);
      }
      fetchHackathons();
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${currentHackathon ? 'update' : 'add'} hackathon.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (hackathonId) => {
    if (window.confirm('Are you sure you want to delete this hackathon?')) {
      setIsLoading(true);
      setError('');
      try {
        await deleteHackathon(hackathonId);
        fetchHackathons();
      } catch (err) {
        setError('Failed to delete hackathon.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-CA'); // YYYY-MM-DD for input compatibility
  };


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaTrophy className="mr-3 text-orange-500"/> Hackathon Management
        </h1>
        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150"
        >
          <FaPlus className="mr-2" /> Add Hackathon
        </button>
      </div>

      {isLoading && !isModalOpen && <p className="text-center text-gray-600 py-4">Loading hackathons...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      {!isLoading && !error && hackathons.length === 0 && (
        <p className="text-center text-gray-500 py-4">No hackathons found.</p>
      )}

      {!isLoading && hackathons.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Theme</th>
                <th className="py-3 px-6 text-left">Dates (Start - End)</th>
                <th className="py-3 px-6 text-left">Registration (Open - Close)</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {hackathons.map((hackathon) => (
                <tr key={hackathon.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{hackathon.name}</td>
                  <td className="py-3 px-6 text-left">{hackathon.theme}</td>
                  <td className="py-3 px-6 text-left">{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</td>
                  <td className="py-3 px-6 text-left">{formatDate(hackathon.registrationOpenDate)} - {formatDate(hackathon.registrationCloseDate)}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        hackathon.status === 'Upcoming' ? 'bg-blue-200 text-blue-800' :
                        hackathon.status === 'Active' ? 'bg-green-200 text-green-800' :
                        hackathon.status === 'Completed' ? 'bg-gray-200 text-gray-800' :
                        hackathon.status === 'Cancelled' ? 'bg-red-200 text-red-800' : ''
                    }`}>
                        {hackathon.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => openEditModal(hackathon)}
                      className="text-blue-500 hover:text-blue-700 mr-4 transition duration-150 p-1"
                      aria-label="Edit Hackathon"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(hackathon.id)}
                      className="text-red-500 hover:text-red-700 transition duration-150 p-1"
                      aria-label="Delete Hackathon"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Hackathon */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"> {/* Increased max-w-xl */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentHackathon ? 'Edit Hackathon' : 'Add New Hackathon'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hackathon Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                <input type="text" name="theme" id="theme" value={formData.theme} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" rows="3" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="registrationOpenDate" className="block text-sm font-medium text-gray-700">Registration Open Date</label>
                  <input type="date" name="registrationOpenDate" id="registrationOpenDate" value={formData.registrationOpenDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                  <label htmlFor="registrationCloseDate" className="block text-sm font-medium text-gray-700">Registration Close Date</label>
                  <input type="date" name="registrationCloseDate" id="registrationCloseDate" value={formData.registrationCloseDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., GITS Auditorium, Online"/>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {hackathonStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" > Cancel </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 flex items-center" >
                  {isLoading ? ( <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : <FaSave className="mr-2" />}
                  {currentHackathon ? 'Save Changes' : 'Add Hackathon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonManagementPage;