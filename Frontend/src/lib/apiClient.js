import axios from "axios";

// Import your backend base URL constant
import { BACKEND_BASE_URL } from "./api";

// Helper to get token from localStorage safely
const getToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.token || null;
    } catch {
        return null;
    }
};

// Create axios instance for backend requests
const apiClient = axios.create({
    baseURL: BACKEND_BASE_URL,
});

// Add auth token to headers automatically
apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
