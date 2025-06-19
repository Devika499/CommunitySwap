import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else {
                    throw new Error('Failed to fetch notifications');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [navigate]);

    const markAsRead = async (notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notif =>
                        notif.id === notificationId ? { ...notif, read: true } : notif
                    )
                );
            } else {
                console.error('Failed to mark notification as read');
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleAcceptRequest = async (swapRequestId, notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/swap-requests/${swapRequestId}/accept`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Swap request accepted successfully!');
                markAsRead(notificationId);
            } else {
                const errorText = await response.text();
                console.error('Failed to accept request:', errorText);
                alert(`Failed to accept swap request: ${errorText}`);
            }
        } catch (err) {
            console.error('Error accepting request:', err);
            alert(`Error accepting swap request: ${err.message}`);
        }
    };

    if (loading) {
        return <div className="container">Loading notifications...</div>;
    }

    if (error) {
        return <div className="container">Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1>Your Notifications</h1>
            {notifications.length === 0 ? (
                <p>No notifications to display.</p>
            ) : (
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-date">{new Date(notification.createdAt).toLocaleString()}</span>
                            {!notification.read && (
                                <button
                                    className="mark-read-button"
                                    onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                >
                                    Mark as Read
                                </button>
                            )}
                            {notification.type === 'SWAP_REQUEST' && !notification.read && notification.swapRequestId && (
                                <button
                                    className="accept-swap-button"
                                    onClick={(e) => { e.stopPropagation(); handleAcceptRequest(notification.swapRequestId, notification.id); }}
                                >
                                    Accept Request
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications; 