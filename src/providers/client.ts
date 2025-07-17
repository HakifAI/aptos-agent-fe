import { Client } from "@langchain/langgraph-sdk";

export function createClient(apiUrl: string, token: string | undefined | null) {
  return new Client({
    apiUrl,
    defaultHeaders: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });
}
