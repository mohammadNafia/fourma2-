"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Key, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/components/shared/toast";
import { useForms } from "@/components/shared/forms-store";

export default function AccessKeyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { getFormByAccessKey } = useForms();
  const [accessKey, setAccessKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      toast("Please enter an access key", "error");
      return;
    }

    setIsLoading(true);
    const upperKey = accessKey.trim().toUpperCase();
    
    // Try multiple times to find the form (in case localStorage hasn't synced yet)
    let attempts = 0;
    const maxAttempts = 5;
    
    const tryFindForm = () => {
      attempts++;
      const form = getFormByAccessKey(upperKey);

      if (!form) {
        // If not found and we haven't tried enough times, try again
        if (attempts < maxAttempts) {
          setTimeout(tryFindForm, 200);
          return;
        }
        setIsLoading(false);
        toast("Invalid access key. Please check and try again.", "error");
        return;
      }

      if (form.status !== "published") {
        setIsLoading(false);
        toast("This form is not currently available.", "error");
        return;
      }

      // Check if form is closed
      if (form.closingDate) {
        const closingDate = new Date(form.closingDate);
        const now = new Date();
        if (now > closingDate) {
          setIsLoading(false);
          toast("This form is closed.", "error");
          return;
        }
      }

      // Navigate to the form
      setIsLoading(false);
      router.push(`/user/form/${upperKey}`);
    };
    
    // Start trying after a short delay
    setTimeout(tryFindForm, 100);
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Card className="border-border bg-card shadow-inset">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-lg border border-border bg-secondary p-2">
                <Key className="h-5 w-5 text-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold lowercase">enter access key</CardTitle>
            </div>
            <CardDescription className="font-light">
              Enter the access key provided by the form administrator to access the form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="access-key" className="text-sm font-light text-muted-foreground">
                  Access Key
                </Label>
                <Input
                  id="access-key"
                  type="text"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                  placeholder="Enter access key (e.g., 4H8QX21B)"
                  className="font-mono text-center uppercase tracking-wider"
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground font-light">
                  Access keys are case-insensitive and typically 8 characters long.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full lowercase"
                disabled={isLoading || !accessKey.trim()}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    access form
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

