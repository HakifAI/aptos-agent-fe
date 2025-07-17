"use client"
import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect, useState } from "react";

import { getContentString } from "../utils";
import { useQueryState, parseAsBoolean } from "nuqs";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import TextBox from "@/components/ui/text-box";
import Tabs, { ITab } from "@/components/ui/tabs";
import Personalized from "./personalized";
import SidebarIcon from "@/components/icons/sidebar-icon";
import HakifAiLogo from "@/components/icons/hakifai-logo";
import { useAuthContext } from "@/providers/AuthProvider";
import BinIcon from "@/components/icons/bin-icon";
import { Loader2, PenLine } from "lucide-react";
import Link from "next/link";
import EmptyItem from "@/components/ui/empty-item";
import UserIcon from "@/components/icons/user-icon";
import HistoryIcon from "@/components/icons/history-icon";
import XIcon from "@/components/icons/x-icon";
import TelegramIcon from "@/components/icons/telegram-icon";
import { SOCIAL_LINKS } from "@/utils/constants";
import { cn } from "@/lib/utils";

function ThreadList({
  threads,
  onThreadClick,
  onDeleteThread
}: {
  threads: Thread[];
  onThreadClick?: (threadId: string) => void;
  onDeleteThread: (threadId: string) => Promise<void>
}) {
  const [threadId, setThreadId] = useQueryState("threadId");
  const [_, setNewThread] = useQueryState("newThread", parseAsBoolean.withDefault(false));
  const [threadDeletedId, setThreadDeletedId] = useState<string | null>(null)
  const [deleteIdHovered, setDeleteIdHovered] = useState<string | null>(null)

  const handleDeleteThread = async (id: string) => {
    setThreadDeletedId(id)
    await onDeleteThread(id)
    setThreadDeletedId(null)
    if (id === threadId) {
      setThreadId(null)
      setNewThread(false)
    }
  }

  return (
    <div className="flex h-min w-full flex-col items-start justify-start gap-2 overflow-y-auto hide-scrollbar">
      {threads.map((t) => {
        let itemText = t.thread_id;
        if (
          typeof t.values === "object" &&
          t.values &&
          "messages" in t.values &&
          Array.isArray(t.values.messages) &&
          t.values.messages?.length > 0
        ) {
          const firstMessage = t.values.messages[0];
          itemText = getContentString(firstMessage.content);
        }
        return (
          <TextBox
            key={t.thread_id}
            onClick={(e) => {
              e.preventDefault();
              onThreadClick?.(t.thread_id);
              if (t.thread_id === threadId) return;
              setThreadId(t.thread_id);
            }}
            text={itemText}
            isActive={t.thread_id === threadId}
            className="flex w-full items-center justify-between"
            textClassName={cn({"text-blue-40": deleteIdHovered === t.thread_id})}
            contentClassName="flex-grow"
            action={
              <>
                {threadDeletedId && threadDeletedId === t.thread_id ? (
                  <span className="px-1">
                    <Loader2 className="size-6 animate-spin" />
                  </span>
                ) : (
                  <Button
                    onClick={() => handleDeleteThread(t.thread_id)}
                    onMouseOver={() => setDeleteIdHovered(t.thread_id)}
                    onMouseLeave={() => setDeleteIdHovered(null)}
                    variant="ghost"
                    className="hover:text-warning p-0"
                  >
                    <BinIcon className="size-6" />
                  </Button>
                )}
              </>
            }
          />
        );
      })}
    </div>
  );
}

function ThreadHistoryLoading() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-auto">
      {Array.from({ length: 30 }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-10 w-[280px]"
        />
      ))}
    </div>
  );
}

export default function ThreadHistory() {
  const [tab, setTab] = useState(window?.localStorage?.getItem("sidebar-tab") || "history")
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  const [_, setThreadId] = useQueryState(
    "threadId",
  );
  const [__, setNewThread] = useQueryState("newThread", parseAsBoolean.withDefault(false));

  const { isAuthenticated } = useAuthContext();
  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading, deleteThread } =
    useThreads();

  const tabs: ITab[] = [
    {
      label: (
        <>
          <HistoryIcon className="size-[18px]" />
          <span>History</span>
        </>
      ),
      value: "history",
    },
    {
      label: (
        <>
          <UserIcon className="size-[18px]" />
          <span>Personalized</span>
        </>
      ),
      value: "personalized",
    },
  ];

  const renderHeading = isAuthenticated ? (
    <Tabs
      list={tabs}
      activeValue={tab}
      onChange={setTab}
      className="mx-auto mb-8 w-min"
    />
  ) : (
    <div className="text-blue-60 flex items-center justify-center gap-2 mb-4">
      <UserIcon className="size-[18px] shrink-0" />
      <h2 className="text-semibold text-lg">
        Available Agents
      </h2>
    </div>
  );

  const renderContent = (isMobile = false) => (
    <>
      {isAuthenticated &&
        tab === "history" &&
        (threadsLoading ? (
          <ThreadHistoryLoading />
        ) : (
          <>
            {threads.length ? (
              <ThreadList
                key={`${isMobile}`}
                threads={threads}
                onThreadClick={
                  isMobile ? () => setChatHistoryOpen((o) => !o) : undefined
                }
                onDeleteThread={(id) => deleteThread(id)}
              />
            ) : (
              <EmptyItem className="mt-8" />
            )}
            <Button
              onClick={() => {
                setThreadId(null);
                setNewThread(false);
                if(isMobile) setChatHistoryOpen(false)
              }}
              variant="outline"
              className="mx-auto my-12 gap-[10px]"
            >
              <span className="text-blue-30">Start new thread</span>
              <PenLine className="size-6 text-blue-50" />
            </Button>
          </>
        ))}

      {(!isAuthenticated || tab === "personalized") && <Personalized />}
      <div className="mt-auto flex items-center justify-center gap-1 pb-8">
        <Link
          href={SOCIAL_LINKS.x}
          target="_blank"
          className="text-blue-60 hover:text-blue-30 p-[10px]"
        >
          <XIcon className="size-8" />
        </Link>
        <Link
          href={SOCIAL_LINKS.telegram}
          target="_blank"
          className="text-blue-60 hover:text-blue-30 p-[10px]"
        >
          <TelegramIcon className="size-8" />
        </Link>
      </div>
    </>
  );

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated) return;
    setThreadsLoading(true);
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("sidebar-tab", tab);
  }, [tab]);

  return (
    <>
      <div className="hidden h-full shrink-0 flex-col pt-16 lg:flex">
        <div className="mb-[58px] flex w-full items-center justify-between">
          <Link href="/" className="hover:opacity-70">
            <HakifAiLogo />
          </Link>
          <Button
            variant="ghost"
            onClick={() => setChatHistoryOpen(false)}
            className="hover:text-blue-20 text-blue-60 h-[52px] p-2.5"
          >
            <SidebarIcon className="size-8" />
          </Button>
        </div>

        {renderHeading}
        {renderContent()}
      </div>
      <div className="lg:hidden">
        <Sheet
          open={!!chatHistoryOpen && !isLargeScreen}
          onOpenChange={(open) => {
            if (isLargeScreen) return;
            setChatHistoryOpen(open);
          }}
        >
          <SheetContent
            side="left"
            className="flex w-full gap-0 border-none px-4 pt-20 sm:w-auto sm:min-w-[383px] lg:hidden"
          >
            <SheetTitle className="sr-only">Sidebar</SheetTitle>

            {renderHeading}
            {renderContent(true)}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
