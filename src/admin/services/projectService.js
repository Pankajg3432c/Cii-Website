// src/admin/services/projectService.js

let projects = [
  { id: 'p1', clubId: 'club_alpha', name: 'AI Chatbot for GITS', description: 'A chatbot to answer common student queries.', status: 'In Progress', teamMembers: ['s1'], technologies: ['Python', 'NLTK', 'Dialogflow'], startDate: '2024-03-01', mentor: 'Dr. AI Expert' },
  { id: 'p2', clubId: 'club_alpha', name: 'Campus Navigation App', description: 'Mobile app for navigating the GITS campus.', status: 'Planning', teamMembers: [], technologies: ['React Native', 'Firebase'], startDate: '2024-06-01', mentor: 'Prof. MobileDev' },
  { id: 'p3', clubId: 'club_beta', name: 'E-Library Portal', description: 'Web portal for accessing digital library resources.', status: 'Completed', teamMembers: ['s2'], technologies: ['React', 'Node.js', 'MongoDB'], startDate: '2024-01-15', mentor: 'Mr. Web Dev' },
  { id: 'p4', clubId: 'club_beta', name: 'IoT Weather Station', description: 'A device to monitor local weather conditions.', status: 'On Hold', teamMembers: [], technologies: ['Arduino', 'Sensors', 'ThingSpeak'], startDate: '2024-04-10', mentor: 'Ms. IoT Guru' },
];

const API_DELAY = 300;
const generateId = () => `p${Date.now()}${Math.floor(Math.random() * 100)}`;

export const getProjectsByClub = async (clubId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clubProjects = projects.filter(p => p.clubId === clubId);
      resolve([...clubProjects]);
    }, API_DELAY);
  });
};

// Super Admin might use this
export const getAllProjects = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...projects]);
    }, API_DELAY);
  });
};

export const getProjectById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const project = projects.find(p => p.id === id);
      if (project) {
        resolve({ ...project });
      } else {
        reject(new Error('Project not found'));
      }
    }, API_DELAY);
  });
};

export const addProject = async (projectData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!projectData.clubId || !projectData.name || !projectData.description) {
        return reject(new Error('Club ID, Project Name, and Description are required.'));
      }
      const newProject = { 
        id: generateId(), 
        teamMembers: [], // Initialize team members as empty array
        technologies: [], // Initialize technologies as empty array
        ...projectData, 
        startDate: projectData.startDate || new Date().toISOString().split('T')[0] // Default start date
      };
      projects.push(newProject);
      resolve({ ...newProject });
    }, API_DELAY);
  });
};

export const updateProject = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = projects.findIndex(p => p.id === id);
      if (index !== -1) {
        if (!updatedData.name || !updatedData.description) {
            return reject(new Error('Project Name and Description cannot be empty.'));
        }
        projects[index] = { ...projects[index], ...updatedData };
        resolve({ ...projects[index] });
      } else {
        reject(new Error('Project not found for update.'));
      }
    }, API_DELAY);
  });
};

export const deleteProject = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = projects.length;
      projects = projects.filter(p => p.id !== id);
      if (projects.length < initialLength) {
        resolve({ message: 'Project deleted successfully.' });
      } else {
        reject(new Error('Project not found for deletion.'));
      }
    }, API_DELAY);
  });
};