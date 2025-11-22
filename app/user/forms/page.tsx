"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForms } from "@/components/shared/forms-store";
import { useToast } from "@/components/shared/toast";
import { useMockAuth } from "@/components/shared/mock-auth-provider";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
} from "lucide-react";

export default function UserFormsPage() {
  const router = useRouter();
  const { getUserForms, getFormById, deleteUserFormDraft } = useForms();
  const { toast } = useToast();
  const { userId } = useMockAuth();

  const userForms = getUserForms(userId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const { activeForms, submittedForms } = useMemo(() => {
    const active: typeof userForms = [];
    const submitted: typeof userForms = [];

    userForms.forEach((uf) => {
      const form = getFormById(uf.formId);
      if (!form) return;

      const isClosed = form.closingDate ? new Date(form.closingDate) < new Date() : false;
      const canStillSubmit =
        form.status === "published" &&
        !isClosed &&
        (uf.status === "in-progress" || (form.allowMultipleSubmissions && uf.status === "submitted"));

      if (canStillSubmit || uf.status === "in-progress") {
        active.push(uf);
      } else if (uf.status === "submitted") {
        submitted.push(uf);
      }
    });

    return { activeForms: active, submittedForms: submitted };
  }, [userForms, getFormById]);

  const handleContinue = (accessKey: string) => {
    router.push(`/user/form/${accessKey}`);
  };

  const handleDeleteDraft = (accessKey: string) => {
    setDeletingId(accessKey);
    deleteUserFormDraft(accessKey, userId);
    toast("Draft deleted successfully", "success");
    setShowDeleteConfirm(null);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const FormCard = ({
    userForm,
    showActions = true,
  }: {
    userForm: (typeof userForms)[0];
    showActions?: boolean;
  }) => {
    const form = getFormById(userForm.formId);
    if (!form) return null;

    const isClosed = form.closingDate ? new Date(form.closingDate) < new Date() : false;
    const canResubmit = form.allowMultipleSubmissions && userForm.status === "submitted" && !isClosed;

    return (
      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg">{form.title}</CardTitle>
              <CardDescription className="font-mono text-xs">{userForm.accessKey}</CardDescription>
            </div>
            <div className="flex gap-2">
              {userForm.status === "in-progress" && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
                  In progress
                </span>
              )}
              {userForm.status === "submitted" && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
                  Submitted
                </span>
              )}
              {isClosed && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/50">
                  Closed
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">First opened</p>
              <p className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatDate(userForm.firstOpenedAt)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatDate(userForm.lastUpdatedAt)}
              </p>
            </div>
          </div>

          {showActions && (
            <>
              <Separator className="bg-border/60" />
              <div className="flex flex-wrap gap-2">
                {userForm.status === "in-progress" && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleContinue(userForm.accessKey)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Continue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(userForm.accessKey)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Draft
                    </Button>
                  </>
                )}
                {userForm.status === "submitted" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/user/form/${userForm.accessKey}`)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Form
                    </Button>
                    {canResubmit && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleContinue(userForm.accessKey)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Resubmit
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {showDeleteConfirm === userForm.accessKey && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/50 bg-red-500/20 p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-red-400">
                    Are you sure you want to delete this entry? You will lose your saved answers.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleDeleteDraft(userForm.accessKey)}
                      disabled={deletingId === userForm.accessKey}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {deletingId === userForm.accessKey ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground lowercase">my forms</h1>
          <p className="text-lg text-muted-foreground font-light">View and manage your form responses.</p>
        </div>
        <Button
          onClick={() => router.push("/user/access-key")}
          variant="primary"
          className="lowercase"
        >
          Enter Access Key
        </Button>
      </div>

      {userForms.length === 0 ? (
        <Card className="border-border/70 bg-card/80">
          <CardContent className="py-12 text-center space-y-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-4 font-light">
                You haven't accessed any forms yet. Use an access key to get started.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push("/user/access-key")} variant="primary" className="lowercase">
                  Enter Access Key
                </Button>
                <Button onClick={() => router.push("/user/home")} variant="outline" className="lowercase">
                  Go to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Forms */}
          {activeForms.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-semibold">Active Forms</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
                  {activeForms.length}
                </span>
              </div>
              <div className="grid gap-4">
                {activeForms.map((userForm) => (
                  <motion.div
                    key={`${userForm.formId}-${userForm.accessKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FormCard userForm={userForm} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Submitted Forms */}
          {submittedForms.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <h2 className="text-2xl font-semibold">Submitted Forms</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
                  {submittedForms.length}
                </span>
              </div>
              <div className="grid gap-4">
                {submittedForms.map((userForm) => (
                  <motion.div
                    key={`${userForm.formId}-${userForm.accessKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FormCard userForm={userForm} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeForms.length === 0 && submittedForms.length === 0 && (
            <Card className="border-border/70 bg-card/80">
              <CardContent className="py-12 text-center">
                <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No forms found</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
