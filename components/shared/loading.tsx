"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Full Page Loader
export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </motion.div>
    </div>
  );
}

// Section Loader
export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

// Button Loader
export function ButtonLoader({ className }: { className?: string }) {
  return (
    <>
      <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
      <span className="sr-only">Loading...</span>
    </>
  );
}

// Inline Loader
export function InlineLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />;
}

