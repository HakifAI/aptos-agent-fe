import React from "react";
import { HumanInterrupt } from "@langchain/langgraph/prebuilt";
import { useStreamContext } from "@/providers/Stream";
import { toast } from "sonner";
import { Copy, CheckCircle, X, ArrowRight, Zap, Route, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRootContext } from "@/providers/RootProvider";

function shortenAddress(addr: string, len = 6) {
  if (!addr) return "";
  if (addr.length <= len * 2 + 3) return addr;
  return addr.slice(0, len) + "..." + addr.slice(-len);
}

function getDexIcon(dexName: string) {
  switch (dexName?.toLowerCase()) {
    case 'hyperion':
      return <Waves className="w-5 h-5" />;
    case 'pancakeswap':
      return <Zap className="w-5 h-5" />;
    default:
      return <Waves className="w-5 h-5" />;
  }
}

function getDexColor(dexName: string) {
  switch (dexName?.toLowerCase()) {
    case 'hyperion':
      return 'from-blue-40 to-blue-70';
    case 'pancakeswap':
      return 'from-yellow-400 to-orange-500';
    default:
      return 'from-blue-60 to-blue-90';
  }
}

function getTokenSymbol(address: string, tokenList: any[]): string {
  if (!address) return "Unknown";
  
  if (address.toLowerCase().includes("aptos_coin") || address === "0x1::aptos_coin::AptosCoin") {
    return "APT";
  }
  
  const token = tokenList.find(t => 
    t.tokenAddress === address || 
    t.faAddress === address ||
    t.tokenAddress?.toLowerCase() === address.toLowerCase() ||
    t.faAddress?.toLowerCase() === address.toLowerCase()
  );
  
  return token?.symbol || address.substring(0, 6) + "...";
}

function RoutingPath({ routePath, routeType, tokenList }: { 
  routePath?: string[], 
  routeType?: string,
  tokenList: any[]
}) {
  if (!routePath || !routeType || routePath.length < 2) {
    return null;
  }

  const isMultiHop = routeType !== 'direct';

  return (
    <div className="p-3 bg-blue-90 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-blue-30">Routing Path</p>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isMultiHop 
            ? "bg-orange-100 text-orange-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {isMultiHop ? (
            <div className="flex items-center gap-1">
              <Route className="w-3 h-3" />
              Multi-hop
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Direct
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {routePath.map((address, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-blue-70 text-blue-10 text-xs rounded font-mono">
                {getTokenSymbol(address, tokenList)}
              </span>
            </div>
            {index < routePath.length - 1 && (
              <ArrowRight className="w-3 h-3 text-blue-50" />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {isMultiHop && (
        <p className="text-xs text-blue-50 mt-2">
          This swap uses intermediate tokens for better liquidity
        </p>
      )}
    </div>
  );
}

function formatFeeRate(pool: any) {
  if (pool.dex?.name?.toLowerCase() === 'hyperion') {
    if (typeof pool.fee === 'number') {
      return `${(pool.fee).toFixed(4)}%`;
    }
  }
  return pool.fee_rate || 'N/A';
}

function PoolCard({
  pool,
  idx,
  onSelect,
  selected,
  disabled,
}: {
  pool: any;
  idx: number;
  onSelect: () => void;
  selected: boolean;
  disabled: boolean;
}) {
  const { listTokens } = useRootContext();
  const dexName = pool.dex?.displayName || pool.dex?.name || 'Unknown';
  const poolId = pool.pool?.inner || pool.pool || pool.pool_address?.address || pool.id || 'N/A';
  const feeRate = formatFeeRate(pool);
  
  const routeType = pool.routeType || 'direct';
  const routePath = pool.routePath || [];
  const estimatedOutput = pool.estimatedOutput;
  const isMultiHop = routeType !== 'direct';
  
  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={cn(
        "group relative overflow-hidden rounded-[10px] border-2 transition-all duration-300 cursor-pointer",
        "transform hover:scale-[1.02] hover:shadow-lg",
        selected 
          ? "border-blue-20 shadow-lg shadow-blue-40/20 ring-2 ring-blue-30/20" 
          : "border-blue-80 hover:border-blue-40",
        disabled ? "cursor-not-allowed opacity-60" : ""
      )}
    >
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getDexColor(dexName)} opacity-10`} />
      
      {/* Main content */}
      <div className="relative bg-blue-150 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${getDexColor(dexName)} text-blue-10`}>
              {getDexIcon(dexName)}
            </div>
            <div>
              <h3 className="font-semibold text-base text-blue-10">Pool #{idx + 1}</h3>
              <p className="text-sm text-blue-30">{dexName}</p>
            </div>
          </div>
          
          {selected && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-70 text-blue-10 text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              <span>Selected</span>
            </div>
          )}
        </div>

        {/* Pool Information */}
        <div className="space-y-3">
          {/* Routing Path - Show if available */}
          {routePath.length >= 2 && (
            <RoutingPath 
              routePath={routePath} 
              routeType={routeType}
              tokenList={listTokens}
            />
          )}

          {/* Pool ID */}
          <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-30 mb-1">Pool ID</p>
              <p className="font-mono text-sm text-blue-10 truncate" title={poolId}>
                {shortenAddress(poolId, 8)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-blue-30 hover:text-blue-10 hover:bg-blue-90"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(poolId);
                toast.success("Pool ID copied!");
              }}
              title="Copy Pool ID"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Pool Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-90 rounded-lg">
              <p className="text-xs font-medium text-blue-30 mb-1">Fee Rate</p>
              <p className="text-sm font-semibold text-blue-10">{feeRate}</p>
            </div>
            <div className="p-3 bg-blue-90 rounded-lg">
              <p className="text-xs font-medium text-blue-30 mb-1">Route Type</p>
              <div className="flex items-center gap-1">
                {isMultiHop ? (
                  <>
                    <Route className="w-3 h-3 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-600">Multi-hop</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Direct</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Estimated Output */}
          {estimatedOutput && (
            <div className="p-3 bg-blue-100 rounded-lg">
              <p className="text-xs font-medium text-blue-30 mb-1">Estimated Output</p>
              <p className="text-sm font-semibold text-blue-10">{estimatedOutput.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 rounded-full bg-blue-20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-150" />
            </div>
          </div>
        )}

        {/* Hover indicator */}
        {!selected && !disabled && (
          <div className="absolute inset-0 bg-blue-20 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
        )}
      </div>
    </div>
  );
}

interface SwapPoolSelectionProps {
  interruptValue: HumanInterrupt;
  streaming: boolean;
}

export function SwapPoolSelection({
  interruptValue,
  streaming,
}: SwapPoolSelectionProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [cancelling, setCancelling] = React.useState(false);
  
  const thread = useStreamContext();
  const pools = interruptValue.action_request.args.pools;
  
  // Find the tool call ID for the swap
  let toolCallId = "";
  let toolName = "";
  const messages = thread.messages || [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (
      msg.type === "ai" &&
      Array.isArray(msg.tool_calls) &&
      msg.tool_calls.length > 0
    ) {
      const swapTool = msg.tool_calls.find(
        (tc: any) => tc.name === "swap_tokens",
      );
      if (swapTool) {
        toolCallId = swapTool.id || "";
        toolName = swapTool.name || "";
        break;
      }
    }
  }

  const [showNewSwapPrompt, setShowNewSwapPrompt] = React.useState(false);
  
  React.useEffect(() => {
    if (!toolCallId || !toolName) {
      setShowNewSwapPrompt(true);
      setSubmitError(null);
    } else {
      setShowNewSwapPrompt(false);
    }
  }, [toolCallId, toolName]);

  const handleSelectPool = async (idx: number, pool: any) => {
    setSubmitting(true);
    setSelectedIdx(idx);
    setSubmitError(null);
    
    try {
      const interruptResponse = {
        selectedPoolIndex: idx,
        pool: pool,
        timestamp: Date.now()
      };
      
      await thread.submit(
        {},
        {
          command: {
            resume: [{
              type: "accept",
              args: JSON.stringify(interruptResponse)
            }],
          },
        },
      );
      
      toast.success("Pool selected successfully!");
    } catch (e: any) {
      setSubmitError(e?.message || "Failed to submit selection");
      setSubmitting(false);
      setSelectedIdx(null);
      toast.error("Failed to select pool", {
        description: e?.message || "Unknown error occurred",
      });
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    setSubmitError(null);
    
    try {
      // Send interrupt response with cancellation
      const interruptResponse = {
        cancelled: true,
        reason: "user_cancelled",
        message: "Swap cancelled by user",
        timestamp: Date.now()
      };
      
      await thread.submit(
        {},
        {
          command: {
            resume: [{
              type: "ignore",
              args: JSON.stringify(interruptResponse)
            }],
          },
        },
      );
      
      toast.success("Swap cancelled successfully");
    } catch (error: any) {
      setSubmitError(error?.message || "Failed to cancel swap");
      toast.error("Failed to cancel swap", {
        description: error?.message || "Unknown error occurred",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleStartNewSwap = () => {
    setShowNewSwapPrompt(false);
    setSubmitError(null);
  };

  const isActionDisabled = streaming || submitting || cancelling || !toolCallId || !toolName;

  return (
    <div className="w-full flex flex-col gap-5 bg-blue-150 rounded-[13px] p-5 border border-blue-80">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-blue-10 mb-2">Select a Pool</h3>
          <p className="text-sm text-blue-30">
            Choose the liquidity pool you'd like to use for your swap.
          </p>
        </div>
        
        {/* Cancel Button */}
        <Button
          onClick={handleCancel}
          disabled={isActionDisabled}
          variant="outline"
          size="default"
          className="flex items-center gap-2"
        >
          {cancelling ? (
            <div className="w-4 h-4 border-2 border-blue-30 border-t-blue-10 rounded-full animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
          {cancelling ? "Cancelling..." : "Cancel Swap"}
        </Button>
      </div>

      {/* New Swap Prompt */}
      {showNewSwapPrompt && (
        <div className="p-4 bg-blue-90 border border-blue-70 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-blue-30">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-blue-20 font-medium">Unable to continue with current session</p>
              <p className="text-blue-30 text-sm">Please send a new swap request to continue.</p>
            </div>
            <Button
              onClick={handleStartNewSwap}
              variant="outline"
              size="sm"
              className="text-blue-20 hover:text-blue-10"
            >
              Start New Swap
            </Button>
          </div>
        </div>
      )}

      {/* Pool Grid - Only show if we have valid tool_call_id */}
      {!showNewSwapPrompt && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pools.map((pool: any, idx: number) => (
            <PoolCard
              key={idx}
              pool={pool}
              idx={idx}
              onSelect={() => handleSelectPool(idx, pool)}
              selected={selectedIdx === idx}
              disabled={isActionDisabled}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {submitting && (
        <div className="flex items-center justify-center p-4 bg-blue-90 rounded-xl border border-blue-70">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-50 border-t-blue-20 rounded-full animate-spin" />
            <span className="text-blue-20 font-medium">Processing your selection...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {submitError && (
        <div className="p-4 bg-[#3B1D1D] border border-warning rounded-xl">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-warning font-medium">{submitError}</span>
          </div>
        </div>
      )}
    </div>
  );
} 