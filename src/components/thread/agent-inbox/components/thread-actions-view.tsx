import { Button } from "@/components/ui/button";
import { ThreadIdCopyable } from "./thread-id";
import { InboxItemInput } from "./inbox-item-input";
import useInterruptedActions from "../hooks/use-interrupted-actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { constructOpenInStudioURL } from "../utils";
import { HumanInterrupt } from "@langchain/langgraph/prebuilt";
import { MarkdownText } from "../../markdown-text";
import { NODE_ENV } from "@/constants/configs";
import { CheckCircle2 } from "lucide-react";

interface ThreadActionsViewProps {
  interrupt: HumanInterrupt;
  handleShowSidePanel: (showState: boolean, showDescription: boolean) => void;
  showState: boolean;
  showDescription: boolean;
}

function ButtonGroup({
  handleShowState,
  handleShowDescription,
  showingState,
  showingDescription,
}: {
  handleShowState: () => void;
  handleShowDescription: () => void;
  showingState: boolean;
  showingDescription: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-center gap-0">
      <Button
        variant="outline"
        className={cn(
          "rounded-l-md rounded-r-none border-r-[0px]",
          showingState ? "text-blue-20" : "bg-white",
        )}
        size="sm"
        onClick={handleShowState}
      >
        State
      </Button>
      <Button
        variant="outline"
        className={cn(
          "rounded-l-none rounded-r-md border-l-[0px]",
          showingDescription ? "text-blue-20" : "bg-white",
        )}
        size="sm"
        onClick={handleShowDescription}
      >
        Description
      </Button>
    </div>
  );
}

export function ThreadActionsView({
  interrupt,
  handleShowSidePanel,
  showDescription,
  showState,
}: ThreadActionsViewProps) {
  const [threadId] = useQueryState("threadId");
  const {
    acceptAllowed,
    hasEdited,
    hasAddedResponse,
    streaming,
    supportsMultipleMethods,
    streamFinished,
    loading,
    handleSubmit,
    handleIgnore,
    handleResolve,
    setSelectedSubmitType,
    setHasAddedResponse,
    setHasEdited,
    humanResponse,
    setHumanResponse,
    initialHumanInterruptEditValue,
  } = useInterruptedActions({
    interrupt,
  });
  const [apiUrl] = useQueryState("apiUrl");

  const handleOpenInStudio = () => {
    if (!apiUrl) {
      toast.error("Error", {
        description: "Please set the LangGraph deployment URL in settings.",
        duration: 5000,
        richColors: true,
        closeButton: true,
      });
      return;
    }

    const studioUrl = constructOpenInStudioURL(apiUrl, threadId ?? undefined);
    window.open(studioUrl, "_blank");
  };

  const threadTitle = interrupt.action_request.action || "Unknown";
  const actionsDisabled = loading || streaming;
  const ignoreAllowed = interrupt.config.allow_ignore;
  
  // Check if this is a swap pool selection - hide default buttons for this case
  const isSwapPoolSelection = 
    interrupt?.action_request?.action === "Select Pool" &&
    Array.isArray(interrupt?.action_request?.args?.pools);

  return (
    <div className="flex min-h-full w-full flex-col gap-9">
      {/* Header */}
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center justify-start gap-3">
          <p className="text-2xl tracking-tighter text-pretty">{threadTitle}</p>
          {threadId && <ThreadIdCopyable threadId={threadId} />}
        </div>
        {NODE_ENV === "development" ? (
          <div className="flex flex-row items-center justify-start gap-2">
            {apiUrl && (
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1 bg-white"
                onClick={handleOpenInStudio}
              >
                Studio
              </Button>
            )}
            <ButtonGroup
              handleShowState={() => handleShowSidePanel(true, false)}
              handleShowDescription={() => handleShowSidePanel(false, true)}
              showingState={showState}
              showingDescription={showDescription}
            />
          </div>
        ) : null}
      </div>
      {/* Only show description for non-swap pool selection cases */}
      {interrupt.description && !isSwapPoolSelection && (
        <MarkdownText>{interrupt.description}</MarkdownText>
      )}

      <div className={!isSwapPoolSelection ? "flex w-full flex-row items-center justify-start gap-4" : ""}>
        {/* Only show default action buttons for non-swap pool selection cases */}
        {!isSwapPoolSelection && (
          <>
            {ignoreAllowed && (
              <Button
                variant="outline"
                onClick={handleIgnore}
                disabled={actionsDisabled}
              >
                Ignore
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleResolve}
              disabled={actionsDisabled}
              className="gap-2"
            >
              <span>Mark as Resolved</span>
              <CheckCircle2 className="text-blue-40 size-[15px]" />
            </Button>
          </>
        )}
        {/* Actions */}
        <InboxItemInput
          acceptAllowed={acceptAllowed}
          hasEdited={hasEdited}
          hasAddedResponse={hasAddedResponse}
          interruptValue={interrupt}
          humanResponse={humanResponse}
          initialValues={initialHumanInterruptEditValue.current}
          setHumanResponse={setHumanResponse}
          streaming={streaming}
          streamFinished={streamFinished}
          supportsMultipleMethods={supportsMultipleMethods}
          setSelectedSubmitType={setSelectedSubmitType}
          setHasAddedResponse={setHasAddedResponse}
          setHasEdited={setHasEdited}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
