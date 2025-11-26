import { api } from "./client";

export const login = (credentials: { email: string; password: string }) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const signup = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) =>
  api("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
