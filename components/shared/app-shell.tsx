import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AppShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  bleed?: boolean;
};

export function AppShell({ title, description, actions, children, bleed = false }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#11111a]/40 via-transparent to-transparent dark:from-[#11111a]/60" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.25),transparent_35%)] blur-2xl" />
      <div className={cn("relative mx-auto flex max-w-screen-2xl flex-col gap-8 px-6 py-10", bleed && "max-w-none")}>
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 px-6 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#9333EA] text-sm font-semibold text-white shadow-[0_12px_35px_rgba(124,58,237,0.55)]">
              Φ
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Flow</p>
              <p className="text-base font-semibold text-foreground">Form Builder System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="inline-flex items-center rounded-full bg-foreground/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Luxury Dark UI
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                  {title}
                </h1>
                {description ? (
                  <p className="max-w-2xl text-base text-muted-foreground">{description}</p>
                ) : null}
              </div>
            </div>
            <div className="hidden h-full min-w-[160px] items-center justify-end rounded-xl border border-border/60 bg-gradient-to-r from-[#1f1f2b] to-[#181821] px-4 py-3 text-xs font-medium text-muted-foreground shadow-inner md:flex">
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] bg-clip-text text-transparent">
                Premium Flow Studio
              </span>
            </div>
          </div>
          <Separator className="bg-border/50" />
        </div>

        <main className="grid gap-6">{children}</main>
      </div>
    </div>
  );
}
