"use client";

import { AlertCircle, Home, Key, XCircle, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Invalid Access Key Error
export function InvalidAccessKeyError() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md py-12"
    >
      <Card className="border-border/70 bg-card/80">
        <CardContent className="py-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-500/20 p-4">
              <Key className="h-12 w-12 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Invalid or Inactive Access Key</CardTitle>
          <CardDescription>
            The access key you entered is not valid or the form is no longer active.
          </CardDescription>
          <Button onClick={() => router.push("/user/home")} className="gap-2">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Form Closed Error
export function FormClosedError() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md py-12"
    >
      <Card className="border-border/70 bg-card/80">
        <CardContent className="py-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-yellow-500/20 p-4">
              <XCircle className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Form Closed</CardTitle>
          <CardDescription>
            This form is no longer accepting responses.
          </CardDescription>
          <Button onClick={() => router.push("/user/home")} variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Not Found Error
export function NotFoundError({ type = "form" }: { type?: "form" | "template" }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md py-12"
    >
      <Card className="border-border/70 bg-card/80">
        <CardContent className="py-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted/50 p-4">
              <FileX className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Not Found</CardTitle>
          <CardDescription>
            The {type} you are looking for does not exist.
          </CardDescription>
          <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Generic Error
export function GenericError({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md py-12"
    >
      <Card className="border-border/70 bg-card/80">
        <CardContent className="py-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-500/20 p-4">
              <AlertCircle className="h-12 w-12 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Error</CardTitle>
          <CardDescription>{message}</CardDescription>
          <div className="flex gap-2 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            )}
            <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

