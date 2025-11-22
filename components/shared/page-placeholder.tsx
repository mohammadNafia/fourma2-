import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  title: string;
  description: string;
  callouts?: ReactNode;
  actions?: ReactNode;
};

export function PagePlaceholder({ title, description, callouts, actions }: Props) {
  return (
    <Card className="border border-border/70 bg-card/80 backdrop-blur-xl">
      <CardHeader className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scaffolded</p>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-foreground/5 p-4 text-sm text-muted-foreground">
            {callouts || (
              <>
                <p className="font-semibold text-foreground">Layout ready</p>
                <p className="mt-1">
                  Plug real UI here. Cards, modals, and luxury gradients are already themed for dark-first mode.
                </p>
              </>
            )}
          </div>
          <div className="rounded-lg border border-border/60 bg-foreground/5 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Next steps</p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center justify-between">
                <span>Wire data/UI logic</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] text-primary">
                  Pending
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Hook into designer flow</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] text-primary">
                  Upcoming
                </span>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="bg-border/50" />
        <div className="flex flex-wrap gap-2">
          {actions ?? (
            <>
              <Button variant="primary" size="md">
                Add UI blocks
              </Button>
              <Button variant="outline" size="md">
                Review flow chart
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
