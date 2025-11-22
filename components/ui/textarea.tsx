"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-[10px] border border-border bg-input px-4 py-3 text-sm font-light text-foreground",
          "placeholder:text-muted-foreground/60 transition-all duration-200 resize-none",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "focus-visible:border-foreground/30",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:border-border/50",
          "hover:border-foreground/20",
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
