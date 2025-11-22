import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground",
          "placeholder:text-muted-foreground/70 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
