'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="relative min-h-screen bg-background">
      {/* Navbar - Always visible including home page */}
      <Navbar />
      
      {/* Clean minimal background for all pages */}
      {!isHomePage && (
        <div className="pointer-events-none absolute inset-0 bg-background" />
      )}
      
      <main className={isHomePage ? 'relative w-full' : 'relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8'}>
        {children}
      </main>
      
      {!isHomePage && (
        <footer className="relative border-t border-border bg-background px-4 py-6 text-center text-xs text-muted-foreground font-light sm:px-6">
          © Flow 2025
        </footer>
      )}
    </div>
  );
}

