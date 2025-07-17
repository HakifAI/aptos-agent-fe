import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { memo } from "react";

interface IProps {
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  title?: string;
}

const EmptyItem = ({
  className,
  iconClassName,
  title,
  titleClassName,
}: IProps) => {
  return (
    <div
      className={cn(
        "text-blue-20 flex flex-col items-center justify-center gap-1",
        className,
      )}
    >
      <Inbox className={cn("size-10", iconClassName)} />
      <h3 className={cn("text-sm", titleClassName)}>{title || "No data"}</h3>
    </div>
  );
};

export default memo(EmptyItem);
