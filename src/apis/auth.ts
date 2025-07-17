import type { User } from "@/types/user.type";
import apiClient from "./client";

// Request/Response interfaces
export interface NonceRequest {
  address: string;
  publicKey: string;
}

export interface NonceResponse {
  nonce: string;
}

export interface VerifyRequest {
  address: string;
  signature: string;
  message: string;
  nonce: string;
  publicKey: string;
}

export interface VerifyResponse {
  accessToken: string;
  user: User;
}

// Auth API service class
export class AuthAPI {
  /**
   * Request a nonce for authentication
   */
  async requestNonce(request: NonceRequest): Promise<NonceResponse> {
    try {
      const response = await apiClient.post<NonceResponse>(
        "/auth/nonce",
        request,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to request nonce:", error);
      throw error;
    }
  }

  /**
   * Verify signature and get auth token
   */
  async verifySignature(request: VerifyRequest): Promise<VerifyResponse> {
    try {
      const response = await apiClient.post<VerifyResponse>(
        "/auth/verify",
        request,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to verify signature:", error);
      throw error;
    }
  }

  /**
   * Helper method to get auth headers for manual requests
   * Note: The axios client will automatically add auth headers via interceptor
   */
  static getAuthHeaders(token: string | null): Record<string, string> {
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Refresh token (placeholder for future implementation)
   */
  async refreshToken(refreshToken: string): Promise<VerifyResponse> {
    try {
      const response = await apiClient.post<VerifyResponse>(
        "/api/auth/refresh",
        {
          refreshToken,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  }

   /**
   * Get user
   */
  async getUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const authAPI = new AuthAPI();
