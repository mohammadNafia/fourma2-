/**
 * Maps frontend field types to backend field types
 */

import { FieldType } from "@/components/shared/forms-store";

// Backend field types from Laravel enum
export type BackendFieldType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "integer"
  | "decimal"
  | "slider"
  | "date"
  | "time"
  | "boolean"
  | "rating"
  | "email"
  | "phone";

/**
 * Maps frontend field type to backend field type
 */
export function mapFieldTypeToBackend(frontendType: FieldType): BackendFieldType {
  const mapping: Record<FieldType, BackendFieldType> = {
    shortText: "text",
    longText: "textarea",
    radio: "radio",
    checkbox: "checkbox",
    dropdown: "dropdown",
    number: "integer",
    range: "slider",
    date: "date",
    time: "time",
    boolean: "boolean",
    rating: "rating",
    email: "email",
    phone: "phone",
    file: "text", // File upload handled separately
    gender: "dropdown", // Gender is a dropdown in backend
  };

  return mapping[frontendType] || "text";
}

/**
 * Maps backend field type to frontend field type
 */
export function mapFieldTypeFromBackend(backendType: BackendFieldType): FieldType {
  const mapping: Record<BackendFieldType, FieldType> = {
    text: "shortText",
    textarea: "longText",
    radio: "radio",
    checkbox: "checkbox",
    dropdown: "dropdown",
    integer: "number",
    decimal: "number",
    slider: "range",
    date: "date",
    time: "time",
    boolean: "boolean",
    rating: "rating",
    email: "email",
    phone: "phone",
  };

  return mapping[backendType] || "shortText";
}

/**
 * Converts frontend field options format to backend format
 * Frontend: string[]
 * Backend: {label: string, value: string}[]
 */
export function mapOptionsToBackend(options: string[]): Array<{ label: string; value: string }> {
  return options.map((opt) => ({
    label: opt,
    value: opt.toLowerCase().replace(/\s+/g, "_"),
  }));
}

/**
 * Converts backend field options format to frontend format
 * Backend: {label: string, value: string}[]
 * Frontend: string[]
 */
export function mapOptionsFromBackend(
  options: Array<{ label: string; value: string }> | null | undefined
): string[] {
  if (!options || !Array.isArray(options)) {
    return [];
  }
  return options.map((opt) => opt.label || opt.value);
}

/**
 * Converts frontend validation to backend validation format
 */
export function mapValidationToBackend(field: {
  min?: number;
  max?: number;
  regex?: string;
  required?: boolean;
}): Record<string, unknown> {
  const validation: Record<string, unknown> = {};

  if (field.min !== undefined) {
    validation.min = field.min;
  }
  if (field.max !== undefined) {
    validation.max = field.max;
  }
  if (field.regex) {
    validation.pattern = field.regex;
  }
  if (field.required) {
    validation.required = true;
  }

  return validation;
}

/**
 * Converts backend validation to frontend format
 */
export function mapValidationFromBackend(validation: Record<string, unknown> | null | undefined): {
  min?: number;
  max?: number;
  regex?: string;
  required?: boolean;
} {
  if (!validation || typeof validation !== "object") {
    return {};
  }

  return {
    min: typeof validation.min === "number" ? validation.min : undefined,
    max: typeof validation.max === "number" ? validation.max : undefined,
    regex: typeof validation.pattern === "string" ? validation.pattern : undefined,
    required: Boolean(validation.required),
  };
}

