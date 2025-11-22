"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type Role = "admin" | "user" | null;
type Space = "admin" | "user" | null;

type AuthState = {
  isAuthenticated: boolean;
  userRole: Role;
  userName: string | null;
  activeSpace: Space;
};

type AuthContextValue = AuthState & {
  login: (payload: { name: string; role: Exclude<Role, null> }) => void;
  register: (payload: { name: string; role: Exclude<Role, null> }) => void;
  logout: () => void;
  quickLoginUser: () => void;
  quickLoginAdmin: () => void;
  switchToAdmin: () => void;
  switchToUser: () => void;
};

const MockAuthContext = createContext<AuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    userRole: null,
    userName: null,
    activeSpace: null,
  });

  const handleLogin = (name: string, role: Exclude<Role, null>) => {
    try {
      setState({
        isAuthenticated: true,
        userRole: role,
        userName: name,
        activeSpace: role,
      });
    } catch (error) {
      console.error("Auth error:", error);
      throw error;
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: ({ name, role }) => handleLogin(name, role),
      register: ({ name, role }) => handleLogin(name, role),
      quickLoginUser: () => handleLogin("Mohammed", "user"),
      quickLoginAdmin: () => handleLogin("Mohammed", "admin"),
      logout: () =>
        setState({
          isAuthenticated: false,
          userRole: null,
          userName: null,
          activeSpace: null,
        }),
      switchToAdmin: () =>
        setState((prev) => ({
          ...prev,
          activeSpace: prev.userRole === "admin" ? "admin" : prev.activeSpace,
        })),
      switchToUser: () =>
        setState((prev) => ({
          ...prev,
          activeSpace: prev.userRole === "admin" ? "user" : prev.activeSpace,
        })),
    }),
    [state],
  );

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth() {
  const ctx = useContext(MockAuthContext);
  if (!ctx) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return ctx;
}

// Alias to match spec naming
export const useAuthStore = useMockAuth;
