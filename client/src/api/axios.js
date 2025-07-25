import axios from "axios";

// Get base URL from environment variables with fallback
const getBaseURL = () => {
  // Use the new environment variable
  console.log("🔍 Environment Debug:");
  console.log("- All env vars:", import.meta.env);
  console.log("- VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("- NODE_ENV:", import.meta.env.NODE_ENV);
  
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  console.log("- Final baseURL:", baseURL);
  console.log("- Complete API URL:", `${baseURL}/api`);
  console.log("📍 End Debug");
  
  return `${baseURL}/api`;
};

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
