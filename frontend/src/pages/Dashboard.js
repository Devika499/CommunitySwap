import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from '../components/WelcomeCard';
import UserPostsCard from '../components/UserPostsCard';
import { api } from '../services/api';
import logoImage from '../assets/Logo.png';

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [userItems, setUserItems] = useState([]);
    const navigate = useNavigate();

    // Use imported image
    const dashboardImageUrl = logoImage;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token); // Debug log
                
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                // Fetch user profile
                console.log('Fetching profile...'); // Debug log
                const profileData = await api.get('/profile');
                console.log('Profile Data:', profileData); // Debug log
                setUserName(profileData.name);

                // Fetch user's items
                console.log('Fetching items...'); // Debug log
                const itemsData = await api.get('/items/my-items');
                console.log('Items Data:', itemsData); // Debug log
                setUserItems(itemsData);

            } catch (error) {
                console.error('Detailed error:', error);
                console.error('Error stack:', error.stack);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div className="app-container">
            <div className="dashboard-container">
                <WelcomeCard userName={userName} imageUrl={dashboardImageUrl} />
                <UserPostsCard userItems={userItems} />
            </div>
        </div>
    );
};

export default Dashboard; 