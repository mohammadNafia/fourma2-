"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionUrl,
  onAction,
  className,
}: EmptyStateProps) {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionUrl) {
      router.push(actionUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-dashed border-border/70 bg-card/70">
        <CardContent className="py-12 text-center">
          {Icon && (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted/50 p-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          )}
          <CardTitle className="mb-2">{title}</CardTitle>
          <CardDescription className="mb-6">{description}</CardDescription>
          {(actionLabel && (actionUrl || onAction)) && (
            <Button variant="primary" onClick={handleAction}>
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

