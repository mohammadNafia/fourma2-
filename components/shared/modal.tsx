"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "destructive" | "outline";
  showFooter?: boolean;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  showFooter = true,
  className,
}: ModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <div className="py-4">{children}</div>}
        {showFooter && (onConfirm || onCancel) && (
          <DialogFooter>
            {onCancel && (
              <Button variant="outline" onClick={handleCancel}>
                {cancelLabel}
              </Button>
            )}
            {onConfirm && (
              <Button variant={confirmVariant} onClick={handleConfirm}>
                {confirmLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Convenience components
export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <DialogHeader className={className}>{children}</DialogHeader>;
}

export function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("py-4", className)}>{children}</div>;
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <DialogFooter className={className}>{children}</DialogFooter>;
}

