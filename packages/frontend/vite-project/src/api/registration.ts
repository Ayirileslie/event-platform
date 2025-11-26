import { api } from "./client";

export function registerForEvent(eventId: string) {
  return api(`/registrations/${eventId}`, {
    method: "POST",
  });
}

export function cancelRegistration(eventId: string) {
  return api(`/registrations/${eventId}`, {
    method: "DELETE",
  });
}

export function listMyRegistrations() {
  return api("/registrations/mine", {
    method: "GET",
  });
}

export function listEventRegistrations(eventId: string) {
  return api(`/registrations/event/${eventId}`, {
    method: "GET",
  });
}
