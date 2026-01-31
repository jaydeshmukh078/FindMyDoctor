import axios from "axios";

/**
 * BASE URL priority:
 * 1️⃣ VITE_BACKEND_URL  (recommended → e.g. http://localhost:5000/api)
 * 2️⃣ BACKENDPORT       (fallback)
 * 3️⃣ localhost:5000   (default)
 */
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKENDPORT ||
  "http://localhost:5000";

// create axios instance
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // attach token if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // network error
    if (!error.response) {
      console.error("Network / Server error");
      return Promise.reject(error);
    }

    // 🔴 auto logout on unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
