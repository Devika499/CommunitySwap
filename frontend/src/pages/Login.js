import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await api.post('/auth/login', {
        email,
        password,
      });
      
      if (data.token) {
        // Clear any existing tokens first
        localStorage.clear();
        
        // Store new tokens and user data
        localStorage.setItem('token', data.token);
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
        if (data.role) {
          localStorage.setItem('userRole', data.role);
        }
        
        setEmail('');
        setPassword('');
        navigate('/dashboard');
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #a8edea 100%)',
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(33,203,243,0.10)',
        minWidth: '320px',
        maxWidth: '90vw',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#1a237e', fontWeight: 700, marginBottom: '1.5rem' }}>Login</h1>
        {error && <div className="error-message" style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ fontWeight: 500 }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdbdbd',
                marginTop: '5px',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ fontWeight: 500 }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdbdbd',
                marginTop: '5px',
                fontSize: '1rem',
              }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(33,203,243,0.10)',
            marginBottom: '0.5rem',
            transition: 'background 0.3s',
          }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          New user? <a href="/register" style={{ color: '#2196f3', textDecoration: 'underline', fontWeight: 500 }}>Register here</a>.
        </div>
      </div>
    </div>
  );
}

export default Login; 