import { validate } from "uuid";
import { Thread } from "@langchain/langgraph-sdk";
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { createClient } from "./client";
import { useAuthContext } from "./AuthProvider";
import { ASSISTANT_ID, LANGGRAPH_API_URL } from "@/constants/configs";

interface ThreadContextType {
  getThreads: () => Promise<Thread[]>;
  threads: Thread[];
  setThreads: Dispatch<SetStateAction<Thread[]>>;
  threadsLoading: boolean;
  setThreadsLoading: Dispatch<SetStateAction<boolean>>;
  deleteThread: (threadId: string) =>  Promise<void>
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

function getThreadSearchMetadata(
  assistantId: string,
): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const { token } = useAuthContext();
  const apiUrl = LANGGRAPH_API_URL;
  const assistantId = ASSISTANT_ID;

  const client = useMemo(() => {
    if (!apiUrl) return null;
    return createClient(apiUrl, token);
  }, [apiUrl, token])

  const getThreads = useCallback(async (): Promise<Thread[]> => {
    if(!client || !assistantId) return []
    
    const threads = await client.threads.search({
      metadata: {
        ...getThreadSearchMetadata(assistantId),
      },
      limit: 100,
    });

    return threads;
  }, [client, assistantId]);

  const deleteThread = useCallback(async (threadId: string) => {
    if(!client) return

    await client.threads.delete(threadId)
    getThreads()
    .then(setThreads)
    .catch(console.error)
  }, [client]);

  const value = {
    getThreads,
    threads,
    setThreads,
    threadsLoading,
    setThreadsLoading,
    deleteThread
  };

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
}

export const useThreads = () => {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
}
