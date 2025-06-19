import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const PostItem = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // To store the file object
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // To display image preview
    const [location, setLocation] = useState('');
    const [type, setType] = useState('SWAP'); // Default to SWAP
    const [message, setMessage] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Geolocation captured:', position.coords.latitude, position.coords.longitude);
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result); // This is the Base64 data URL
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            setImagePreviewUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

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

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('location', finalLocation);
        formData.append('type', type);
        if (selectedImage) {
            formData.append('imageFile', selectedImage);
        }
        if (finalLatitude) {
            formData.append('latitude', finalLatitude);
        }
        if (finalLongitude) {
            formData.append('longitude', finalLongitude);
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8080/api/items', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do NOT set Content-Type; browser will set it for FormData
                },
                body: formData
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Item posted successfully!' });
                setTitle('');
                setDescription('');
                setCategory('');
                setSelectedImage(null);
                setImagePreviewUrl('');
                setLocation('');
                setType('SWAP');
                navigate('/dashboard'); // Redirect back to dashboard after posting
            } else {
                const errorText = await response.text();
                setMessage({ type: 'error', text: `Failed to post item: ${errorText}` });
                console.error('Failed to post item:', response.status, errorText);
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Error: ${error.message}` });
            console.error('Error posting item:', error);
        }
    };

    return (
        <div className="form-container">
            <h1>Post a New Item</h1>
            {message && <div className={`message ${message.type}`}>{message.text}</div>}
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
                    ></textarea>
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div>
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreviewUrl && (
                        <div className="image-preview">
                            <img src={imagePreviewUrl} alt="Image Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                        </div>
                    )}
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="SWAP">SWAP</option>
                        <option value="GIVEAWAY">GIVEAWAY</option>
                    </select>
                </div>
                <button type="submit">Post Item</button>
            </form>
        </div>
    );
};

export default PostItem; 