"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { userService } from "@/services/userService";
import type { AuthResponse, Role } from "@/lib/types";

interface AuthState {
  user: Omit<AuthResponse, "token"> | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "petly.auth";

function persistAuth(state: AuthState) {
  const toPersist = state.token
    ? {
        user: state.user,
        token: state.token,
      }
    : null;
  if (!toPersist) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
}

function getInitialState(): AuthState {
  // Sempre começa com loading: false para evitar problemas de hidratação
  // O estado será atualizado no useEffect após a montagem
  if (typeof window === "undefined") {
    return { user: null, token: null, loading: false };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { user: null, token: null, loading: false };

  try {
    const parsed = JSON.parse(raw) as {
      user: AuthState["user"];
      token: string;
    };
    return { user: parsed.user ?? null, token: parsed.token ?? null, loading: false };
  } catch {
    return { user: null, token: null, loading: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => getInitialState());

  useEffect(() => {
    if (state.loading) return;
    persistAuth(state);
  }, [state]);

  const setAuth = (auth: AuthResponse | null) => {
    setState((prev) => ({
      ...prev,
      user: auth
        ? {
            id: auth.id,
            name: auth.name,
            email: auth.email,
            role: auth.role,
          }
        : null,
      token: auth?.token ?? null,
      loading: false,
    }));
  };

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const auth = await userService.login({ email, password });
      setAuth(auth);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const auth = await userService.register({ name, email, password });
      setAuth(auth);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      loading: state.loading,
      login,
      register,
      logout,
    }),
    [state, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useHasRole(roles: Role[]) {
  const { user } = useAuth();
  if (!user) return false;
  return roles.includes(user.role);
}

