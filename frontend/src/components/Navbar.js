import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userPoints, setUserPoints] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserPoints(data.points || 0);
        } else if (response.status === 401) {
          console.log('Token expired or invalid');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user points:', error);
      }
    };

    const fetchUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:8080/api/notifications/unread/count', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUnreadNotifications(data.count || 0);
        } else {
          console.error('Failed to fetch unread notifications:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserPoints();
      fetchUnreadNotifications();
    }
  }, [isLoggedIn, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar" style={{
      background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
      color: '#fff',
      padding: '0.7rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(33,203,243,0.10)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div className="navbar-brand">
        <span className="navbar-title" style={{
          fontWeight: 800,
          fontSize: '1.7rem',
          letterSpacing: '1px',
          color: '#fff',
          textShadow: '0 2px 8px rgba(33,203,243,0.15)'
        }}>CommunitySwap</span>
      </div>
      <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''} style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '5px', background: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.15)' : 'none', transition: 'background 0.2s' }}>
              Dashboard
            </Link>
            <Link to="/items" className={location.pathname === '/items' ? 'active' : ''} style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '5px', background: location.pathname === '/items' ? 'rgba(255,255,255,0.15)' : 'none', transition: 'background 0.2s' }}>
              Browse Items
            </Link>
            <Link to="/my-swaps" className={location.pathname === '/my-swaps' ? 'active' : ''} style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '5px', background: location.pathname === '/my-swaps' ? 'rgba(255,255,255,0.15)' : 'none', transition: 'background 0.2s' }}>
              Swaps
            </Link>
            <Link to="/chats" className={location.pathname === '/chats' ? 'active' : ''} style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '5px', background: location.pathname === '/chats' ? 'rgba(255,255,255,0.15)' : 'none', transition: 'background 0.2s' }}>
              Chats
            </Link>
            <div className="navbar-end" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div className="points-display" style={{ color: '#ffd54f', fontWeight: 700, fontSize: '1.1rem' }}>
                Points: {userPoints}
              </div>
              <Link to="/notifications" className="notifications-icon-link" style={{ color: '#fff', fontSize: '1.3rem', position: 'relative', textDecoration: 'none' }}>
                🔔
                {unreadNotifications > 0 && (
                  <span className="notification-badge" style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ff5252', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '0.8rem', fontWeight: 700 }}>{unreadNotifications}</span>
                )}
              </Link>
              <Link to="/profile" className="profile-icon-text" style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', fontSize: '1.1rem' }}>
                👤 Profile
              </Link>
              <div className="profile-dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>
                  &#9660;
                </button>
                {showDropdown && (
                  <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '2.2rem', background: '#fff', color: '#333', borderRadius: '8px', boxShadow: '0 2px 8px rgba(33,203,243,0.15)', minWidth: '120px', zIndex: 100 }}>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#2196f3', fontWeight: 600, padding: '0.7rem 1rem', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''} style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '5px', background: location.pathname === '/login' ? 'rgba(255,255,255,0.15)' : 'none', transition: 'background 0.2s' }}>
              Login
            </Link>
            <Link to="/register" className={location.pathname === '/register' ? 'active' : ''} style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '5px', background: location.pathname === '/register' ? 'rgba(255,255,255,0.15)' : 'none', transition: 'background 0.2s' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 