export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 px-4 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.25)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.12),transparent_30%),linear-gradient(135deg,rgba(24,24,36,0.7),rgba(17,17,26,0.9))]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
