"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Copy, Eye, FileEdit, Plus, LayoutTemplate, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForms } from "@/components/shared/forms-store";
import { useToast } from "@/components/shared/toast";
import { useState } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, deleteTemplate, duplicateTemplate, createFormFromTemplate } = useForms();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleUseTemplate = (templateId: string) => {
    try {
      const form = createFormFromTemplate(templateId);
      router.push(`/admin/form/${form.id}/edit`);
      toast("Form created from template", "success");
    } catch (error) {
      toast("Failed to create form from template", "error");
    }
  };

  const handleDuplicate = (templateId: string) => {
    try {
      duplicateTemplate(templateId);
      toast("Template duplicated successfully", "success");
    } catch (error) {
      toast("Failed to duplicate template", "error");
    }
  };

  const handleDelete = (templateId: string) => {
    deleteTemplate(templateId);
    toast("Template deleted successfully", "success");
    setShowDeleteConfirm(null);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalFields = (template: typeof templates[0]) => {
    return template.sections.reduce((acc, s) => acc + s.fields.length, 0);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-foreground">Templates</h1>
          <p className="text-lg text-muted-foreground">Reusable form templates for quick creation</p>
        </div>
        <Button variant="primary" onClick={() => router.push("/admin/templates/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Empty Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="border-dashed border-border/70 bg-card/70">
          <CardHeader>
            <CardTitle>No templates yet</CardTitle>
            <CardDescription>Create your first template to reuse form structures.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="primary" onClick={() => router.push("/admin/templates/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <motion.div
              key={template.templateId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group border-border/70 bg-card/80 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg text-foreground">{template.name}</CardTitle>
                      {template.category && (
                        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {template.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Created {formatDate(template.createdAt)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{template.sections.length} sections</span>
                    <span>•</span>
                    <span>{getTotalFields(template)} fields</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <Button
                      variant="primary"
                      className="justify-start"
                      onClick={() => handleUseTemplate(template.templateId)}
                    >
                      <LayoutTemplate className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start border border-border/70"
                        onClick={() => router.push(`/admin/templates/${template.templateId}/preview`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start border border-border/70"
                        onClick={() => router.push(`/admin/templates/${template.templateId}/builder`)}
                      >
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start border border-border/70"
                        onClick={() => handleDuplicate(template.templateId)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start border border-border/70 text-destructive hover:text-destructive"
                        onClick={() => setShowDeleteConfirm(template.templateId)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {showDeleteConfirm === template.templateId && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-red-500/50 bg-red-500/20 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium text-red-400">
                            Are you sure you want to delete this template? This cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleDelete(template.templateId)}
                              disabled={deletingId === template.templateId}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              {deletingId === template.templateId ? "Deleting..." : "Delete"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

