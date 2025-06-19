import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #a8edea 100%)',
    }}>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '20px', color: '#1a237e', fontWeight: 700, letterSpacing: '1px' }}>Welcome to CommunitySwap</h1>
      <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#333', fontWeight: 500 }}>Your community marketplace for swapping items.</p>
      <div>
        <Link to="/login" className="button-link" style={{
          margin: '10px',
          padding: '12px 32px',
          background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.1rem',
          fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(33,203,243,0.15)',
          transition: 'background 0.3s',
          cursor: 'pointer',
        }}>Login</Link>
        <Link to="/register" className="button-link secondary" style={{
          margin: '10px',
          padding: '12px 32px',
          background: 'linear-gradient(90deg, #ff8a65 0%, #ffd54f 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.1rem',
          fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(255,138,101,0.15)',
          transition: 'background 0.3s',
          cursor: 'pointer',
        }}>Register</Link>
      </div>
    </div>
  );
}

export default Home; 