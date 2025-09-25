import type { IResponseData } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ForgotPasswordRequest {
  email: string;
  phoneNumber: string;
}

// Mock delay to simulate network requests
const mockDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock Authentication API calls
export const authApi = {
  login: async (data: LoginRequest): Promise<IResponseData> => {
    await mockDelay(800);

    // Mock successful login
    return {
      success: true,
      message: "Login successful",
      data: {
        token: "mock-jwt-token-12345",
        user: {
          id: "1",
          email: data.email,
          firstName: "John",
          lastName: "Doe",
          nickname: "johndoe",
          avatar:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop&crop=faces&auto=format",
        },
      },
    };
  },

  register: async (data: RegisterRequest): Promise<IResponseData> => {
    await mockDelay(1200);

    return {
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: "2",
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
        },
      },
    };
  },

  logout: async (): Promise<IResponseData> => {
    await mockDelay(500);

    return {
      success: true,
      message: "Logout successful",
    };
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<IResponseData> => {
    await mockDelay(1000);

    return {
      success: true,
      message: "Password reset email sent successfully",
    };
  },

  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<IResponseData> => {
    await mockDelay(800);

    return {
      success: true,
      message: "Password changed successfully",
    };
  },

  deleteAccount: async (): Promise<IResponseData> => {
    await mockDelay(1500);

    return {
      success: true,
      message: "Account deleted successfully",
    };
  },
};
