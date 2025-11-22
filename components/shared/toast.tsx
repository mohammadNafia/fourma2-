"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = Math.random().toString(36).slice(2, 10);
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: "bg-green-500/20 border-green-500/50 text-green-400",
    error: "bg-red-500/20 border-red-500/50 text-red-400",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-md min-w-[300px] max-w-md",
                  colors[t.type],
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <p className="flex-1 text-sm font-medium">{t.message}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 hover:bg-transparent"
                  onClick={() => removeToast(t.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Utility functions for easier toast usage
export function useToastHelpers() {
  const { toast } = useToast();

  return {
    success: (message: string) => toast(message, "success"),
    error: (message: string) => toast(message, "error"),
    info: (message: string) => toast(message, "info"),
    warning: (message: string) => toast(message, "warning"),
  };
}

