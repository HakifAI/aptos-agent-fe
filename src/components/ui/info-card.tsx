import { cn } from "@/lib/utils";
import { memo } from "react";

interface IProps {
  title: string;
  icon: React.ReactElement;
  className?: string;
  titleClassName?: string;
}

const InfoCard = ({ title, icon, className, titleClassName }: IProps) => {
  return (
    <div
      className={cn(
        "bg-blue-150 border-blue-70 rounded-[13px] border p-4",
        className,
      )}
    >
      {icon}
      <h3 className={cn("mt-[6px] text-sm", titleClassName)}>{title}</h3>
    </div>
  );
};

export default memo(InfoCard);
