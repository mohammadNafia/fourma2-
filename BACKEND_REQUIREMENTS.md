# Backend Requirements & Database Schema
## Complete Form Builder System Documentation

---

## 1. FEATURE SUMMARY

### ADMIN FEATURES

**Form Management:**
- Create new forms (empty or from templates)
- Edit form metadata (title, description, category)
- Delete forms
- Duplicate forms (creates a new form copy with new access key)
- Update form settings (status, multiple submissions, anonymous responses, closing date)
- Publish/unpublish forms (status: draft → published)
- Regenerate access keys for forms
- View all forms with filtering by status (draft/published)
- View form statistics (total forms, published, drafts, submissions)

**Form Builder:**
- Create and manage multiple sections per form
- Add, edit, delete, and reorder sections
- Drag-and-drop section reordering
- Edit section title and description
- Add, edit, delete, and reorder fields within sections
- Drag-and-drop field reordering (within section and across sections)
- Support for 16 field types (see Field Types below)
- Configure field properties (label, placeholder, required, help text, default value)
- Configure field validation (min, max, regex patterns)
- Configure options for choice fields (radio, checkbox, dropdown, gender)

**Template System:**
- Create templates (reusable form structures)
- Edit template metadata (name, description, category)
- Delete templates
- Duplicate templates
- Browse all templates
- Create form from template (creates draft form)
- Publish template as form (creates published form immediately with access key)
- Save existing form as template

**Analytics & Dashboard:**
- Admin dashboard with overview statistics:
  - Total forms count
  - Published forms count
  - Draft forms count
  - Total submissions across all forms
  - Average submissions per form
  - Total templates count
  - Recent forms activity
- Per-form analytics dashboard:
  - Total submissions count
  - Submitted vs in-progress submissions
  - Section-based analytics (completion rates per section)
  - Field-level analytics (response rates per field, required field tracking)
  - Daily submission trends (last 7 days)
  - Field type distribution
  - Total fields and sections count

**Access Key Management:**
- Auto-generate unique access keys (format: alphanumeric, e.g., "4H8QX21B")
- Access key uniqueness validation
- Regenerate access keys for existing forms
- Access key lookup for form retrieval

**AI Chatbot Assistant:**
- Circular floating popup button on admin page
- Chat-like interface with message history
- Text input field for user queries
- AI-powered assistant to help admins with:
  - Form creation guidance
  - Template suggestions
  - Analytics insights
  - Feature explanations
  - Troubleshooting help
  - Quick actions (create form, view analytics, etc.)
- Chat history persistence (per user session)
- Open/close chatbot popup toggle
- Message bubbles UI (user messages and bot responses)

### USER FEATURES

**Form Access:**
- Enter access key to access a form
- View form details (title, description, sections, fields)
- Form validation (check if published, check if closed)
- Test mode for admins (preview draft/closed forms)

**Form Submission:**
- Fill out forms with all supported field types
- Real-time field validation
- Save draft progress automatically
- Submit completed forms
- View submission confirmation
- Resubmit forms (if multiple submissions allowed)
- View previously submitted forms

**Form History:**
- View all accessed forms (active and submitted)
- Continue filling in-progress forms (draft restoration)
- View submitted forms
- Delete draft entries
- Track first opened date and last updated date
- Filter forms by status (in-progress, submitted)

**Draft Management:**
- Auto-save drafts (saves field values as user types)
- Restore drafts when returning to form
- Delete drafts manually
- Draft persists across sessions

### FORM BUILDER FEATURES

**Section Management:**
- Create sections with title and description
- Edit section properties
- Delete sections
- Reorder sections (drag-and-drop)
- Minimum one section required per form

**Field Management:**
- 16 supported field types (see below)
- Add fields to sections
- Edit field properties (label, placeholder, required, help text, default value, options)
- Delete fields
- Reorder fields within section
- Move fields between sections
- Configure validation rules (min, max, regex)

**Field Types Supported:**
1. **Short Text** - Single-line text input
2. **Long Text** - Multi-line textarea
3. **Radio Group** - Single choice from options
4. **Checkboxes** - Multiple choice from options
5. **Dropdown** - Select from dropdown menu
6. **Number** - Numeric input (integer/decimal)
7. **Range Slider** - Slider input with min/max
8. **Date** - Date picker
9. **Time** - Time picker
10. **Boolean** - Yes/No toggle
11. **Rating** - Star rating (1-5 or custom max)
12. **Email** - Email validation
13. **Phone** - Phone number (Iraq format: 07XXXXXXXX)
14. **File Upload** - File attachment
15. **Gender** - Gender selection dropdown

**Field Properties:**
- `label` (required) - Display name
- `placeholder` - Hint text
- `required` - Boolean, makes field mandatory
- `defaultValue` - Pre-filled value
- `helpText` - Helper text below field
- `options` - Array of strings (for radio, checkbox, dropdown, gender)
- `min` - Minimum value (for number, range, rating)
- `max` - Maximum value (for number, range, rating)
- `step` - Increment step (for number, range)
- `regex` - Pattern validation
- `validation` - Additional validation rules object

### SUBMISSION LOGIC

**Submission Process:**
- Validate all required fields before submission
- Validate field types (email format, phone format, number ranges, etc.)
- Validate custom regex patterns
- Scroll to first error on validation failure
- Create submission record with all field values
- Link submission to user (if authenticated and not anonymous)
- Track submission timestamp
- Support anonymous submissions (no user tracking)

**Multiple Submissions:**
- Configurable per form (`allowMultipleSubmissions` boolean)
- If disabled: Updates existing submission if user already submitted
- If enabled: Creates new submission each time
- Tracks all submissions per user per form

**Form Status & Access:**
- **Draft** - Not accessible to users (except admins in test mode)
- **Published** - Accessible via access key
- **Closed** - If `closingDate` is set and passed, form is closed to new submissions
- Admins can preview draft/closed forms using `?test=true` query parameter

**Draft Saving:**
- Auto-save drafts as user types
- Save draft values per field
- Restore drafts on form re-access
- Draft values stored separately from submissions
- Draft deletion option for users

### VALIDATION RULES

**Field-Level Validation:**
- Required field validation
- Email format validation
- Phone number validation (Iraq format: 07XXXXXXXX)
- Number range validation (min/max)
- Date format validation
- Time format validation (HH:MM)
- Regex pattern validation
- Rating range validation (1 to max)
- Range slider validation (min/max)
- Empty value validation for required fields
- Array length validation (for checkboxes)

**Form-Level Validation:**
- All required fields must be filled
- Field type-specific validation rules
- Submission allowed only if form is published
- Submission allowed only if form is not closed
- Submission allowed only if multiple submissions enabled OR no previous submission

### ACCESS KEY SYSTEM

**Key Generation:**
- Format: Alphanumeric uppercase (e.g., "4H8QX21B", "9M2TLD4A")
- Must be unique across all forms
- Auto-generated on form creation
- Can be regenerated manually by admin

**Key Lookup:**
- Case-insensitive lookup (converted to uppercase)
- Direct lookup by access key
- Returns form if published and not closed
- Returns null if form not found, draft, or closed

**Key Usage:**
- Users enter access key to access form
- Access key used in form URL: `/user/form/{accessKey}`
- Access key displayed in admin form list
- Access key displayed in user form history

### USER FORM HISTORY

**Tracking:**
- Tracks when user first opened form (`firstOpenedAt`)
- Tracks when user last updated form (`lastUpdatedAt`)
- Tracks form access status (`in-progress` or `submitted`)
- Links to last submission ID (if submitted)
- Stores draft values separately

**History Features:**
- View all forms user has accessed
- Filter by status (active/submitted)
- Continue in-progress forms
- View submitted forms
- Delete draft entries
- Show form status (open/closed)

---

## 2. BACKEND REQUIREMENTS SUMMARY

### AUTHENTICATION

**Endpoints Needed:**
- `POST /api/register` - User registration
  - Request: `{ name, email, password, role? }`
  - Response: `{ user: { id, name, email, role }, token, tenant?: { id } }`
- `POST /api/login` - User login
  - Request: `{ email, password }`
  - Response: `{ user: { id, name, email, role }, token, tenant?: { id } }`
- `POST /api/logout` - User logout
  - Headers: `Authorization: Bearer {token}`
- `GET /api/user` - Get current authenticated user
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ user: { id, name, email, role }, tenant?: { id } }`

**Requirements:**
- JWT token-based authentication
- Password hashing (bcrypt)
- Role-based access (admin, user)
- Tenant scoping support (optional for multi-tenancy)
- Token stored in localStorage on frontend
- Token included in all authenticated requests

### FORM CRUD OPERATIONS

**Endpoints Needed:**
- `GET /api/tenants/{tenantId}/forms` - List all forms (admin only)
  - Query params: `?status=draft|published` (optional filter)
  - Response: Array of form objects with basic metadata
  
- `GET /api/tenants/{tenantId}/forms/{formId}` - Get single form by ID
  - Response: Complete form with sections and fields
  
- `GET /api/public/forms/{accessKey}` - Get form by access key (public)
  - Response: Form with sections and fields (only if published and not closed)
  
- `POST /api/tenants/{tenantId}/forms` - Create new form
  - Request: `{ title, description?, category?, status?, sections?: [...] }`
  - Response: Created form with auto-generated access key
  
- `PUT /api/tenants/{tenantId}/forms/{formId}` - Update form metadata
  - Request: `{ title?, description?, category?, status?, allowMultipleSubmissions?, anonymousResponses?, closingDate? }`
  - Response: Updated form
  
- `DELETE /api/tenants/{tenantId}/forms/{formId}` - Delete form
  - Response: Success confirmation
  
- `POST /api/tenants/{tenantId}/forms/{formId}/duplicate` - Duplicate form
  - Response: New form (draft status) with copied sections/fields
  
- `POST /api/tenants/{tenantId}/forms/{formId}/regenerate-key` - Regenerate access key
  - Response: Form with new access key

**Requirements:**
- Auto-generate unique access keys on form creation
- Validate access key uniqueness
- Track form ownership (user_id)
- Support form status transitions (draft → published)
- Validate closing dates
- Soft delete or hard delete (specify in requirements)

### SECTION CRUD OPERATIONS

**Endpoints Needed:**
- `POST /api/tenants/{tenantId}/forms/{formId}/sections` - Add section
  - Request: `{ title, description, order? }`
  - Response: Created section
  
- `PUT /api/tenants/{tenantId}/forms/{formId}/sections/{sectionId}` - Update section
  - Request: `{ title?, description? }`
  - Response: Updated section
  
- `DELETE /api/tenants/{tenantId}/forms/{formId}/sections/{sectionId}` - Delete section
  - Response: Success confirmation
  - Note: Must prevent deletion if it's the last section
  
- `PUT /api/tenants/{tenantId}/forms/{formId}/sections/reorder` - Reorder sections
  - Request: `{ sections: [{ id, order }, ...] }`
  - Response: Success confirmation

**Requirements:**
- Sections must have order/index field
- Minimum one section per form
- Cascade delete fields when section deleted (or move to another section)
- Validate section ownership (must belong to form)

### FIELD CRUD OPERATIONS

**Endpoints Needed:**
- `POST /api/tenants/{tenantId}/forms/{formId}/sections/{sectionId}/fields` - Add field
  - Request: Field object (see Field Structure below)
  - Response: Created field
  
- `PUT /api/tenants/{tenantId}/forms/{formId}/sections/{sectionId}/fields/{fieldId}` - Update field
  - Request: Partial field object
  - Response: Updated field
  
- `DELETE /api/tenants/{tenantId}/forms/{formId}/sections/{sectionId}/fields/{fieldId}` - Delete field
  - Response: Success confirmation
  
- `PUT /api/tenants/{tenantId}/forms/{formId}/fields/reorder` - Reorder or move field
  - Request: `{ fieldId, sourceSectionId, destSectionId, sourceIndex, destIndex }`
  - Response: Success confirmation

**Field Structure (Backend Format):**
```json
{
  "type": "text|textarea|radio|checkbox|dropdown|integer|decimal|slider|date|time|boolean|rating|email|phone",
  "label": "string",
  "handle": "string (auto-generated from label)",
  "placeholder": "string?",
  "help_text": "string?",
  "is_required": boolean,
  "default_value": "string?",
  "options": [{"label": "string", "value": "string"}], // For choice fields
  "validation": {
    "min": number?,
    "max": number?,
    "pattern": "string (regex)?"
  },
  "position": number
}
```

**Requirements:**
- Fields must have position/order within section
- Support all 16 field types
- Validate field options for choice types
- Validate field validation rules
- Handle field type mapping (frontend → backend)

### TEMPLATE CRUD OPERATIONS

**Endpoints Needed:**
- `GET /api/tenants/{tenantId}/templates` - List all templates
  - Query params: `?category={category}` (optional filter)
  - Response: Array of template objects
  
- `GET /api/tenants/{tenantId}/templates/{templateId}` - Get single template
  - Response: Complete template with sections and fields
  
- `POST /api/tenants/{tenantId}/templates` - Create template
  - Request: `{ name, description?, category?, sections: [...] }`
  - Response: Created template
  
- `PUT /api/tenants/{tenantId}/templates/{templateId}` - Update template
  - Request: `{ name?, description?, category?, sections?: [...] }`
  - Response: Updated template
  
- `DELETE /api/tenants/{tenantId}/templates/{templateId}` - Delete template
  - Response: Success confirmation
  
- `POST /api/tenants/{tenantId}/templates/{templateId}/duplicate` - Duplicate template
  - Response: New template (copy)
  
- `POST /api/tenants/{tenantId}/templates/{templateId}/create-form` - Create form from template
  - Request: `{ title?, status? }` (optional overrides)
  - Response: Created form (defaults to draft)
  
- `POST /api/tenants/{tenantId}/templates/{templateId}/publish-form` - Publish template as form
  - Request: `{ title? }` (optional override)
  - Response: Created form (published status) with access key
  
- `POST /api/tenants/{tenantId}/forms/{formId}/save-as-template` - Save form as template
  - Request: `{ name, description?, category? }`
  - Response: Created template

**Requirements:**
- Templates have same structure as forms (sections + fields)
- Templates do not have submissions or access keys
- Templates can be cloned/copied
- Support template categories

### SUBMISSION HANDLING

**Endpoints Needed:**
- `POST /api/public/forms/{accessKey}/submit` - Submit form (public endpoint)
  - Request: `{ guest_token?, answers: { fieldId: value } }`
  - Response: Submission object
  
- `GET /api/tenants/{tenantId}/forms/{formId}/submissions` - List submissions (admin only)
  - Query params: `?page=1&per_page=50&status=submitted|in-progress`
  - Response: Paginated list of submissions
  
- `GET /api/tenants/{tenantId}/forms/{formId}/submissions/{submissionId}` - Get single submission
  - Response: Submission with all answers
  
- `PUT /api/public/submissions/{submissionId}` - Update submission (if editable)
  - Request: `{ answers: { fieldId: value } }`
  - Response: Updated submission
  
- `DELETE /api/tenants/{tenantId}/submissions/{submissionId}` - Delete submission (admin only)
  - Response: Success confirmation

**Requirements:**
- Validate form is published and not closed before accepting submission
- Validate all required fields are filled
- Validate field types and rules
- Support anonymous submissions (guest_token)
- Link submission to user_id if authenticated and not anonymous
- Track IP address and user agent (optional)
- Prevent duplicate submissions if `allowMultipleSubmissions` is false
- Store submission timestamp
- Support submission editing (if form allows)

### DRAFT SAVING

**Endpoints Needed:**
- `POST /api/public/forms/{accessKey}/draft` - Save draft (public endpoint)
  - Request: `{ guest_token?, values: { fieldId: value } }`
  - Response: Draft saved confirmation
  
- `GET /api/public/forms/{accessKey}/draft` - Get draft (public endpoint)
  - Request: `{ guest_token? }`
  - Response: Draft values
  
- `DELETE /api/public/forms/{accessKey}/draft` - Delete draft (public endpoint)
  - Request: `{ guest_token? }`
  - Response: Success confirmation

**Requirements:**
- Store draft per user/guest_token per form
- Draft values stored separately from submissions
- Auto-save functionality (debounced requests)
- Restore drafts when user returns to form
- Support guest users (via guest_token)

### ANALYTICS DATA

**Endpoints Needed:**
- `GET /api/tenants/{tenantId}/forms/{formId}/analytics` - Get form analytics (admin only)
  - Response: Analytics object (see Analytics Structure below)
  
- `GET /api/tenants/{tenantId}/dashboard` - Get admin dashboard stats
  - Response: Dashboard statistics (see Dashboard Structure below)

**Analytics Structure:**
```json
{
  "totalSubmissions": number,
  "submittedCount": number,
  "inProgressCount": number,
  "sections": [
    {
      "sectionId": "string",
      "sectionTitle": "string",
      "sectionDescription": "string",
      "totalFields": number,
      "fieldResponses": [
        {
          "fieldId": "string",
          "fieldLabel": "string",
          "fieldType": "string",
          "responses": number,
          "responseRate": number,
          "isRequired": boolean
        }
      ],
      "totalResponses": number,
      "avgResponseRate": number,
      "completionRate": number
    }
  ],
  "dailySubmissions": [
    {"date": "YYYY-MM-DD", "count": number}
  ],
  "fieldTypeCounts": {"type": count},
  "totalFields": number,
  "totalSections": number
}
```

**Dashboard Structure:**
```json
{
  "totalForms": number,
  "publishedForms": number,
  "draftForms": number,
  "totalSubmissions": number,
  "totalFields": number,
  "totalTemplates": number,
  "avgSubmissions": number,
  "recentForms": [/* recent form objects */]
}
```

**Requirements:**
- Calculate analytics on-the-fly or cache (performance consideration)
- Support filtering by date ranges
- Aggregate data from submissions and fields
- Support pagination for large datasets

### ACCESS KEY LOOKUP

**Endpoint Needed:**
- `GET /api/public/forms/{accessKey}` - Get form by access key (mentioned above)

**Requirements:**
- Case-insensitive lookup
- Only return form if status is "published"
- Check if form is closed (closingDate passed)
- Return 404 if form not found or not accessible
- Support test mode for admins (query param `?test=true`)

### USER FORM HISTORY TRACKING

**Endpoints Needed:**
- `GET /api/user/forms` - Get user's form history
  - Headers: `Authorization: Bearer {token}`
  - Query params: `?status=in-progress|submitted` (optional filter)
  - Response: Array of user form entries
  
- `GET /api/user/forms/{accessKey}` - Get user's form entry for specific form
  - Headers: `Authorization: Bearer {token}`
  - Response: User form entry with draft values (if exists)

**Requirements:**
- Track first opened timestamp
- Track last updated timestamp
- Track form access status (in-progress, submitted)
- Link to last submission ID
- Store draft values separately
- Support guest users (via guest_token in localStorage)

### FILE UPLOADS

**Endpoints Needed:**
- `POST /api/public/uploads` - Upload file (public endpoint for file fields)
  - Request: Multipart form data with file
  - Response: `{ url: "string", filename: "string", size: number }`
  
- `GET /api/uploads/{fileId}` - Get uploaded file
  - Response: File content

**Requirements:**
- File storage (local filesystem or cloud storage like S3)
- File size limits (configurable)
- File type validation (whitelist allowed types)
- Generate unique filenames
- Store file metadata (original filename, size, mime type, uploaded date)
- Secure file access (prevent unauthorized access)

### AI CHATBOT ASSISTANT

**Endpoints Needed:**
- `POST /api/tenants/{tenantId}/chatbot/message` - Send message to chatbot (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Request: `{ message: "string", conversation_id?: "string" }`
  - Response: `{ 
      message_id: "string",
      response: "string",
      conversation_id: "string",
      suggestions?: string[],
      quick_actions?: Array<{ label: string, action: string, params?: object }>
    }`
  
- `GET /api/tenants/{tenantId}/chatbot/conversations` - Get chat history (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Query params: `?limit=50` (optional, defaults to last 50 messages)
  - Response: `{
      conversations: [{
        conversation_id: "string",
        messages: [{
          id: "string",
          role: "user" | "assistant",
          content: "string",
          timestamp: "string",
          suggestions?: string[],
          quick_actions?: Array<{ label: string, action: string, params?: object }>
        }],
        created_at: "string",
        updated_at: "string"
      }]
    }`
  
- `POST /api/tenants/{tenantId}/chatbot/conversations/{conversationId}/clear` - Clear conversation history (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Response: Success confirmation

- `POST /api/tenants/{tenantId}/chatbot/quick-action` - Execute quick action from chatbot (admin only)
  - Headers: `Authorization: Bearer {token}`
  - Request: `{ action: "string", params?: object }`
  - Response: Action-specific response (e.g., form creation result, analytics data, etc.)

**Features & Capabilities:**
- Natural language understanding for admin queries
- Context-aware responses based on user's current activity
- Integration with form builder (suggest field types, templates, etc.)
- Integration with analytics (provide insights, summaries)
- Quick actions support:
  - Create form from template
  - View form analytics
  - Duplicate form
  - Get access key
  - Show submission statistics
  - Suggest improvements
- Conversation history per user
- Message suggestions/auto-complete
- Context memory (remembers previous conversation turns)

**Requirements:**
- Real-time message processing
- Support for conversational context (multi-turn conversations)
- Message storage (optional - for history)
- Integration with existing form/template/submission data
- Fast response times (< 2 seconds)
- Handle errors gracefully with helpful error messages
- Support for markdown formatting in bot responses
- Support for structured responses (lists, tables, etc.)
- Optional: Voice input support
- Optional: File/image sharing in chat

**Optional Database Table: `chatbot_conversations`**

**Purpose:** Store chatbot conversation history (optional - can use in-memory storage if not needed)

**Columns:**
- `id` - integer, primary key, auto-increment
- `user_id` - integer, not null, foreign key → `users.id`
- `tenant_id` - integer, nullable, foreign key → `tenants.id` (if multi-tenancy)
- `conversation_id` - varchar(255), not null, unique (UUID or similar)
- `messages` - json, not null (array of messages: `[{role: "user"|"assistant", content: string, timestamp: string}]`)
- `context` - json, nullable (stores conversation context, user preferences, etc.)
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `users` (conversation belongs to one user)
- Many-to-one with `tenants` (conversation belongs to one tenant, if multi-tenancy)

**Indexes:**
- Primary key on `id`
- Index on `user_id`
- Index on `conversation_id`
- Index on `tenant_id` (if multi-tenancy)
- Index on `updated_at` (for sorting by recent)

**Constraints:**
- Foreign key constraint on `user_id` → `users.id`
- Foreign key constraint on `tenant_id` → `tenants.id` (if multi-tenancy)
- Unique constraint on `conversation_id`

**Frontend Requirements:**
- Circular floating button (bottom-right corner, fixed position)
- Expandable chat window with:
  - Chat message history area (scrollable)
  - Input field at bottom
  - Send button
  - Close/minimize button
- Message bubbles (user messages aligned right, bot messages aligned left)
- Typing indicator when bot is processing
- Quick action buttons (if provided by backend)
- Suggestion chips (if provided by backend)
- Smooth animations for open/close
- Responsive design (mobile-friendly)
- Dark mode compatible (matches app theme)

### LOGS (Optional but Recommended)

**Requirements:**
- Log form access attempts
- Log submission attempts (success/failure)
- Log admin actions (create, update, delete forms)
- Log authentication events
- Log errors and exceptions
- Store in database or log files

---

## 3. DATABASE REQUIREMENTS

### TABLE: `users`

**Purpose:** Store user accounts (admins and regular users)

**Columns:**
- `id` - integer, primary key, auto-increment
- `name` - varchar(255), not null
- `email` - varchar(255), not null, unique
- `password` - varchar(255), not null (hashed)
- `role` - enum('admin', 'user'), not null, default 'user'
- `remember_token` - varchar(255), nullable
- `email_verified_at` - timestamp, nullable
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- One-to-many with `forms` (user creates multiple forms)
- One-to-many with `submissions` (user makes multiple submissions)
- One-to-many with `user_form_history` (user accesses multiple forms)

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `role`

---

### TABLE: `forms`

**Purpose:** Store form definitions and metadata

**Columns:**
- `id` - integer, primary key, auto-increment
- `user_id` - integer, not null, foreign key → `users.id`
- `tenant_id` - integer, nullable, foreign key → `tenants.id` (if multi-tenancy)
- `title` - varchar(255), not null
- `description` - text, nullable
- `category` - varchar(255), nullable
- `access_key` - varchar(50), not null, unique
- `status` - enum('draft', 'published'), not null, default 'draft'
- `allow_multiple_submissions` - boolean, not null, default false
- `anonymous_responses` - boolean, not null, default false
- `closing_date` - timestamp, nullable
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null
- `deleted_at` - timestamp, nullable (for soft deletes)

**Relations:**
- Many-to-one with `users` (form belongs to one user)
- One-to-many with `form_sections` (form has multiple sections)
- One-to-many with `form_submissions` (form receives multiple submissions)
- One-to-many with `user_form_history` (form accessed by multiple users)

**Indexes:**
- Primary key on `id`
- Unique index on `access_key`
- Index on `user_id`
- Index on `status`
- Index on `tenant_id` (if multi-tenancy)
- Index on `created_at` (for sorting)

**Constraints:**
- Foreign key constraint on `user_id` → `users.id`
- Foreign key constraint on `tenant_id` → `tenants.id` (if multi-tenancy)

---

### TABLE: `form_sections`

**Purpose:** Store form sections (groupings of fields)

**Columns:**
- `id` - integer, primary key, auto-increment
- `form_id` - integer, not null, foreign key → `forms.id`
- `title` - varchar(255), not null
- `description` - text, nullable
- `order` - integer, not null (position within form)
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `forms` (section belongs to one form)
- One-to-many with `form_fields` (section contains multiple fields)

**Indexes:**
- Primary key on `id`
- Index on `form_id`
- Composite index on `(form_id, order)` (for efficient ordering)

**Constraints:**
- Foreign key constraint on `form_id` → `forms.id` (cascade delete)
- Unique constraint on `(form_id, order)` (prevent duplicate order values)

---

### TABLE: `form_fields`

**Purpose:** Store individual form fields and their configurations

**Columns:**
- `id` - integer, primary key, auto-increment
- `section_id` - integer, not null, foreign key → `form_sections.id`
- `type` - varchar(50), not null (see Field Types below)
- `label` - varchar(255), not null
- `handle` - varchar(255), not null (auto-generated from label, used for field identification)
- `placeholder` - varchar(255), nullable
- `help_text` - text, nullable
- `is_required` - boolean, not null, default false
- `default_value` - text, nullable (stored as string, parsed by type)
- `options` - json, nullable (for choice fields: `[{"label": "...", "value": "..."}]`)
- `validation` - json, nullable (stores min, max, regex, etc.)
- `position` - integer, not null (order within section)
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Field Types (values for `type` column):**
- `text` (Short Text)
- `textarea` (Long Text)
- `radio`
- `checkbox`
- `dropdown`
- `integer` (Number - integer)
- `decimal` (Number - decimal)
- `slider` (Range Slider)
- `date`
- `time`
- `boolean`
- `rating`
- `email`
- `phone`
- `file` (File Upload)
- `gender` (Gender Select - stored as dropdown)

**Relations:**
- Many-to-one with `form_sections` (field belongs to one section)
- One-to-many with `submission_answers` (field has multiple answers across submissions)

**Indexes:**
- Primary key on `id`
- Index on `section_id`
- Composite index on `(section_id, position)` (for efficient ordering)
- Index on `type` (for analytics)

**Constraints:**
- Foreign key constraint on `section_id` → `form_sections.id` (cascade delete)
- Unique constraint on `(section_id, handle)` (prevent duplicate handles within section)
- Unique constraint on `(section_id, position)` (prevent duplicate order values)

**Validation JSON Structure (`validation` column):**
```json
{
  "min": number | null,
  "max": number | null,
  "pattern": "string (regex)" | null,
  "required": boolean
}
```

**Options JSON Structure (`options` column for choice fields):**
```json
[
  {"label": "Option 1", "value": "option1"},
  {"label": "Option 2", "value": "option2"}
]
```

---

### TABLE: `form_submissions`

**Purpose:** Store form submission records

**Columns:**
- `id` - integer, primary key, auto-increment
- `form_id` - integer, not null, foreign key → `forms.id`
- `form_version_id` - integer, nullable, foreign key → `form_versions.id` (if versioning implemented)
- `user_id` - integer, nullable, foreign key → `users.id` (null if anonymous)
- `guest_token` - varchar(255), nullable (for guest users)
- `ip_address` - varchar(45), nullable (IPv4 or IPv6)
- `user_agent` - text, nullable
- `status` - enum('submitted', 'in-progress', 'archived'), not null, default 'submitted'
- `is_editable` - boolean, not null, default false
- `editable_until` - timestamp, nullable
- `submitted_at` - timestamp, not null
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `forms` (submission belongs to one form)
- Many-to-one with `users` (submission belongs to one user, nullable)
- One-to-many with `submission_answers` (submission contains multiple answers)

**Indexes:**
- Primary key on `id`
- Index on `form_id`
- Index on `user_id`
- Index on `guest_token`
- Index on `status`
- Index on `submitted_at` (for analytics and sorting)
- Composite index on `(form_id, user_id)` (for checking duplicate submissions)

**Constraints:**
- Foreign key constraint on `form_id` → `forms.id`
- Foreign key constraint on `user_id` → `users.id` (nullable)
- Check constraint: Either `user_id` or `guest_token` must be set

**Note:** 
- `form_version_id` is included for future versioning support (if form structure changes after submissions are made, preserve submission schema)
- If versioning is not implemented initially, this can be nullable and ignored

---

### TABLE: `submission_answers`

**Purpose:** Store individual field answers for each submission

**Columns:**
- `id` - integer, primary key, auto-increment
- `submission_id` - integer, not null, foreign key → `form_submissions.id`
- `field_id` - integer, not null, foreign key → `form_fields.id`
- `answer` - text, nullable (stores answer value as string/JSON based on field type)
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `form_submissions` (answer belongs to one submission)
- Many-to-one with `form_fields` (answer is for one field)

**Answer Storage Format:**
- For text fields: Plain string
- For number fields: String representation of number
- For boolean: "true" or "false"
- For date/time: ISO 8601 string
- For choice fields (radio, dropdown): Selected option value
- For checkboxes: JSON array of selected values: `["value1", "value2"]`
- For file upload: File URL or file ID
- For rating: String representation of number

**Indexes:**
- Primary key on `id`
- Index on `submission_id`
- Index on `field_id`
- Composite index on `(submission_id, field_id)` (for efficient lookup)

**Constraints:**
- Foreign key constraint on `submission_id` → `form_submissions.id` (cascade delete)
- Foreign key constraint on `field_id` → `form_fields.id`
- Unique constraint on `(submission_id, field_id)` (one answer per field per submission)

---

### TABLE: `templates`

**Purpose:** Store reusable form templates

**Columns:**
- `id` - integer, primary key, auto-increment (used as `templateId` in frontend)
- `user_id` - integer, not null, foreign key → `users.id`
- `tenant_id` - integer, nullable, foreign key → `tenants.id` (if multi-tenancy)
- `name` - varchar(255), not null
- `description` - text, nullable
- `category` - varchar(255), nullable
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null
- `deleted_at` - timestamp, nullable (for soft deletes)

**Relations:**
- Many-to-one with `users` (template belongs to one user)
- One-to-many with `template_sections` (template has multiple sections)

**Indexes:**
- Primary key on `id`
- Index on `user_id`
- Index on `category`
- Index on `tenant_id` (if multi-tenancy)

**Constraints:**
- Foreign key constraint on `user_id` → `users.id`
- Foreign key constraint on `tenant_id` → `tenants.id` (if multi-tenancy)

---

### TABLE: `template_sections`

**Purpose:** Store template sections (same structure as form sections)

**Columns:**
- `id` - integer, primary key, auto-increment
- `template_id` - integer, not null, foreign key → `templates.id`
- `title` - varchar(255), not null
- `description` - text, nullable
- `order` - integer, not null
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `templates` (section belongs to one template)
- One-to-many with `template_fields` (section contains multiple fields)

**Indexes:**
- Primary key on `id`
- Index on `template_id`
- Composite index on `(template_id, order)`

**Constraints:**
- Foreign key constraint on `template_id` → `templates.id` (cascade delete)
- Unique constraint on `(template_id, order)`

---

### TABLE: `template_fields`

**Purpose:** Store template fields (same structure as form fields)

**Columns:**
- `id` - integer, primary key, auto-increment
- `section_id` - integer, not null, foreign key → `template_sections.id`
- `type` - varchar(50), not null
- `label` - varchar(255), not null
- `handle` - varchar(255), not null
- `placeholder` - varchar(255), nullable
- `help_text` - text, nullable
- `is_required` - boolean, not null, default false
- `default_value` - text, nullable
- `options` - json, nullable
- `validation` - json, nullable
- `position` - integer, not null
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `template_sections` (field belongs to one section)

**Indexes:**
- Primary key on `id`
- Index on `section_id`
- Composite index on `(section_id, position)`

**Constraints:**
- Foreign key constraint on `section_id` → `template_sections.id` (cascade delete)
- Unique constraint on `(section_id, handle)`
- Unique constraint on `(section_id, position)`

---

### TABLE: `user_form_history`

**Purpose:** Track user's interaction with forms (access, drafts, submissions)

**Columns:**
- `id` - integer, primary key, auto-increment
- `form_id` - integer, not null, foreign key → `forms.id`
- `user_id` - integer, nullable, foreign key → `users.id` (null if guest)
- `guest_token` - varchar(255), nullable (for guest users)
- `access_key` - varchar(50), not null (duplicate for easy lookup)
- `status` - enum('in-progress', 'submitted'), not null, default 'in-progress'
- `first_opened_at` - timestamp, not null
- `last_updated_at` - timestamp, not null
- `last_submission_id` - integer, nullable, foreign key → `form_submissions.id`
- `draft_values` - json, nullable (stores field values: `{fieldId: value}`)
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `forms` (history entry belongs to one form)
- Many-to-one with `users` (history entry belongs to one user, nullable)
- Many-to-one with `form_submissions` (links to last submission, nullable)

**Indexes:**
- Primary key on `id`
- Index on `form_id`
- Index on `user_id`
- Index on `guest_token`
- Index on `access_key`
- Index on `status`
- Composite index on `(user_id, access_key)` OR `(guest_token, access_key)` (for efficient lookup)
- Index on `last_updated_at` (for sorting)

**Constraints:**
- Foreign key constraint on `form_id` → `forms.id`
- Foreign key constraint on `user_id` → `users.id` (nullable)
- Foreign key constraint on `last_submission_id` → `form_submissions.id` (nullable)
- Check constraint: Either `user_id` or `guest_token` must be set
- Unique constraint on `(user_id, access_key)` OR `(guest_token, access_key)` (one entry per user/guest per form)

---

### TABLE: `form_files` (Optional - if file uploads are stored in database)

**Purpose:** Store metadata for uploaded files

**Columns:**
- `id` - integer, primary key, auto-increment
- `submission_id` - integer, nullable, foreign key → `form_submissions.id` (if file is part of submission)
- `field_id` - integer, not null, foreign key → `form_fields.id`
- `form_id` - integer, not null, foreign key → `forms.id`
- `original_filename` - varchar(255), not null
- `stored_filename` - varchar(255), not null (unique filename on server)
- `file_path` - varchar(500), not null (path to file on server or cloud URL)
- `mime_type` - varchar(100), not null
- `file_size` - integer, not null (in bytes)
- `uploaded_by_user_id` - integer, nullable, foreign key → `users.id`
- `uploaded_by_guest_token` - varchar(255), nullable
- `uploaded_at` - timestamp, not null
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `form_submissions` (file belongs to one submission, nullable)
- Many-to-one with `form_fields` (file is for one field)
- Many-to-one with `forms` (file belongs to one form)
- Many-to-one with `users` (file uploaded by one user, nullable)

**Indexes:**
- Primary key on `id`
- Index on `submission_id`
- Index on `field_id`
- Index on `form_id`
- Unique index on `stored_filename`
- Index on `uploaded_at`

**Constraints:**
- Foreign key constraint on `submission_id` → `form_submissions.id` (nullable)
- Foreign key constraint on `field_id` → `form_fields.id`
- Foreign key constraint on `form_id` → `forms.id`
- Foreign key constraint on `uploaded_by_user_id` → `users.id` (nullable)

**Note:** Alternatively, files can be stored in cloud storage (S3, etc.) and only URLs stored in `submission_answers.answer` column. This table is optional if using cloud storage.

---

### TABLE: `tenants` (Optional - if multi-tenancy is required)

**Purpose:** Support multi-tenant architecture

**Columns:**
- `id` - integer, primary key, auto-increment
- `name` - varchar(255), not null
- `slug` - varchar(255), not null, unique
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- One-to-many with `users` (tenant has multiple users)
- One-to-many with `forms` (tenant has multiple forms)
- One-to-many with `templates` (tenant has multiple templates)

**Indexes:**
- Primary key on `id`
- Unique index on `slug`

---

### TABLE: `form_versions` (Optional - for form versioning)

**Purpose:** Store form structure snapshots for versioning

**Columns:**
- `id` - integer, primary key, auto-increment
- `form_id` - integer, not null, foreign key → `forms.id`
- `version_number` - integer, not null
- `structure_snapshot` - json, not null (stores complete form structure: sections + fields)
- `created_at` - timestamp, not null
- `updated_at` - timestamp, not null

**Relations:**
- Many-to-one with `forms` (version belongs to one form)
- One-to-many with `form_submissions` (version used by multiple submissions)

**Indexes:**
- Primary key on `id`
- Index on `form_id`
- Composite index on `(form_id, version_number)`

**Constraints:**
- Foreign key constraint on `form_id` → `forms.id`
- Unique constraint on `(form_id, version_number)`

**Note:** This table is optional and can be implemented later if form versioning is needed (to preserve submission schema when form structure changes).

---

## 4. ERD SUMMARY

### Entity-Relationship Diagram Structure

**Core Entities:**
1. **users** (Primary Key: `id`)
2. **forms** (Primary Key: `id`, Foreign Key: `user_id` → `users.id`)
3. **form_sections** (Primary Key: `id`, Foreign Key: `form_id` → `forms.id`)
4. **form_fields** (Primary Key: `id`, Foreign Key: `section_id` → `form_sections.id`)
5. **form_submissions** (Primary Key: `id`, Foreign Key: `form_id` → `forms.id`, Foreign Key: `user_id` → `users.id` (nullable))
6. **submission_answers** (Primary Key: `id`, Foreign Key: `submission_id` → `form_submissions.id`, Foreign Key: `field_id` → `form_fields.id`)
7. **templates** (Primary Key: `id`, Foreign Key: `user_id` → `users.id`)
8. **template_sections** (Primary Key: `id`, Foreign Key: `template_id` → `templates.id`)
9. **template_fields** (Primary Key: `id`, Foreign Key: `section_id` → `template_sections.id`)
10. **user_form_history** (Primary Key: `id`, Foreign Key: `form_id` → `forms.id`, Foreign Key: `user_id` → `users.id` (nullable), Foreign Key: `last_submission_id` → `form_submissions.id` (nullable))

**Optional Entities:**
11. **form_files** (Primary Key: `id`, Foreign Keys: `submission_id`, `field_id`, `form_id`, `uploaded_by_user_id`)
12. **tenants** (Primary Key: `id`) - if multi-tenancy is required
13. **form_versions** (Primary Key: `id`, Foreign Key: `form_id` → `forms.id`) - if versioning is required
14. **chatbot_conversations** (Primary Key: `id`, Foreign Key: `user_id` → `users.id`) - if conversation history is stored in database

### Relationships:

**One-to-Many:**
- `users` → `forms` (One user creates many forms)
- `users` → `form_submissions` (One user makes many submissions)
- `users` → `templates` (One user creates many templates)
- `users` → `user_form_history` (One user has many history entries)
- `forms` → `form_sections` (One form has many sections)
- `forms` → `form_submissions` (One form receives many submissions)
- `forms` → `user_form_history` (One form accessed by many users)
- `form_sections` → `form_fields` (One section contains many fields)
- `form_submissions` → `submission_answers` (One submission contains many answers)
- `templates` → `template_sections` (One template has many sections)
- `template_sections` → `template_fields` (One section contains many fields)
- `form_submissions` → `user_form_history` (One submission linked to history entry)

**Many-to-One:**
- `form_fields` → `submission_answers` (Many answers reference one field)
- `form_submissions` → `submission_answers` (Many answers belong to one submission)

**Cascade Deletes:**
- When `form` is deleted → cascade delete `form_sections`, `form_submissions`, `user_form_history`
- When `form_section` is deleted → cascade delete `form_fields`
- When `form_submission` is deleted → cascade delete `submission_answers`
- When `template` is deleted → cascade delete `template_sections`
- When `template_section` is deleted → cascade delete `template_fields`
- When `user` is deleted → cascade delete or set null (depending on business rules) for `form_submissions.user_id`, `user_form_history.user_id`

### Key Constraints:

1. **Access Key Uniqueness:** `forms.access_key` must be unique across all forms
2. **Section Order:** Within each form, section `order` values must be unique
3. **Field Order:** Within each section, field `position` values must be unique
4. **Submission Uniqueness:** If `allow_multiple_submissions` is false, enforce one submission per user per form (handled at application level, not DB constraint)
5. **User/Guest Token:** Either `user_id` or `guest_token` must be set in `form_submissions` and `user_form_history`
6. **Answer Uniqueness:** One answer per field per submission (`(submission_id, field_id)` unique constraint)

---

## 5. EXTRA RECOMMENDATIONS

### A. Performance Considerations

1. **Indexing Strategy:**
   - Index frequently queried columns (`status`, `access_key`, `user_id`, `form_id`)
   - Composite indexes for multi-column queries (`(form_id, user_id)`, `(section_id, position)`)
   - Consider partial indexes for filtered queries (e.g., only published forms)

2. **Query Optimization:**
   - Use eager loading for related data (sections + fields when loading form)
   - Paginate large result sets (submissions list, analytics)
   - Cache analytics data if calculations are expensive
   - Consider materialized views for dashboard statistics

3. **Database Scaling:**
   - Consider read replicas for analytics queries
   - Archive old submissions if needed (move to separate table)
   - Partition large tables by date if needed (e.g., `form_submissions`)

### B. Security Considerations

1. **Access Control:**
   - Implement row-level security (users can only access their own forms/data)
   - Validate tenant isolation in multi-tenant setup
   - Prevent SQL injection (use parameterized queries)
   - Sanitize user inputs before storing

2. **File Upload Security:**
   - Validate file types (whitelist approach)
   - Scan files for viruses/malware
   - Limit file sizes
   - Store files outside web root
   - Generate unique filenames to prevent path traversal
   - Implement secure file download URLs (signed URLs with expiration)

3. **API Security:**
   - Rate limiting on public endpoints (prevent abuse)
   - CORS configuration
   - API authentication tokens with expiration
   - Guest token generation (secure random tokens)

### C. Data Integrity

1. **Validation:**
   - Enforce minimum one section per form (application level)
   - Enforce minimum one field per section (application level)
   - Validate field options for choice fields (must have at least 2 options)
   - Validate closing date (must be in future when setting)

2. **Data Consistency:**
   - Use database transactions for multi-table operations (e.g., creating form with sections and fields)
   - Handle race conditions (access key generation, submission uniqueness)
   - Consider optimistic locking for concurrent edits

3. **Audit Trail:**
   - Track form structure changes (who changed what and when)
   - Track submission modifications (if editable)
   - Log admin actions for compliance

### D. Additional Features to Consider

1. **Form Versioning:**
   - If form structure changes after submissions, preserve submission schema using `form_versions` table
   - Link submissions to specific form version
   - Display historical form structure when viewing old submissions

2. **Conditional Logic:**
   - Show/hide fields based on other field values
   - Skip sections based on conditions
   - Requires additional `conditions` column in `form_fields` table (JSON)

3. **Email Notifications:**
   - Send confirmation email to user after submission
   - Send notification to admin when form is submitted
   - Requires `email_settings` JSON column in `forms` table

4. **Form Sharing:**
   - Public form links (in addition to access keys)
   - Password-protected forms
   - Time-limited access
   - Requires additional columns: `public_slug`, `password_hash`, `access_expires_at`

5. **Submission Editing:**
   - Allow users to edit their submissions after submission
   - Time-limited editing window
   - Track edit history
   - Already partially supported via `is_editable` and `editable_until` columns

6. **Analytics Export:**
   - Export submissions as CSV/Excel
   - Export analytics reports
   - Scheduled exports

7. **Form Templates Marketplace:**
   - Share templates publicly
   - Template categories and tags
   - Template ratings/reviews

8. **Integration APIs:**
   - Webhook support (send submission data to external URLs)
   - API keys for programmatic access
   - Zapier/Integromat integrations

### E. Migration Strategy

1. **Phased Rollout:**
   - Start with basic CRUD operations
   - Add analytics incrementally
   - Add advanced features later

2. **Backward Compatibility:**
   - Maintain API versioning (`/api/v1/...`)
   - Support both access keys and slugs (if migrating)
   - Graceful handling of missing optional fields

3. **Data Migration:**
   - If migrating from existing system, create migration scripts
   - Test migration on staging environment
   - Backup data before migration

---

## SUMMARY

This document provides a complete specification for the backend implementation of the Form Builder system. The backend must support:

- **Authentication** with JWT tokens and role-based access
- **Form CRUD** with access keys, status management, and settings
- **Section & Field CRUD** with ordering and validation
- **Template System** for reusable form structures
- **Submission Handling** with validation, multiple submissions, and anonymous support
- **Draft Saving** for in-progress forms
- **Analytics** with section and field-level insights
- **User History Tracking** for form access and drafts
- **File Uploads** with secure storage
- **AI Chatbot Assistant** for admin support and quick actions
- **Database Schema** with 10 core tables (plus 4 optional tables)

The database design follows a normalized structure with proper foreign keys, indexes, and constraints to ensure data integrity and performance.

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-22  
**Prepared for:** Backend Development Team

