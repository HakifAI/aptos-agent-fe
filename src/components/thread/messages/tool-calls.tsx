import { AIMessage, ToolMessage } from "@langchain/langgraph-sdk";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

export function ToolCalls({
  toolCalls,
}: {
  toolCalls: AIMessage["tool_calls"];
}) {
  if (!toolCalls || toolCalls.length === 0) return null;
  console.log("toolCalls: ", toolCalls);
  
  return (
    <div className="mx-auto grid grid-rows-[1fr_auto] gap-2">
      {toolCalls.map((tc, idx) => {
        const args = tc.args as Record<string, any>;
        const functionCalled = {
          name: tc.name,
          id: tc.id,
          args: args,
        }
        const functionCalledStr = JSON.stringify(functionCalled, null, 2);
        return (
            <pre>{functionCalledStr}</pre>
        );
      })}
    </div>
  );
}

export function ToolResult({ message, hasCollapsible = true }: { message: ToolMessage, hasCollapsible?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  let parsedContent: any;
  let isJsonContent = false;
  try {
    if (typeof message.content === "string") {
      parsedContent = JSON.parse(message.content);
      isJsonContent = isComplexValue(parsedContent);
    }
  } catch {
    // Content is not JSON, use as is
    parsedContent = message.content;
  }

  const contentStr = isJsonContent
    ? JSON.stringify(parsedContent, null, 2)
    : String(message.content);
  const contentLines = contentStr.split("\n");
  const shouldTruncate = hasCollapsible && (contentLines.length > 4 || contentStr.length > 500);
  const displayedContent =
    shouldTruncate && !isExpanded
      ? contentStr.length > 500
        ? contentStr.slice(0, 500) + "..."
        : contentLines.slice(0, 4).join("\n") + "\n..."
      : contentStr;

  return (
    <div className="mx-auto grid grid-rows-[1fr_auto] gap-2">
      <div className="overflow-x-auto">
        {/* <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {message.name ? (
              <h3 className="font-medium text-gray-900">
                Tool Result:{" "}
                <code className="rounded bg-gray-100 px-2 py-1">
                  {message.name}
                </code>
              </h3>
            ) : (
              <h3 className="font-medium text-gray-900">Tool Result</h3>
            )}
            {message.tool_call_id && (
              <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-sm">
                {message.tool_call_id}
              </code>
            )}
          </div>
        </div> */}
        <motion.div
          className="min-w-full bg-gray-100"
          initial={false}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={isExpanded ? "expanded" : "collapsed"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {isJsonContent ? (
                  <div><pre>{displayedContent}</pre></div>
                  // <table className="min-w-full divide-y divide-gray-200">
                  //   <tbody className="divide-y divide-gray-200">
                  //     {(Array.isArray(parsedContent)
                  //       ? isExpanded
                  //         ? parsedContent
                  //         : parsedContent.slice(0, 5)
                  //       : Object.entries(parsedContent)
                  //     ).map((item, argIdx) => {
                  //       const [key, value] = Array.isArray(parsedContent)
                  //         ? [argIdx, item]
                  //         : [item[0], item[1]];
                  //       return (
                  //         <tr key={argIdx}>
                  //           <td className="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900">
                  //             {key}
                  //           </td>
                  //           <td className="px-4 py-2 text-sm text-gray-500">
                  //             {isComplexValue(value) ? (
                  //               <code className="rounded bg-gray-50 px-2 py-1 font-mono text-sm break-all">
                  //                 {JSON.stringify(value, null, 2)}
                  //               </code>
                  //             ) : (
                  //               String(value)
                  //             )}
                  //           </td>
                  //         </tr>
                  //       );
                  //     })}
                  //   </tbody>
                  // </table>
                ) : (
                  <code className="block text-sm">{displayedContent}</code>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {hasCollapsible && shouldTruncate && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex mx-auto cursor-pointer items-center justify-center py-2 px-4 text-gray-500 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-600"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
