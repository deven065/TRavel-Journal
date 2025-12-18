import { useState } from 'react'
import EntryForm from './EntryForm'
import '../styles/AdminPanel.css'

function EntryManager({ entries, onUpdate, onDelete }) {
    const [editingId, setEditingId] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredEntries = entries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.country.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (entry) => {
        setEditingId(entry.id)
    }

    const handleUpdate = (updatedEntry) => {
        onUpdate(updatedEntry)
        setEditingId(null)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            onDelete(id)
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
    }

    if (editingId) {
        const entryToEdit = entries.find(e => e.id === editingId)
        return (
            <div>
                <button onClick={handleCancelEdit} className="back-btn">
                    ← Back to List
                </button>
                <EntryForm
                    entryData={{
                        ...entryToEdit,
                        photos: entryToEdit.photos || [{ id: 1, url: entryToEdit.img.src, name: 'Main Photo' }],
                        videos: entryToEdit.videos || []
                    }}
                    onSubmit={handleUpdate}
                />
            </div>
        )
    }

    return (
        <div className="entry-manager">
            <div className="manager-header">
                <input
                    type="text"
                    placeholder="🔍 Search by title or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <span className="entry-count">
                    {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                </span>
            </div>

            <div className="entries-grid">
                {filteredEntries.map(entry => (
                    <div key={entry.id} className="admin-entry-card">
                        <div className="admin-entry-image">
                            <img src={entry.img.src} alt={entry.img.alt} />
                            {entry.photos && entry.photos.length > 1 && (
                                <span className="photo-count">📸 {entry.photos.length}</span>
                            )}
                            {entry.videos && entry.videos.length > 0 && (
                                <span className="video-count">🎬 {entry.videos.length}</span>
                            )}
                        </div>
                        <div className="admin-entry-info">
                            <h3>{entry.title}</h3>
                            <p className="entry-country">📍 {entry.country}</p>
                            <p className="entry-dates">{entry.dates}</p>
                            <p className="entry-description">{entry.text.substring(0, 100)}...</p>
                            
                            <div className="admin-entry-actions">
                                <button 
                                    onClick={() => handleEdit(entry)}
                                    className="edit-btn"
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(entry.id)}
                                    className="delete-btn"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEntries.length === 0 && (
                <div className="no-entries">
                    <p>No entries found</p>
                </div>
            )}
        </div>
    )
}

export default EntryManager
