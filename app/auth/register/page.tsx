"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMockAuth } from "@/components/shared/mock-auth-provider";
import { isValidEmail } from "@/lib/validation";
import { useToast } from "@/components/shared/toast";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "";
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useMockAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormState, string>>>({});
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const validate = () => {
    const nextErrors: Partial<Record<keyof RegisterFormState, string>> = {};
    if (!form.name || form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    } else if (form.name.trim().length > 40) {
      nextErrors.name = "Name must be under 40 characters";
    }
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
      nextErrors.role = "Select a role";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const normalizedRole = form.role as "admin" | "user";
      if (!normalizedRole) {
        setErrors({ role: "Please select a role" });
        setIsSubmitting(false);
        return;
      }

      register({ name: form.name.trim(), role: normalizedRole });
      toast("Account created successfully!", "success");
      
      // Small delay to show toast before navigation
      setTimeout(() => {
        router.push(normalizedRole === "admin" ? "/admin/home" : "/user/home");
      }, 300);
    } catch (error) {
      console.error("Registration error:", error);
      toast("Failed to create account. Please try again.", "error");
      setErrors({ role: "Failed to create account. Please try again." });
      setIsSubmitting(false);
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
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Create your Flow account</h1>
              <p className="text-sm text-muted-foreground">Join us and start building your forms.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Mohammed Ali"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="pl-9"
                />
              </div>
              {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
            </div>

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

            <div className="space-y-3">
              <Label className="text-sm">Account Type</Label>
              <RadioGroup
                value={form.role}
                onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as "admin" | "user" }))}
                className="grid grid-cols-2 gap-3"
              >
                {["admin", "user"].map((role) => (
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

            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
