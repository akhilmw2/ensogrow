import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

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
  const response = await api.post("/plants/recommendations", formData);
  // Typically returns something like: { message: "Plants created successfully", data: [...] }
  return response.data;
}

// POST /plants/custom
export const postCustomPlants = async (data: any) => {
  if (!data) {
    return null;
  }
  try {
    const response = await api.post("/plants/custom", data);
    return response.data.data;
  } catch (err) {
    return null;
  }
};

export default api;
