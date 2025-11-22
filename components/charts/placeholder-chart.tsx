import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaceholderChart() {
  return (
    <Card className="border border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle>Insight Widget</CardTitle>
        <CardDescription>Reserved for Framer Motion-powered charts and data stories.</CardDescription>
      </CardHeader>
      <CardContent className="h-40 rounded-lg border border-dashed border-border/60 bg-foreground/5" />
    </Card>
  );
}
