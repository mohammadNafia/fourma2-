/**
 * API service for form management
 */

import { apiClient } from "./client";
import { FieldType, FormModel, FormSection, FormField } from "@/components/shared/forms-store";
import {
  mapFieldTypeToBackend,
  mapFieldTypeFromBackend,
  mapOptionsToBackend,
  mapOptionsFromBackend,
  mapValidationToBackend,
  mapValidationFromBackend,
} from "./field-mapper";

// Backend API response types
export interface BackendFormField {
  id: number;
  type: string;
  label: string;
  handle: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  default_value?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: Record<string, unknown>;
  position: number;
}

export interface BackendFormVersion {
  id: number;
  form_id: number;
  version_number: number;
  status: string;
  is_locked: boolean;
  fields?: BackendFormField[];
}

export interface BackendForm {
  id: number;
  tenant_id: number;
  owner_id: number;
  template_id?: number;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  visibility: "public" | "private";
  single_submission: boolean;
  allow_guests: boolean;
  allow_editing: boolean;
  submission_start_at?: string;
  submission_end_at?: string;
  published_at?: string;
  current_version_id?: number;
  published_version_id?: number;
  settings?: Record<string, unknown>;
  analytics?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  current_version?: BackendFormVersion;
  published_version?: BackendFormVersion;
}

/**
 * Convert backend form field to frontend format
 */
function convertBackendFieldToFrontend(field: BackendFormField): FormField {
  const frontendType = mapFieldTypeFromBackend(field.type as any);
  const validation = mapValidationFromBackend(field.validation);

  return {
    id: field.id.toString(),
    type: frontendType,
    label: field.label,
    placeholder: field.placeholder,
    required: field.is_required,
    defaultValue: field.default_value,
    helpText: field.help_text,
    validation: field.validation || {},
    options: mapOptionsFromBackend(field.options),
    min: typeof validation.min === "number" ? validation.min : undefined,
    max: typeof validation.max === "number" ? validation.max : undefined,
    regex: validation.regex,
  };
}

/**
 * Convert frontend form field to backend format
 */
function convertFrontendFieldToBackend(field: FormField, position: number): Omit<BackendFormField, "id"> {
  const backendType = mapFieldTypeToBackend(field.type);
  const validation = mapValidationToBackend(field);

  return {
    type: backendType,
    label: field.label,
    handle: field.label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
    placeholder: field.placeholder,
    help_text: field.helpText,
    is_required: Boolean(field.required),
    default_value: field.defaultValue?.toString(),
    options: field.options && field.options.length > 0 ? mapOptionsToBackend(field.options) : undefined,
    validation: Object.keys(validation).length > 0 ? validation : undefined,
    position,
  };
}

/**
 * Convert backend form to frontend format
 */
function convertBackendFormToFrontend(backendForm: BackendForm): FormModel {
  const version = backendForm.current_version || backendForm.published_version;
  const fields = version?.fields || [];

  // Group fields into sections (for now, single section)
  // In a real implementation, you might have section metadata in the version config
  const sections: FormSection[] = [
    {
      id: "default",
      title: "Form Fields",
      description: "",
      fields: fields.map(convertBackendFieldToFrontend),
    },
  ];

  return {
    id: backendForm.id.toString(),
    title: backendForm.title,
    description: "",
    category: undefined,
    accessKey: backendForm.slug, // Using slug as access key for now
    createdAt: backendForm.created_at,
    updatedAt: backendForm.updated_at,
    status: backendForm.status === "published" ? "published" : "draft",
    allowMultipleSubmissions: !backendForm.single_submission,
    anonymousResponses: backendForm.allow_guests,
    closingDate: backendForm.submission_end_at || undefined,
    sections,
    submissions: [],
  };
}

/**
 * List all forms for the current tenant
 */
export async function listForms(tenantId: string, page = 1, perPage = 50): Promise<{
  data: FormModel[];
  current_page: number;
  last_page: number;
  total: number;
}> {
  const response = await apiClient.get<{
    data: BackendForm[];
    current_page: number;
    last_page: number;
    total: number;
  }>(`/tenants/${tenantId}/forms?page=${page}&per_page=${perPage}`);

  return {
    data: response.data.map(convertBackendFormToFrontend),
    current_page: response.current_page,
    last_page: response.last_page,
    total: response.total,
  };
}

/**
 * Get a single form by ID
 */
export async function getForm(formId: string): Promise<FormModel> {
  const response = await apiClient.get<{ data: BackendForm }>(`/forms/${formId}`);
  return convertBackendFormToFrontend(response.data);
}

/**
 * Get a form by slug (for public access)
 */
export async function getFormBySlug(slug: string): Promise<FormModel> {
  const response = await apiClient.get<{ data: BackendForm }>(`/public/forms/${slug}`);
  return convertBackendFormToFrontend(response.data);
}

/**
 * Create a new form
 */
export async function createForm(
  tenantId: string,
  data: {
    title: string;
    visibility?: "public" | "private";
    single_submission?: boolean;
    allow_guests?: boolean;
    allow_editing?: boolean;
    submission_start_at?: string;
    submission_end_at?: string;
    settings?: Record<string, unknown>;
    fields?: FormField[];
    template_id?: number;
  }
): Promise<FormModel> {
  const backendFields = data.fields?.map((field, index) => convertFrontendFieldToBackend(field, index)) || [];

  const payload = {
    title: data.title,
    visibility: data.visibility || "public",
    single_submission: data.single_submission || false,
    allow_guests: data.allow_guests !== false,
    allow_editing: data.allow_editing || false,
    submission_start_at: data.submission_start_at,
    submission_end_at: data.submission_end_at,
    settings: data.settings || {},
    fields: backendFields,
    template_id: data.template_id,
  };

  const response = await apiClient.post<{ data: BackendForm }>(
    `/tenants/${tenantId}/forms`,
    payload
  );

  return convertBackendFormToFrontend(response.data);
}

/**
 * Update form metadata
 */
export async function updateForm(
  formId: string,
  data: {
    title?: string;
    visibility?: "public" | "private";
    single_submission?: boolean;
    allow_guests?: boolean;
    allow_editing?: boolean;
    submission_start_at?: string;
    submission_end_at?: string;
    settings?: Record<string, unknown>;
    fields?: FormField[];
  }
): Promise<FormModel> {
  const payload: Record<string, unknown> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.visibility !== undefined) payload.visibility = data.visibility;
  if (data.single_submission !== undefined) payload.single_submission = data.single_submission;
  if (data.allow_guests !== undefined) payload.allow_guests = data.allow_guests;
  if (data.allow_editing !== undefined) payload.allow_editing = data.allow_editing;
  if (data.submission_start_at !== undefined) payload.submission_start_at = data.submission_start_at;
  if (data.submission_end_at !== undefined) payload.submission_end_at = data.submission_end_at;
  if (data.settings !== undefined) payload.settings = data.settings;

  if (data.fields !== undefined) {
    payload.fields = data.fields.map((field, index) => convertFrontendFieldToBackend(field, index));
  }

  const response = await apiClient.put<{ data: BackendForm }>(`/forms/${formId}`, payload);
  return convertBackendFormToFrontend(response.data);
}

/**
 * Update form builder schema (fields)
 */
export async function updateFormBuilder(
  formId: string,
  fields: FormField[]
): Promise<FormModel> {
  const backendFields = fields.map((field, index) => convertFrontendFieldToBackend(field, index));

  const response = await apiClient.put<{ data: BackendFormVersion }>(
    `/forms/${formId}/builder`,
    { fields: backendFields }
  );

  // Fetch the updated form
  return getForm(formId);
}

/**
 * Publish a form
 */
export async function publishForm(formId: string, versionId?: number): Promise<FormModel> {
  const payload = versionId ? { version_id: versionId } : {};
  const response = await apiClient.post<{ data: BackendForm }>(`/forms/${formId}/publish`, payload);
  return convertBackendFormToFrontend(response.data);
}

/**
 * Duplicate a form
 */
export async function duplicateForm(formId: string): Promise<FormModel> {
  const response = await apiClient.post<{ data: BackendForm }>(`/forms/${formId}/duplicate`);
  return convertBackendFormToFrontend(response.data);
}

/**
 * Delete a form
 */
export async function deleteForm(formId: string): Promise<void> {
  await apiClient.delete(`/forms/${formId}`);
}

/**
 * Get form analytics
 */
export async function getFormAnalytics(formId: string): Promise<{
  submission_count: number;
  submissions_by_status: Record<string, number>;
}> {
  return apiClient.get(`/forms/${formId}/analytics`);
}


