"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute top-0 right-4 h-full text-blue-40"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeIcon
            className="size-8"
            aria-hidden="true"
          />
        ) : (
          <EyeOffIcon
            className="size-8"
            aria-hidden="true"
          />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
