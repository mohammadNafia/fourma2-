import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { MockAuthProvider } from "@/components/shared/mock-auth-provider";
import { FormsProvider } from "@/components/shared/forms-store";
import { ToastProvider } from "@/components/shared/toast";

const fontSans = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const fontMono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flow | Form Builder System",
  description:
    "Luxury dark-mode Next.js 14 + React 19 form builder foundation with admin, user, and dynamic form experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <MockAuthProvider>
            <FormsProvider>
              <ToastProvider>
                <div className="relative min-h-screen bg-background">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#11111a]/60 via-transparent to-transparent dark:from-[#11111a]/60" />
                  <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.18),transparent_35%)] blur-2xl" />
                  <Navbar />
                  <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
                    {children}
                  </main>
                  <footer className="relative border-t border-border/70 bg-background/70 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
                    © Flow 2025
                  </footer>
                </div>
              </ToastProvider>
            </FormsProvider>
          </MockAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
