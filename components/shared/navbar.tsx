"use client";

"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, User, Workflow } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMockAuth } from "./mock-auth-provider";

type NavbarProps = {
  centerSlot?: ReactNode;
};

function getInitials(name: string | null) {
  if (!name) return "FL";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase();
}

export function Navbar({ centerSlot }: NavbarProps) {
  const pathname = usePathname();
  const {
    isAuthenticated,
    userName,
    userRole,
    activeSpace,
    quickLoginUser,
    logout,
    switchToAdmin,
    switchToUser,
  } = useMockAuth();

  const onSwitch = (target: "admin" | "user") => {
    if (target === "admin") {
      switchToAdmin();
    } else {
      switchToUser();
    }
  };

  const placeholder = centerSlot ?? (
    <div className="hidden md:flex flex-col">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">Navigation</span>
      <span className="text-sm text-muted-foreground">
        {pathname === "/" ? "Welcome to Flow" : pathname}
      </span>
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[--primary-gradient] text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(124,58,237,0.4)] transition-transform duration-150 group-hover:scale-105">
              Φ
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-foreground">Flow</span>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Form Studio</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">{placeholder}</div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 rounded-full border-border/70 bg-card/60 pr-2 pl-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground">
                    {getInitials(userName)}
                  </div>
                  <span className="mx-2 text-sm text-foreground">{userName}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Signed in as</span>
                  <span className="text-sm font-semibold text-foreground">{userName}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                    {activeSpace ?? userRole ?? "guest"}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  My Account
                </DropdownMenuItem>
                {userRole === "admin" && (
                  <>
                    <DropdownMenuItem onSelect={() => onSwitch("admin")}>
                      <Workflow className="mr-2 h-4 w-4 text-muted-foreground" />
                      Switch to Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onSwitch("user")}>
                      <Workflow className="mr-2 h-4 w-4 rotate-180 text-muted-foreground" />
                      Switch to User
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive" onSelect={logout}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="primary"
                size="sm"
                className="hidden shadow-[0_12px_40px_rgba(79,70,229,0.45)] sm:inline-flex"
                onClick={() => quickLoginUser()}
              >
                <Link href="/auth/register">Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
