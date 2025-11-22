"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import * as authApi from "@/lib/api/auth";

export type Role = "admin" | "user" | null;
type Space = "admin" | "user" | null;

type AuthState = {
  isAuthenticated: boolean;
  userRole: Role;
  userName: string | null;
  userEmail: string | null;
  userId: string | null;
  tenantId: string | null;
  activeSpace: Space;
};

type AuthContextValue = AuthState & {
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; password_confirmation: string; tenant_name?: string }) => Promise<void>;
  logout: () => void;
  quickLoginUser: () => void;
  quickLoginAdmin: () => void;
  switchToAdmin: () => void;
  switchToUser: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    userRole: null,
    userName: null,
    userEmail: null,
    userId: null,
    tenantId: null,
    activeSpace: null,
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = apiClient.getToken();
    const tenantId = apiClient.getTenantId();
    
    if (token && tenantId) {
      // Try to fetch current user to validate token
      authApi.getCurrentUser()
        .then((user) => {
          setState({
            isAuthenticated: true,
            userRole: user.role === "admin" || user.role === "owner" ? "admin" : "user",
            userName: user.name,
            userEmail: user.email,
            userId: user.id.toString(),
            tenantId: user.tenant_id.toString(),
            activeSpace: user.role === "admin" || user.role === "owner" ? "admin" : "user",
          });
          apiClient.setTenantId(user.tenant_id.toString());
        })
        .catch(() => {
          // Token invalid, clear it
          apiClient.setToken(null);
          apiClient.setTenantId(null);
        });
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      setState({
        isAuthenticated: true,
        userRole: response.user.role === "admin" || response.user.role === "owner" ? "admin" : "user",
        userName: response.user.name,
        userEmail: response.user.email,
        userId: response.user.id.toString(),
        tenantId: response.tenant.id.toString(),
        activeSpace: response.user.role === "admin" || response.user.role === "owner" ? "admin" : "user",
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    tenant_name?: string;
  }) => {
    try {
      const response = await authApi.register(data);
      
      setState({
        isAuthenticated: true,
        userRole: response.user.role === "admin" || response.user.role === "owner" ? "admin" : "user",
        userName: response.user.name,
        userEmail: response.user.email,
        userId: response.user.id.toString(),
        tenantId: response.tenant.id.toString(),
        activeSpace: response.user.role === "admin" || response.user.role === "owner" ? "admin" : "user",
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setState({
      isAuthenticated: false,
      userRole: null,
      userName: null,
      userEmail: null,
      userId: null,
      tenantId: null,
      activeSpace: null,
    });
    router.push("/auth/login");
  };

  const refreshUser = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setState((prev) => ({
        ...prev,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role === "admin" || user.role === "owner" ? "admin" : "user",
      }));
    } catch (error) {
      console.error("Failed to refresh user:", error);
      handleLogout();
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: ({ email, password }) => handleLogin(email, password),
      register: (data) => handleRegister(data),
      quickLoginUser: () => {
        // For development only - remove in production
        console.warn("Quick login is for development only");
      },
      quickLoginAdmin: () => {
        // For development only - remove in production
        console.warn("Quick login is for development only");
      },
      logout: handleLogout,
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
      refreshUser,
    }),
    [state, router],
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

// Alias for backward compatibility
export const useAuthStore = useAuth;
export const useMockAuth = useAuth; // Keep for backward compatibility during migration


