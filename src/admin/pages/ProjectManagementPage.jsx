// src/admin/pages/ProjectManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { 
    getAllProjects, 
    addProject, 
    updateProject, 
    deleteProject 
} from '@/admin/services/projectService'; // Using alias
import { getClubs } from '@/admin/services/clubService'; // To populate club dropdown
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaTasks } from 'react-icons/fa';

const projectStatuses = ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"];

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [clubs, setClubs] = useState([]); // For club selection dropdown
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clubId: '', // Super Admin needs to select this
    status: 'Planning',
    technologies: '',
    mentor: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [projectsData, clubsData] = await Promise.all([
        getAllProjects(),
        getClubs()
      ]);
      setProjects(projectsData);
      setClubs(clubsData);
    } catch (err) {
      setError('Failed to fetch initial project data or clubs.');
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
    setCurrentProject(null);
    setFormData({ 
        name: '', description: '', clubId: clubs.length > 0 ? clubs[0].id : '', // Default to first club if available
        status: 'Planning', technologies: '', mentor: '', 
        startDate: new Date().toISOString().split('T')[0] 
    });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({ 
        name: project.name, 
        description: project.description, 
        clubId: project.clubId,
        status: project.status,
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
        mentor: project.mentor || '',
        startDate: project.startDate ? project.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.clubId) {
        setError("Project Name, Description, and assigned Club are required.");
        return;
    }
    setIsLoading(true);
    setError('');
    const projectPayload = { 
        ...formData, 
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
    };
    try {
      if (currentProject) {
        await updateProject(currentProject.id, projectPayload);
      } else {
        await addProject(projectPayload);
      }
      fetchInitialData(); // Re-fetch all projects
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${currentProject ? 'update' : 'add'} project.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setIsLoading(true);
      setError('');
      try {
        await deleteProject(projectId);
        fetchInitialData(); // Re-fetch all projects
      } catch (err) {
        setError('Failed to delete project.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getClubName = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'N/A';
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaTasks className="mr-3 text-teal-600"/> All Projects Management
        </h1>
        <button
          onClick={openAddModal}
          disabled={clubs.length === 0} // Disable if no clubs to assign to
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          title={clubs.length === 0 ? "Please add a club first" : "Add New Project"}
        >
          <FaPlus className="mr-2" /> Add Project
        </button>
      </div>
       {clubs.length === 0 && !isLoading && (
         <p className="text-center text-orange-600 bg-orange-100 p-3 rounded-md mb-4">
           No clubs found. Please add clubs in Club Management before adding projects.
         </p>
       )}

      {isLoading && !isModalOpen && <p className="text-center text-gray-600 py-4">Loading projects...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      {!isLoading && !error && projects.length === 0 && clubs.length > 0 && (
        <p className="text-center text-gray-500 py-4">No projects found.</p>
      )}

      {!isLoading && projects.length > 0 && (
         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
         <table className="min-w-full leading-normal">
           <thead>
             <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
               <th className="py-3 px-6 text-left">Project Name</th>
               <th className="py-3 px-6 text-left">Club</th>
               <th className="py-3 px-6 text-left">Description</th>
               <th className="py-3 px-6 text-left">Status</th>
               <th className="py-3 px-6 text-left">Start Date</th>
               <th className="py-3 px-6 text-center">Actions</th>
             </tr>
           </thead>
           <tbody className="text-gray-700 text-sm">
             {projects.map((project) => (
               <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-100">
                 <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{project.name}</td>
                 <td className="py-3 px-6 text-left">{getClubName(project.clubId)}</td>
                 <td className="py-3 px-6 text-left max-w-xs truncate" title={project.description}>{project.description}</td>
                 <td className="py-3 px-6 text-left">{project.status}</td>
                 <td className="py-3 px-6 text-left">{project.startDate ? new Date(project.startDate + 'T00:00:00Z').toLocaleDateString() : 'N/A'}</td>
                 <td className="py-3 px-6 text-center">
                   <button
                     onClick={() => openEditModal(project)}
                     className="text-blue-500 hover:text-blue-700 mr-4 transition duration-150 p-1"
                     aria-label="Edit Project"
                   >
                     <FaEdit size={16} />
                   </button>
                   <button
                     onClick={() => handleDelete(project.id)}
                     className="text-red-500 hover:text-red-700 transition duration-150 p-1"
                     aria-label="Delete Project"
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

      {/* Modal for Add/Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div>
                <label htmlFor="clubId" className="block text-sm font-medium text-gray-700">Assign to Club</label>
                <select name="clubId" id="clubId" value={formData.clubId} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select a Club</option>
                    {clubs.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {projectStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
              </div>
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                <input type="text" name="technologies" id="technologies" value={formData.technologies} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., React, Node.js, Python"/>
              </div>
              <div>
                <label htmlFor="mentor" className="block text-sm font-medium text-gray-700">Mentor (Optional)</label>
                <input type="text" name="mentor" id="mentor" value={formData.mentor} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" > Cancel </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 flex items-center" >
                  {isLoading ? ( <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : <FaSave className="mr-2" />}
                  {currentProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagementPage;