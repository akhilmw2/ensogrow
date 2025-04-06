import axios from "axios";
import { getCookie } from "./cookies";

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

// GET /plants/id
export async function getPlanDetail(plantId: string) {
  const response = await api.get(`/plants/${plantId}`);
  return response.data; // e.g. { data: [...] }
}

// PATCH /plants/:plantId/steps/:stepId/complete
export async function completeStep(plantId: string, stepId: number) {
  // Possibly your backend expects a payload or just a patch call
  const response = await api.patch(
    `/plants/${plantId}/steps/${stepId}/complete`
  );
  return response.data; // e.g. { message: 'Step updated', data: {...} }
}

export default api;
