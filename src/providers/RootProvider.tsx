"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { IAgentRole, Token } from "@/types/common.type";
import { useRoot } from "@/hooks/useRoot";

interface RootContextType {
  listTokens: Token[];
  agentRoles: IAgentRole[],
  agentTags: string[]
}

const RootContext = createContext<RootContextType | undefined>(undefined);

export function RootProvider({ children }: { children: ReactNode }) {
  const root = useRoot();

  return (
    <RootContext.Provider value={root}>
      {children}
    </RootContext.Provider>
  );
}

export function useRootContext() {
  const context = useContext(RootContext);
  if (context === undefined) {
    throw new Error("useRootContext must be used within an RootProvider");
  }
  return context;
} 