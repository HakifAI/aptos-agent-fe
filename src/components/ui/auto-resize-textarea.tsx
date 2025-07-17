import React, {
  useRef,
  useEffect,
  TextareaHTMLAttributes,
  useCallback,
} from "react";

interface AutoResizeTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  onChange,
  placeholder = "Type your message...",
  minHeight = 40,
  maxHeight = 300,
  className = "",
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset to shrink if needed
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  }, [maxHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={textareaRef}
      className={`auto-resize-textarea box-sizing-border transition-height w-full resize-none overflow-y-auto duration-100 ease-in-out ${className}`}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        resize();
      }}
      placeholder={placeholder}
      style={{
        maxHeight: `${maxHeight}px`,
      }}
      rows={1}
      {...rest}
    />
  );
};

export default AutoResizeTextarea;
