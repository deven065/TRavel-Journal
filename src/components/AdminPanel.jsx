import { useState } from 'react'
import EntryForm from './EntryForm'
import EntryManager from './EntryManager'
import '../styles/AdminPanel.css'

function AdminPanel({ entries, onAddEntry, onUpdateEntry, onDeleteEntry, onLogout }) {
    const [activeTab, setActiveTab] = useState('add')

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>🎯 Admin Dashboard</h1>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    ➕ Add Entry
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manage')}
                >
                    📋 Manage Entries ({entries.length})
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'add' && (
                    <EntryForm 
                        onSubmit={onAddEntry}
                        existingEntries={entries}
                    />
                )}
                
                {activeTab === 'manage' && (
                    <EntryManager 
                        entries={entries}
                        onUpdate={onUpdateEntry}
                        onDelete={onDeleteEntry}
                    />
                )}
            </div>
        </div>
    )
}

export default AdminPanel
