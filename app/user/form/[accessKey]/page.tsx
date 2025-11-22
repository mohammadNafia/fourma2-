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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useForms, FormField, FormModel } from "@/components/shared/forms-store";
import { useToast } from "@/components/shared/toast";
import { validateFieldValue } from "@/lib/validation";
import { motion } from "framer-motion";
import { Star, AlertCircle, CheckCircle2, Home, FileText, Loader2 } from "lucide-react";
import { useMockAuth } from "@/components/shared/mock-auth-provider";
import { InvalidAccessKeyError, FormClosedError } from "@/components/shared/error-state";

type FieldErrors = Record<string, string>;

export default function UserFormPage() {
  const params = useParams();
  const router = useRouter();
  const accessKey = (params.accessKey as string).toUpperCase();
  const { getFormByAccessKey, submitForm, saveDraft, getUserFormByAccessKey, trackFormAccess } = useForms();
  const { toast } = useToast();
  const { userId } = useMockAuth();

  const [form, setForm] = useState<FormModel | undefined>(undefined);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundForm = getFormByAccessKey(accessKey);
      if (!foundForm) {
        setLoading(false);
        return;
      }

      // Check if form is published
      if (foundForm.status !== "published") {
        setLoading(false);
        return;
      }

      // Check if form is closed
      if (foundForm.closingDate) {
        const closingDate = new Date(foundForm.closingDate);
        const now = new Date();
        if (now > closingDate) {
          setLoading(false);
          return;
        }
      }

      setForm(foundForm);

      // Track form access
      trackFormAccess(accessKey, userId);

      // Load draft or previous submission
      const userForm = getUserFormByAccessKey(accessKey, userId);
      if (userForm?.draftValues) {
        setValues(userForm.draftValues);
      } else if (userForm?.lastSubmissionId && foundForm.allowMultipleSubmissions) {
        // For multiple submissions, start fresh but allow viewing previous
        setValues({});
      }

      setLoading(false);
    }, 500);
  }, [accessKey, getFormByAccessKey, getUserFormByAccessKey, userId, trackFormAccess]);

  const updateValue = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!form) return false;
    const newErrors: FieldErrors = {};

    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const value = values[field.id];
        const validation = validateFieldValue(
          value,
          field.type,
          field.required,
          field.min,
          field.max,
          field.regex,
        );

        if (!validation.valid) {
          newErrors[field.id] = validation.error || "Invalid value";
        }
      });
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      setTimeout(() => {
        const firstErrorId = Object.keys(newErrors)[0];
        const element = document.getElementById(`field-${firstErrorId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }, 100);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!form) return;

    if (!validateForm()) {
      toast("Please fix the errors before submitting", "error");
      return;
    }

    setIsSubmitting(true);
    const submission = submitForm(accessKey, values, userId);

    if (submission) {
      setSubmitted(true);
      toast("Your response has been submitted successfully", "success");
    } else {
      toast("Failed to submit form. Please try again.", "error");
    }
    setIsSubmitting(false);
  };

  const handleSaveDraft = async () => {
    if (!form) return;
    setIsSaving(true);
    saveDraft(accessKey, values, userId);
    toast("Form saved. You can continue later.", "success");
    setTimeout(() => setIsSaving(false), 1000);
  };

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.id}`;
    const value = values[field.id] ?? field.defaultValue ?? "";
    const error = errors[field.id];
    const hasError = !!error;

    const fieldWrapper = (content: React.ReactNode) => (
      <div id={fieldId} className="space-y-2" ref={hasError ? firstErrorRef : null}>
        <Label htmlFor={fieldId} className={hasError ? "text-destructive" : ""}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {content}
        {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
        {hasError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );

    switch (field.type) {
      case "shortText":
        return fieldWrapper(
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );

      case "longText":
        return fieldWrapper(
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
            rows={4}
          />,
        );

      case "email":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="email"
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={field.placeholder || "example@email.com"}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );

      case "phone":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="tel"
            value={value}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
              updateValue(field.id, cleaned);
            }}
            placeholder={field.placeholder || "07XXXXXXXX"}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );

      case "number":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value ? Number(e.target.value) : "")}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );

      case "date":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="date"
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );

      case "time":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="time"
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );

      case "radio":
        return fieldWrapper(
          <RadioGroup
            value={value}
            onValueChange={(val) => updateValue(field.id, val)}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
          >
            {(field.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <RadioGroupItem value={opt} id={`${fieldId}-${opt}`} />
                {opt}
              </label>
            ))}
          </RadioGroup>,
        );

      case "checkbox":
        const checkboxValues = Array.isArray(value) ? value : [];
        return fieldWrapper(
          <div className="space-y-2">
            {(field.options || []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={checkboxValues.includes(opt)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...checkboxValues, opt]
                      : checkboxValues.filter((v) => v !== opt);
                    updateValue(field.id, newValues);
                  }}
                  disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
                />
                {opt}
              </label>
            ))}
          </div>,
        );

      case "dropdown":
      case "gender":
        const options = field.type === "gender" ? ["Male", "Female", "Other"] : (field.options || []);
        return fieldWrapper(
          <SelectNative
            id={fieldId}
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </SelectNative>,
        );

      case "boolean":
        return fieldWrapper(
          <SelectNative
            id={fieldId}
            value={value === true ? "Yes" : value === false ? "No" : ""}
            onChange={(e) => updateValue(field.id, e.target.value === "Yes")}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </SelectNative>,
        );

      case "rating":
        const maxStars = field.max || 5;
        const rating = Number(value) || 0;
        return fieldWrapper(
          <div className="flex items-center gap-2">
            {Array.from({ length: maxStars }).map((_, idx) => {
              const starValue = idx + 1;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => updateValue(field.id, starValue)}
                  disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
                  className="focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      starValue <= rating
                        ? "fill-primary stroke-primary text-primary"
                        : "fill-transparent stroke-muted-foreground text-muted-foreground"
                    }`}
                  />
                </button>
              );
            })}
            {rating > 0 && <span className="text-sm text-muted-foreground ml-2">{rating} / {maxStars}</span>}
          </div>,
        );

      case "range":
        return fieldWrapper(
          <div className="space-y-2">
            <input
              id={fieldId}
              type="range"
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={value || field.min || 0}
              onChange={(e) => updateValue(field.id, Number(e.target.value))}
              disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{field.min ?? 0}</span>
              <span className="font-medium text-foreground">{value || field.min || 0}</span>
              <span>{field.max ?? 100}</span>
            </div>
          </div>,
        );

      case "file":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                updateValue(field.id, file.name);
              }
            }}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );

      default:
        return fieldWrapper(
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={form.status === "draft" || !!form.closingDate && new Date(form.closingDate) < new Date()}
            className={hasError ? "border-destructive" : ""}
          />,
        );
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <Card className="border-border/70 bg-card/80">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return <InvalidAccessKeyError />;
  }

  const isFormClosed = form.closingDate ? new Date(form.closingDate) < new Date() : false;
  if (form.status !== "published" || isFormClosed) {
    return <FormClosedError />;
  }

  const isDisabled = false; // Already checked above
  const userForm = getUserFormByAccessKey(accessKey, userId);
  const hasDraft = userForm?.draftValues && Object.keys(userForm.draftValues).length > 0;
  const canSubmitAgain = form.allowMultipleSubmissions && userForm?.status === "submitted";

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-border/70 bg-card/80">
            <CardContent className="py-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-500/20 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Your response has been submitted successfully</h2>
              <p className="text-muted-foreground">Thank you for your submission!</p>
              <div className="flex gap-2 justify-center pt-4">
                <Button onClick={() => router.push("/user/home")} variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <Button onClick={() => router.push("/user/forms")}>
                  <FileText className="h-4 w-4 mr-2" />
                  View My Forms
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10">
      {/* Form Header */}
      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{form.title}</CardTitle>
              {form.description && <CardDescription>{form.description}</CardDescription>}
            </div>
            <div className="flex gap-2">
              {form.status === "draft" && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                  Draft
                </span>
              )}
              {isFormClosed && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/50">
                  Closed
                </span>
              )}
              {form.status === "published" && !isFormClosed && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
                  Active
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        {isDisabled && (
          <CardContent>
            <div className="flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/20 px-4 py-3 text-sm text-yellow-400">
              <AlertCircle className="h-4 w-4" />
              <span>This form is not currently accepting submissions.</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Form Fields */}
      <div className="space-y-6">
        {form.sections.map((section) => (
          <Card key={section.id} className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              {section.description && <CardDescription>{section.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.id}>{renderField(field)}</div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Buttons */}
      <Card className="border-border/70 bg-card/80">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {hasDraft && !canSubmitAgain && (
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting || isDisabled}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & continue later"
                )}
              </Button>
            )}
            {canSubmitAgain && (
              <Button
                variant="outline"
                onClick={() => {
                  setValues({});
                  setSubmitted(false);
                }}
                disabled={isSubmitting || isDisabled}
              >
                Submit another response
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isSaving || isDisabled}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
