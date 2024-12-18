import { useUserContext } from "@/context/UserContext";
import axios, { AxiosResponse } from "axios";
import { use } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/data_processing/";

// Register user function
export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}register/`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is JSON
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

// Login user function
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}login/`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is JSON
    if (response.headers["content-type"]?.includes("application/json")) {
      const data = response.data;
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      return data;
    } else {
      throw new Error("Invalid JSON response");
    }
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export interface UploadResponse {
  data: Array<Record<string, any>>;
  data_types: Record<string, string>;
}

// Upload single file API
export const uploadFile = async (
  formData: FormData,
  token: string,
  onUploadProgress?: (progress: number) => void
): Promise<AxiosResponse<UploadResponse, any>> => {
  try {
    const response = await axios.post(`${API_URL}upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
      onUploadProgress: (event) => {
        if (event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          if (onUploadProgress) {
            onUploadProgress(progress);
          }
        }
      },
    });
    return response;
  } catch (error: any) {
    console.error("File upload failed:", error);
    throw error.response?.data || error.message;
  }
};

// Upload file chunk API
export const uploadChunk = async (formData: FormData, token: string, onUploadProgress?: (progress: number) => void) => {
  try {
    const response = await axios.post(`${API_URL}upload-chunk/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
      onUploadProgress: (event) => {
        if (event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          if (onUploadProgress) {
            onUploadProgress(progress);
          }
        }
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Chunk upload failed:", error);
    throw error.response?.data || error.message;
  }
};

// Example of an authenticated request with Authorization header
export const getProtectedData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found, please login first.");
  }

  try {
    const response = await axios.get(`${API_URL}protected/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`, // Use "Bearer" for JWT: `Bearer ${token}`
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
