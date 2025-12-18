import { useState } from 'react'
import '../styles/AdminPanel.css'

function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // Simple password check - you can change this password
        if (password === 'admin123') {
            onLogin()
        } else {
            setError('Incorrect password!')
            setPassword('')
        }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="login-header">
                    <h1>🔐 Admin Login</h1>
                    <p>Enter password to access admin panel</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter password"
                            className="login-input"
                            autoFocus
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>
                    
                    <button type="submit" className="login-btn">
                        Login
                    </button>
                    
                    <div className="login-hint">
                        <small>Default password: admin123</small>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
