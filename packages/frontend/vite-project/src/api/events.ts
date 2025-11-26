import { api } from "./client";

export const createEvent = (data: any) =>
  api("/events/create", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const listEvents = () => api("/events/all");

export const listAllEvents = () => api("/events/all");

export const listMyEvents = () => api("/events/my-events");

export const getEvent = (eventId: string) => api(`/events/${eventId}`);

export const getEventRegistrations = (eventId: string) => 
  api(`/events/${eventId}/registrations`);

export const registerEvent = (eventId: string) =>
  api("/events/register", {
    method: "POST",
    body: JSON.stringify({ eventId }),
  });

export const cancelRegistration = (eventId: string) =>
  api("/events/cancel", {
    method: "DELETE",
    body: JSON.stringify({ eventId }),
  });