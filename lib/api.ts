import axios from "axios";
import { getCookie } from "./utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getCookie("accessToken")}`,
  },
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

// POST /plants/:plantId/activate
export async function activatePlant(plantId: string) {
  const response = await api.patch(`/plants/${plantId}/activate`);
  return response.data; // e.g. { message: 'Plant activated', data: ... }
}

// GET /plants/active
export async function getActivePlants() {
  const response = await api.get("/plants/active");
  return response.data; // e.g. { data: [...] }
}

export default api;
