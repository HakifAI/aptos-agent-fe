import { useState } from "react";
import { TooltipIconButton } from "../thread/tooltip-icon-button";
import CopyIcon from "../icons/copy-icon";
import { CheckIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const useCopyToClipboard = ({
    copiedDuration = 3000,
}: {
    copiedDuration?: number;
} = {}) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const copyToClipboard = (value: string) => {
        if (!value) return;

        navigator.clipboard.writeText(value).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), copiedDuration);
        });
    };

    return { isCopied, copyToClipboard };
};

const sizes = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
}

const Copy = ({ value, className, size = "md", message = "Copied to clipboard" }: { value: string, className?: string, size?: keyof typeof sizes, message?: string }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();
    const onCopy = () => {
        if (isCopied) return;
        copyToClipboard(value);
        toast.success(message);
    };

    const sizeClass = sizes[size];

    return (
        <Button variant="ghost" onClick={onCopy} className={cn("text-blue-40", className)}>
            {!isCopied && <CopyIcon className={sizeClass} />}
            {isCopied && <CheckIcon className={sizeClass} />}
        </Button>
    );
}

export default Copy;