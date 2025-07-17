import { HumanMessage } from "@langchain/core/messages";
import { HumanInterrupt } from "@langchain/langgraph/prebuilt";
import { SwapPoolSelection } from "../agent-inbox/components/SwapPoolSelection";

interface Props {
  interrupt: HumanMessage;
  streaming: boolean;
}

export function GenericInterruptView({ interrupt, streaming }: Props) {
  // Handle different content types properly
  const interruptValue = interrupt.content;
  
  // Check if content is a HumanInterrupt object
  if (typeof interruptValue === 'object' && !Array.isArray(interruptValue) && interruptValue !== null) {
    const humanInterrupt = interruptValue as HumanInterrupt;
    
    // Check if this is a swap pool selection interrupt
    if (
      humanInterrupt.action_request &&
      humanInterrupt.action_request.action === "Select Pool"
    ) {
      return (
        <SwapPoolSelection interruptValue={humanInterrupt} streaming={streaming} />
      );
    }



    // Default interrupt UI for other types
    return (
      <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-orange-800 mb-1">Human Input Required</h4>
            <p className="text-orange-700 text-sm whitespace-pre-wrap">
              {humanInterrupt.description || "The assistant needs your input to continue."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for non-object content
  return (
    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-orange-800 mb-1">Human Input Required</h4>
          <p className="text-orange-700 text-sm whitespace-pre-wrap">
            {typeof interruptValue === 'string' ? interruptValue : "The assistant needs your input to continue."}
          </p>
        </div>
      </div>
    </div>
  );
}

// Export alias for backward compatibility
export const GenericInterrupt = GenericInterruptView;
