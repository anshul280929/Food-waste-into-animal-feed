const API_BASE_URL = 'http://localhost:5000/api';

export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Signup failed');
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  uploadAnimal: async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/upload-animal`, {
            method: 'POST',
            body: formData  // Don't set Content-Type header, let browser set it
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
},

  getAnimals: async () => {
    const token = localStorage.getItem('token'); // Get token
    const response = await fetch(`${API_BASE_URL}/animals`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add token to headers
      },
    });
    if (!response.ok) throw new Error('Failed to fetch animals');
    return response.json();
  },
};