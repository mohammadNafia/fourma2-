# API Integration Guide

This document explains how the frontend integrates with the Laravel backend API.

## Overview

The frontend has been integrated with a Laravel backend API that follows REST conventions with tenant scoping. The integration maintains backward compatibility with the existing mock system while providing a path to full API integration.

## Architecture

### API Client (`lib/api/client.ts`)

The base API client handles:
- Authentication token management (stored in localStorage)
- Tenant ID management
- Request/response formatting
- Error handling with custom `ApiError` class
- Automatic token injection in headers

### Field Type Mapping (`lib/api/field-mapper.ts`)

Maps between frontend and backend field types:
- Frontend uses types like `shortText`, `longText`, etc.
- Backend uses types like `text`, `textarea`, etc.
- Handles options format conversion (string[] ↔ {label, value}[])
- Handles validation format conversion

### API Services

- **`lib/api/auth.ts`**: Authentication (login, register, logout, getCurrentUser)
- **`lib/api/forms.ts`**: Form management (CRUD, publish, duplicate, analytics)
- **`lib/api/submissions.ts`**: Submission management (list, submit, update)
- **`lib/api/templates.ts`**: Template management (CRUD)

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_USE_API=true
```

### Switching Between Mock and API Mode

The system currently supports both modes:
- **Mock Mode**: Uses in-memory state (current default)
- **API Mode**: Uses Laravel backend (when `NEXT_PUBLIC_USE_API=true`)

To fully migrate to API mode, you'll need to:
1. Update `components/shared/forms-store.tsx` to use API calls
2. Replace `MockAuthProvider` with `AuthProvider` in `app/layout.tsx`
3. Update login/register pages to use the new auth API

## Authentication Flow

1. User logs in via `/api/login` endpoint
2. Backend returns `{ user, token, tenant }`
3. Token is stored in localStorage
4. Token is automatically included in all subsequent API requests
5. On logout, token is cleared

## Tenant Scoping

All tenant-scoped endpoints require the tenant ID in the path:
- `/api/tenants/{tenant}/forms`
- `/api/tenants/{tenant}/templates`

The tenant ID is automatically retrieved from the authenticated user's response and stored in localStorage.

## Field Type Mapping

| Frontend | Backend |
|---------|---------|
| `shortText` | `text` |
| `longText` | `textarea` |
| `number` | `integer` |
| `range` | `slider` |
| `gender` | `dropdown` |
| `file` | `text` (handled separately) |

## Error Handling

The API client throws `ApiError` exceptions with:
- `status`: HTTP status code
- `message`: Error message
- `errors`: Field-level validation errors (if available)

Example error handling:

```typescript
try {
  await createForm(tenantId, formData);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 422) {
      // Show validation errors
      console.log(error.errors);
    }
  }
}
```

## Usage Examples

### Creating a Form

```typescript
import { createForm } from "@/lib/api/forms";
import { apiClient } from "@/lib/api/client";

const tenantId = apiClient.getTenantId();
if (!tenantId) throw new Error("Not authenticated");

const form = await createForm(tenantId, {
  title: "My Form",
  fields: [
    {
      id: "1",
      type: "shortText",
      label: "Name",
      required: true,
    },
  ],
});
```

### Submitting a Form

```typescript
import { submitForm } from "@/lib/api/submissions";

const submission = await submitForm("form-slug", {
  answers: {
    name: "John Doe",
    email: "john@example.com",
  },
});
```

### Updating Form Builder

```typescript
import { updateFormBuilder } from "@/lib/api/forms";

await updateFormBuilder(formId, [
  {
    id: "1",
    type: "shortText",
    label: "Name",
    required: true,
  },
]);
```

## Migration Checklist

- [x] Create API client infrastructure
- [x] Create field type mapper
- [x] Create API service functions
- [x] Create new AuthProvider
- [ ] Update forms-store to use API calls
- [ ] Update login/register pages
- [ ] Update all form operations to use API
- [ ] Update submission handling
- [ ] Test all CRUD operations
- [ ] Handle error states
- [ ] Add loading states
- [ ] Update route guards

## Notes

- The backend uses form slugs instead of access keys. The frontend maps slugs to access keys for backward compatibility.
- Form versions are handled automatically by the backend when editing published forms with submissions.
- Submissions reference both `form_id` and `form_version_id` to preserve schema snapshots.

