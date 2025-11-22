export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 px-4 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.1),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.08),transparent_32%)]" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
