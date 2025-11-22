import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FormBuilderPlaceholder() {
  return (
    <Card className="border-dashed border-border/60 bg-card/70">
      <CardHeader>
        <CardTitle>Form Builder Canvas</CardTitle>
        <CardDescription>Drag-and-drop question blocks and logic graph will mount here.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Components for palettes, nodes, and preview rails will attach to this mount point.
      </CardContent>
    </Card>
  );
}
