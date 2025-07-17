import { memo, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IProps {
  text: string | React.ReactElement;
  isActive?: boolean;
  className?: string;
  contentClassName?: string;
  textClassName?: string;
  onClick?: MouseEventHandler | undefined;
  action?: ReactNode
}

const TextBox = ({
  text,
  isActive,
  className,
  contentClassName,
  textClassName,
  onClick,
  action,
}: IProps) => {
  return (
    <div
      className={cn(
        "w-full cursor-pointer border border-transparent pr-2 text-base text-blue-50",
        { "hover:text-blue-20 hover:border-blue-80": !isActive },
        { "border-blue-80 bg-[#05213780]": isActive },
        className,
      )}
    >
      <div
        onClick={onClick}
        className={cn("py-[10px] pr-2 pl-3", contentClassName)}
      >
        <p className={cn("line-clamp-1 break-all", textClassName)}>{text}</p>
      </div>
      {action && action}
    </div>
  );
};

export default memo(TextBox);
