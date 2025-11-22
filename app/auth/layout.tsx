import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flow | Auth",
  description: "Authentication shell for Flow — Form Builder System.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="relative w-full max-w-xl space-y-6 rounded-[12px] border border-border bg-card p-8 shadow-inset">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary text-primary-foreground border border-border">
            <span className="text-lg font-bold lowercase">Φ</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-light">Flow</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground lowercase mt-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground font-light mt-2">Sign in to access your forms and admin studio.</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
