import React, { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });
      setLoading(false);
      if (response.ok) {
        alert('Registration successful!');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        const errorData = await response.json();
        alert('Registration failed: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      setLoading(false);
      alert('Registration failed: ' + error.message);
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
        boxShadow: '0 4px 24px rgba(255,138,101,0.10)',
        minWidth: '320px',
        maxWidth: '90vw',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#ff8a65', fontWeight: 700, marginBottom: '1.5rem' }}>Register</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ fontWeight: 500 }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            background: 'linear-gradient(90deg, #ff8a65 0%, #ffd54f 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(255,138,101,0.10)',
            marginBottom: '0.5rem',
            transition: 'background 0.3s',
          }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register; 