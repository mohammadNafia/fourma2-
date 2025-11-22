"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="mx-auto max-w-md border-border bg-card p-8 shadow-inset">
        <CardContent className="space-y-6">
          <div className="space-y-3 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground lowercase tracking-tight">
                sign in
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                Enter your credentials to continue
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-light text-muted-foreground">
                Email
              </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="font-light"
                />
              {errors.email ? (
                <p className="text-xs text-muted-foreground font-light">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-light text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="pr-10 font-light"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-muted-foreground font-light">{errors.password}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-light text-muted-foreground">Login as</Label>
              <RadioGroup
                value={form.role}
                onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as "admin" | "user" }))}
                className="grid grid-cols-2 gap-2"
              >
                {["user", "admin"].map((role) => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-card px-3 py-2.5 text-sm font-light hover:bg-secondary transition-colors duration-200"
                  >
                    <RadioGroupItem value={role} />
                    <span className="lowercase">{role}</span>
                  </label>
                ))}
              </RadioGroup>
              {errors.role ? (
                <p className="text-xs text-muted-foreground font-light">{errors.role}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.remember}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, remember: Boolean(checked) }))
                  }
                />
                <span className="text-muted-foreground font-light">Remember me</span>
              </label>
              <Link href="#" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full lowercase">
              Sign in
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="bg-border" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-light">or</span>
              <Separator className="bg-border" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button 
                variant="outline" 
                className="w-full lowercase font-light" 
                onClick={() => handleQuickLogin("user")} 
                type="button"
              >
                Login as User
              </Button>
              <Button 
                variant="outline" 
                className="w-full lowercase font-light" 
                onClick={() => handleQuickLogin("admin")} 
                type="button"
              >
                Login as Admin
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground font-light">
            New to Flow?{" "}
            <Link href="/auth/register" className="font-medium text-foreground hover:opacity-80 transition-opacity duration-200">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
