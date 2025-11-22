"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Copy,
  MoreVertical,
  Plus,
  Trash2,
  FileText,
  LayoutTemplate,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  ArrowUpRight,
  Activity,
  Zap,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useMockAuth } from "@/components/shared/mock-auth-provider";
import { useForms } from "@/components/shared/forms-store";
import { useState, useMemo } from "react";

export default function AdminHomePage() {
  const router = useRouter();
  const { userName } = useMockAuth();
  const { forms, deleteForm, duplicateForm, templates, createFormFromTemplate } = useForms();
  const [activeTab, setActiveTab] = useState<"forms" | "templates">("forms");

  // Calculate statistics
  const stats = useMemo(() => {
    const publishedForms = forms.filter((f) => f.status === "published");
    const draftForms = forms.filter((f) => f.status === "draft");
    const totalSubmissions = forms.reduce((acc, f) => acc + (f.submissions?.length || 0), 0);
    const totalFields = forms.reduce(
      (acc, f) => acc + f.sections.reduce((sum, s) => sum + s.fields.length, 0),
      0
    );
    const recentForms = forms
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    const avgSubmissions = publishedForms.length > 0 ? totalSubmissions / publishedForms.length : 0;

    return {
      totalForms: forms.length,
      publishedForms: publishedForms.length,
      draftForms: draftForms.length,
      totalSubmissions,
      totalFields,
      totalTemplates: templates.length,
      avgSubmissions: Math.round(avgSubmissions * 10) / 10,
      recentForms,
    };
  }, [forms, templates]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // noop
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.section
        className="rounded-[12px] border border-border bg-card p-8 shadow-inset"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground lowercase tracking-tight sm:text-4xl">
                {userName ? `welcome back, ${userName}` : "welcome back"}
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                Manage your forms or create a new one. Everything you ship appears in one workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="lowercase"
                onClick={() => router.push("/admin/templates/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Form
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="lowercase font-light"
                onClick={() => router.push("/admin/templates")}
              >
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-[10px] border border-border bg-card p-6 shadow-inset">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-light">Quick Stats</p>
            <div className="space-y-3 text-sm text-muted-foreground font-light">
              <div className="flex items-center justify-between">
                <span>Total Forms</span>
                <span className="rounded-[6px] border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {stats.totalForms}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Published</span>
                <span className="rounded-[6px] border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {stats.publishedForms}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Drafts</span>
                <span className="rounded-[6px] border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {stats.draftForms}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Submissions</span>
                <span className="rounded-[6px] border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {stats.totalSubmissions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Statistics Cards */}
      <motion.section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
      >
        <Card className="border-border bg-card shadow-inset">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-light text-muted-foreground lowercase">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalForms}</div>
            <p className="text-xs text-muted-foreground font-light mt-1">
              {stats.publishedForms} published, {stats.draftForms} drafts
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-inset">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-light text-muted-foreground lowercase">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground font-light mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Avg {stats.avgSubmissions} per form
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-inset">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-light text-muted-foreground lowercase">Total Fields</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalFields}</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Across all forms</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-inset">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-light text-muted-foreground lowercase">Templates</CardTitle>
            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Reusable templates</p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Recent Activity & Quick Actions */}
      <motion.section
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
      >
        {/* Recent Forms */}
        <Card className="lg:col-span-2 border-border bg-card shadow-inset">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 lowercase">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="font-light">Your recently updated forms</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("forms")} className="lowercase font-light">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentForms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground font-light">No forms yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 lowercase font-light"
                  onClick={() => router.push("/admin/new-form")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentForms.map((form) => (
                  <Link
                    key={form.id}
                    href={`/admin/form/${form.id}/edit`}
                    className="group flex items-center justify-between rounded-[10px] border border-border bg-card p-3 transition-all duration-200 hover:bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-secondary">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm lowercase group-hover:opacity-80 transition-opacity duration-200">
                          {form.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
                          <Clock className="h-3 w-3" />
                          <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="uppercase">{form.status}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border bg-card shadow-inset">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 lowercase">
              <Zap className="h-4 w-4 text-muted-foreground" />
              Quick Actions
            </CardTitle>
            <CardDescription className="font-light">Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="primary"
              className="w-full justify-start lowercase"
              onClick={() => router.push("/admin/new-form")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Form
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start lowercase font-light"
              onClick={() => router.push("/admin/templates/new")}
            >
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Create Template
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start lowercase font-light"
              onClick={() => router.push("/admin/templates")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
            <Separator className="bg-border my-3" />
            <div className="space-y-2 text-xs text-muted-foreground font-light">
              <div className="flex items-center justify-between">
                <span>Published Forms</span>
                <span className="font-medium text-foreground">{stats.publishedForms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Submissions</span>
                <span className="font-medium text-foreground">{stats.totalSubmissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Templates</span>
                <span className="font-medium text-foreground">{stats.totalTemplates}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Forms & Templates Section */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground lowercase">Your Forms</h2>
              <div className="flex gap-1 rounded-[10px] border border-border bg-card p-1 shadow-inset">
                <Button
                  variant={activeTab === "forms" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("forms")}
                  className="gap-2 lowercase font-light"
                >
                  <FileText className="h-4 w-4" />
                  Forms
                </Button>
                <Button
                  variant={activeTab === "templates" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("templates")}
                  className="gap-2 lowercase font-light"
                >
                  <LayoutTemplate className="h-4 w-4" />
                  Templates
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-light">
              {activeTab === "forms" ? "All forms you've created will appear here." : "Reusable form templates for quick creation."}
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === "forms" ? (
              <Button variant="outline" onClick={() => router.push("/admin/new-form")} className="gap-2 lowercase font-light">
                <Plus className="h-4 w-4" />
                Create New Form
              </Button>
            ) : (
              <Button variant="outline" onClick={() => router.push("/admin/templates/new")} className="gap-2 lowercase font-light">
                <Plus className="h-4 w-4" />
                Create Empty Template
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push("/admin/templates")} className="gap-2 lowercase font-light">
              <LayoutTemplate className="h-4 w-4" />
              View All Templates
            </Button>
          </div>
        </div>

        {activeTab === "forms" ? (
          forms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="border-dashed border-border bg-card shadow-inset">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="mb-2 lowercase">No forms yet</CardTitle>
                  <CardDescription className="mb-6 max-w-md font-light">
                    Get started by creating your first form. You can build custom forms with various field types,
                    collect responses, and analyze data.
                  </CardDescription>
                  <div className="flex gap-3">
                    <Button variant="primary" onClick={() => router.push("/admin/new-form")} className="lowercase">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Form
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/admin/templates")} className="lowercase font-light">
                      <LayoutTemplate className="mr-2 h-4 w-4" />
                      Browse Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {forms.map((form, index) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.03 }}
                >
                  <Card className="group border-border bg-card shadow-inset transition-all duration-200 hover:scale-[1.01]">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="text-lg text-foreground line-clamp-1 lowercase">{form.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-[6px] border border-border px-2 py-0.5 text-xs font-medium ${
                                form.status === "published"
                                  ? "bg-secondary text-foreground"
                                  : "bg-card text-muted-foreground"
                              }`}
                            >
                              {form.status === "published" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <Clock className="mr-1 h-3 w-3" />
                              )}
                              {form.status}
                            </span>
                            {form.submissions && form.submissions.length > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-[6px] border border-border bg-secondary px-2 py-0.5 text-xs text-foreground">
                                <Users className="h-3 w-3" />
                                {form.submissions.length}
                              </span>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleCopy(form.accessKey)} className="lowercase font-light">
                              <Copy className="mr-2 h-4 w-4" />
                              Copy access key
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onSelect={() => {
                                const duplicated = duplicateForm(form.id);
                                router.push(`/admin/form/${duplicated.id}/edit`);
                              }}
                              className="lowercase font-light"
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate Form
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => deleteForm(form.id)} className="text-foreground lowercase font-light">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete form
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                        </div>
                        {form.sections && (
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-3.5 w-3.5" />
                            <span>{form.sections.reduce((acc, s) => acc + s.fields.length, 0)} fields</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {form.description && (
                        <p className="text-sm text-muted-foreground font-light line-clamp-2">{form.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-[6px] border border-border bg-secondary px-2 py-1 text-muted-foreground font-light">
                          <Key className="h-3 w-3" />
                          {form.accessKey}
                        </span>
                        <button
                          className="inline-flex items-center gap-1 rounded-[6px] border border-border bg-card px-2 py-1 text-foreground hover:bg-secondary transition-colors duration-200 font-light"
                          onClick={() => handleCopy(form.accessKey)}
                        >
                          <Copy className="h-3 w-3" /> Copy Key
                        </button>
                      </div>
                      <Separator className="bg-border" />
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <Button asChild variant="primary" className="justify-start lowercase">
                          <Link href={`/admin/form/${form.id}/builder`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Open Builder
                          </Link>
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button asChild variant="outline" className="justify-start lowercase font-light">
                            <Link href={`/admin/form/${form.id}/edit`}>
                              <Copy className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="justify-start lowercase font-light">
                            <Link href={`/admin/form/${form.id}/dashboard`}>
                              <BarChart3 className="mr-2 h-3.5 w-3.5" />
                              Analytics
                            </Link>
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="ghost"
                            className="justify-start border border-border lowercase font-light"
                            onClick={() => {
                              const duplicated = duplicateForm(form.id);
                              router.push(`/admin/form/${duplicated.id}/edit`);
                            }}
                          >
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            Duplicate
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start border border-border text-foreground hover:bg-secondary lowercase font-light"
                            onClick={() => deleteForm(form.id)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          templates.length === 0 ? (
            <Card className="border-dashed border-border bg-card shadow-inset">
              <CardHeader>
                <CardTitle className="lowercase">No templates yet</CardTitle>
                <CardDescription className="font-light">Create your first template to reuse form structures.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="primary" onClick={() => router.push("/admin/templates/new")} className="lowercase">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.slice(0, 6).map((template) => (
                <Card
                  key={template.templateId}
                  className="group border-border bg-card shadow-inset transition-all duration-200 hover:scale-[1.01]"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-foreground lowercase">{template.name}</CardTitle>
                        {template.category && (
                          <span className="inline-block rounded-[6px] border border-border bg-secondary px-2 py-0.5 text-xs text-foreground font-medium">
                            {template.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground font-light line-clamp-2">{template.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
                      <span>{template.sections.length} sections</span>
                      <span>•</span>
                      <span>{template.sections.reduce((acc, s) => acc + s.fields.length, 0)} fields</span>
                    </div>
                    <Separator className="bg-border" />
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <Button
                        variant="primary"
                        className="justify-start lowercase"
                        onClick={() => {
                          const form = createFormFromTemplate(template.templateId);
                          router.push(`/admin/form/${form.id}/edit`);
                        }}
                      >
                        <LayoutTemplate className="mr-2 h-4 w-4" />
                        Use Template
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="ghost"
                          className="justify-start border border-border lowercase font-light"
                          onClick={() => router.push(`/admin/templates/${template.templateId}/preview`)}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start border border-border lowercase font-light"
                          onClick={() => router.push(`/admin/templates/${template.templateId}/builder`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </section>
    </div>
  );
}
