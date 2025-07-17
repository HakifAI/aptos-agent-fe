"use client";

import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user.type";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  address: string | null;
  isLoading: boolean;
  authenticate: () => Promise<boolean>;
  authenticateTwitter: (token: string) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
  isWalletMatched: boolean;
  isWalletLoading: boolean;
  canAuthenticate: boolean;
  openConnectWallet: boolean;
  setOpenConnectWallet: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
} 