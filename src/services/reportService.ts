import { api } from "@/lib/api";
import type { CreateReportPayload, Report } from "@/lib/types";

export const reportService = {
  create: (payload: CreateReportPayload, token?: string | null) =>
    api.post<Report, CreateReportPayload>("/reports", payload, token ?? null),
  list: (token: string | null) => api.get<Report[]>("/reports", token),
  getById: (id: number, token: string | null) =>
    api.get<Report>(`/reports/${id}`, token),
  updateStatus: (
    id: number,
    payload: Partial<Report>,
    token: string | null,
  ) => api.patch<Report, Partial<Report>>(`/reports/${id}`, payload, token),
};

