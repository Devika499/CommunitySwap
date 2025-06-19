import React from 'react';
import WelcomeCard from './WelcomeCard';
import UserPostsCard from './UserPostsCard';
import OtherPostsCard from './OtherPostsCard';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <WelcomeCard 
                imageUrl="https://img.freepik.com/free-photo/3d-rendering-beautiful-luxury-bedroom-suite-hotel-with-tv_105762-2063.jpg"
            />
            <UserPostsCard />
            <OtherPostsCard />
        </div>
    );
};

export default Dashboard; 