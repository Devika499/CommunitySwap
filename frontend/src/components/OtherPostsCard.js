import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

const OtherPostsCard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        console.log("OtherPostsCard useEffect initiated.");

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("OtherPostsCard: No authentication token found.");
                return null;
            }
            try {
                console.log("OtherPostsCard: Fetching user data...");
                const response = await fetch(`${API_BASE_URL}/api/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const userData = await response.json();
                    console.log("OtherPostsCard: User data received:", userData);
                    setCurrentUserId(userData.id);
                    return userData.id;
                } else if (response.status === 401) {
                    console.error("OtherPostsCard: Unauthorized - redirecting to login.");
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    const errorData = await response.json();
                    console.error("OtherPostsCard: Failed to fetch user data:", errorData);
                }
            } catch (err) {
                console.error("OtherPostsCard: Network error fetching user data:", err);
            }
            return null;
        };

        const fetchOtherItems = async (userId) => {
            console.log("OtherPostsCard: Entering fetchOtherItems. userId:", userId);
            if (!userId) {
                console.warn("OtherPostsCard: fetchOtherItems called with no userId.");
                return;
            }
            const token = localStorage.getItem('token');
            try {
                console.log("OtherPostsCard: Fetching other items from API...");
                const response = await fetch(`${API_BASE_URL}/api/items/others-items`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("OtherPostsCard: Other items received:", data);
                    setItems(data);
                } else if (response.status === 401) {
                    console.error("OtherPostsCard: Unauthorized - redirecting to login.");
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    const errorData = await response.json();
                    console.error("OtherPostsCard: Failed to fetch other items:", errorData);
                    setError(errorData.message || 'Failed to fetch items posted by others.');
                }
            } catch (err) {
                console.error("OtherPostsCard: Network error fetching other items:", err);
                setError('Network error or server is unreachable.');
            } finally {
                setLoading(false);
            }
        };

        const initFetch = async () => {
            console.log("OtherPostsCard: Initiating fetch process...");
            const userId = await fetchUserData();
            console.log("OtherPostsCard: User ID from fetchUserData:", userId);
            if (userId) {
                console.log("OtherPostsCard: Calling fetchOtherItems with userId.");
                fetchOtherItems(userId);
            } else {
                console.log("OtherPostsCard: User ID not available, setting loading to false.");
                setLoading(false);
            }
        };

        initFetch();
    }, []);

    const handleRequestItem = async (itemId) => {
        if (!currentUserId) {
            alert("User not logged in or user ID not available. Please try logging in again.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Authentication token not found. Please log in.");
            window.location.href = '/login';
            return;
        }

        try {
            console.log("Sending swap request for item:", itemId);
            const response = await fetch(`${API_BASE_URL}/api/swap-requests?itemId=${itemId}&requesterId=${currentUserId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("Swap request sent successfully!");
                // Optionally, refresh the list of items or update the specific item's status
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                console.error("Failed to send swap request:", errorData);
                alert(`Failed to send swap request: ${errorData.message || response.statusText}`);
            }
        } catch (err) {
            console.error("Error sending swap request:", err);
            alert("Network error or server is unreachable.");
        }
    };

    if (loading) {
        return <div className="other-posts-card card">Loading items...</div>;
    }

    if (error) {
        return <div className="other-posts-card card">Error: {error}</div>;
    }

    return (
        <div className="other-posts-card card">
            <h2>Items others posted</h2>
            <div className="item-cards-container">
                {items.length === 0 ? (
                    <p>No items posted by other users yet.</p>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="item-card">
                            <div className="item-image-wrapper">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="item-image" />
                                ) : (
                                    <div className="image-not-found">Image Not Found</div>
                                )}
                            </div>
                            <div className="item-details">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <p><strong>Category:</strong> {item.category}</p>
                                <p><strong>Type:</strong> {item.type}</p>
                                <p><strong>Location:</strong> {item.location}</p>
                                <p><strong>Posted By:</strong> {item.user.name}</p>
                                <button onClick={() => handleRequestItem(item.id)} className="request-button">Request</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OtherPostsCard; 