'use client';

import { motion } from "framer-motion";
import { AppShell } from "@/components/shared/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const routes = [
  "/auth/login",
  "/auth/register",
  "/admin/home",
  "/admin/new-form",
  "/admin/form/[formId]/edit",
  "/admin/form/[formId]/builder",
  "/admin/form/[formId]/dashboard",
  "/user/home",
  "/user/forms",
  "/user/form/[accessKey]",
];

export default function Home() {
  return (
    <AppShell
      title="Flow Form Builder — Core Skeleton Ready"
      description="Premium dark-mode foundation with Next.js 14 + React 19, Tailwind v4, and shadcn/UI v2. All required routes, providers, and theme primitives are scaffolded for the upcoming UI build."
    >
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tech Stack Locked</CardTitle>
            <CardDescription>
              Next.js 14 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · shadcn/UI v2 ·
              Framer Motion · Lucide icons
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-foreground/5 p-4">
              <p className="text-sm font-semibold text-foreground">Theme DNA</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Dark-first palette with primary gradient (#4F46E5 → #9333EA), luxury spacing,
                gradients, and smooth focus states.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-foreground/5 p-4">
              <p className="text-sm font-semibold text-foreground">Animations</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Framer Motion wired for page scaffolds; global blur + glow for Apple-like smoothness.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Global Rules</CardTitle>
            <CardDescription>Dark by default, consistent padding, responsive cards, smooth hover.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Light/Dark toggle is available from the shell header and persisted locally.</p>
            <Separator className="bg-border/50" />
            <p>Color tokens live in <code className="text-foreground">app/globals.css</code>.</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
      >
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Routing Blueprint</CardTitle>
            <CardDescription>All required directories are pre-created to keep the build fast.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-card/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Admin
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground/90">
                {routes.slice(2, 7).map((route) => (
                  <li key={route} className="flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2">
                    <span>{route}</span>
                    <span className="text-[11px] text-muted-foreground">scaffolded</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Auth & User
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground/90">
                {routes.slice(0, 2).concat(routes.slice(7)).map((route) => (
                  <li key={route} className="flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2">
                    <span>{route}</span>
                    <span className="text-[11px] text-muted-foreground">scaffolded</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shadcn/UI Kits</CardTitle>
            <CardDescription>Base primitives added manually for Tailwind v4.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Installed: button, card, checkbox, input, label, separator, textarea, radio-group, dropdown-menu,
              select-native, utils.
            </p>
            <div className="rounded-lg border border-border/60 bg-foreground/5 p-3 text-xs text-muted-foreground">
              Ready for <code className="text-foreground">npx shadcn@latest add ...</code> commands if we
              need more components.
            </div>
            <Button variant="secondary" className="w-full">View component stubs</Button>
          </CardContent>
        </Card>
      </motion.div>
    </AppShell>
  );
}
