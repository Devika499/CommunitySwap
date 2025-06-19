import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Items() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const currentUserId = localStorage.getItem('userId');

    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);
    const [searchRadius, setSearchRadius] = useState(50); // Default search radius in km
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);

    const [nearbyItems, setNearbyItems] = useState([]);
    const [otherItems, setOtherItems] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const navigate = useNavigate();

    // Calculate distance between two points using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const fetchUserProfileLocation = async () => {
        try {
            const response = await api.get('/users/profile');
            if (response.latitude && response.longitude) {
                setUserLatitude(response.latitude);
                setUserLongitude(response.longitude);
                return true;
            }
            console.log('User profile does not have stored location.');
            return false;
        } catch (error) {
            console.error('Error fetching user profile location:', error);
            return false;
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            return Promise.resolve(false);
        }

        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                console.log('Geolocation request timed out');
                resolve(false);
            }, 10000);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeoutId);
                    setUserLatitude(position.coords.latitude);
                    setUserLongitude(position.coords.longitude);
                    resolve(true);
                },
                (error) => {
                    clearTimeout(timeoutId);
                    console.error('Geolocation error:', error.code, error.message);
                    resolve(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };

    useEffect(() => {
        const initializeLocation = async () => {
            if (useCurrentLocation) {
                const locationSuccess = await getCurrentLocation();
                if (!locationSuccess) {
                    const profileLocationSuccess = await fetchUserProfileLocation();
                    if (!profileLocationSuccess) {
                        setUserLatitude(9.0935376); // Default latitude
                        setUserLongitude(76.4886703); // Default longitude
                    }
                }
            } else {
                const profileLocationSuccess = await fetchUserProfileLocation();
                if (!profileLocationSuccess) {
                    setUserLatitude(9.0935376);
                    setUserLongitude(76.4886703);
                }
            }
        };

        initializeLocation();
    }, [useCurrentLocation]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                if (!api.isAuthenticated()) {
                    setError('Please log in to view items');
                    setLoading(false);
                    return;
                }

                let data;
                if (showAll) {
                    // Fetch all items posted by others
                    data = await api.get('/items/others-items');
                } else if (userLatitude && userLongitude && searchRadius) {
                    // Use the new location-based endpoint
                    data = await api.get(`/items/nearby?latitude=${userLatitude}&longitude=${userLongitude}&radiusKm=${searchRadius}`);
                } else {
                    // Fallback to old endpoint if location is not available
                    data = await api.get('/items/others-items');
                }
                setItems(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching items:', err);
                if (err.message && err.message.includes('403')) {
                    setError('You do not have permission to view items. Please contact support.');
                } else {
                    setError(err.message || 'Failed to fetch items');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [currentUserId, userLatitude, userLongitude, searchRadius, showAll]);

    // Filter items based on distance when location or radius changes
    useEffect(() => {
        if (userLatitude && userLongitude && items.length > 0) {
            const withDistance = items.map(item => {
                if (!item.latitude || !item.longitude) return { ...item, distance: Infinity };
                const distance = calculateDistance(
                    userLatitude,
                    userLongitude,
                    item.latitude,
                    item.longitude
                );
                return { ...item, distance };
            });
            setNearbyItems(withDistance.filter(item => item.distance <= searchRadius).sort((a, b) => a.distance - b.distance));
            if (showAll) {
                setOtherItems(withDistance.filter(item => item.distance > searchRadius || item.distance <= searchRadius).sort((a, b) => a.distance - b.distance));
            } else {
                setOtherItems(withDistance.filter(item => item.distance > searchRadius).sort((a, b) => a.distance - b.distance));
            }
        } else {
            setNearbyItems(items);
            setOtherItems([]);
        }
    }, [items, userLatitude, userLongitude, searchRadius, showAll]);

    const handleRequestSwap = async (itemId, ownerId) => {
        if (!currentUserId) {
            alert('Please log in to request a swap.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/swap-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    requestedItemId: itemId,
                    requesterId: currentUserId
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Swap request sent successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to send swap request: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            alert(`Error sending swap request: ${error.message}`);
        }
    };

    const handleContactOwner = async (ownerId, itemId) => {
        if (!currentUserId) {
            alert('Please log in to contact the owner.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/chat/conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: ownerId,
                    itemId: itemId
                })
            });

            if (response.ok) {
                navigate('/chats');
            } else {
                const errorData = await response.json();
                alert(`Failed to start conversation: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            alert(`Error starting conversation: ${error.message}`);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container">Error: {error}</div>;

    return (
        <div className="container">
            <h1>Available Items</h1>

            <div className="location-filter-controls">
                <div className="location-display">
                    {userLatitude !== null && userLongitude !== null ? (
                        <p>Items near: {userLatitude.toFixed(4)}, {userLongitude.toFixed(4)}</p>
                    ) : (
                        <p>Location not determined.</p>
                    )}
                </div>
                <div className="radius-select">
                    <label htmlFor="searchRadius">Search Radius (km):</label>
                    <input
                        type="number"
                        id="searchRadius"
                        value={searchRadius}
                        onChange={(e) => setSearchRadius(Number(e.target.value))}
                        min="1"
                        max="500"
                    />
                </div>
                <div className="location-preference-toggle">
                    <label>
                        <input
                            type="checkbox"
                            checked={useCurrentLocation}
                            onChange={() => setUseCurrentLocation(!useCurrentLocation)}
                        />
                        Use Current Location (Browser Geolocation)
                    </label>
                </div>
            </div>

            <h2>Nearer Items</h2>
            <div className="items-grid">
                {nearbyItems.length === 0 && <p>No items nearby.</p>}
                {nearbyItems.map(item => (
                    <div key={item.id} className="item-card">
                        <div className="item-image-container">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="item-image"
                                    onError={(e) => { e.target.onerror = null; e.target.alt = 'Image Not Available'; e.target.className = 'item-image image-error'; }}
                                    onClick={() => setSelectedImage(item.imageUrl)}
                                />
                            ) : (
                                <div className="image-placeholder">Image Not Available</div>
                            )}
                        </div>
                        <h3>{item.title}</h3>
                        <p className="item-description">{item.description}</p>
                        <div className="item-meta">
                            <span className="item-type-tag">{item.type}</span>
                            <span className="item-location">{item.location}</span>
                            {item.distance && (
                                <span className="item-distance">{item.distance.toFixed(1)} km away</span>
                            )}
                        </div>
                        <div className="item-actions">
                            {item.status === 'SWAPPED' ? (
                                <span className="item-status-swapped">Swapped</span>
                            ) : (
                                <>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleRequestSwap(item.id, item.ownerId)}
                                    >
                                        Request Swap
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleContactOwner(item.ownerId, item.id)}
                                    >
                                        Contact Owner
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <h2>Other Items</h2>
            <div className="items-grid">
                {otherItems.length === 0 && <p>No other items.</p>}
                {otherItems.map(item => (
                    <div key={item.id} className="item-card">
                        <div className="item-image-container">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="item-image"
                                    onError={(e) => { e.target.onerror = null; e.target.alt = 'Image Not Available'; e.target.className = 'item-image image-error'; }}
                                    onClick={() => setSelectedImage(item.imageUrl)}
                                />
                            ) : (
                                <div className="image-placeholder">Image Not Available</div>
                            )}
                        </div>
                        <h3>{item.title}</h3>
                        <p className="item-description">{item.description}</p>
                        <div className="item-meta">
                            <span className="item-type-tag">{item.type}</span>
                            <span className="item-location">{item.location}</span>
                            {item.distance && (
                                <span className="item-distance">{item.distance.toFixed(1)} km away</span>
                            )}
                        </div>
                        <div className="item-actions">
                            {item.status === 'SWAPPED' ? (
                                <span className="item-status-swapped">Swapped</span>
                            ) : (
                                <>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleRequestSwap(item.id, item.ownerId)}
                                    >
                                        Request Swap
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleContactOwner(item.ownerId, item.id)}
                                    >
                                        Contact Owner
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={() => setShowAll(!showAll)} style={{marginBottom: '1rem'}}>
                {showAll ? 'Show Only By Distance' : 'Show All'}
            </button>

            {selectedImage && (
                <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Full Size" className="full-size-image" />
                        <button className="close-modal-button" onClick={() => setSelectedImage(null)}>&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Items; 