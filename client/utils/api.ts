import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/data_processing/";

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, { username, password });
    if (response.headers["content-type"]?.includes("application/json")) {
      return response.data;
    } else {
      throw new Error("Invalid JSON response");
    }
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    if (response.headers["content-type"]?.includes("application/json")) {
      return response.data;
    } else {
      throw new Error("Invalid JSON response");
    }
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
