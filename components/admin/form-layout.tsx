"use client";

import { ReactNode } from "react";
import { FormHeader } from "./form-header";
import { FormToolbar } from "./form-toolbar";

type Props = {
  formId: string;
  children: ReactNode;
  showToolbar?: boolean;
};

export function FormLayout({ formId, children, showToolbar = true }: Props) {
  return (
    <div className="space-y-4">
      <FormHeader formId={formId} />
      {showToolbar ? <FormToolbar /> : null}
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </div>
  );
}
