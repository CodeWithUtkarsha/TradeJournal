import type { LoginRequest, RegisterRequest, User } from "@shared/schema";

export interface AuthResponse {
  user: User;
  token: string;
}

// Mock user data
const mockUser: User = {
  id: "mock-user-id",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  profilePhoto: "",
  preferredBroker: "MetaTrader",
  experience: "Intermediate",
  bio: "Passionate trader",
  defaultRisk: 2.00,
  riskRewardRatio: "1:2",
  currency: "USD",
  emailNotifications: true,
  aiInsights: true,
  weeklyReports: false,
  pushNotifications: true,
  twoFactorEnabled: false,
  subscription: "Free",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const auth = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Mock login - in a real app, this would authenticate with your backend/service
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    if (credentials.email === "user@example.com" && credentials.password === "password") {
      const token = "mock-jwt-token";
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(mockUser));
      
      // Dispatch custom event to notify components of login
      window.dispatchEvent(new CustomEvent('auth-login'));
      
      return {
        user: mockUser,
        token
      };
    } else {
      throw new Error("Invalid credentials");
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Mock registration - in a real app, this would create a new user
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const newUser: User = {
      ...mockUser,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      id: `user-${Date.now()}`,
    };
    
    const token = "mock-jwt-token";
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(newUser));
    
    // Dispatch custom event to notify components of registration/login
    window.dispatchEvent(new CustomEvent('auth-login'));
    
    return {
      user: newUser,
      token
    };
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        return JSON.parse(userData) as User;
      }
      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    // Dispatch custom event to notify components of logout
    window.dispatchEvent(new CustomEvent('auth-logout'));
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
