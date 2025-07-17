import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Image from "next/image";

const variants = cva(
  "flex border w-full relative cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-blue-80 hover:border-blue-50",
        active: "border-blue-20",
        disabled: "border-gray-60 text-gray-60",
      },
      size: {
        default: "h-[176px] p-[18px] gap-[18px]",
        sm: "h-[105px] px-2 py-[10px] gap-3",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type Props = React.ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    asChild?: boolean;
    imgUrl?: string;
    title: string;
    description?: string;
    imgAlt?: string;
  };

function AgentCard({
  className,
  variant,
  size,
  asChild = false,
  imgUrl,
  title,
  description,
  imgAlt = "agent",
  ...props
}: Props) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="div"
      className={cn(variants({ variant, size, className }))}
      {...props}
    >
      <Image
        src={imgUrl || "/images/default-image.png"}
        width={size === "sm" ? 85 : 140}
        height={size === "sm" ? 85 : 140}
        alt={imgAlt}
        className="h-min shrink-0"
      />
      <div className="flex-grow">
        <h3
          className={cn("text-blue-40 text-lg font-semibold", {
            "text-base": size === "sm",
          })}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "text-sm",
              size === "sm"
                ? "mt-1 line-clamp-3 text-blue-50"
                : "text-blue-40 mt-2 line-clamp-4",
              {
                "text-blue-40": variant === "active" && size === "sm",
                "text-blue-50": variant === "active" && size === "default",
              },
            )}
          >
            {description}
          </p>
        )}
      </div>
      {props.children}
    </Comp>
  );
}

export default AgentCard;
