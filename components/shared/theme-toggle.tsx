"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
