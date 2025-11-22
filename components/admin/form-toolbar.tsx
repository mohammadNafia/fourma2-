"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { BarChart2, Layout, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Dashboard", icon: BarChart2, path: "dashboard" },
  { label: "Edit Details", icon: PencilLine, path: "edit" },
  { label: "Form Builder", icon: Layout, path: "builder" },
];

export function FormToolbar() {
  const pathname = usePathname();
  const params = useParams();
  const formId = params?.formId as string;

  return (
    <div className="sticky top-[calc(4rem+72px)] z-20 overflow-x-auto rounded-2xl border border-border/70 bg-card/70 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md sm:px-3">
      <div className="flex min-w-full gap-2">
        {tabs.map((tab) => {
          const href = `/admin/form/${formId}/${tab.path}`;
          const active = pathname?.includes(tab.path);
          const Icon = tab.icon;
          return (
            <Button
              key={tab.path}
              asChild
              variant={active ? "primary" : "ghost"}
              className={cn(
                "gap-2 px-4",
                active
                  ? "shadow-[0_14px_45px_rgba(79,70,229,0.35)]"
                  : "border border-transparent hover:border-border/60",
              )}
            >
              <Link href={href}>
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
