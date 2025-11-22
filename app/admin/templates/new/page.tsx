"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import {
  AlignJustify,
  Calendar,
  CheckSquare,
  ChevronDown,
  GripVertical,
  Hash,
  Heading,
  Mail,
  MoveHorizontal,
  Phone,
  Plus,
  Rows,
  Star,
  Text,
  Timer,
  ToggleLeft,
  Upload,
  Trash,
  ArrowLeft,
  Save,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useForms, FormField, FieldType, FormSection } from "@/components/shared/forms-store";
import { useToast } from "@/components/shared/toast";

type Selected = { sectionId: string; fieldId: string } | null;

const fieldPalette: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "shortText", label: "Short Text", icon: <Heading className="h-4 w-4" /> },
  { type: "longText", label: "Long Text", icon: <Text className="h-4 w-4" /> },
  { type: "radio", label: "Radio Group", icon: <Rows className="h-4 w-4" /> },
  { type: "checkbox", label: "Checkboxes", icon: <CheckSquare className="h-4 w-4" /> },
  { type: "dropdown", label: "Dropdown", icon: <ChevronDown className="h-4 w-4" /> },
  { type: "number", label: "Number", icon: <Hash className="h-4 w-4" /> },
  { type: "range", label: "Range Slider", icon: <MoveHorizontal className="h-4 w-4" /> },
  { type: "date", label: "Date", icon: <Calendar className="h-4 w-4" /> },
  { type: "time", label: "Time", icon: <Timer className="h-4 w-4" /> },
  { type: "boolean", label: "Boolean", icon: <ToggleLeft className="h-4 w-4" /> },
  { type: "rating", label: "Rating", icon: <Star className="h-4 w-4" /> },
  { type: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { type: "phone", label: "Phone Number", icon: <Phone className="h-4 w-4" /> },
  { type: "file", label: "File Upload", icon: <Upload className="h-4 w-4" /> },
  { type: "gender", label: "Gender Select", icon: <AlignJustify className="h-4 w-4" /> },
];

function fieldPreview(field: FormField) {
  switch (field.type) {
    case "shortText":
    case "email":
    case "phone":
      return <Input disabled placeholder={field.placeholder || "Text input"} />;
    case "longText":
      return <Textarea disabled placeholder={field.placeholder || "Long text"} />;
    case "radio":
      return (
        <RadioGroup value={field.options?.[0]}>
          {(field.options || ["Option 1", "Option 2"]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={opt} disabled />
              {opt}
            </label>
          ))}
        </RadioGroup>
      );
    case "checkbox":
      return (
        <div className="space-y-2">
          {(field.options || ["Option 1", "Option 2"]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <Checkbox disabled />
              {opt}
            </label>
          ))}
        </div>
      );
    case "dropdown":
    case "gender":
      return (
        <SelectNative disabled>
          {(field.options || ["Option 1", "Option 2"]).map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </SelectNative>
      );
    case "number":
      return <Input disabled type="number" placeholder="123" />;
    case "range":
      return <input type="range" disabled className="w-full accent-primary" />;
    case "date":
      return <Input disabled type="date" />;
    case "time":
      return <Input disabled type="time" />;
    case "boolean":
      return (
        <SelectNative disabled>
          <option>Yes</option>
          <option>No</option>
        </SelectNative>
      );
    case "rating":
      return (
        <div className="flex items-center gap-1 text-primary">
          {Array.from({ length: Number(field.max) || 5 }).map((_, idx) => (
            <Star key={idx} className="h-4 w-4 fill-primary/30 stroke-primary" />
          ))}
        </div>
      );
    case "file":
      return <Input disabled type="file" />;
    default:
      return <Input disabled placeholder="Text input" />;
  }
}

export default function NewTemplatePage() {
  const router = useRouter();
  const { addTemplate, publishTemplateAsForm } = useForms();
  const { toast } = useToast();
  const [sections, setSections] = useState<FormSection[]>([]);
  const [selected, setSelected] = useState<Selected>(null);
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState("");

  useEffect(() => {
    if (sections.length === 0) {
      setSections([
        {
          id: Math.random().toString(36).slice(2, 10),
          title: "New Section",
          description: "Describe this section",
          fields: [],
        },
      ]);
    }
  }, [sections.length]);

  const addSection = () => {
    const newSection: FormSection = {
      id: Math.random().toString(36).slice(2, 10),
      title: "New Section",
      description: "Describe this section",
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (sectionId: string, data: Partial<Pick<FormSection, "title" | "description">>) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, ...data } : section)),
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    if (selected?.sectionId === sectionId) {
      setSelected(null);
    }
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    setSections(newSections);
  };

  const addField = (type: FieldType, sectionId: string) => {
    const field: FormField = {
      id: Math.random().toString(36).slice(2, 10),
      type,
      label: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
      placeholder: "Enter text",
      required: false,
      helpText: "",
      options: type === "radio" || type === "dropdown" || type === "checkbox" || type === "gender" ? ["Option 1", "Option 2"] : undefined,
      min: type === "rating" ? 1 : undefined,
      max: type === "rating" ? 5 : undefined,
      step: type === "number" ? 1 : undefined,
    };
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, fields: [...section.fields, field] } : section,
      ),
    );
    setSelected({ sectionId, fieldId: field.id });
  };

  const updateField = (sectionId: string, fieldId: string, data: Partial<FormField>) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) => (field.id === fieldId ? { ...field, ...data } : field)),
            }
          : section,
      ),
    );
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, fields: section.fields.filter((f) => f.id !== fieldId) } : section,
      ),
    );
    if (selected?.fieldId === fieldId) {
      setSelected(null);
    }
  };

  const moveField = (
    sourceSectionId: string,
    destSectionId: string,
    sourceIndex: number,
    destIndex: number,
  ) => {
    const newSections = sections.map((s) => ({ ...s, fields: [...s.fields] }));
    const sourceSection = newSections.find((s) => s.id === sourceSectionId);
    const destSection = newSections.find((s) => s.id === destSectionId);
    if (!sourceSection || !destSection) return;
    const [moved] = sourceSection.fields.splice(sourceIndex, 1);
    destSection.fields.splice(destIndex, 0, moved);
    setSections(newSections);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (type === "SECTION") {
      if (destination.index === source.index) return;
      reorderSections(source.index, destination.index);
    } else {
      const [_, sourceSectionId] = source.droppableId.split(":");
      const [__, destSectionId] = destination.droppableId.split(":");
      moveField(sourceSectionId, destSectionId, source.index, destination.index);
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast("Template name is required", "error");
      return;
    }
    try {
      addTemplate(templateName.trim(), templateDescription.trim(), templateCategory.trim() || null, sections);
      toast("Template created successfully", "success");
      router.push("/admin/templates");
    } catch (error) {
      toast("Failed to create template", "error");
    }
  };

  const handlePublish = () => {
    if (!templateName.trim()) {
      toast("Template name is required", "error");
      return;
    }
    if (!sections.length || sections.every(s => s.fields.length === 0)) {
      toast("Please add at least one field to the template before publishing", "error");
      return;
    }
    
    try {
      // First save as template
      const template = addTemplate(templateName.trim(), templateDescription.trim(), templateCategory.trim() || null, sections);
      
      // Then publish as form immediately
      const form = publishTemplateAsForm(template.templateId);
      
      toast(`Form published successfully! Access Key: ${form.accessKey}`, "success");
      router.push(`/admin/form/${form.id}/edit`);
    } catch (error) {
      toast("Failed to publish form", "error");
      console.error(error);
    }
  };

  const selectedField = useMemo(() => {
    if (!selected) return null;
    const section = sections.find((s) => s.id === selected.sectionId);
    return section?.fields.find((f) => f.id === selected.fieldId) || null;
  }, [selected, sections]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/templates")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Template</h1>
            <p className="text-muted-foreground">Build a reusable template structure</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} className="gap-2 lowercase">
            <Save className="h-4 w-4" />
            Save Template
          </Button>
          <Button variant="primary" onClick={handlePublish} className="gap-2 lowercase">
            <Rocket className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">
              Template Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Template Description</Label>
            <Textarea
              id="template-description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Describe this template"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-category">Category (optional)</Label>
            <Input
              id="template-category"
              value={templateCategory}
              onChange={(e) => setTemplateCategory(e.target.value)}
              placeholder="e.g., HR, Marketing, Survey, Tech"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr_320px]">
        {/* Left Sidebar */}
        <Card className="h-fit border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Add a Field</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            {fieldPalette.map((item, idx) => (
              <Button
                key={`${item.label}-${item.type}-${idx}`}
                variant="outline"
                className="justify-start gap-2 text-sm transition hover:-translate-y-[2px]"
                onClick={() => addField(item.type, sections[0]?.id || "")}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
            <Separator className="bg-border/60" />
            <Button variant="ghost" className="gap-2" onClick={addSection}>
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </CardContent>
        </Card>

        {/* Center Builder */}
        <div className="space-y-3">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections" type="SECTION">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                  {sections.map((section, sectionIndex) => (
                    <Draggable draggableId={`section-${section.id}`} index={sectionIndex} key={section.id}>
                      {(sectionProvided) => (
                        <div
                          ref={sectionProvided.innerRef}
                          {...sectionProvided.draggableProps}
                          className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex flex-1 items-center gap-2">
                              <div {...sectionProvided.dragHandleProps} className="cursor-grab text-muted-foreground">
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <Input
                                  value={section.title}
                                  onChange={(e) =>
                                    updateSection(section.id, { title: e.target.value || "Untitled Section" })
                                  }
                                  className="font-semibold"
                                />
                                <Textarea
                                  value={section.description}
                                  onChange={(e) => updateSection(section.id, { description: e.target.value })}
                                  placeholder="Section description"
                                  className="min-h-[60px]"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-destructive"
                                onClick={() => {
                                  if (window.confirm("Delete this section?")) deleteSection(section.id);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <Droppable droppableId={`section:${section.id}`} type="FIELD">
                            {(dropProvided) => (
                              <div
                                ref={dropProvided.innerRef}
                                {...dropProvided.droppableProps}
                                className="mt-4 space-y-3"
                              >
                                {section.fields.map((field, fieldIndex) => (
                                  <Draggable
                                    key={field.id}
                                    draggableId={`field-${field.id}`}
                                    index={fieldIndex}
                                  >
                                    {(fieldProvided) => (
                                      <div
                                        ref={fieldProvided.innerRef}
                                        {...fieldProvided.draggableProps}
                                        className={`rounded-lg border p-3 transition ${
                                          selected?.fieldId === field.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border/70 bg-card/60"
                                        }`}
                                        onClick={() => setSelected({ sectionId: section.id, fieldId: field.id })}
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex flex-1 items-center gap-2">
                                            <div {...fieldProvided.dragHandleProps} className="cursor-grab text-muted-foreground">
                                              <GripVertical className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">{fieldPreview(field)}</div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              deleteField(section.id, field.id);
                                            }}
                                          >
                                            <Trash className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {dropProvided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Right Sidebar - Field Editor */}
        <Card className="h-fit border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Field Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedField ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Field Label</Label>
                  <Input
                    value={selectedField.label}
                    onChange={(e) =>
                      updateField(selected!.sectionId, selected!.fieldId, { label: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input
                    value={selectedField.placeholder || ""}
                    onChange={(e) =>
                      updateField(selected!.sectionId, selected!.fieldId, { placeholder: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedField.required}
                    onCheckedChange={(checked) =>
                      updateField(selected!.sectionId, selected!.fieldId, { required: checked === true })
                    }
                  />
                  <Label>Required field</Label>
                </div>
                {(selectedField.type === "radio" ||
                  selectedField.type === "checkbox" ||
                  selectedField.type === "dropdown") && (
                  <div className="space-y-2">
                    <Label>Options (one per line)</Label>
                    <Textarea
                      value={selectedField.options?.join("\n") || ""}
                      onChange={(e) =>
                        updateField(selected!.sectionId, selected!.fieldId, {
                          options: e.target.value.split("\n").filter((o) => o.trim()),
                        })
                      }
                      rows={4}
                    />
                  </div>
                )}
                {(selectedField.type === "number" || selectedField.type === "range") && (
                  <>
                    <div className="space-y-2">
                      <Label>Min Value</Label>
                      <Input
                        type="number"
                        value={selectedField.min || ""}
                        onChange={(e) =>
                          updateField(selected!.sectionId, selected!.fieldId, {
                            min: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Value</Label>
                      <Input
                        type="number"
                        value={selectedField.max || ""}
                        onChange={(e) =>
                          updateField(selected!.sectionId, selected!.fieldId, {
                            max: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </>
                )}
                {selectedField.type === "rating" && (
                  <div className="space-y-2">
                    <Label>Max Stars</Label>
                    <Input
                      type="number"
                      value={selectedField.max || 5}
                      onChange={(e) =>
                        updateField(selected!.sectionId, selected!.fieldId, {
                          max: e.target.value ? Number(e.target.value) : 5,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a field to edit its properties</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


