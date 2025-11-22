/**
 * API service for authentication
 */

import { apiClient } from "./client";

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    tenant_id: number;
  };
  token: string;
  tenant: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface RegisterResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    tenant_id: number;
  };
  token: string;
  tenant: {
    id: number;
    name: string;
    slug: string;
  };
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/login", {
    email,
    password,
  });

  // Store token and tenant ID
  apiClient.setToken(response.token);
  apiClient.setTenantId(response.tenant.id.toString());

  return response;
}

/**
 * Register a new user
 */
export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  tenant_name?: string;
}): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>("/register", data);

  // Store token and tenant ID
  apiClient.setToken(response.token);
  apiClient.setTenantId(response.tenant.id.toString());

  return response;
}

/**
 * Logout (clear token)
 */
export function logout(): void {
  apiClient.setToken(null);
  apiClient.setTenantId(null);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<LoginResponse["user"]> {
  return apiClient.get<LoginResponse["user"]>("/me");
}


