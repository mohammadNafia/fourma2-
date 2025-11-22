"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "flow-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;
  if (theme === "dark") {
    root.classList.add("dark");
    body.classList.add("dark");
    root.dataset.theme = "dark";
    body.dataset.theme = "dark";
  } else {
    root.classList.remove("dark");
    body.classList.remove("dark");
    root.dataset.theme = "light";
    body.dataset.theme = "light";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? undefined;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "dark");
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
