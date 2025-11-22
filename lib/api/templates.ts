/**
 * API service for form templates
 */

import { apiClient } from "./client";
import { Template, FormSection, FormField } from "@/components/shared/forms-store";
import { BackendFormField } from "./forms";
import {
  mapFieldTypeToBackend,
  mapFieldTypeFromBackend,
  mapOptionsToBackend,
  mapOptionsFromBackend,
  mapValidationToBackend,
  mapValidationFromBackend,
} from "./field-mapper";

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

export interface BackendTemplate {
  id: number;
  tenant_id: number;
  name: string;
  description?: string;
  is_public: boolean;
  schema: {
    sections: Array<{
      id: string;
      title: string;
      description: string;
      fields: BackendFormField[];
    }>;
  };
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Convert backend template to frontend format
 */
function convertBackendTemplateToFrontend(template: BackendTemplate): Template {
  const sections: FormSection[] = template.schema.sections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    fields: section.fields.map(convertBackendFieldToFrontend),
  }));

  return {
    templateId: template.id.toString(),
    name: template.name,
    description: template.description || "",
    category: null, // Category not in backend schema yet
    createdAt: template.created_at,
    updatedAt: template.updated_at,
    sections,
  };
}

/**
 * List templates for a tenant
 */
export async function listTemplates(tenantId: string): Promise<Template[]> {
  const response = await apiClient.get<{ data: BackendTemplate[] }>(
    `/tenants/${tenantId}/templates`
  );
  return response.data.map(convertBackendTemplateToFrontend);
}

/**
 * Get a template by ID
 */
export async function getTemplate(tenantId: string, templateId: string): Promise<Template> {
  const response = await apiClient.get<{ data: BackendTemplate }>(
    `/tenants/${tenantId}/templates/${templateId}`
  );
  return convertBackendTemplateToFrontend(response.data);
}

/**
 * Create a template
 */
export async function createTemplate(
  tenantId: string,
  data: {
    name: string;
    description?: string;
    is_public?: boolean;
    sections: FormSection[];
  }
): Promise<Template> {
  // Convert frontend sections to backend schema format
  const schema = {
    sections: data.sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      fields: section.fields.map((field, index) => {
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
          position: index,
        };
      }),
    })),
  };

  const payload = {
    name: data.name,
    description: data.description,
    is_public: data.is_public || false,
    schema,
  };

  const response = await apiClient.post<{ data: BackendTemplate }>(
    `/tenants/${tenantId}/templates`,
    payload
  );

  return convertBackendTemplateToFrontend(response.data);
}

/**
 * Update a template
 */
export async function updateTemplate(
  tenantId: string,
  templateId: string,
  data: {
    name?: string;
    description?: string;
    is_public?: boolean;
    sections?: FormSection[];
  }
): Promise<Template> {
  const payload: Record<string, unknown> = {};

  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.is_public !== undefined) payload.is_public = data.is_public;

  if (data.sections !== undefined) {
    payload.schema = {
      sections: data.sections.map((section) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        fields: section.fields.map((field, index) => {
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
            position: index,
          };
        }),
      })),
    };
  }

  const response = await apiClient.put<{ data: BackendTemplate }>(
    `/tenants/${tenantId}/templates/${templateId}`,
    payload
  );

  return convertBackendTemplateToFrontend(response.data);
}

/**
 * Delete a template
 */
export async function deleteTemplate(tenantId: string, templateId: string): Promise<void> {
  await apiClient.delete(`/tenants/${tenantId}/templates/${templateId}`);
}

