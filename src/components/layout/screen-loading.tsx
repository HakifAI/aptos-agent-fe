import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface IProps {
  className?: string;
}

const ScreenLoading = ({ className }: IProps) => {
  return (
    <article
      className={cn(
        "flex h-screen w-screen items-center justify-center",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin" />
    </article>
  );
};

export default ScreenLoading;
