"use client";

import { ReactNode } from "react";
import { FormLayout } from "@/components/admin/form-layout";

export default function AdminFormLayout({
  params,
  children,
}: {
  params: { formId: string };
  children: ReactNode;
}) {
  return <FormLayout formId={params.formId}>{children}</FormLayout>;
}
