import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});


// POST /plants/recommendations
export async function postCropRecommendation(formData: {
    location: string;
    sunlightHours: number;
    availableSpace: string;
  }) {
    // This call will hit: baseURL + "/plants/recommendations"
    const response = await api.post('/plants/recommendations', formData);
    // Typically returns something like: { message: "Plants created successfully", data: [...] }
    return response.data;
}

// Example of a function to authenticate a user (login)
export const loginUser = async (credentials: {
    email: string;
    password: string;
}) => {
    try {
        const response = await api.post('/api/login', credentials);
        return response.data; // presumably { token, user } or something similar
    } catch (error) {
        console.error('Error logging in', error);
        throw error;
    }
};

export default api;