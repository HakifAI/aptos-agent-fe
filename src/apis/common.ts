import apiClient from "./client";
import { IGetAgentRoles, Token } from "@/types/common.type";

// Request/Response interfaces

// Auth API service class
export class CommonAPI {
  /**
   * Get list tokens
   */
  async getListTokens(): Promise<Token[]> {
    try {
      const response = await apiClient.get<Token[]>("/token/list");
      return response.data;
    } catch (error) {
      console.error("Failed to get list tokens:", error);
      throw error;
    }
  };
  async getAgentRoles(): Promise<IGetAgentRoles> {
    try {
      const response = await apiClient.get<IGetAgentRoles>("/agent/roles");
      return response.data;
    } catch (error) {
      console.error("Failed to get agent roles: ", error);
      throw error;
    }
  };
  
}

// Export singleton instance
export const commonAPI = new CommonAPI();
