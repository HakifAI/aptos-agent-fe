"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import ErrorIcon from "../icons/error-icon";
import WarningIcon from "../icons/warning-icon";
import SuccessIcon from "../icons/success-icon";
import { cn } from "@/lib/utils";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      offset={{ top: 130 }}
      mobileOffset={{ top: 60 }}
      toastOptions={{
        classNames: {
          toast: "border-none!",
          title: "text-sm! font-normal!",
          description: "text-gray-40! text-sm! font-normal!",
          success: "group toast group-[.toaster]:bg-blue-50! text-blue-90!",
          error: "group toast group-[.toaster]:bg-error-dark! text-gray-20!",
          warning: "group toast group-[.toaster]:bg-warning-dark! text-gray-20!",
        },
      }}
      icons={{
        error: <ErrorIcon className="size-6 text-warning" />,
        warning: <WarningIcon className="size-6 text-warning-light" />,
        success: <SuccessIcon className="size-6 text-blue-90" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
