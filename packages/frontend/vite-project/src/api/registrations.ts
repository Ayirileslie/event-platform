import { api } from "./client";

export const registerForEvent = (eventId: string) =>
  api("/events/register", {
    method: "POST",
    body: JSON.stringify({ eventId }),
  });

export const listMyRegistrations = () => api("/registrations");

export const cancelRegistration = (eventId: string) =>
  api("/events/cancel", {
    method: "DELETE",
    body: JSON.stringify({ eventId }),
  });
