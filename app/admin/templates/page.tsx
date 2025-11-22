"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  LayoutTemplate,
  Plus,
  Trash2,
  FileText,
  Copy,
  Rocket,
  MoreVertical,
  Eye,
  FileEdit,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useForms } from "@/components/shared/forms-store";
import { useToast } from "@/components/shared/toast";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, deleteTemplate, duplicateTemplate, createFormFromTemplate, publishTemplateAsForm } = useForms();
  const { toast } = useToast();
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handlePublishAsForm = (templateId: string) => {
    try {
      setPublishingId(templateId);
      const template = templates.find((t) => t.templateId === templateId);
      
      // Validate template has at least one field
      const totalFields = template?.sections.reduce((sum, s) => sum + s.fields.length, 0) || 0;
      if (totalFields === 0) {
        toast("Please add at least one field to the template before publishing", "error");
        setPublishingId(null);
        return;
      }

      // Publish template as form
      const form = publishTemplateAsForm(templateId);
      
      toast(`Form published successfully! Access Key: ${form.accessKey}`, "success");
      
      // Redirect to form edit page
      router.push(`/admin/form/${form.id}/edit`);
    } catch (error) {
      console.error("Failed to publish template:", error);
      toast("Failed to publish template as form", "error");
    } finally {
      setPublishingId(null);
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
    try {
      deleteTemplate(templateId);
      toast("Template deleted successfully", "success");
    } catch (error) {
      toast("Failed to delete template", "error");
    }
  };

  const handleUseTemplate = (templateId: string) => {
    try {
      const form = createFormFromTemplate(templateId);
      router.push(`/admin/form/${form.id}/edit`);
      toast("Form created from template", "success");
    } catch (error) {
      toast("Failed to create form from template", "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground lowercase">templates</h1>
          <p className="text-lg text-muted-foreground font-light">Create and manage reusable form templates.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/templates/new")}
          className="gap-2 lowercase"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <EmptyState
          icon={<LayoutTemplate className="h-12 w-12 text-muted-foreground" />}
          title="No templates yet"
          description="Create your first template to get started. Templates help you quickly create forms with pre-configured structures."
          action={
            <Button
              variant="primary"
              onClick={() => router.push("/admin/templates/new")}
              className="gap-2 lowercase"
            >
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <motion.div
              key={template.templateId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.03 }}
            >
              <Card className="group border-border bg-card shadow-inset transition-all duration-200 hover:scale-[1.01]">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg text-foreground line-clamp-1 lowercase">
                        {template.name}
                      </CardTitle>
                      {template.category && (
                        <span className="inline-block rounded-[6px] border border-border bg-secondary px-2 py-0.5 text-xs text-foreground font-medium">
                          {template.category}
                        </span>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => router.push(`/admin/templates/${template.templateId}/preview`)}
                          className="lowercase font-light"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => router.push(`/admin/templates/${template.templateId}/builder`)}
                          className="lowercase font-light"
                        >
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDuplicate(template.templateId)}
                          className="lowercase font-light"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate Template
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDelete(template.templateId)}
                          className="text-foreground lowercase font-light"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-light">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>{template.sections.reduce((acc, s) => acc + s.fields.length, 0)} fields</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {template.description && (
                    <p className="text-sm text-muted-foreground font-light line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
                    <span>{template.sections.length} sections</span>
                    <span>•</span>
                    <span>{template.sections.reduce((acc, s) => acc + s.fields.length, 0)} fields</span>
                  </div>
                  <Separator className="bg-border" />
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleUseTemplate(template.templateId)}
                      className="w-full justify-start lowercase font-light"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handlePublishAsForm(template.templateId)}
                      disabled={publishingId === template.templateId}
                      className="w-full justify-start lowercase font-light"
                    >
                      {publishingId === template.templateId ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Publish as Form
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
