export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-border bg-card px-4 py-8 shadow-inset sm:px-6 lg:px-8">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
