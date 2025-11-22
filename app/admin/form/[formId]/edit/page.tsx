"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useForms } from "@/components/shared/forms-store";
import { Copy, ExternalLink, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/shared/toast";
import { motion } from "framer-motion";

export default function FormEditPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const { getFormById, updateForm, regenerateAccessKey } = useForms();
  const { toast } = useToast();
  const form = getFormById(formId);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(false);
  const [anonymousResponses, setAnonymousResponses] = useState(false);
  const [closingDate, setClosingDate] = useState("");
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const isInitializedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const initialValuesRef = useRef<{
    title: string;
    description: string;
    category: string;
    status: "draft" | "published";
    allowMultipleSubmissions: boolean;
    anonymousResponses: boolean;
    closingDate: string;
  } | null>(null);

  // Initialize form data from props - only once when form first loads
  useEffect(() => {
    if (form && !isInitializedRef.current) {
      setFormName(form.title);
      setFormDescription(form.description);
      setCategory(form.category || "");
      setStatus(form.status);
      setAllowMultipleSubmissions(form.allowMultipleSubmissions ?? false);
      setAnonymousResponses(form.anonymousResponses ?? false);
      setClosingDate(form.closingDate || "");
      
      // Store initial values for comparison
      initialValuesRef.current = {
        title: form.title,
        description: form.description,
        category: form.category || "",
        status: form.status,
        allowMultipleSubmissions: form.allowMultipleSubmissions ?? false,
        anonymousResponses: form.anonymousResponses ?? false,
        closingDate: form.closingDate || "",
      };
      
      isInitializedRef.current = true;
    }
    // Reset initialization flag when formId changes
    if (form?.id !== formId) {
      isInitializedRef.current = false;
      initialValuesRef.current = null;
    }
  }, [form, formId]);

  // Auto-save with debouncing - only save when user makes changes
  useEffect(() => {
    if (!form || !isInitializedRef.current || !initialValuesRef.current || isSavingRef.current) return;
    
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Compare against initial values, not current form values (prevents infinite loop)
    const initial = initialValuesRef.current;
    const hasChanges = 
      formName !== initial.title ||
      formDescription !== initial.description ||
      category !== initial.category ||
      status !== initial.status ||
      allowMultipleSubmissions !== initial.allowMultipleSubmissions ||
      anonymousResponses !== initial.anonymousResponses ||
      closingDate !== initial.closingDate;
    
    if (hasChanges) {
      // Debounce the save to prevent rapid updates
      saveTimeoutRef.current = setTimeout(() => {
        // Prevent saving if we're already saving
        if (isSavingRef.current) return;
        
        isSavingRef.current = true;
        updateForm(formId, {
          title: formName,
          description: formDescription,
          category: category || undefined,
          status,
          allowMultipleSubmissions,
          anonymousResponses,
          closingDate: closingDate || undefined,
        });
        
        // Update initial values to match what we just saved
        if (initialValuesRef.current) {
          initialValuesRef.current = {
            title: formName,
            description: formDescription,
            category: category || "",
            status,
            allowMultipleSubmissions,
            anonymousResponses,
            closingDate: closingDate || "",
          };
        }
        
        setSavedIndicator(true);
        setTimeout(() => {
          setSavedIndicator(false);
          isSavingRef.current = false;
        }, 2000);
      }, 800); // 800ms debounce
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formName, formDescription, category, status, allowMultipleSubmissions, anonymousResponses, closingDate, formId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard`, "success");
  };

  const handleRegenerateKey = () => {
    if (!form) return;
    const newKey = regenerateAccessKey(formId);
    toast("Access key regenerated successfully", "success");
    setShowRegenerateConfirm(false);
  };

  const handleOpenAsUser = () => {
    if (!form) return;
    window.open(`/user/form/${form.accessKey}?test=true`, "_blank");
  };

  const isFormClosed = form?.closingDate ? new Date(form.closingDate) < new Date() : false;

  if (!form) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Form not found</p>
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/user/form/${form.accessKey}` : "";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {savedIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="sticky top-20 z-10 flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground font-light"
        >
          <Check className="h-4 w-4" />
          <span>Saved</span>
        </motion.div>
      )}

      {/* Form Basic Info */}
      <Card className="border-border bg-card shadow-inset">
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
          <CardDescription>Manage basic information about your form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-name">
              Form Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Add a description to help collaborators understand this form"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Internal Survey, Feedback, HR, Tech"
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Key Management */}
      <Card className="border-border bg-card shadow-inset">
        <CardHeader>
          <CardTitle>Access & Sharing</CardTitle>
          <CardDescription>Manage access keys and sharing options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Access Key</Label>
            <div className="flex gap-2">
              <Input value={form.accessKey} readOnly className="font-mono" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(form.accessKey, "Access key")}
                title="Copy access key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Public URL</Label>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(publicUrl, "Public URL")}
                title="Copy public URL"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowRegenerateConfirm(true)}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate Access Key
            </Button>
            <Button variant="primary" onClick={handleOpenAsUser} className="gap-2 lowercase">
              <ExternalLink className="h-4 w-4" />
              Test as User
            </Button>
          </div>

          {showRegenerateConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="rounded-lg border border-border bg-secondary p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-light text-foreground">
                    Are you sure? Users with the old key will no longer be able to access this form.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={handleRegenerateKey}>
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowRegenerateConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Form Status & Settings */}
      <Card className="border-border bg-card shadow-inset">
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
          <CardDescription>Configure form behavior and restrictions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Form Status</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="h-4 w-4"
                />
                <span className="text-sm">Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="h-4 w-4"
                />
                <span className="text-sm">Published</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              {status === "draft"
                ? "Users with access key cannot submit"
                : "Users can submit responses"}
            </p>
          </div>

          <Separator className="bg-border/60" />

          <div className="flex items-start gap-3">
            <Checkbox
              id="allow-multiple"
              checked={allowMultipleSubmissions}
              onCheckedChange={(checked) => setAllowMultipleSubmissions(checked === true)}
            />
            <div className="flex-1 space-y-1">
              <Label htmlFor="allow-multiple" className="cursor-pointer">
                Allow Multiple Submissions
              </Label>
              <p className="text-xs text-muted-foreground">
                If checked, the same user can submit multiple times. If unchecked, users can only have one submission (they can edit it but not create a new one).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="anonymous"
              checked={anonymousResponses}
              onCheckedChange={(checked) => setAnonymousResponses(checked === true)}
            />
            <div className="flex-1 space-y-1">
              <Label htmlFor="anonymous" className="cursor-pointer">
                Anonymous Responses
              </Label>
              <p className="text-xs text-muted-foreground">
                If enabled, user identity is not attached to submissions.
              </p>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-2">
            <Label htmlFor="closing-date">Closing Date (optional)</Label>
            <Input
              id="closing-date"
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              If set and current date passes the closing date, the form will be closed.
            </p>
            {isFormClosed && (
              <div className="flex items-center gap-2 text-sm text-foreground font-light">
                <AlertTriangle className="h-4 w-4" />
                <span>This form is currently closed</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
