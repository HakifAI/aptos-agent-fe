import { v4 as uuidv4 } from "uuid";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useStreamContext } from "@/providers/Stream";
import { useState, FormEvent } from "react";
import { Button } from "../ui/button";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import { AssistantMessage, Interrupt } from "./messages/ai";
import { HumanMessage } from "./messages/human";
import {
  DO_NOT_RENDER_ID_PREFIX,
  ensureToolCallsHaveResponses,
} from "@/lib/ensure-tool-responses";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  // Plus,
} from "lucide-react";
import { useQueryState, parseAsBoolean } from "nuqs";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ContentBlocksPreview } from "./ContentBlocksPreview";
import {
  useArtifactContext,
} from "./artifact";
import { useAuthContext } from "@/providers/AuthProvider";
import TrendingAgents from "./trending-agents";
import ScreenLoading from "../layout/screen-loading";
import { useRootContext } from "@/providers/RootProvider";
import { useThreads } from "@/providers/Thread";
import { useRouter } from "next/navigation";
import HakifiBrandIcon from "../icons/hakifi-brand-icon";
import Image from "next/image";
import { IMessage } from "@/types/common.type";
import AgentImage from "./agent-image";
import AutoResizeTextarea from "../ui/auto-resize-textarea";

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  containerClassName?: string;
}) {
  const context = useStickToBottomContext();
  return (
    <div
      className={props.className}
      style={{ overflow: "hidden" }}
    >
      <div
        className={props.containerClassName}
        ref={context.scrollRef}
      >
        <div
          ref={context.contentRef}
          className={props.contentClassName}
        >
          {props.content}
        </div>

        {props.footer}
      </div>
    </div>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button
      className={cn("bg-blue-150/90", props.className)}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

export function Thread() {
  const [artifactContext, _] = useArtifactContext();
  const {agentRoles} = useRootContext()
  const [threadId, _setThreadId] = useQueryState("threadId");
  const [newThread, setNewThread] = useQueryState("newThread", parseAsBoolean.withDefault(false));
  const [agent, ___] = useQueryState("agent");
  const {replace} = useRouter()
  const [input, setInput] = useState("");
  const [messageOpenId, setMessageOpenId] = useState("")
  const {
    contentBlocks,
    setContentBlocks,
    // handleFileUpload,
    dropRef,
    removeBlock,
    dragOver,
    handlePaste,
  } = useFileUpload();
  const currentAgent = agentRoles.find(({id}) => `${id}` === agent)

  const stream = useStreamContext();
  const {threads} = useThreads()
  const {isAuthenticated, isLoading: isAuthLoading, setOpenConnectWallet} = useAuthContext()
  const messages = stream?.messages as IMessage[];
  const isLoading = !!stream?.isLoading;

  const lastError = useRef<string | undefined>(undefined);
  const [isInputFocused, setInputFocused] = useState(false)

  useEffect(() => {
    if (!stream?.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error("An error occurred. Please try again.", {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    } catch {
      // no-op
    }
  }, [stream]);

  // TODO: this should be part of the useStream hook
  const prevMessageLength = useRef(0);
  useEffect(() => {
    if(!messages) return
    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
    if (!stream || (input.trim().length === 0 && contentBlocks.length === 0) || isLoading)
      return;

    if(threadId) {
      const isThreadExisted = threads.find(({thread_id}) => thread_id === threadId)
      if(!isThreadExisted) {
        replace("/")
        setInput("")
        return
      }
    }

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [
        ...(input.trim().length > 0 ? [{ type: "text", text: input }] : []),
        ...contentBlocks,
      ] as Message["content"],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    const context =
      Object.keys(artifactContext).length > 0 ? artifactContext : undefined;

    stream.submit(
      { messages: [...toolMessages, newHumanMessage], context },
      {
        streamMode: ["values"],
        ...(currentAgent && {
          config: {
            configurable: {
              systemPromptTemplate: currentAgent.prompt
            }
          }
        }),
        optimisticValues: (prev) => ({
          ...prev,
          context,
          messages: [
            ...(prev.messages ?? []),
            ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );

    setInput("");
    setContentBlocks([]);
  };

  const handleRegenerate = useCallback((
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {    
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;
    stream?.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ["values"],
    });
  }, [stream])

  const chatStarted = !!threadId || !!messages?.length || newThread;
  const hasNoAIOrToolMessages = !messages?.find(
    (m) => m.type === "ai" || m.type === "tool",
  );

  const renderTitle = (
    <h1 className="font-figtree flex flex-col items-center justify-center text-center text-blue-20 mt-10 mb-10 sm:mb-16 text-2xl sm:mt-20 sm:text-[40px] lg:mt-[72px] lg:text-[56px]">
      <span>Personalized experience,</span>
      <span>Simplified DeFi</span>
    </h1>
  );

  const renderContent = useMemo(() => {
    const messagesByToolCallId = new Map(
      messages.map(obj => [obj?.tool_call_id, obj])
    );
    
    const usedIds = new Set();
    
    const arrayMapped = [];
    
    for (const obj of messages) {
      if (Array.isArray(obj.tool_calls)) {
        const matched = obj.tool_calls
          .map(ref => messagesByToolCallId.get(ref.id))
          .filter(Boolean);
    
        matched.forEach(m => usedIds.add(m?.tool_call_id ?? ""));
    
        if (matched.length > 0) {
          arrayMapped.push({ ...obj, responses: matched });
          continue; // already pushed, skip bottom push
        }
      }
    
      // Only push if this message wasn't matched into another object's `responses`
      if (!usedIds.has(obj.tool_call_id)) {
        arrayMapped.push(obj);
      }
    }

    return (
      <>
        {arrayMapped
          ?.filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
          .map((message, index) => {  
            const lastStreamMessageId = messages[messages.length - 1].id;
            const isLastMappedMessage = (lastStreamMessageId === message?.id) || message?.responses?.find((m) => m?.id === lastStreamMessageId);
              
            return message.type === "human" ? (
              <HumanMessage
                key={message.id || `${message.type}-${index}`}
                message={message}
                isLoading={isLoading}
              />
            ) : message?.responses ? (
              <div key={message.id || `${message.type}-${index}`}>
                <div
                  className={cn("border-blue-90 mb-3 border px-4 py-3", {
                    "cursor-pointer hover:opacity-75":
                      messageOpenId !== message.id,
                  })}
                  onClick={
                    messageOpenId === message.id
                      ? undefined
                      : () => setMessageOpenId(message.id || "")
                  }
                >
                  <div
                    className={cn("flex items-center justify-between", {
                      "cursor-pointer hover:opacity-75":
                        messageOpenId === message.id,
                    })}
                    onClick={
                      messageOpenId !== message.id
                        ? undefined
                        : () => setMessageOpenId("")
                    }
                  >
                    <div className="flex items-center gap-[10px]">
                      <AgentImage size={20} />
                      <h3 className="text-sm font-medium">
                        {message?.tool_calls
                          ?.map((toolCall) =>
                            toolCall?.name?.replaceAll("_", " "),
                          )
                          ?.join(", ") || "Tool Result"}
                      </h3>
                    </div>
                    <ChevronDown
                      className={cn("size-[18px] text-blue-50", {
                        "rotate-180": messageOpenId === message.id,
                      })}
                    />
                  </div>
                  {messageOpenId === message.id && (
                    <div className="mt-3">
                      <AssistantMessage
                        key={message.id}
                        message={message}
                        isLoading={isLoading}
                        handleRegenerate={handleRegenerate}
                        toolType="request"
                      />
                      {message.responses.map((ref, idx) => (
                        <AssistantMessage
                          key={idx}
                          message={ref}
                          isLoading={isLoading}
                          handleRegenerate={handleRegenerate}
                          toolType="response"
                        />
                      ))}
                      <button
                        className="mx-auto flex w-full items-center justify-center px-3 pt-3 hover:opacity-75"
                        onClick={() => setMessageOpenId("")}
                      >
                        <ChevronDown
                          className={cn("size-[18px] text-blue-50", {
                            "rotate-180": messageOpenId === message.id,
                          })}
                        />
                      </button>
                    </div>
                  )}
                </div>
                <Interrupt
                  interruptValue={stream?.interrupt?.value}
                  isLastMessage={!!isLastMappedMessage}
                  hasNoAIOrToolMessages={hasNoAIOrToolMessages}
                  isLoading={false}
                />
              </div>
            ) : (
              <AssistantMessage
                key={message.id || `${message.type}-${index}`}
                message={message}
                isLoading={isLoading}
                handleRegenerate={handleRegenerate}
              />
            );
          })}
        {/* Special rendering case where there are no AI/tool messages, but there is an interrupt.
          We need to render it outside of the messages list, since there are no messages to render */}
        {hasNoAIOrToolMessages && !!stream?.interrupt && (
          <AssistantMessage
            key="interrupt-msg"
            message={undefined}
            isLoading={isLoading}
            handleRegenerate={handleRegenerate}
          />
        )}
      </>
    );
  }, [
    handleRegenerate,
    hasNoAIOrToolMessages,
    isLoading,
    messages,
    stream?.interrupt,
    messageOpenId,
  ]);

  if (isAuthLoading)
    return <ScreenLoading className="w-full"/>

  if (!isAuthenticated)
    return (
      <article className="h-screen overflow-y-auto hide-scrollbar">
        {renderTitle}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setOpenConnectWallet(true)}
            className="hover:opacity-75 border-blue-70 mx-7 flex w-full max-w-[992px] items-center justify-between border-[1.5px] px-4 py-3 sm:mx-8 sm:py-5 lg:mx-16"
          >
            <span className="text-blue-40 text-base">
              Connect wallet to start chatting
            </span>
            <ArrowRight className="text-blue-60 size-8" />
          </button>
        </div>
        <TrendingAgents className="px-4 sm:px-8 lg:px-16" />
      </article>
    );

  return (
    <div className="flex-grow w-full flex flex-col">
      {chatStarted && currentAgent && (
        <div className="flex items-center justify-center gap-2 px-4 pt-2 pb-4 sm:justify-start sm:px-8 sm:pt-4 lg:px-16">
          <span className="text-blue-40 text-base">You're chatting with:</span>
          <span className="text-blue-20 text-lg">{currentAgent.name}</span>
        </div>
      )}
      <StickToBottom className="relative size-full">
        <StickyToBottomContent
          className={cn("absolute inset-0 size-full px-4 sm:px-16", {
            "sm:pb-8 lg:pb-16": chatStarted,
          })}
          containerClassName={cn(
            "size-full overflow-y-auto hide-scrollbar",
            !chatStarted && "flex flex-col items-stretch",
            chatStarted && "grid grid-rows-[1fr_auto] sm:px-8 sm:pt-8",
          )}
          contentClassName={cn({
            "pb-16 flex flex-col gap-4 size-full justify-end break-word-all-child": chatStarted,
          })}
          content={
            <>
              {renderContent}
              {isLoading && (
                <div className="flex items-center gap-2">
                  {currentAgent?.imageUrl ? (
                    <Image
                      src={currentAgent.imageUrl}
                      width={32}
                      height={32}
                      alt={currentAgent.name || "agent"}
                      className="shrink-0"
                    />
                  ) : (
                    <HakifiBrandIcon className="size-9 shrink-0" />
                  )}
                  <p className="text-base text-blue-50">Generating answer...</p>
                </div>
              )}
            </>
          }
          footer={
            <div className="sticky bottom-0 flex flex-col items-center">
              {!chatStarted && renderTitle}

              {chatStarted && (
                <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2" />
              )}

              <div className="w-full">
                <div
                  ref={dropRef}
                  className={cn(
                    "mx-auto bg-blue-150 border-blue-90 relative z-10 flex w-full items-center justify-between gap-2 px-4 py-3 transition-all sm:py-[14.5px]",
                    dragOver ? "border-p border-dotted" : "border-[1.5px]",
                    { "mb-0 max-w-[992px]": !chatStarted },
                    { "border-blue-50": isInputFocused },
                  )}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex-grow flex items-center"
                  >
                    <ContentBlocksPreview
                      blocks={contentBlocks}
                      onRemove={removeBlock}
                    />
                    <AutoResizeTextarea
                      name="human-message"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onPaste={handlePaste}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          !e.metaKey &&
                          !e.nativeEvent.isComposing
                        ) {
                          e.preventDefault();
                          const el = e.target as HTMLElement | undefined;
                          const form = el?.closest("form");
                          form?.requestSubmit();
                        }
                      }}
                      placeholder="Ask anything..."
                      className="caret-blue-10 break-all field-sizing-content w-full resize-none border-none bg-transparent text-blue-50 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                    />
                    {/* <Label
                            htmlFor="file-input"
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Plus className="size-5 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              Upload PDF or Image
                            </span>
                          </Label>
                          <input
                            id="file-input"
                            type="file"
                            onChange={handleFileUpload}
                            multiple
                            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                            className="hidden"
                          /> */}
                  </form>

                  {isLoading ? (
                    <Button
                      key="stop"
                      onClick={() => stream.stop()}
                      className="ml-auto"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="text-blue-60 ml-auto p-0 hover:text-blue-50 sm:p-1"
                      disabled={
                        isLoading || (!input.trim() && contentBlocks.length === 0)
                      }
                      onClick={handleSubmit}
                    >
                      <ArrowRight className="size-8" />
                    </Button>
                  )}
                </div>
                <div className="h-8 bg-blue-150"/>
              </div>
              {!chatStarted ? (
                <TrendingAgents onClick={() => setNewThread(true)} />
              ) : null}
            </div>
          }
        />
      </StickToBottom>
    </div>
  );
}
