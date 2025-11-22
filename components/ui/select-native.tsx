import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectNativeProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-lg border border-border/70 bg-background/80 px-4 py-3 pr-12 text-sm text-foreground shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  },
);
SelectNative.displayName = "SelectNative";

export { SelectNative };
