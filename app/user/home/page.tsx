"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForms } from "@/components/shared/forms-store";
import { useToast } from "@/components/shared/toast";
import { motion } from "framer-motion";
import { Key } from "lucide-react";

export default function UserHomePage() {
  const router = useRouter();
  const { getFormByAccessKey } = useForms();
  const { toast } = useToast();
  const [accessKey, setAccessKey] = useState("");

  const handleOpenForm = () => {
    const key = accessKey.trim().toUpperCase();
    
    if (key.length !== 8) {
      toast("Access key must be 8 characters", "error");
      return;
    }

    const form = getFormByAccessKey(key);

    if (!form) {
      toast("Invalid or inactive access key", "error");
      return;
    }

    // Check if form is published
    if (form.status !== "published") {
      toast("This form is not currently accepting responses", "error");
      return;
    }

    // Check if form is closed
    if (form.closingDate) {
      const closingDate = new Date(form.closingDate);
      const now = new Date();
      if (now > closingDate) {
        toast("This form is closed", "error");
        return;
      }
    }

    router.push(`/user/form/${key}`);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    setAccessKey(value);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold text-foreground">Access a form with a key</h1>
        <p className="text-lg text-muted-foreground">
          Enter the access key you received from your admin to open a form.
        </p>
      </motion.div>

      {/* Access Key Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Access Key
            </CardTitle>
            <CardDescription>Enter your 8-character access key to open a form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-key">Access Key</Label>
              <Input
                id="access-key"
                value={accessKey}
                onChange={handleKeyChange}
                placeholder="Enter 8-character key"
                className="font-mono text-center text-lg tracking-widest"
                maxLength={8}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleOpenForm();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground text-center">
                Example: 4H8QX21B
              </p>
            </div>
            <Button
              onClick={handleOpenForm}
              className="w-full"
              disabled={accessKey.length !== 8}
            >
              Open Form
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/user/forms")}
                className="w-full justify-start"
              >
                View My Forms
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
