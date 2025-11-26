import { api } from "@/lib/api";
import type { CreateEventPayload, Event } from "@/lib/types";

export const eventService = {
  list: () => api.get<Event[]>("/events"),
  getById: (id: number) => api.get<Event>(`/events/${id}`),
  create: (payload: CreateEventPayload, token: string | null) =>
    api.post<Event, CreateEventPayload>("/events", payload, token),
  update: (id: number, payload: CreateEventPayload, token: string | null) =>
    api.put<Event, CreateEventPayload>(`/events/${id}`, payload, token),
  remove: (id: number, token: string | null) =>
    api.delete<{ message: string }>(`/events/${id}`, token),
  approve: (id: number, token: string | null) =>
    api.patch<Event, Record<string, never>>(`/events/${id}/approve`, {}, token),
};

