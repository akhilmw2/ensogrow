import axios from "axios";
import { getCookie } from "./utils";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    Authorization: `Bearer ${getCookie("accessToken")}`,
  },
  // or wherever your Node backend is hosted
  // Could be https://example.com
});

// Example of a function calling your Crop Recommendation endpoint
export const postCropRecommendation = async (data: {
  location: string;
  balconyDirection: string;
  space: string;
  sunlightHours: number;
}) => {
  try {
    const response = await api.post("/api/crop-recommendation", data);
    return response.data;
  } catch (error) {
    console.error("Error posting crop recommendation", error);
    throw error;
  }
};

// Example of a function to authenticate a user (login)
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/api/login", credentials);
    return response.data; // presumably { token, user } or something similar
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

export default api;
