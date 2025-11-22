"use client";

"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, User, Workflow, BookOpen } from "lucide-react";
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
    <nav className="sticky top-0 z-40 border-b border-border bg-background transition-all duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary text-primary-foreground border border-border transition-all duration-200 group-hover:scale-[1.02]">
              <span className="text-base font-bold lowercase">Φ</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-foreground tracking-tight lowercase">Flow</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-light">Form Studio</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">{placeholder}</div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <Link href="/documentation" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Documentation</span>
            </Link>
          </Button>
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 rounded-[10px] border-border bg-card pr-2 pl-1 hover:bg-secondary">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-secondary text-xs font-medium text-foreground border border-border">
                    {getInitials(userName)}
                  </div>
                  <span className="mx-2 text-sm font-medium text-foreground lowercase">{userName}</span>
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
              <Button asChild variant="ghost" size="sm" className="text-sm lowercase">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex lowercase"
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
