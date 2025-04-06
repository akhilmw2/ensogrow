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

// POST /plants/custom
export async function postCustomPlant(plantName: string) {
    try {
      // Adjust the request body shape if your backend expects something else
      const response = await api.post('/plants/custom', { name: plantName });
      // e.g. response.data might be { id: 99, plantName: "Tomatoes", ... }
      return response.data;
    } catch (err: any) {
      throw err;
    }
  }

export default api;