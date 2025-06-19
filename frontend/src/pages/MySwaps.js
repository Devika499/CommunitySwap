import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MySwaps() {
    const [swapRequests, setSwapRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to view your swaps');
            setLoading(false);
            return;
        }
        fetchSwapRequests();
    }, []);

    const fetchSwapRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to view your swaps');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8080/api/swap-requests/my-swaps', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch swap requests: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setSwapRequests(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching swap requests:', err);
            setError(err.message || 'Failed to fetch swap requests. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSwap = async (swapRequestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to complete the swap');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/swap-requests/${swapRequestId}/complete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Swap completed successfully!');
                fetchSwapRequests(); // Refresh the list
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Failed to complete swap: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error completing swap:', error);
            alert(`Error completing swap: ${error.message}`);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container error-message">Error: {error}</div>;

    return (
        <div className="container">
            <h1>Swaps</h1>
            <div className="swaps-container">
                {swapRequests.length === 0 ? (
                    <p>No swap requests found.</p>
                ) : (
                    swapRequests.map(swap => (
                        <div key={swap.id} className="swap-card">
                            <div className="swap-info">
                                <h3>Swap Request for: {swap.itemTitle || 'Unknown Item'}</h3>
                                <p>Status: {swap.status || 'Unknown'}</p>
                                <p>Requested by: {swap.requesterName || 'Unknown User'}</p>
                                <p>Item Owner: {swap.itemOwnerName || 'Unknown Owner'}</p>
                            </div>
                            <div className="swap-actions">
                                {swap.status === 'ACCEPTED' && swap.requesterId === currentUserId && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleCompleteSwap(swap.id)}
                                    >
                                        Complete Swap
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MySwaps; 