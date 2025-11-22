"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Copy, Link as LinkIcon, LogOut, PencilLine, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForms } from "@/components/shared/forms-store";
import { useMockAuth } from "@/components/shared/mock-auth-provider";
import { ThemeToggle } from "@/components/shared/theme-toggle";

type Props = {
  formId: string;
};

export function FormHeader({ formId }: Props) {
  const pathname = usePathname();
  const { getFormById, updateFormTitle } = useForms();
  const { userName, logout } = useMockAuth();
  const form = getFormById(formId);
  const [title, setTitle] = useState(form?.title ?? "Untitled Form");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (form?.title) setTitle(form.title);
  }, [form?.title]);

  const shareUrl = useMemo(() => `/user/form/${form?.accessKey ?? "--------"}`, [form?.accessKey]);

  const handleSave = () => {
    updateFormTitle(formId, title);
    setIsEditing(false);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  };

  return (
    <div className="sticky top-16 z-30 space-y-2 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                className="w-60"
                autoFocus
              />
            ) : (
              <button
                className="group inline-flex items-center gap-2 text-lg font-semibold text-foreground"
                onClick={() => setIsEditing(true)}
              >
                <span className="truncate">{title}</span>
                <PencilLine className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Access Key: {form?.accessKey ?? "--------"}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs"
              onClick={() => handleCopy(form?.accessKey ?? "")}
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            className="hidden items-center gap-2 rounded-full border-border/70 bg-card/70 px-3 text-sm sm:flex"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold">
              {userName ? userName.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <span className="truncate max-w-[120px]">{userName || "Admin"}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            className="rounded-full border border-border/70"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1">
          <LinkIcon className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{shareUrl}</span>
        </div>
        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs" onClick={() => handleCopy(shareUrl)}>
          Copy link
        </Button>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
          {pathname}
        </span>
      </div>
    </div>
  );
}
