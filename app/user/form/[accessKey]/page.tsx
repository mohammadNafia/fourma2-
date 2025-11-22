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
import { useSearchParams } from "next/navigation";

type FieldErrors = Record<string, string>;

export default function UserFormPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessKey = (params.accessKey as string).toUpperCase();
  const { getFormByAccessKey, submitForm, saveDraft, getUserFormByAccessKey, trackFormAccess } = useForms();
  const { toast } = useToast();
  const { userId, userRole } = useMockAuth();
  const isTestMode = searchParams.get("test") === "true" || searchParams.get("preview") === "true";
  const isAdmin = userRole === "admin";

  const [form, setForm] = useState<FormModel | undefined>(undefined);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load form - try multiple times to ensure it's loaded from localStorage
    let attempts = 0;
    const maxAttempts = 3;
    
    const loadForm = () => {
      attempts++;
      const foundForm = getFormByAccessKey(accessKey);
      
      if (!foundForm) {
        // If not found and we haven't tried enough times, try again
        if (attempts < maxAttempts) {
          setTimeout(loadForm, 200);
          return;
        }
        setLoading(false);
        return;
      }

      // Check if form is published (allow admins in test mode to preview draft forms)
      if (foundForm.status !== "published" && !(isAdmin && isTestMode)) {
        setLoading(false);
        return;
      }

      // Check if form is closed (allow admins in test mode to preview closed forms)
      if (foundForm.closingDate && !(isAdmin && isTestMode)) {
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
    };
    
    // Start loading after a short delay to ensure localStorage is ready
    setTimeout(loadForm, 100);
  }, [accessKey, getFormByAccessKey, getUserFormByAccessKey, userId, trackFormAccess, isAdmin, isTestMode]);

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

    // Validate all sections and fields
    form.sections.forEach((section) => {
      if (section.fields && section.fields.length > 0) {
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
      }
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
        <Label htmlFor={fieldId} className={`text-sm font-light ${hasError ? "text-foreground" : "text-muted-foreground"}`}>
          {field.label}
          {field.required && <span className="text-foreground ml-1">*</span>}
        </Label>
        {content}
        {field.helpText && <p className="text-xs text-muted-foreground font-light">{field.helpText}</p>}
        {hasError && (
          <div className="flex items-center gap-2 text-xs text-foreground font-light">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );

    const isDisabled = form?.status === "draft" || (!!form?.closingDate && new Date(form.closingDate) < new Date());

    switch (field.type) {
      case "shortText":
        return fieldWrapper(
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
          />,
        );

      case "longText":
        return fieldWrapper(
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
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
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
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
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
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
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
          />,
        );

      case "date":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="date"
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
          />,
        );

      case "time":
        return fieldWrapper(
          <Input
            id={fieldId}
            type="time"
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
          />,
        );

      case "radio":
        return fieldWrapper(
          <RadioGroup
            value={value}
            onValueChange={(val) => updateValue(field.id, val)}
            disabled={isDisabled}
          >
            {(field.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer font-light">
                <RadioGroupItem value={opt} id={`${fieldId}-${opt}`} />
                <span>{opt}</span>
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
                className="flex items-center gap-2 text-sm cursor-pointer font-light"
              >
                <Checkbox
                  checked={checkboxValues.includes(opt)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...checkboxValues, opt]
                      : checkboxValues.filter((v) => v !== opt);
                    updateValue(field.id, newValues);
                  }}
                  disabled={isDisabled}
                />
                <span>{opt}</span>
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
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
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
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
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
                  disabled={isDisabled}
                  className="focus:outline-none focus:ring-1 focus:ring-ring rounded transition-opacity duration-200 hover:opacity-80 disabled:opacity-50"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      starValue <= rating
                        ? "fill-foreground stroke-foreground text-foreground"
                        : "fill-transparent stroke-muted-foreground text-muted-foreground"
                    }`}
                  />
                </button>
              );
            })}
            {rating > 0 && <span className="text-sm text-muted-foreground font-light ml-2">{rating} / {maxStars}</span>}
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
              disabled={isDisabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-light">
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
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
          />,
        );

      default:
        return fieldWrapper(
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => updateValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={hasError ? "border-foreground" : ""}
          />,
        );
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <Card className="border-border bg-card shadow-inset">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return <InvalidAccessKeyError />;
  }

  const isFormClosed = form.closingDate ? new Date(form.closingDate) < new Date() : false;
  // Allow admins in test mode to preview forms even if not published or closed
  if (!(isAdmin && isTestMode) && (form.status !== "published" || isFormClosed)) {
    return <FormClosedError />;
  }

  const isDisabled = false;
  const userForm = getUserFormByAccessKey(accessKey, userId);
  const hasDraft = userForm?.draftValues && Object.keys(userForm.draftValues).length > 0;
  const canSubmitAgain = form.allowMultipleSubmissions && userForm?.status === "submitted";

  if (submitted) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card className="border-border bg-card shadow-inset">
            <CardContent className="py-16 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full border border-border bg-secondary p-6">
                  <CheckCircle2 className="h-12 w-12 text-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground lowercase">Response submitted</h2>
              <p className="text-muted-foreground font-light">Thank you for your submission!</p>
              <div className="flex gap-3 justify-center pt-4">
                <Button onClick={() => router.push("/user/home")} variant="outline" className="lowercase font-light">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <Button onClick={() => router.push("/user/forms")} variant="primary" className="lowercase">
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
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      {/* Form Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Card className="border-border bg-card shadow-inset">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold lowercase">{form.title}</CardTitle>
                {form.description && (
                  <CardDescription className="font-light">{form.description}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                {isAdmin && isTestMode && (
                  <span className="px-3 py-1 rounded-[6px] border border-border bg-secondary text-xs font-medium text-foreground uppercase">
                    Test Mode
                  </span>
                )}
                {form.status === "published" && !isFormClosed && !(isAdmin && isTestMode) && (
                  <span className="px-3 py-1 rounded-[6px] border border-border bg-secondary text-xs font-medium text-foreground uppercase">
                    Active
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Form Sections - Ensure all sections are rendered */}
      <div className="space-y-6">
        {form.sections && form.sections.length > 0 ? (
          form.sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id || `section-${sectionIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: sectionIndex * 0.05 }}
            >
              <Card className="border-border bg-card shadow-inset">
                <CardHeader>
                  <CardTitle className="text-lg font-bold lowercase">
                    {section.title || `Section ${sectionIndex + 1}`}
                  </CardTitle>
                  {section.description && (
                    <CardDescription className="font-light">{section.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.fields && section.fields.length > 0 ? (
                    section.fields.map((field, fieldIndex) => (
                      <div key={field.id || `field-${fieldIndex}`}>
                        {renderField(field)}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground font-light italic">
                      No fields in this section
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="border-border bg-card shadow-inset">
            <CardContent className="py-12 text-center">
              <p className="text-sm text-muted-foreground font-light">This form has no sections yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submit Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
      >
        <Card className="border-border bg-card shadow-inset">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              {hasDraft && !canSubmitAgain && (
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving || isSubmitting || isDisabled}
                  className="lowercase font-light"
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
                  className="lowercase font-light"
                >
                  Submit another response
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isSaving || isDisabled}
                className="min-w-[120px] lowercase"
                variant="primary"
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
      </motion.div>
    </div>
  );
}
