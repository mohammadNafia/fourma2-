"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type FieldType =
  | "shortText"
  | "longText"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "number"
  | "range"
  | "date"
  | "time"
  | "boolean"
  | "rating"
  | "email"
  | "phone"
  | "file"
  | "gender";

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  helpText?: string;
  validation?: Record<string, unknown>;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  regex?: string;
};

export type FormSection = {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
};

export type FormSubmission = {
  id: string;
  userId?: string | null;
  submittedAt: string;
  values: {
    [fieldId: string]: any;
  };
  status: "submitted" | "in-progress";
};

export type UserFormEntry = {
  formId: string;
  accessKey: string;
  status: "in-progress" | "submitted";
  firstOpenedAt: string;
  lastUpdatedAt: string;
  lastSubmissionId?: string;
  draftValues?: {
    [fieldId: string]: any;
  };
};

export type FormModel = {
  id: string;
  title: string;
  description: string;
  category?: string;
  accessKey: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
  allowMultipleSubmissions?: boolean;
  anonymousResponses?: boolean;
  closingDate?: string;
  sections: FormSection[];
  submissions: FormSubmission[];
};

export type Template = {
  templateId: string;
  name: string;
  description: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  sections: FormSection[];
};

type FormsContextValue = {
  forms: FormModel[];
  userForms: UserFormEntry[];
  templates: Template[];
  createForm: (data?: Partial<Pick<FormModel, "title" | "description" | "status">>) => FormModel;
  duplicateForm: (formId: string) => FormModel;
  updateFormTitle: (id: string, title: string) => void;
  updateForm: (id: string, data: Partial<Pick<FormModel, "title" | "description" | "category" | "status" | "allowMultipleSubmissions" | "anonymousResponses" | "closingDate">>) => void;
  regenerateAccessKey: (id: string) => string;
  deleteForm: (id: string) => void;
  getFormById: (id: string) => FormModel | undefined;
  getFormByAccessKey: (accessKey: string) => FormModel | undefined;
  // Template functions
  addTemplate: (name: string, description: string, category: string | null, sections: FormSection[]) => Template;
  updateTemplate: (templateId: string, data: Partial<Pick<Template, "name" | "description" | "category" | "sections">>) => void;
  deleteTemplate: (templateId: string) => void;
  duplicateTemplate: (templateId: string) => Template;
  getTemplateById: (templateId: string) => Template | undefined;
  createFormFromTemplate: (templateId: string) => FormModel;
  publishTemplateAsForm: (templateId: string) => FormModel;
  saveFormAsTemplate: (formId: string, name: string, description: string, category: string | null) => Template;
  addSection: (formId: string) => FormSection;
  updateSection: (formId: string, sectionId: string, data: Partial<Pick<FormSection, "title" | "description">>) => void;
  deleteSection: (formId: string, sectionId: string) => void;
  reorderSections: (formId: string, fromIndex: number, toIndex: number) => void;
  addField: (formId: string, sectionId: string, type: FieldType) => FormField;
  updateField: (formId: string, sectionId: string, fieldId: string, data: Partial<FormField>) => void;
  deleteField: (formId: string, sectionId: string, fieldId: string) => void;
  moveField: (
    formId: string,
    sourceSectionId: string,
    destSectionId: string,
    sourceIndex: number,
    destIndex: number,
  ) => void;
  submitForm: (accessKey: string, values: Record<string, any>, userId?: string | null) => FormSubmission | null;
  saveDraft: (accessKey: string, values: Record<string, any>, userId?: string | null) => void;
  getUserForms: (userId?: string | null) => UserFormEntry[];
  getUserFormByAccessKey: (accessKey: string, userId?: string | null) => UserFormEntry | undefined;
  deleteUserFormDraft: (accessKey: string, userId?: string | null) => void;
  trackFormAccess: (accessKey: string, userId?: string | null) => void;
};

const FormsContext = createContext<FormsContextValue | null>(null);

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateAccessKey(existing: Set<string>): string {
  let key = "";
  do {
    key = Array.from({ length: 8 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join("");
  } while (existing.has(key));
  return key;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultOptions(type: FieldType) {
  if (type === "radio" || type === "dropdown" || type === "checkbox" || type === "gender") {
    return ["Option 1", "Option 2"];
  }
  return undefined;
}

function defaultField(type: FieldType): FormField {
  return {
    id: randomId(),
    type,
    label: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
    placeholder: "Enter text",
    required: false,
    helpText: "",
    options: defaultOptions(type),
    min: type === "rating" ? 1 : undefined,
    max: type === "rating" ? 5 : undefined,
    step: type === "number" ? 1 : undefined,
  };
}

const seedForms: FormModel[] = [
  {
    id: "welcome-kit",
    title: "Employee Onboarding Kit",
    description: "Collect start details, equipment needs, and compliance signatures.",
    category: "HR",
    accessKey: "4H8QX21B",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "published",
    allowMultipleSubmissions: false,
    anonymousResponses: false,
    sections: [
      {
        id: "intro",
        title: "Profile",
        description: "Basic details for HR and IT.",
        fields: [
          { id: "full-name", type: "shortText", label: "Full name", required: true },
          { id: "dept", type: "dropdown", label: "Department", options: ["Engineering", "HR", "Sales", "Marketing"] },
        ],
      },
    ],
    submissions: [],
  },
  {
    id: "research-2025",
    title: "Product Discovery 2025",
    description: "Survey for beta cohort about product direction.",
    category: "Tech",
    accessKey: "9M2TLD4A",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
    allowMultipleSubmissions: true,
    anonymousResponses: true,
    sections: [],
    submissions: [],
  },
];

const FORMS_STORAGE_KEY = "flow_forms";
const TEMPLATES_STORAGE_KEY = "flow_templates";
const USER_FORMS_STORAGE_KEY = "flow_user_forms";

// Load from localStorage on initial render
function loadFormsFromStorage(): FormModel[] {
  if (typeof window === "undefined") return seedForms;
  try {
    const stored = localStorage.getItem(FORMS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with seed forms to ensure we always have default forms
      const seedIds = new Set(seedForms.map((f) => f.id));
      const storedOnly = parsed.filter((f: FormModel) => !seedIds.has(f.id));
      return [...seedForms, ...storedOnly];
    }
  } catch (error) {
    console.error("Failed to load forms from storage:", error);
  }
  return seedForms;
}

function loadTemplatesFromStorage(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load templates from storage:", error);
  }
  return [];
}

function loadUserFormsFromStorage(): UserFormEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USER_FORMS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load user forms from storage:", error);
  }
  return [];
}

// Save to localStorage
function saveFormsToStorage(forms: FormModel[]) {
  if (typeof window === "undefined") return;
  try {
    // Only save non-seed forms
    const seedIds = new Set(seedForms.map((f) => f.id));
    const toSave = forms.filter((f) => !seedIds.has(f.id));
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error("Failed to save forms to storage:", error);
  }
}

function saveTemplatesToStorage(templates: Template[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error("Failed to save templates to storage:", error);
  }
}

function saveUserFormsToStorage(userForms: UserFormEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_FORMS_STORAGE_KEY, JSON.stringify(userForms));
  } catch (error) {
    console.error("Failed to save user forms to storage:", error);
  }
}

export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [forms, setForms] = useState<FormModel[]>(() => {
    // Load forms synchronously on initial mount
    if (typeof window !== "undefined") {
      return loadFormsFromStorage();
    }
    return seedForms;
  });
  const [userForms, setUserForms] = useState<UserFormEntry[]>(() => {
    if (typeof window !== "undefined") {
      return loadUserFormsFromStorage();
    }
    return [];
  });
  const [templates, setTemplates] = useState<Template[]>(() => {
    if (typeof window !== "undefined") {
      return loadTemplatesFromStorage();
    }
    return [];
  });
  const keysRef = useRef<Set<string>>(new Set(forms.map((f) => f.accessKey)));
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize keysRef with all loaded forms on mount
  useEffect(() => {
    keysRef.current = new Set(forms.map((f) => f.accessKey));
  }, []); // Only run on mount

  // Update keys ref immediately when forms change (for access key generation)
  useEffect(() => {
    keysRef.current = new Set(forms.map((f) => f.accessKey));
  }, [forms]);

  // Sync forms to localStorage with debouncing to prevent lag
  useEffect(() => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Save immediately for critical operations, debounce for rapid changes
    saveTimeoutRef.current = setTimeout(() => {
      saveFormsToStorage(forms);
    }, 200);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [forms]);

  // Sync templates to localStorage with debouncing
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveTemplatesToStorage(templates);
    }, 200);
    return () => clearTimeout(timeout);
  }, [templates]);

  // Sync userForms to localStorage with debouncing
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveUserFormsToStorage(userForms);
    }, 200);
    return () => clearTimeout(timeout);
  }, [userForms]);

  const createForm = (data?: Partial<Pick<FormModel, "title" | "description" | "status">>) => {
    const accessKey = generateAccessKey(keysRef.current);
    keysRef.current.add(accessKey);
    const now = new Date().toISOString();
    const form: FormModel = {
      id: randomId(),
      title: data?.title ?? "Untitled Form",
      description: data?.description ?? "Add a description to help collaborators understand this form.",
      accessKey,
      createdAt: now,
      updatedAt: now,
      status: data?.status ?? "draft",
      sections: [
        {
          id: randomId(),
          title: "New Section",
          description: "Describe this section",
          fields: [],
        },
      ],
      submissions: [],
    };
    setForms((prev) => {
      const updated = [form, ...prev];
      // Save immediately to localStorage (don't wait for debounce)
      saveFormsToStorage(updated);
      return updated;
    });
    return form;
  };

  const updateFormTitle = (id: string, title: string) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === id ? { ...form, title: title.trim() || "Untitled Form", updatedAt: new Date().toISOString() } : form,
      ),
    );
  };

  const updateForm = (id: string, data: Partial<Pick<FormModel, "title" | "description" | "category" | "status" | "allowMultipleSubmissions" | "anonymousResponses" | "closingDate">>) => {
    setForms((prev) => {
      const updated = prev.map((form) =>
        form.id === id
          ? {
              ...form,
              ...data,
              title: data.title !== undefined ? (data.title.trim() || "Untitled Form") : form.title,
              updatedAt: new Date().toISOString(),
            }
          : form,
      );
      // Save immediately if status is being changed to published (critical operation)
      if (data.status === "published") {
        saveFormsToStorage(updated);
      }
      return updated;
    });
  };

  const regenerateAccessKey = (id: string): string => {
    let newKey = "";
    setForms((prev) =>
      prev.map((form) => {
        if (form.id === id) {
          const oldKey = form.accessKey;
          keysRef.current.delete(oldKey);
          newKey = generateAccessKey(keysRef.current);
          keysRef.current.add(newKey);
          return { ...form, accessKey: newKey, updatedAt: new Date().toISOString() };
        }
        return form;
      }),
    );
    return newKey;
  };

  const deleteForm = (id: string) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
  };

  const duplicateForm = (formId: string): FormModel => {
    const form = getFormById(formId);
    if (!form) throw new Error("Form not found");

    const accessKey = generateAccessKey(keysRef.current);
    keysRef.current.add(accessKey);
    const now = new Date().toISOString();

    const duplicated: FormModel = {
      id: randomId(),
      title: `${form.title} (copy)`,
      description: form.description,
      category: form.category,
      accessKey,
      createdAt: now,
      updatedAt: now,
      status: "draft",
      allowMultipleSubmissions: form.allowMultipleSubmissions,
      anonymousResponses: form.anonymousResponses,
      closingDate: form.closingDate,
      sections: JSON.parse(JSON.stringify(form.sections)), // Deep copy
      submissions: [], // No submissions in duplicate
    };

    setForms((prev) => {
      const updated = [duplicated, ...prev];
      // Save immediately to localStorage (don't wait for debounce)
      saveFormsToStorage(updated);
      return updated;
    });
    return duplicated;
  };

  const getFormById = (id: string) => forms.find((f) => f.id === id);

  const getFormByAccessKey = (accessKey: string): FormModel | undefined => {
    if (!accessKey) return undefined;
    const upperKey = accessKey.toUpperCase().trim();
    
    // First try to find in current forms state
    let form = forms.find((f) => f.accessKey === upperKey);
    
    // If not found, try loading from localStorage directly (for cases where state hasn't updated yet)
    if (!form && typeof window !== "undefined") {
      try {
        // Check stored forms
        const stored = localStorage.getItem(FORMS_STORAGE_KEY);
        if (stored) {
          const parsed: FormModel[] = JSON.parse(stored);
          form = parsed.find((f) => f.accessKey === upperKey);
        }
        
        // Also check seed forms
        if (!form) {
          const seedForm = seedForms.find((f) => f.accessKey === upperKey);
          if (seedForm) form = seedForm;
        }
        
        // If found in localStorage but not in state, update state (this shouldn't happen but helps with sync)
        if (form && !forms.find((f) => f.id === form!.id)) {
          // Form exists in storage but not in state - this is a sync issue
          // Reload forms from storage to sync
          const allForms = loadFormsFromStorage();
          setForms(allForms);
        }
      } catch (error) {
        console.error("Failed to load form from storage:", error);
      }
    }
    
    return form;
  };

  const addSection = (formId: string) => {
    const section: FormSection = {
      id: randomId(),
      title: "New Section",
      description: "Describe this section",
      fields: [],
    };
    setForms((prev) =>
      prev.map((form) => (form.id === formId ? { ...form, sections: [...form.sections, section] } : form)),
    );
    return section;
  };

  const updateSection = (formId: string, sectionId: string, data: Partial<Pick<FormSection, "title" | "description">>) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.map((section) =>
                section.id === sectionId ? { ...section, ...data } : section,
              ),
            }
          : form,
      ),
    );
  };

  const deleteSection = (formId: string, sectionId: string) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId ? { ...form, sections: form.sections.filter((sec) => sec.id !== sectionId) } : form,
      ),
    );
  };

  const reorderSections = (formId: string, fromIndex: number, toIndex: number) => {
    setForms((prev) =>
      prev.map((form) => {
        if (form.id !== formId) return form;
        const nextSections = [...form.sections];
        const [moved] = nextSections.splice(fromIndex, 1);
        nextSections.splice(toIndex, 0, moved);
        return { ...form, sections: nextSections, updatedAt: new Date().toISOString() };
      }),
    );
  };

  const addField = (formId: string, sectionId: string, type: FieldType) => {
    const field = defaultField(type);
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.map((section) =>
                section.id === sectionId ? { ...section, fields: [...section.fields, field] } : section,
              ),
            }
          : form,
      ),
    );
    return field;
  };

  const updateField = (formId: string, sectionId: string, fieldId: string, data: Partial<FormField>) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              updatedAt: new Date().toISOString(),
              sections: form.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      fields: section.fields.map((field) => (field.id === fieldId ? { ...field, ...data } : field)),
                    }
                  : section,
              ),
            }
          : form,
      ),
    );
  };

  const deleteField = (formId: string, sectionId: string, fieldId: string) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, fields: section.fields.filter((field) => field.id !== fieldId) }
                  : section,
              ),
            }
          : form,
      ),
    );
  };

  const moveField = (
    formId: string,
    sourceSectionId: string,
    destSectionId: string,
    sourceIndex: number,
    destIndex: number,
  ) => {
    setForms((prev) =>
      prev.map((form) => {
        if (form.id !== formId) return form;
        const nextSections = form.sections.map((s) => ({ ...s, fields: [...s.fields] }));
        const sourceSection = nextSections.find((s) => s.id === sourceSectionId);
        const destSection = nextSections.find((s) => s.id === destSectionId);
        if (!sourceSection || !destSection) return form;
        const [moved] = sourceSection.fields.splice(sourceIndex, 1);
        destSection.fields.splice(destIndex, 0, moved);
        return { ...form, sections: nextSections, updatedAt: new Date().toISOString() };
      }),
    );
  };

  const submitForm = (accessKey: string, values: Record<string, any>, userId?: string | null): FormSubmission | null => {
    const form = getFormByAccessKey(accessKey);
    if (!form || form.status !== "published") return null;

    // Check if form is closed
    if (form.closingDate) {
      const closingDate = new Date(form.closingDate);
      const now = new Date();
      if (now > closingDate) return null;
    }

    // Check if multiple submissions are allowed
    if (!form.allowMultipleSubmissions) {
      const existingSubmission = form.submissions.find(
        (s) => s.userId === userId && s.status === "submitted",
      );
      if (existingSubmission) {
        // Update existing submission
        const submission: FormSubmission = {
          ...existingSubmission,
          values,
          submittedAt: new Date().toISOString(),
          status: "submitted",
        };
        setForms((prev) =>
          prev.map((f) =>
            f.accessKey === accessKey
              ? {
                  ...f,
                  submissions: f.submissions.map((s) => (s.id === existingSubmission.id ? submission : s)),
                }
              : f,
          ),
        );
        // Update user form entry
        const userForm = getUserFormByAccessKey(accessKey, userId);
        if (userForm) {
          setUserForms((prev) =>
            prev.map((uf) =>
              uf.accessKey === accessKey && uf.formId === form.id
                ? {
                    ...uf,
                    status: "submitted",
                    lastUpdatedAt: new Date().toISOString(),
                    lastSubmissionId: submission.id,
                    draftValues: undefined,
                  }
                : uf,
            ),
          );
        }
        return submission;
      }
    }

    const submission: FormSubmission = {
      id: randomId(),
      userId: form.anonymousResponses ? null : userId,
      submittedAt: new Date().toISOString(),
      values,
      status: "submitted",
    };

    setForms((prev) =>
      prev.map((f) =>
        f.accessKey === accessKey ? { ...f, submissions: [...f.submissions, submission] } : f,
      ),
    );

    // Update or create user form entry
    const userForm = getUserFormByAccessKey(accessKey, userId);
    const now = new Date().toISOString();
    if (userForm) {
      setUserForms((prev) =>
        prev.map((uf) =>
          uf.accessKey === accessKey && uf.formId === form.id
            ? {
                ...uf,
                status: "submitted",
                lastUpdatedAt: now,
                lastSubmissionId: submission.id,
                draftValues: undefined,
              }
            : uf,
        ),
      );
    } else {
      setUserForms((prev) => [
        ...prev,
        {
          formId: form.id,
          accessKey,
          status: "submitted",
          firstOpenedAt: now,
          lastUpdatedAt: now,
          lastSubmissionId: submission.id,
        },
      ]);
    }

    return submission;
  };

  const saveDraft = (accessKey: string, values: Record<string, any>, userId?: string | null) => {
    const form = getFormByAccessKey(accessKey);
    if (!form) return;

    const userForm = getUserFormByAccessKey(accessKey, userId);
    const now = new Date().toISOString();

    if (userForm) {
      setUserForms((prev) =>
        prev.map((uf) =>
          uf.accessKey === accessKey && uf.formId === form.id
            ? {
                ...uf,
                lastUpdatedAt: now,
                draftValues: values,
                status: uf.status === "submitted" && form.allowMultipleSubmissions ? "submitted" : "in-progress",
              }
            : uf,
        ),
      );
    } else {
      setUserForms((prev) => [
        ...prev,
        {
          formId: form.id,
          accessKey,
          status: "in-progress",
          firstOpenedAt: now,
          lastUpdatedAt: now,
          draftValues: values,
        },
      ]);
    }
  };

  const getUserForms = (userId?: string | null): UserFormEntry[] => {
    return userForms;
  };

  const getUserFormByAccessKey = (accessKey: string, userId?: string | null): UserFormEntry | undefined => {
    return userForms.find((uf) => uf.accessKey === accessKey.toUpperCase());
  };

  const deleteUserFormDraft = (accessKey: string, userId?: string | null) => {
    setUserForms((prev) => prev.filter((uf) => !(uf.accessKey === accessKey.toUpperCase() && uf.status === "in-progress")));
  };

  const trackFormAccess = (accessKey: string, userId?: string | null) => {
    const form = getFormByAccessKey(accessKey);
    if (!form) return;

    const userForm = getUserFormByAccessKey(accessKey, userId);
    if (!userForm) {
      const now = new Date().toISOString();
      setUserForms((prev) => [
        ...prev,
        {
          formId: form.id,
          accessKey: accessKey.toUpperCase(),
          status: "in-progress",
          firstOpenedAt: now,
          lastUpdatedAt: now,
        },
      ]);
    }
  };

  // Template functions
  const addTemplate = (name: string, description: string, category: string | null, sections: FormSection[]): Template => {
    const now = new Date().toISOString();
    const template: Template = {
      templateId: randomId(),
      name,
      description,
      category,
      createdAt: now,
      updatedAt: now,
      sections: JSON.parse(JSON.stringify(sections)), // Deep copy
    };
    setTemplates((prev) => [template, ...prev]);
    return template;
  };

  const updateTemplate = (templateId: string, data: Partial<Pick<Template, "name" | "description" | "category" | "sections">>) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.templateId === templateId
          ? {
              ...template,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : template,
      ),
    );
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((template) => template.templateId !== templateId));
  };

  const duplicateTemplate = (templateId: string): Template => {
    const template = getTemplateById(templateId);
    if (!template) throw new Error("Template not found");

    const now = new Date().toISOString();
    const duplicated: Template = {
      templateId: randomId(),
      name: `${template.name} (copy)`,
      description: template.description,
      category: template.category,
      createdAt: now,
      updatedAt: now,
      sections: JSON.parse(JSON.stringify(template.sections)), // Deep copy
    };

    setTemplates((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const getTemplateById = (templateId: string): Template | undefined => {
    return templates.find((t) => t.templateId === templateId);
  };

  const createFormFromTemplate = (templateId: string): FormModel => {
    const template = getTemplateById(templateId);
    if (!template) throw new Error("Template not found");

    const accessKey = generateAccessKey(keysRef.current);
    keysRef.current.add(accessKey);
    const now = new Date().toISOString();

    const form: FormModel = {
      id: randomId(),
      title: `${template.name} (copy)`,
      description: template.description,
      category: template.category || undefined,
      accessKey,
      createdAt: now,
      updatedAt: now,
      status: "draft",
      sections: JSON.parse(JSON.stringify(template.sections)), // Deep copy
      submissions: [],
    };

    setForms((prev) => {
      const updated = [form, ...prev];
      // Save immediately to localStorage (don't wait for debounce)
      saveFormsToStorage(updated);
      return updated;
    });
    return form;
  };

  const publishTemplateAsForm = (templateId: string): FormModel => {
    const template = getTemplateById(templateId);
    if (!template) throw new Error("Template not found");

    const accessKey = generateAccessKey(keysRef.current);
    keysRef.current.add(accessKey);
    const now = new Date().toISOString();

    const form: FormModel = {
      id: randomId(),
      title: template.name,
      description: template.description,
      category: template.category || undefined,
      accessKey,
      createdAt: now,
      updatedAt: now,
      status: "published", // Published immediately
      sections: JSON.parse(JSON.stringify(template.sections)), // Deep copy
      submissions: [],
    };

    setForms((prev) => [form, ...prev]);
    return form;
  };

  const saveFormAsTemplate = (formId: string, name: string, description: string, category: string | null): Template => {
    const form = getFormById(formId);
    if (!form) throw new Error("Form not found");

    return addTemplate(name, description, category, form.sections);
  };

  const value = useMemo<FormsContextValue>(
    () => ({
      forms,
      userForms,
      templates,
      createForm,
      duplicateForm,
      updateFormTitle,
      updateForm,
      regenerateAccessKey,
      deleteForm,
      getFormById,
      getFormByAccessKey,
      addSection,
      updateSection,
      deleteSection,
      reorderSections,
      addField,
      updateField,
      deleteField,
      moveField,
      submitForm,
      saveDraft,
      getUserForms,
      getUserFormByAccessKey,
      deleteUserFormDraft,
      trackFormAccess,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      duplicateTemplate,
      getTemplateById,
      createFormFromTemplate,
      publishTemplateAsForm,
      saveFormAsTemplate,
    }),
    [forms, userForms, templates],
  );

  return <FormsContext.Provider value={value}>{children}</FormsContext.Provider>;
}

export function useForms() {
  const ctx = useContext(FormsContext);
  if (!ctx) throw new Error("useForms must be used within FormsProvider");
  return ctx;
}
