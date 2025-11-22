"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle2,
  FileText,
  ArrowLeft,
  Activity,
  Target,
  PieChart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useForms } from "@/components/shared/forms-store";
import { Badge } from "@/components/ui/badge";

export default function FormDashboardPage() {
  const params = useParams();
  const { getFormById } = useForms();
  const form = getFormById(params.formId as string);

  // Calculate analytics based on sections
  const analytics = useMemo(() => {
    if (!form) return null;

    const submissions = form.submissions || [];
    const totalSubmissions = submissions.length;
    const submittedCount = submissions.filter((s) => s.status === "submitted").length;
    const inProgressCount = submissions.filter((s) => s.status === "in-progress").length;

    // Section-based analytics
    const sectionAnalytics = form.sections.map((section) => {
      const sectionFields = section.fields;
      const totalFields = sectionFields.length;

      // Count responses per field in this section
      const fieldResponses = sectionFields.map((field) => {
        const responses = submissions.filter((sub) => {
          const fieldValue = sub.values[field.id];
          return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
        }).length;
        const responseRate = totalSubmissions > 0 ? (responses / totalSubmissions) * 100 : 0;

        return {
          fieldId: field.id,
          fieldLabel: field.label,
          fieldType: field.type,
          responses,
          responseRate: Math.round(responseRate * 10) / 10,
          isRequired: field.required,
        };
      });

      const sectionResponseCount = fieldResponses.reduce(
        (sum, f) => sum + f.responses,
        0
      );
      const avgResponseRate =
        fieldResponses.length > 0
          ? fieldResponses.reduce((sum, f) => sum + f.responseRate, 0) / fieldResponses.length
          : 0;

      return {
        sectionId: section.id,
        sectionTitle: section.title,
        sectionDescription: section.description,
        totalFields,
        fieldResponses,
        totalResponses: sectionResponseCount,
        avgResponseRate: Math.round(avgResponseRate * 10) / 10,
        completionRate: totalSubmissions > 0 ? Math.round((sectionResponseCount / (totalFields * totalSubmissions)) * 1000) / 10 : 0,
      };
    });

    // Calculate submission trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const dailySubmissions = last7Days.map((date) => {
      const count = submissions.filter((sub) => {
        const subDate = new Date(sub.submittedAt).toISOString().split("T")[0];
        return subDate === date;
      }).length;
      return { date, count };
    });

    // Field type distribution
    const fieldTypeCounts: Record<string, number> = {};
    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        fieldTypeCounts[field.type] = (fieldTypeCounts[field.type] || 0) + 1;
      });
    });

    return {
      totalSubmissions,
      submittedCount,
      inProgressCount,
      sections: sectionAnalytics,
      dailySubmissions,
      fieldTypeCounts,
      totalFields: form.sections.reduce((sum, s) => sum + s.fields.length, 0),
      totalSections: form.sections.length,
    };
  }, [form]);

  if (!form) {
    return (
      <div className="space-y-4">
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle>Form not found</CardTitle>
            <CardDescription>The form you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/home">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">{form.title}</h1>
              <p className="text-sm text-muted-foreground">Analytics & Response Dashboard</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={form.status === "published" ? "default" : "secondary"}
            className={form.status === "published" ? "bg-emerald-500/15 text-emerald-300" : ""}
          >
            {form.status === "published" ? (
              <>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Published
              </>
            ) : (
              "Draft"
            )}
          </Badge>
          <Button
            onClick={() => window.open(`/user/form/${form.accessKey}?test=true`, "_blank")}
            variant="primary"
            className="gap-2 lowercase"
          >
            <ExternalLink className="h-4 w-4" />
            Test as User
          </Button>
          <Button asChild variant="outline">
            <Link href={`/admin/form/${form.id}/builder`}>
              <FileText className="mr-2 h-4 w-4" />
              Edit Form
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Overview Statistics */}
      <motion.section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      >
        <Card className="border-border/70 bg-gradient-to-br from-card/80 to-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analytics.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.submittedCount} completed, {analytics.inProgressCount} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-gradient-to-br from-card/80 to-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sections</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analytics.totalSections}</div>
            <p className="text-xs text-muted-foreground mt-1">{analytics.totalFields} total fields</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-gradient-to-br from-card/80 to-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
            <Target className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.sections.length > 0
                ? Math.round(
                    analytics.sections.reduce((sum, s) => sum + s.completionRate, 0) /
                      analytics.sections.length
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all sections</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-gradient-to-br from-card/80 to-card/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalSubmissions > 0
                ? Math.round((analytics.submittedCount / analytics.totalSubmissions) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.submittedCount} of {analytics.totalSubmissions} submitted
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Section-Based Analytics */}
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Section Analytics</h2>
            <p className="text-sm text-muted-foreground">Performance metrics for each section</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {analytics.sections.map((section, index) => (
            <motion.div
              key={section.sectionId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-border/70 bg-card/80">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        {section.sectionTitle}
                      </CardTitle>
                      {section.sectionDescription && (
                        <CardDescription>{section.sectionDescription}</CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={
                          section.completionRate >= 80
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : section.completionRate >= 50
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-red-500/15 text-red-300 border-red-500/30"
                        }
                      >
                        {section.completionRate}% Complete
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {section.totalFields} fields
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Section Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Responses</p>
                      <p className="text-lg font-semibold text-foreground">{section.totalResponses}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Avg. Response Rate</p>
                      <p className="text-lg font-semibold text-foreground">{section.avgResponseRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fields</p>
                      <p className="text-lg font-semibold text-foreground">{section.totalFields}</p>
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  {/* Field-Level Analytics */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Field Performance</h4>
                    <div className="space-y-2">
                      {section.fieldResponses.map((field) => (
                        <div
                          key={field.fieldId}
                          className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-3"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{field.fieldLabel}</span>
                              {field.isRequired && (
                                <Badge variant="outline" className="text-xs">
                                  Required
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {field.fieldType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{field.responses} responses</span>
                              <span>•</span>
                              <span>{field.responseRate}% response rate</span>
                            </div>
                          </div>
                          <div className="w-24">
                            <div className="h-2 w-full rounded-full bg-background/80 overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${field.responseRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Submission Trends */}
      {analytics.totalSubmissions > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.4 }}
        >
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Submission Trends (Last 7 Days)
              </CardTitle>
              <CardDescription>Daily submission activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {analytics.dailySubmissions.map((day, index) => {
                    const maxCount = Math.max(...analytics.dailySubmissions.map((d) => d.count), 1);
                    const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

                    return (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div className="relative w-full h-32 flex items-end justify-center">
                          <div
                            className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                            style={{ height: `${height}%`, minHeight: day.count > 0 ? "4px" : "0" }}
                            title={`${day.count} submissions on ${day.date}`}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-foreground">{day.count}</p>
                          <p className="text-[10px] text-muted-foreground">{dayName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {date.getDate()}/{date.getMonth() + 1}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Field Type Distribution */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.5 }}
      >
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Field Type Distribution
            </CardTitle>
            <CardDescription>Breakdown of field types in this form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(analytics.fieldTypeCounts).map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-3"
                >
                  <span className="text-sm font-medium text-foreground capitalize">
                    {type.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
