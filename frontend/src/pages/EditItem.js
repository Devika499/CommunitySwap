import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Helper for reverse geocoding
async function reverseGeocode(lat, lon) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  const data = await response.json();
  return (
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.hamlet ||
    data.address?.state ||
    data.display_name ||
    ''
  );
}

function EditItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [removeImage, setRemoveImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/items/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch item: ${response.statusText}`);
                }

                const data = await response.json();
                setItem(data);
                setTitle(data.title);
                setDescription(data.description);
                setCategory(data.category);
                setType(data.type);
                setLocation(data.location);
                setCurrentImageUrl(data.imageUrl || '');

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();

        // Get current geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let finalLatitude = latitude;
        let finalLongitude = longitude;
        let finalLocation = location;

        // Geocode the location if provided
        if (location) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
                const data = await response.json();
                if (data.length > 0) {
                    finalLatitude = data[0].lat;
                    finalLongitude = data[0].lon;
                    finalLocation = location;
                    console.log('Geocoded location:', location, finalLatitude, finalLongitude);
                } else {
                    console.warn('Geocoding failed, using browser geolocation');
                }
            } catch (err) {
                console.error('Geocoding error:', err);
            }
        } else if (finalLatitude && finalLongitude) {
            // If no location string, but we have coordinates, reverse geocode them
            try {
                finalLocation = await reverseGeocode(finalLatitude, finalLongitude);
                console.log('Reverse geocoded location:', finalLocation);
            } catch (err) {
                console.error('Reverse geocoding error:', err);
            }
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('type', type);
            formData.append('location', finalLocation);
            if (selectedFile) {
                formData.append('imageFile', selectedFile);
            } else if (currentImageUrl && !removeImage) {
                formData.append('imageUrl', currentImageUrl);
            } else if (removeImage) {
                formData.append('removeImage', 'true');
            }
            if (finalLatitude) {
                formData.append('latitude', finalLatitude);
            }
            if (finalLongitude) {
                formData.append('longitude', finalLongitude);
            }

            const response = await fetch(`http://localhost:8080/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            setLoading(false);
            if (response.ok) {
                alert('Item updated successfully!');
                navigate('/dashboard');
            } else {
                const errorText = await response.text();
                alert(`Failed to update item: ${errorText}`);
            }
        } catch (err) {
            setLoading(false);
            alert(`Error updating item: ${err.message}`);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setRemoveImage(false);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setCurrentImageUrl('');
        setRemoveImage(true);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLoading(false);
            if (response.ok) {
                alert('Item deleted successfully!');
                navigate('/dashboard');
            } else {
                const errorText = await response.text();
                alert(`Failed to delete item: ${errorText}`);
            }
        } catch (err) {
            setLoading(false);
            alert(`Error deleting item: ${err.message}`);
        }
    };

    if (loading) return <div className="form-container">Loading item...</div>;
    if (error) return <div className="form-container">Error: {error}</div>;
    if (!item) return <div className="form-container">Item not found.</div>;

    return (
        <div className="form-container">
            <h1>Edit Item</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="SWAP">SWAP</option>
                        <option value="GIVEAWAY">GIVEAWAY</option>
                    </select>
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Image:</label>
                    {(currentImageUrl && !removeImage) && (
                        <div className="image-preview-container">
                            <img src={`http://localhost:8080${currentImageUrl}`} alt="Current Item" className="image-preview" />
                            <button type="button" onClick={handleRemoveImage} className="btn btn-secondary remove-image-btn">
                                Remove Current Image
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                    {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Item'}</button>
                <button type="button" onClick={handleDelete} style={{marginTop: '1rem', backgroundColor: '#dc3545', color: 'white', width: '100%'}} disabled={loading}>
                  Delete Item
                </button>
            </form>
        </div>
    );
}

export default EditItem; 