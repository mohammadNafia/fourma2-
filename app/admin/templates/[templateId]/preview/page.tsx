"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Copy, Eye, FileEdit, LayoutTemplate, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForms } from "@/components/shared/forms-store";
import { useToast } from "@/components/shared/toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectNative } from "@/components/ui/select-native";
import { Star } from "lucide-react";

function renderFieldPreview(field: any) {
  switch (field.type) {
    case "shortText":
    case "email":
    case "phone":
      return <Input disabled placeholder={field.placeholder || "Text input"} />;
    case "longText":
      return <Textarea disabled placeholder={field.placeholder || "Long text"} rows={3} />;
    case "radio":
      return (
        <RadioGroup value={field.options?.[0]} disabled>
          {(field.options || []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={opt} disabled />
              {opt}
            </label>
          ))}
        </RadioGroup>
      );
    case "checkbox":
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <Checkbox disabled />
              {opt}
            </label>
          ))}
        </div>
      );
    case "dropdown":
    case "gender":
      return (
        <SelectNative disabled>
          {(field.options || []).map((opt: string) => (
            <option key={opt}>{opt}</option>
          ))}
        </SelectNative>
      );
    case "number":
      return <Input disabled type="number" placeholder="123" />;
    case "range":
      return <input type="range" disabled className="w-full accent-primary" />;
    case "date":
      return <Input disabled type="date" />;
    case "time":
      return <Input disabled type="time" />;
    case "boolean":
      return (
        <SelectNative disabled>
          <option>Yes</option>
          <option>No</option>
        </SelectNative>
      );
    case "rating":
      return (
        <div className="flex items-center gap-1 text-primary">
          {Array.from({ length: Number(field.max) || 5 }).map((_, idx) => (
            <Star key={idx} className="h-4 w-4 fill-primary/30 stroke-primary" />
          ))}
        </div>
      );
    case "file":
      return <Input disabled type="file" />;
    default:
      return <Input disabled placeholder="Text input" />;
  }
}

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const { getTemplateById, deleteTemplate, duplicateTemplate, createFormFromTemplate } = useForms();
  const { toast } = useToast();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Template not found</p>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleUseTemplate = () => {
    try {
      const form = createFormFromTemplate(templateId);
      router.push(`/admin/form/${form.id}/edit`);
      toast("Form created from template", "success");
    } catch (error) {
      toast("Failed to create form from template", "error");
    }
  };

  const handleDuplicate = () => {
    try {
      duplicateTemplate(templateId);
      toast("Template duplicated successfully", "success");
      router.push("/admin/templates");
    } catch (error) {
      toast("Failed to duplicate template", "error");
    }
  };

  const handleDelete = () => {
    deleteTemplate(templateId);
    toast("Template deleted successfully", "success");
    router.push("/admin/templates");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/templates")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground">Template Preview</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleUseTemplate} className="gap-2">
            <LayoutTemplate className="h-4 w-4" />
            Use Template
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/templates/${templateId}/builder`)} className="gap-2">
            <FileEdit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{template.name}</CardTitle>
              {template.description && <CardDescription>{template.description}</CardDescription>}
              {template.category && (
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  {template.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {template.sections.map((section) => {
          const isCollapsed = collapsedSections.has(section.id);
          return (
            <Card key={section.id} className="border-border/70 bg-card/80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    {section.description && <CardDescription>{section.description}</CardDescription>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSection(section.id)}
                    className="h-8 w-8"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {!isCollapsed && (
                <CardContent className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </label>
                      </div>
                      {renderFieldPreview(field)}
                      {field.helpText && (
                        <p className="text-xs text-muted-foreground">{field.helpText}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardContent className="py-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleUseTemplate} className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Use Template
            </Button>
            <Button variant="outline" onClick={() => router.push(`/admin/templates/${templateId}/builder`)} className="gap-2">
              <FileEdit className="h-4 w-4" />
              Edit Template
            </Button>
            <Button variant="outline" onClick={handleDuplicate} className="gap-2">
              <Copy className="h-4 w-4" />
              Duplicate Template
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-red-500/50 bg-card/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this template? This cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

