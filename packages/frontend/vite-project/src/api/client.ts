// packages/frontend/src/api/client.ts
const API_BASE = import.meta.env.VITE_API_URL || "https://rfim8ivv3h.execute-api.us-east-1.amazonaws.com";

export async function api(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  const url = `${API_BASE}${endpoint}`;
  console.log('API Request:', url); // Debug log
  
  const res = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error('API Error:', text); // Debug log
    throw new Error(text || "API error");
  }
  
  return res.json();
}

export { API_BASE };
