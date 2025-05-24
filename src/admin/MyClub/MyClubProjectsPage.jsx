// src/admin/pages/MyClub/MyClubProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
    getProjectsByClub, 
    addProject, 
    updateProject, 
    deleteProject 
} from '@/admin/services/projectService';
// We might need studentService later if we assign students to projects
// import { getStudentsByClub } from '@/admin/services/studentService'; 
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaProjectDiagram } from 'react-icons/fa';

const projectStatuses = ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"];

const MyClubProjectsPage = () => {
  const { user } = useAuth();
  const clubIdForLeader = user?.clubId;

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    technologies: '', // comma-separated string for simplicity
    mentor: '',
    startDate: new Date().toISOString().split('T')[0],
    // teamMembers will be handled later if needed
  });

  useEffect(() => {
    if (clubIdForLeader) {
      fetchClubProjects();
    } else if (user) {
      setError("Club ID not associated with your account. Cannot fetch projects.");
    }
  }, [clubIdForLeader, user]);

  const fetchClubProjects = async () => {
    if (!clubIdForLeader) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getProjectsByClub(clubIdForLeader);
      setProjects(data);
    } catch (err) {
      setError(`Failed to fetch projects for your club.`);
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
        name: '', description: '', status: 'Planning', 
        technologies: '', mentor: '', 
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
    if (!formData.name.trim() || !formData.description.trim()) {
        setError("Project Name and Description are required.");
        return;
    }
    setIsLoading(true);
    setError('');
    const projectPayload = { 
        ...formData, 
        clubId: clubIdForLeader,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech), // Convert string to array
    };
    try {
      if (currentProject) {
        await updateProject(currentProject.id, projectPayload);
      } else {
        await addProject(projectPayload);
      }
      fetchClubProjects();
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
        fetchClubProjects();
      } catch (err) {
        setError('Failed to delete project.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (!user) return <p>Loading user information...</p>;
  if (user.role === 'CLUB_LEADER' && !clubIdForLeader) {
    return <div className="text-red-500 font-semibold p-4">Error: No Club ID associated.</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaProjectDiagram className="mr-3 text-purple-600"/> My Club Projects
        </h1>
        <button
          onClick={openAddModal}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150"
        >
          <FaPlus className="mr-2" /> Add Project
        </button>
      </div>

      {isLoading && !isModalOpen && <p className="text-center text-gray-600 py-4">Loading projects...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      {!isLoading && !error && projects.length === 0 && (
        <p className="text-center text-gray-500 py-4">No projects found for your club.</p>
      )}

      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-1 h-20 overflow-y-auto">{project.description}</p>
                <p className="text-xs text-gray-500 mb-1"><strong>Status:</strong> {project.status}</p>
                <p className="text-xs text-gray-500 mb-1"><strong>Technologies:</strong> {(Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies) || 'N/A'}</p>
                <p className="text-xs text-gray-500 mb-1"><strong>Mentor:</strong> {project.mentor || 'N/A'}</p>
                <p className="text-xs text-gray-500"><strong>Start Date:</strong> {project.startDate ? new Date(project.startDate  + 'T00:00:00').toLocaleDateString() : 'N/A'}</p>
                 {/* <p className="text-xs text-gray-500"><strong>Team:</strong> {project.teamMembers?.join(', ') || 'N/A'}</p> */}
              </div>
              <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                <button
                  onClick={() => openEditModal(project)}
                  className="text-blue-500 hover:text-blue-700 transition duration-150 p-1"
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-3 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
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
              
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" > Cancel </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center" >
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

export default MyClubProjectsPage;