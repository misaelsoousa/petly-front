export type Role = "USER" | "ONG" | "VET" | "ADMIN";

export type PetStatus = "AVAILABLE" | "ADOPTED" | "LOST" | "FOUND";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type EventStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ReportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  address?: string | null;
  reputation?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  sex?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: PetStatus;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  owner?: Pick<User, "id" | "name" | "email" | "role">;
}

export interface AdoptionRequest {
  id: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  petId: number;
  userId: number;
  user?: User;
  pet?: Pet;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status: EventStatus;
  organizerId: number;
  organizer?: Pick<User, "id" | "name" | "email" | "role">;
}

export interface Report {
  id: number;
  description: string;
  photoUrl?: string | null;
  videoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: ReportStatus;
  reporterId?: number | null;
  createdAt: string;
}

export interface CreatePetPayload {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  description?: string;
  status: PetStatus;
  sex?: string;
  photoUrl?: string;
}

export interface UpdatePetPayload extends Partial<CreatePetPayload> {}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface CreateReportPayload {
  description: string;
  photoUrl?: string;
  videoUrl?: string;
  latitude?: number;
  longitude?: number;
}

