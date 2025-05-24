// src/admin/pages/MyClub/MyClubNotesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
    getNotesByClub, 
    addNote, 
    updateNote, 
    deleteNote 
} from '@/admin/services/notesService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaStickyNote, FaLink, FaFileAlt } from 'react-icons/fa';

const MyClubNotesPage = () => {
  const { user } = useAuth();
  const clubIdForLeader = user?.clubId;

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'text', // 'text' or 'link'
    content: '', // URL if type is 'link', text content if type is 'text'
    description: '', // Optional
  });

  useEffect(() => {
    if (clubIdForLeader) {
      fetchClubNotes();
    } else if (user) {
      setError("Club ID not associated with your account. Cannot fetch notes.");
    }
  }, [clubIdForLeader, user]);

  const fetchClubNotes = async () => {
    if (!clubIdForLeader) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getNotesByClub(clubIdForLeader);
      setNotes(data);
    } catch (err) {
      setError(`Failed to fetch notes for your club.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    setFormData(prev => ({ ...prev, type: e.target.value, content: '' })); // Reset content when type changes
  };

  const openAddModal = () => {
    setCurrentNote(null);
    setFormData({ title: '', type: 'text', content: '', description: '' });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (note) => {
    setCurrentNote(note);
    setFormData({ 
        title: note.title, 
        type: note.type, 
        content: note.content,
        description: note.description || ''
    });
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
        setError("Title and Content are required.");
        return;
    }
    setIsLoading(true);
    setError('');
    const notePayload = { ...formData, clubId: clubIdForLeader };
    try {
      if (currentNote) {
        await updateNote(currentNote.id, notePayload);
      } else {
        await addNote(notePayload);
      }
      fetchClubNotes();
      closeModal();
    } catch (err) {
      setError(err.message || `Failed to ${currentNote ? 'update' : 'add'} note.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note/resource?')) {
      setIsLoading(true);
      setError('');
      try {
        await deleteNote(noteId);
        fetchClubNotes();
      } catch (err) {
        setError('Failed to delete note.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };
  
  if (!user) return <p>Loading user information...</p>;
  if (user.role === 'CLUB_LEADER' && !clubIdForLeader) {
    return <div className="text-red-500 font-semibold p-4">Error: No Club ID associated with your account.</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaStickyNote className="mr-3 text-yellow-500"/> My Club Notes & Resources
        </h1>
        <button
          onClick={openAddModal}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150"
        >
          <FaPlus className="mr-2" /> Add Note/Resource
        </button>
      </div>

      {isLoading && !isModalOpen && <p className="text-center text-gray-600 py-4">Loading notes...</p>}
      {error && !isModalOpen && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      {!isLoading && !error && notes.length === 0 && (
        <p className="text-center text-gray-500 py-4">No notes or resources found for your club.</p>
      )}

      {!isLoading && notes.length > 0 && (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                    {note.type === 'link' ? <FaLink className="mr-2 text-blue-500" /> : <FaFileAlt className="mr-2 text-gray-500" />}
                    {note.title}
                  </h3>
                  {note.description && <p className="text-sm text-gray-600 mb-2">{note.description}</p>}
                  {note.type === 'link' ? (
                    <a href={note.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm">
                      {note.content}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">{note.content}</p>
                  )}
                </div>
                <div className="flex-shrink-0 flex space-x-2 mt-1">
                  <button
                    onClick={() => openEditModal(note)}
                    className="text-blue-500 hover:text-blue-700 transition duration-150 p-1"
                    aria-label="Edit Note"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-500 hover:text-red-700 transition duration-150 p-1"
                    aria-label="Delete Note"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Added: {formatDate(note.dateAdded)}
                {note.dateModified && ` | Modified: ${formatDate(note.dateModified)}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit Note */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentNote ? 'Edit Note/Resource' : 'Add New Note/Resource'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-3 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type" id="type" value={formData.type} onChange={handleTypeChange} required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="text">Text Note</option>
                  <option value="link">Link/URL</option>
                </select>
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  {formData.type === 'link' ? 'URL / Link' : 'Content'}
                </label>
                {formData.type === 'link' ? (
                  <input
                    type="url" name="content" id="content" value={formData.content} onChange={handleInputChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/resource"
                  />
                ) : (
                  <textarea
                    name="content" id="content" rows="5" value={formData.content} onChange={handleInputChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  name="description" id="description" rows="2" value={formData.description} onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" > Cancel </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 flex items-center" >
                  {isLoading ? ( <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : <FaSave className="mr-2" />}
                  {currentNote ? 'Save Changes' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubNotesPage;