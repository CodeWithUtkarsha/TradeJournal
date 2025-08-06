import { apiRequest } from "./queryClient";
import type { LoginRequest, RegisterRequest, User } from "@shared/schema";

export interface AuthResponse {
  user: User;
  token: string;
}

export const auth = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }
    
    return data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }
    
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  logout() {
    localStorage.removeItem("auth_token");
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

// Add auth token to all API requests
const originalApiRequest = apiRequest;
export { originalApiRequest };

export async function authenticatedApiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const token = auth.getToken();
  
  const response = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (response.status === 401) {
    auth.logout();
    window.location.href = "/login";
  }

  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${text}`);
  }

  return response;
}
