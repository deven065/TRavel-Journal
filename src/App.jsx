import { useState, useEffect } from 'react'
import Header from "./components/Header"
import Entry from "./components/Entry"
import AdminLogin from "./components/AdminLogin"
import AdminPanel from "./components/AdminPanel"
import initialData from "./data"
import { getEntries, addEntry, updateEntry, deleteEntry } from './firebase/firebaseService'

function App() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [useFirebase, setUseFirebase] = useState(false)

  // Check if Firebase is configured
  useEffect(() => {
    const checkFirebaseConfig = async () => {
      try {
        // Try to fetch from Firebase
        const firebaseEntries = await getEntries()
        if (firebaseEntries.length > 0 || localStorage.getItem('firebaseConfigured') === 'true') {
          setUseFirebase(true)
          setEntries(firebaseEntries.length > 0 ? firebaseEntries : initialData)
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem('travelEntries')
          setEntries(saved ? JSON.parse(saved) : initialData)
        }
      } catch (error) {
        console.log('Firebase not configured, using localStorage')
        const saved = localStorage.getItem('travelEntries')
        setEntries(saved ? JSON.parse(saved) : initialData)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkFirebaseConfig()
  }, [])

  // Save to localStorage as backup
  useEffect(() => {
    if (!isLoading && entries.length > 0) {
      localStorage.setItem('travelEntries', JSON.stringify(entries))
    }
  }, [entries, isLoading])

  // Check for admin route
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdmin(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    window.history.pushState({}, '', '/')
  }

  const handleAddEntry = async (newEntry) => {
    try {
      if (useFirebase) {
        const addedEntry = await addEntry(newEntry)
        setEntries(prev => [...prev, addedEntry])
        localStorage.setItem('firebaseConfigured', 'true')
      } else {
        setEntries(prev => [...prev, newEntry])
      }
      alert('✅ Entry added successfully!')
    } catch (error) {
      console.error('Error adding entry:', error)
      alert('❌ Error adding entry. Check console for details.')
    }
  }

  const handleUpdateEntry = async (updatedEntry) => {
    try {
      if (useFirebase) {
        await updateEntry(updatedEntry.id, updatedEntry)
      }
      setEntries(prev => prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ))
      alert('✅ Entry updated successfully!')
    } catch (error) {
      console.error('Error updating entry:', error)
      alert('❌ Error updating entry. Check console for details.')
    }
  }

  const handleDeleteEntry = async (id) => {
    try {
      if (useFirebase) {
        await deleteEntry(id)
      }
      setEntries(prev => prev.filter(entry => entry.id !== id))
      alert('✅ Entry deleted successfully!')
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('❌ Error deleting entry. Check console for details.')
    }
  }

  // Admin view
  if (isAdmin) {
    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleLogin} />
    }
    return (
      <AdminPanel 
        entries={entries}
        onAddEntry={handleAddEntry}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntry}
        onLogout={handleLogout}
      />
    )
  }

  // Public view
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        ⏳ Loading...
      </div>
    )
  }

  const entryElements = entries.map((entry)=>{
    return (
      <Entry 
        key={entry.id}
        id={entry.id}
        img={entry.img}
        title={entry.title}
        country={entry.country}
        googleMapsLink={entry.googleMapsLink}
        dates={entry.dates}
        text={entry.text}
      />
    )
  })

  return (
    <>
      <Header />
      <main className="container">
        {entryElements}
      </main>
      
      {/* Admin Access Button */}
      <button 
        onClick={() => setIsAdmin(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          zIndex: 999
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        🔐 Admin
      </button>
    </>
  )
}

export default App;