import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[10px] px-4 cursor-pointer whitespace-nowrap text-base disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-blue-70 text-blue-10 border-none hover:bg-blue-40 hover:text-blue-80 disabled:bg-gray-80 disabled:text-gray-60",
        outline:
          "border border-blue-80 text-blue-30 bg-transparent hover:border-blue-50 hover:text-blue-50 disabled:border-gray-80 disabled:text-gray-80",
        ghost: "p-1",
      },
      size: {
        default: "h-10 py-[10px]",
        sm: "h-7 py-[2px]",
        lg: "h-[46px] py-[11px]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  prefix,
  suffix,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {prefix}
      {children}
      {suffix}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonProps };
