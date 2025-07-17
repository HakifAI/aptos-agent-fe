import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-blue-10 h-14 flex w-full min-w-0 rounded-lg bg-transparent p-4 placeholder:text-base outline-none border border-blue-60 placeholder:text-blue-60",
        "hover:border-blue-40 hover:placeholder:text-blue-40",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "focus:border-blue-20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
