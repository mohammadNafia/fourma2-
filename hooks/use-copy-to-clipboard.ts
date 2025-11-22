"use client";

import { useState } from "react";
import { useToast } from "@/components/shared/toast";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast(successMessage || "Copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      toast("Failed to copy to clipboard", "error");
      return false;
    }
  };

  return { copy, copied };
}

