// src/admin/services/notesService.js

let notes = [
  { id: 'n1', clubId: 'club_alpha', title: 'Python Basics - Week 1 Slides', type: 'link', content: 'https://example.com/slides/python_w1.pdf', dateAdded: new Date('2024-05-10T10:00:00Z').toISOString() },
  { id: 'n2', clubId: 'club_alpha', title: 'Algorithm Problem Set 1', type: 'text', content: 'Solve problems 1-5 from the handout. Focus on time complexity.', dateAdded: new Date('2024-05-12T14:30:00Z').toISOString() },
  { id: 'n3', clubId: 'club_beta', title: 'React Component Lifecycle Cheatsheet', type: 'link', content: 'https://reactjs.org/docs/state-and-lifecycle.html', dateAdded: new Date('2024-05-11T09:00:00Z').toISOString() },
];

const API_DELAY = 300;
const generateId = () => `n${Date.now()}${Math.floor(Math.random() * 100)}`;

export const getNotesByClub = async (clubId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clubNotes = notes.filter(n => n.clubId === clubId).sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // Sort by most recent
      resolve([...clubNotes]);
    }, API_DELAY);
  });
};

export const addNote = async (noteData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!noteData.clubId || !noteData.title || !noteData.type) {
        return reject(new Error('Club ID, Title, and Type are required.'));
      }
      if (noteData.type === 'link' && !noteData.content) {
        return reject(new Error('Content (URL) is required for link type notes.'));
      }
      if (noteData.type === 'text' && !noteData.content) {
        return reject(new Error('Content is required for text type notes.'));
      }
      const newNote = { id: generateId(), ...noteData, dateAdded: new Date().toISOString() };
      notes.push(newNote);
      resolve({ ...newNote });
    }, API_DELAY);
  });
};

export const updateNote = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = notes.findIndex(n => n.id === id);
      if (index !== -1) {
        if (!updatedData.title || !updatedData.type) {
            return reject(new Error('Title and Type cannot be empty.'));
        }
        if (updatedData.type === 'link' && !updatedData.content) {
            return reject(new Error('Content (URL) is required for link type notes.'));
        }
        if (updatedData.type === 'text' && !updatedData.content) {
            return reject(new Error('Content is required for text type notes.'));
        }
        notes[index] = { ...notes[index], ...updatedData, dateModified: new Date().toISOString() };
        resolve({ ...notes[index] });
      } else {
        reject(new Error('Note not found for update.'));
      }
    }, API_DELAY);
  });
};

export const deleteNote = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = notes.length;
      notes = notes.filter(n => n.id !== id);
      if (notes.length < initialLength) {
        resolve({ message: 'Note deleted successfully.' });
      } else {
        reject(new Error('Note not found for deletion.'));
      }
    }, API_DELAY);
  });
};

// Optional: If Super Admin needs to see all notes
export const getAllNotes = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...notes].sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded)));
      }, API_DELAY);
    });
  };