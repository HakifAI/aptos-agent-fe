import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { CookieStorage } from "@/lib/cookie-storage";
import { BACKEND_API_BASE_URL } from "@/constants/configs";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth headers
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = CookieStorage.getAuthToken();
      // const address = CookieStorage.getAuthAddress();

      if (token) {
        // Ensure headers object exists
        if (!config.headers) {
          config.headers = {} as any;
        }

        // Add authorization header
        config.headers.Authorization = `Bearer ${token}`;
        
        console.log(
          `🔐 [API] Adding auth headers for request to ${config.url}`,
        );
      } else {
        console.log(
          `🔓 [API] No auth token found for request to ${config.url}`,
        );
      }
    }

    return config;
  },
  (error) => {
    console.error("🚨 [API] Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful authenticated requests
    const hasAuthHeader = response.config.headers?.Authorization;
    if (hasAuthHeader) {
      console.log(
        `✅ [API] Authenticated request successful: ${response.config.url}`,
      );
    }

    return response;
  },
  (error) => {
    console.error("🚨 [API] Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn("🔒 [API] Unauthorized - clearing auth cookies");

      // Clear auth cookies on 401
      if (typeof window !== "undefined") {
        CookieStorage.clearAuth();

        // Dispatch custom event to notify auth state change
        window.dispatchEvent(
          new CustomEvent("auth:logout", {
            detail: { reason: "unauthorized" },
          }),
        );
      }
    }

    // Handle other auth-related errors
    if (error.response?.status === 403) {
      console.warn("🔒 [API] Forbidden - insufficient permissions");
    }

    // Handle token expiration specifically
    if (error.response?.data?.code === "TOKEN_EXPIRED") {
      console.warn("⏰ [API] Token expired - clearing auth");
      if (typeof window !== "undefined") {
        CookieStorage.clearAuth();
        window.dispatchEvent(
          new CustomEvent("auth:logout", {
            detail: { reason: "token_expired" },
          }),
        );
      }
    }

    // Return a more user-friendly error message
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  },
);

// Note: Cookie management is now handled by CookieStorage utility class

// Utility functions for manual control
export const apiUtils = {
  /**
   * Check if current request will have auth headers
   */
  hasAuthToken(): boolean {
    if (typeof window === "undefined") return false;
    return CookieStorage.isTokenValid();
  },

  /**
   * Make a request with explicit auth token (override cookies)
   */
  async authenticatedRequest<T = any>(
    config: AxiosRequestConfig,
    token?: string,
  ): Promise<AxiosResponse<T>> {
    const requestConfig = { ...config };

    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return apiClient(requestConfig);
  },

  /**
   * Make a request without auth headers (even if cookies exist)
   */
  async publicRequest<T = any>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const requestConfig = {
      ...config,
      headers: {
        ...config.headers,
        // Explicitly set no auth
        Authorization: undefined,
      },
    };

    return apiClient(requestConfig);
  },

  /**
   * Get current auth status
   */
  getAuthStatus() {
    if (typeof window === "undefined") {
      return { hasToken: false, token: null, address: null };
    }

    const token = CookieStorage.getAuthToken();
    const address = CookieStorage.getAuthAddress();

    return {
      hasToken: !!(token && address),
      token,
      address,
    };
  },
};

// Export the configured client
export default apiClient;

// Export types for use in other API files
export type { AxiosRequestConfig, AxiosResponse };
