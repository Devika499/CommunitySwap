import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserPostsCard = ({ userItems }) => {
    const navigate = useNavigate();

    const handlePostItemClick = () => {
        navigate('/dashboard/post-item');
    };

    const handleItemClick = (itemId) => {
        navigate(`/dashboard/edit-item/${itemId}`);
    };

    return (
        <div className="dashboard-card user-posts-card">
            <h2 className="your-posts-subtitle">Your posts</h2>
            <div className="user-items-grid">
                {userItems.length > 0 ? (
                    userItems.map(item => (
                        <div key={item.id} className="item-card" onClick={() => handleItemClick(item.id)}>
                            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="item-image" />}
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <p>Category: {item.category}</p>
                        </div>
                    ))
                ) : (
                    <p>You haven't posted any items yet. Start by adding one!</p>
                )}
                
                <div className="item-card post-new-item-card" onClick={handlePostItemClick}>
                    <h3>Post a New Item</h3>
                    <p>Click here to list a new item for swap or giveaway.</p>
                    <button className="post-item-button" >
                        Post Item
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPostsCard; 