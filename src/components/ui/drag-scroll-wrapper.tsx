import { cn } from "@/lib/utils";
import React, { useRef, useState, MouseEvent, ReactNode } from "react";

interface DragScrollWrapperProps {
  children: ReactNode;
  className?: string
  direction?: "horizontal" | "vertical";
}

const DragScrollWrapper: React.FC<DragScrollWrapperProps> = ({
  children,
  className,
  direction = "horizontal",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const isHorizontal = direction === "horizontal";

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPos(isHorizontal ? e.pageX : e.pageY);
    const scrollValue = isHorizontal
      ? containerRef.current?.scrollLeft || 0
      : containerRef.current?.scrollTop || 0;
    setScrollStart(scrollValue);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    e.preventDefault();
    const current = isHorizontal ? e.pageX : e.pageY;
    const distance = current - startPos;

    if (isHorizontal) {
      containerRef.current.scrollLeft = scrollStart - distance;
    } else {
      containerRef.current.scrollTop = scrollStart - distance;
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        `cursor-grab overflow-auto select-none active:cursor-grabbing ${
          isHorizontal ? "whitespace-nowrap" : "h-full"
        }`,
        className,
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {children}
    </div>
  );
};

export default DragScrollWrapper;
