import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "") || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// attach token with interceptor
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token && config?.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
