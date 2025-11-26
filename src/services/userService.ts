import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export const userService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse, LoginPayload>("/users/login", payload),
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse, RegisterPayload>("/users/register", payload),
  getUsers: (token: string | null) =>
    api.get<User[]>("/users", token),
  getUserById: (id: number, token: string | null) =>
    api.get<User>(`/users/${id}`, token),
  updateUser: (id: number, payload: Partial<User>, token: string | null) =>
    api.put<User, Partial<User>>(`/users/${id}`, payload, token),
  deleteUser: (id: number, token: string | null) =>
    api.delete<{ message: string }>(`/users/${id}`, token),
};

