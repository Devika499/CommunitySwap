const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

const handleAuthError = (error) => {
    console.log('Authentication error:', error);
    // Don't remove tokens immediately, let the login page handle it
    window.location.href = '/login';
};

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ refreshToken }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.token;
    } catch (error) {
        console.error('Token refresh failed:', error);
        handleAuthError(error);
        throw error;
    }
};

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            errorMessage = errorData.message || `HTTP Error: ${response.status}`;
        } catch (e) {
            console.error('Failed to parse error response:', e);
        }
        
        if (response.status === 401) {
            try {
                const newToken = await refreshToken();
                // Retry the original request with the new token
                const retryResponse = await fetch(response.url, {
                    method: response.method,
                    headers: {
                        ...getAuthHeader(),
                        'Authorization': `Bearer ${newToken}`
                    },
                    body: response.body,
                    credentials: 'include'
                });
                return handleResponse(retryResponse);
            } catch (refreshError) {
                handleAuthError(errorMessage);
                throw new Error(errorMessage);
            }
        }
        
        if (response.status === 403) {
            handleAuthError(errorMessage);
        }
        throw new Error(errorMessage);
    }
    
    try {
        const data = await response.json();
        return data;
    } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Failed to parse server response');
    }
};

export const api = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: getAuthHeader(),
                credentials: 'include'
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    post: async (endpoint, body) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(body),
                credentials: 'include'
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Add a method to check authentication status
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    }
}; 