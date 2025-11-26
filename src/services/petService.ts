import { api } from "@/lib/api";
import type { CreatePetPayload, Pet, UpdatePetPayload } from "@/lib/types";

export const petService = {
  list: () => api.get<Pet[]>("/pets"),
  getById: (id: number) => api.get<Pet>(`/pets/${id}`),
  create: (payload: CreatePetPayload, token: string | null) =>
    api.post<Pet, CreatePetPayload>("/pets", payload, token),
  update: (id: number, payload: UpdatePetPayload, token: string | null) =>
    api.put<Pet, UpdatePetPayload>(`/pets/${id}`, payload, token),
  remove: (id: number, token: string | null) =>
    api.delete<{ message: string }>(`/pets/${id}`, token),
};
