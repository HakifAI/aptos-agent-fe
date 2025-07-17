import { cn } from "@/lib/utils";
import React from "react";

interface IProps {
  className?: string;
  dotClassName?: string;
}

const DotsLoading = ({ className, dotClassName }: IProps) => {
  return (
    <div
      className={cn(
        "bg-blue-70 absolute -top-17 left-0 flex h-[43px] items-center justify-center gap-[5px] rounded-2xl p-3",
        className,
      )}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "bg-blue-10 inline-block size-[9px] rounded-full",
            dotClassName,
          )}
          style={{
            animationName: "wave",
            animationDuration: "1.2s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            animationDelay: `${(i + 1) * 0.2}s`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes wave {
            0%, 80%, 100% {
              transform: scale(0.4);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DotsLoading;
