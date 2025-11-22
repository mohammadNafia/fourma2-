"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMockAuth } from "@/components/shared/mock-auth-provider";
import { isValidEmail } from "@/lib/validation";

type LoginFormState = {
  email: string;
  password: string;
  remember: boolean;
  role: "admin" | "user";
};

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAdmin, quickLoginUser } = useMockAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    remember: false,
    role: "user",
  });

  const emailName = useMemo(
    () => (form.email ? form.email.split("@")[0] || "Flow User" : "Flow User"),
    [form.email],
  );

  const validate = () => {
    const nextErrors: Partial<Record<keyof LoginFormState, string>> = {};
    if (!form.email) {
      nextErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      nextErrors.password = "Minimum 6 characters";
    }
    if (!form.role) {
      nextErrors.role = "Choose a role";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    login({ name: emailName, role: form.role });
    router.push(form.role === "admin" ? "/admin/home" : "/user/home");
  };

  const handleQuickLogin = (role: "admin" | "user") => {
    if (role === "admin") {
      quickLoginAdmin();
      router.push("/admin/home");
    } else {
      quickLoginUser();
      router.push("/user/home");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="mx-auto max-w-md border-border/70 bg-card/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[--primary-gradient] text-lg font-semibold text-primary-foreground shadow-[0_12px_40px_rgba(99,102,241,0.25)] dark:shadow-[0_12px_40px_rgba(124,58,237,0.45)]">
              Φ
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Sign in to Flow</h1>
              <p className="text-sm text-muted-foreground">Welcome back! Please enter your credentials.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-9"
                />
              </div>
              {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Login as</Label>
              <RadioGroup
                value={form.role}
                onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as "admin" | "user" }))}
                className="grid grid-cols-2 gap-2"
              >
                {["user", "admin"].map((role) => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-sm capitalize hover:border-border"
                  >
                    <RadioGroupItem value={role} />
                    {role}
                  </label>
                ))}
              </RadioGroup>
              {errors.role ? <p className="text-xs text-destructive">{errors.role}</p> : null}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={form.remember}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, remember: Boolean(checked) }))
                  }
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Sign in
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="bg-border/60" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">OR</span>
              <Separator className="bg-border/60" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button variant="outline" className="w-full" onClick={() => handleQuickLogin("user")} type="button">
                Login as User
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleQuickLogin("admin")} type="button">
                Login as Admin
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full border border-border/70 bg-foreground/5 text-foreground hover:bg-foreground/10"
              type="button"
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-sm bg-white">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path
                    fill="#4285F4"
                    d="M23.52 12.273c0-.815-.073-1.595-.209-2.34H12v4.427h6.48c-.28 1.5-1.12 2.773-2.392 3.627v3.01h3.872c2.268-2.087 3.56-5.163 3.56-8.724Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.956-1.073 7.941-2.904l-3.872-3.01c-1.073.72-2.445 1.147-4.069 1.147-3.127 0-5.774-2.112-6.72-4.946H1.266v3.104C3.24 21.3 7.295 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.287c-.24-.72-.376-1.487-.376-2.287s.136-1.567.376-2.287V6.609H1.266A11.994 11.994 0 0 0 0 12c0 1.945.468 3.78 1.266 5.391l4.014-3.104Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.764 0 3.35.606 4.596 1.795l3.448-3.447C17.952 1.126 15.236 0 12 0 7.295 0 3.24 2.7 1.266 6.609l4.014 3.104C6.226 6.862 8.873 4.75 12 4.75Z"
                  />
                </svg>
              </span>
              Sign in with Google
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            New to Flow?{" "}
            <Link href="/auth/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
