"use client";

import * as React from "react";
import { Modal } from "./modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "destructive",
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      confirmVariant={variant}
    >
      <div className="flex items-start gap-3 py-2">
        {variant === "destructive" && (
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        )}
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Modal>
  );
}

