"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[--primary-gradient] text-primary-foreground shadow-[0_10px_40px_rgba(99,102,241,0.25)] dark:shadow-[0_10px_40px_rgba(124,58,237,0.45)] hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground border border-border/70 hover:border-border hover:bg-secondary/80",
        outline:
          "border border-border/70 bg-transparent text-foreground hover:bg-foreground/5 hover:border-border",
        ghost:
          "text-foreground hover:bg-foreground/5 border border-transparent hover:border-border/50",
        subtle:
          "bg-muted text-foreground hover:bg-muted/80 border border-border/60",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
      shape: {
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
