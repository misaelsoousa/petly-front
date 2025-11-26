export type BackendStatus = "AVAILABLE" | "ADOPTED" | "LOST" | "FOUND";

export const STATUS_LABELS: Record<BackendStatus, string> = {
  AVAILABLE: "Disponível",
  ADOPTED: "Adotado",
  LOST: "Perdido",
  FOUND: "Encontrado",
};

export function statusLabel(status?: BackendStatus | string | null) {
  if (!status) return "-";
  return (STATUS_LABELS as Record<string, string>)[status] ?? status;
}
