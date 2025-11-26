const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

interface RequestOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  token?: string | null;
  headers?: HeadersInit;
  cache?: RequestCache;
}

// 🔥 Agora SEM retorno undefined: garante JSON sempre
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("A API retornou um formato inválido (não JSON).");
  }

  return (await response.json()) as T;
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    token,
    headers = {},
    cache = "no-store",
  } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Content-Type", "application/json");

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  if (!response.ok) {
    let errorBody: unknown;

    try {
      errorBody = await parseResponse<unknown>(response);
    } catch {
      errorBody = null;
    }

    const error: ApiError = {
      status: response.status,
      message:
        (errorBody as { message?: string })?.message ??
        "Erro ao se comunicar com o servidor",
      details: errorBody,
    };

    throw error;
  }

  return parseResponse<TResponse>(response);
}

export const api = {
  get: <TResponse>(path: string, token?: string | null, cache?: RequestCache) =>
    apiRequest<TResponse>(path, { token, cache }),

  post: <TResponse, TBody>(
    path: string,
    body: TBody,
    token?: string | null
  ) => apiRequest<TResponse, TBody>(path, { method: "POST", body, token }),

  put: <TResponse, TBody>(
    path: string,
    body: TBody,
    token?: string | null
  ) => apiRequest<TResponse, TBody>(path, { method: "PUT", body, token }),

  patch: <TResponse, TBody>(
    path: string,
    body: TBody,
    token?: string | null
  ) => apiRequest<TResponse, TBody>(path, { method: "PATCH", body, token }),

  delete: <TResponse>(path: string, token?: string | null) =>
    apiRequest<TResponse>(path, { method: "DELETE", token }),
};

// Paginação (inalterado)
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};
