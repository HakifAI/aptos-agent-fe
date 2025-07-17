import { cn } from "@/lib/utils";
import * as Tabs from "@radix-ui/react-tabs";

type IProfileSliderProps = {
    value: string;
    options: {
        label: string | React.ReactElement;
        value: string;
    }[];
    onValueChange: (value: string) => void;
    className?: string;
    triggerClassName?: string;
    children: React.ReactNode;
};


export const ProfileSliderContent = Tabs.Content;

export default function ProfileSlider({ value, options, onValueChange, className, triggerClassName, children }: IProfileSliderProps) {
    return (
        <Tabs.Root value={value} onValueChange={onValueChange}>
            <Tabs.List
                className={cn("flex items-center w-full sm:w-max border border-blue-90 divide-x divide-blue-90", className)}
            >
                {options.map((option) => (
                    <Tabs.Trigger value={option.value} className={cn("py-3 w-[200px] text-blue-60 text-lg leading-[22px] font-medium flex items-center justify-center gap-x-2", value === option.value && "text-blue-20", triggerClassName)} key={option.value}>
                        {option.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            {children}
        </Tabs.Root>
    )
}