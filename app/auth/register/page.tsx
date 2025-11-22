"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="mx-auto max-w-md border-border bg-card p-8 shadow-inset">
        <CardContent className="space-y-6">
          <div className="space-y-3 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground lowercase tracking-tight">
                create account
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                Join us and start building your forms
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-light text-muted-foreground">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="font-light"
              />
              {errors.name ? (
                <p className="text-xs text-muted-foreground font-light">{errors.name}</p>
              ) : null}
            </div>

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
              <Label className="text-sm font-light text-muted-foreground">Account Type</Label>
              <RadioGroup
                value={form.role}
                onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as "admin" | "user" }))}
                className="grid grid-cols-2 gap-2"
              >
                {["admin", "user"].map((role) => (
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

            <Button type="submit" variant="primary" className="w-full lowercase" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground font-light">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-foreground hover:opacity-80 transition-opacity duration-200">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
