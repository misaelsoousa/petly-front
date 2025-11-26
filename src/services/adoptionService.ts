import { api } from "@/lib/api";
import type { AdoptionRequest, RequestStatus } from "@/lib/types";

interface CreateAdoptionPayload {
  petId: number;
}

interface UpdateAdoptionPayload {
  status: RequestStatus;
}

export const adoptionService = {
  create: (payload: CreateAdoptionPayload, token: string | null) =>
    api.post<AdoptionRequest, CreateAdoptionPayload>(
      "/adoptions",
      payload,
      token,
    ),
  list: (token: string | null) => api.get<AdoptionRequest[]>("/adoptions", token),
  updateStatus: (
    id: number,
    payload: UpdateAdoptionPayload,
    token: string | null,
  ) => api.patch<AdoptionRequest, UpdateAdoptionPayload>(
    `/adoptions/${id}`,
    payload,
    token,
  ),
  remove: (id: number, token: string | null) =>
    api.delete<{ message: string }>(`/adoptions/${id}`, token),
};

