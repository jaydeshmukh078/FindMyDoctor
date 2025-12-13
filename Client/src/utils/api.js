// src/utils/api.js
import axios from "axios";

const BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKENDPORT ||
  "http://localhost:5000";

const API = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// attach token automatically if present
API.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return cfg;
});

export default API;