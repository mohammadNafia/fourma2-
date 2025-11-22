"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForms } from "@/components/shared/forms-store";

export default function AdminNewFormPage() {
  const router = useRouter();
  const { createForm } = useForms();
  const hasCreatedRef = useRef(false);
  const [status, setStatus] = useState<"creating" | "redirecting">("creating");

  useEffect(() => {
    if (hasCreatedRef.current) return;
    hasCreatedRef.current = true;
    const form = createForm();
    setStatus("redirecting");
    const timer = setTimeout(() => {
      router.replace(`/admin/form/${form.id}/edit`);
    }, 700);
    return () => clearTimeout(timer);
  }, [createForm, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="mx-auto max-w-xl border-border/70 bg-card/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Creating your form…
          </CardTitle>
          <CardDescription>Please wait while we prepare your fresh workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-3 w-24 rounded-full bg-foreground/10">
            <div className="h-3 w-12 animate-[pulse_0.9s_ease-in-out_infinite] rounded-full bg-primary/80" />
          </div>
          <Separator className="bg-border/60" />
          <p className="text-sm text-muted-foreground">
            We automatically generate a unique 8-character access key and a form ID, then redirect you to the edit page.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Status: {status === "creating" ? "Creating" : "Redirecting"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
