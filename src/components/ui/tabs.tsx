"use client";

import { cn } from "@/lib/utils";

export type ITab = {
  label: string | React.ReactElement;
  value: string;
};
interface IProps {
  type?: "default" | "outline";
  list: ITab[];
  activeValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}

const Tabs = ({
  type = "default",
  list,
  activeValue,
  className,
  onChange,
}: IProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center",
        {
          "gap-4 border-b border-blue-80": type === "outline",
        },
        className,
      )}
    >
      {list.map((tab) => (
        <button
          key={tab.value}
          className={cn(
            "flex gap-2 cursor-pointer items-center justify-center whitespace-nowrap font-medium",
            {
              "text-blue-60 hover:text-blue-20 h-[42px] px-4 py-[10px] text-lg":
                type === "default",
              "text-blue-60 hover:text-blue-20 h-[42px] border-b-2 border-transparent px-2 py-4 text-base":
                type === "outline",
              "text-blue-20 hover:text-blue-20":
                activeValue === tab.value && type === "default",
              "text-blue-10 hover:text-blue-20 border-blue-40":
                activeValue === tab.value && type === "outline",
            },
          )}
          onClick={() => onChange?.(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
