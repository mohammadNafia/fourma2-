/**
 * API service for form submissions
 */

import { apiClient } from "./client";

export interface BackendSubmission {
  id: number;
  tenant_id: number;
  form_id: number;
  form_version_id: number;
  user_id?: number;
  guest_token?: string;
  ip_address?: string;
  user_agent?: string;
  status: "submitted" | "updated" | "archived";
  is_editable: boolean;
  editable_until?: string;
  submitted_at: string;
  answers: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FrontendSubmission {
  id: string;
  formId: string;
  userId?: string | null;
  guestToken?: string;
  submittedAt: string;
  values: Record<string, unknown>;
  status: "submitted" | "in-progress";
}

/**
 * Convert backend submission to frontend format
 */
function convertBackendSubmissionToFrontend(submission: BackendSubmission): FrontendSubmission {
  return {
    id: submission.id.toString(),
    formId: submission.form_id.toString(),
    userId: submission.user_id?.toString() || null,
    guestToken: submission.guest_token,
    submittedAt: submission.submitted_at,
    values: submission.answers,
    status: submission.status === "submitted" ? "submitted" : "in-progress",
  };
}

/**
 * List submissions for a form
 */
export async function listFormSubmissions(
  formId: string,
  page = 1,
  perPage = 50
): Promise<{
  data: FrontendSubmission[];
  current_page: number;
  last_page: number;
  total: number;
}> {
  const response = await apiClient.get<{
    data: BackendSubmission[];
    current_page: number;
    last_page: number;
    total: number;
  }>(`/forms/${formId}/submissions?page=${page}&per_page=${perPage}`);

  return {
    data: response.data.map(convertBackendSubmissionToFrontend),
    current_page: response.current_page,
    last_page: response.last_page,
    total: response.total,
  };
}

/**
 * Get user's submission history
 */
export async function getMySubmissions(page = 1, perPage = 50): Promise<{
  data: FrontendSubmission[];
  current_page: number;
  last_page: number;
  total: number;
}> {
  const response = await apiClient.get<{
    data: BackendSubmission[];
    current_page: number;
    last_page: number;
    total: number;
  }>(`/me/submissions?page=${page}&per_page=${perPage}`);

  return {
    data: response.data.map(convertBackendSubmissionToFrontend),
    current_page: response.current_page,
    last_page: response.last_page,
    total: response.total,
  };
}

/**
 * Submit a form (public endpoint)
 */
export async function submitForm(
  slug: string,
  data: {
    guest_token?: string;
    answers: Record<string, unknown>;
  }
): Promise<FrontendSubmission> {
  const response = await apiClient.post<{ data: BackendSubmission }>(
    `/public/forms/${slug}/submit`,
    data
  );

  return convertBackendSubmissionToFrontend(response.data);
}

/**
 * Update a submission
 */
export async function updateSubmission(
  submissionId: string,
  answers: Record<string, unknown>
): Promise<FrontendSubmission> {
  const response = await apiClient.put<{ data: BackendSubmission }>(
    `/submissions/${submissionId}`,
    { answers }
  );

  return convertBackendSubmissionToFrontend(response.data);
}


