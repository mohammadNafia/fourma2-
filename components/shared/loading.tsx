"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Full Page Loader
export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center gap-6 rounded-3xl border border-border/50 bg-card/80 p-8 backdrop-blur-xl backdrop-saturate-180 shadow-glow-purple shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-[--electric-purple] shadow-glow-purple" />
        </motion.div>
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </motion.div>
    </div>
  );
}

// Section Loader
export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-[--electric-purple]" />
      </motion.div>
    </div>
  );
}

// Button Loader
export function ButtonLoader({ className }: { className?: string }) {
  return (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={cn("h-4 w-4 text-current", className)} />
      </motion.div>
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

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className={cn("text-[--electric-purple]", sizeClasses[size])} />
    </motion.div>
  );
}


