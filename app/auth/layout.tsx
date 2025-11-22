import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flow | Auth",
  description: "Authentication shell for Flow — Form Builder System.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.2),transparent_30%)] opacity-80 blur-2xl" />
      <div className="relative w-full max-w-xl space-y-6 rounded-3xl border border-border/70 bg-card/80 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[--primary-gradient] text-lg font-semibold text-primary-foreground shadow-[0_12px_40px_rgba(124,58,237,0.45)]">
            Φ
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Flow</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your forms and admin studio.</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
