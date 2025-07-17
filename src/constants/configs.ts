import type { Network } from "@aptos-labs/wallet-adapter-react";

export const NETWORK: Network =
  (process.env.NEXT_PUBLIC_APP_NETWORK as Network) ?? "testnet";
export const APTOS_API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY;

export const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID ?? "agent";
export const LANGGRAPH_API_URL =
  process.env.NEXT_PUBLIC_LANGGRAPH_API_URL ?? "http://localhost:2024";

export const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000/api";

export const EXPLORER_APTOSLABS_URL =
  process.env.NEXT_PUBLIC_EXPLORER_APTOSLABS_URL || "https://explorer.aptoslabs.com";

export const NODE_ENV = process.env.NODE_ENV || "development"