"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useForms, FormField, FieldType } from "@/components/shared/forms-store";

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
  { type: "longText", label: "Rich Description", icon: <Text className="h-4 w-4" /> },
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

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const {
    getFormById,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addField,
    updateField,
    deleteField,
    moveField,
  } = useForms();
  const form = getFormById(formId);
  const [selected, setSelected] = useState<Selected>(null);

  const handleTestAsUser = () => {
    if (!form) return;
    window.open(`/user/form/${form.accessKey}?test=true`, "_blank");
  };

  useEffect(() => {
    if (form && !form.sections.length) {
      addSection(formId);
    }
  }, [form, formId, addSection]);

  const selectedField = useMemo(() => {
    if (!selected || !form) return null;
    const section = form.sections.find((s) => s.id === selected.sectionId);
    return section?.fields.find((f) => f.id === selected.fieldId) || null;
  }, [selected, form]);

  const handleAddField = (type: FieldType, sectionId: string) => {
    const field = addField(formId, sectionId, type);
    setSelected({ sectionId, fieldId: field.id });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (type === "SECTION") {
      if (destination.index === source.index) return;
      reorderSections(formId, source.index, destination.index);
    } else {
      const [_, sourceSectionId] = source.droppableId.split(":");
      const [__, destSectionId] = destination.droppableId.split(":");
      moveField(formId, sourceSectionId, destSectionId, source.index, destination.index);
    }
  };

  if (!form) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Form not found</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Test Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground lowercase">{form.title}</h1>
          <p className="text-sm text-muted-foreground font-light">Build your form by adding fields and sections</p>
        </div>
        <Button
          onClick={handleTestAsUser}
          variant="primary"
          className="gap-2 lowercase"
        >
          <ExternalLink className="h-4 w-4" />
          Test as User
        </Button>
      </div>

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
              onClick={() => handleAddField(item.type, form.sections[0]?.id || addSection(formId).id)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
          <Separator className="bg-border/60" />
          <Button variant="ghost" className="gap-2" onClick={() => addSection(formId)}>
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
                {form.sections.map((section, sectionIndex) => (
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
                                  updateSection(formId, section.id, { title: e.target.value || "Untitled Section" })
                                }
                                className="font-semibold"
                              />
                              <Textarea
                                value={section.description}
                                onChange={(e) => updateSection(formId, section.id, { description: e.target.value })}
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
                                if (window.confirm("Delete this section?")) deleteSection(formId, section.id);
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
                                <Draggable draggableId={`field-${field.id}`} index={fieldIndex} key={field.id}>
                                  {(fieldProvided, snapshot) => (
                                    <motion.div
                                      ref={fieldProvided.innerRef}
                                      {...fieldProvided.draggableProps}
                                      {...fieldProvided.dragHandleProps}
                                      layout
                                      className={`rounded-xl border p-4 transition ${
                                        snapshot.isDragging
                                          ? "border-primary shadow-[0_14px_40px_rgba(79,70,229,0.35)]"
                                          : selected?.fieldId === field.id
                                            ? "border-primary/70 shadow-[0_10px_30px_rgba(79,70,229,0.25)]"
                                            : "border-border/70"
                                      }`}
                                      onClick={() => setSelected({ sectionId: section.id, fieldId: field.id })}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Label className="text-foreground">
                                              {field.label}
                                              {field.required ? "*" : ""}
                                            </Label>
                                            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                              {field.type}
                                            </span>
                                          </div>
                                          {field.helpText ? (
                                            <p className="text-xs text-muted-foreground">{field.helpText}</p>
                                          ) : null}
                                          <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                                            {fieldPreview(field)}
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (window.confirm("Delete this field?")) {
                                                deleteField(formId, section.id, field.id);
                                                if (selected?.fieldId === field.id) setSelected(null);
                                              }
                                            }}
                                          >
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))}
                              {dropProvided.placeholder}
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                onClick={() => handleAddField("shortText", section.id)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add field to this section
                              </Button>
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

      {/* Right Settings Panel */}
      <Card className="h-fit border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Field Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedField ? (
            <p className="text-sm text-muted-foreground">Select a field to edit its settings.</p>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={selectedField.label}
                  onChange={(e) =>
                    updateField(formId, selected!.sectionId, selected!.fieldId, { label: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Placeholder</Label>
                <Input
                  value={selectedField.placeholder || ""}
                  onChange={(e) =>
                    updateField(formId, selected!.sectionId, selected!.fieldId, { placeholder: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Helper text</Label>
                <Textarea
                  value={selectedField.helpText || ""}
                  onChange={(e) =>
                    updateField(formId, selected!.sectionId, selected!.fieldId, { helpText: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={Boolean(selectedField.required)}
                  onCheckedChange={(checked) =>
                    updateField(formId, selected!.sectionId, selected!.fieldId, { required: Boolean(checked) })
                  }
                />
                <Label className="text-sm">Required</Label>
              </div>

              {["shortText", "longText"].includes(selectedField.type) ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Min length</Label>
                    <Input
                      type="number"
                      value={selectedField.min ?? ""}
                      onChange={(e) =>
                        updateField(formId, selected!.sectionId, selected!.fieldId, {
                          min: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max length</Label>
                    <Input
                      type="number"
                      value={selectedField.max ?? ""}
                      onChange={(e) =>
                        updateField(formId, selected!.sectionId, selected!.fieldId, {
                          max: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Regex</Label>
                    <Input
                      value={selectedField.regex ?? ""}
                      onChange={(e) =>
                        updateField(formId, selected!.sectionId, selected!.fieldId, { regex: e.target.value })
                      }
                      placeholder="^.*$"
                    />
                  </div>
                </div>
              ) : null}

              {["number", "range"].includes(selectedField.type) ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Min</Label>
                    <Input
                      type="number"
                      value={selectedField.min ?? ""}
                      onChange={(e) =>
                        updateField(formId, selected!.sectionId, selected!.fieldId, {
                          min: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max</Label>
                    <Input
                      type="number"
                      value={selectedField.max ?? ""}
                      onChange={(e) =>
                        updateField(formId, selected!.sectionId, selected!.fieldId, {
                          max: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Step</Label>
                    <Input
                      type="number"
                      value={selectedField.step ?? ""}
                      onChange={(e) =>
                        updateField(formId, selected!.sectionId, selected!.fieldId, {
                          step: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                </div>
              ) : null}

              {selectedField.type === "rating" ? (
                <div className="space-y-1">
                  <Label className="text-xs">Max stars</Label>
                  <Input
                    type="number"
                    value={selectedField.max ?? 5}
                    onChange={(e) =>
                      updateField(formId, selected!.sectionId, selected!.fieldId, {
                        max: e.target.value ? Number(e.target.value) : 5,
                      })
                    }
                  />
                </div>
              ) : null}

              {["radio", "dropdown", "checkbox", "gender"].includes(selectedField.type) ? (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {(selectedField.options || []).map((opt, idx) => (
                      <div key={opt + idx} className="flex items-center gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const next = [...(selectedField.options || [])];
                            next[idx] = e.target.value;
                            updateField(formId, selected!.sectionId, selected!.fieldId, { options: next });
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const next = (selectedField.options || []).filter((_, i) => i !== idx);
                            updateField(formId, selected!.sectionId, selected!.fieldId, { options: next });
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        updateField(formId, selected!.sectionId, selected!.fieldId, {
                          options: [
                            ...(selectedField.options || []),
                            `Option ${((selectedField.options || []).length || 0) + 1}`,
                          ],
                        })
                      }
                    >
                      Add option
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
