import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    location: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          location: data.location || ''
        }));
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      setMessage('Error fetching user data: ' + error.message);
      setMessageType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate passwords if changing password
    if (userData.newPassword) {
      if (userData.newPassword !== userData.confirmPassword) {
        setMessage('New passwords do not match');
        setMessageType('error');
        setLoading(false);
        return;
      }
      if (!userData.currentPassword) {
        setMessage('Current password is required to change password');
        setMessageType('error');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          location: userData.location,
          password: userData.newPassword // Only send if changing password
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setMessage('Profile updated successfully!');
        setMessageType('success');
        // Clear password fields
        setUserData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <h1>Update Profile</h1>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
          />
        </div>
        <div className="password-section">
          <h3>Change Password (Optional)</h3>
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={userData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile; 