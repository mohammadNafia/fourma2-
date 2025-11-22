import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { LayoutWrapper } from "@/components/shared/layout-wrapper";
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
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </ToastProvider>
            </FormsProvider>
          </MockAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
