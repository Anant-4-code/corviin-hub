# CORVIIN HUB — Technical Requirements Document (TRD)

**Document ID:** CH-TRD-001  
**Version:** 1.0  
**Status:** Draft for architecture and engineering review  
**Date:** 5 November 2026  
**Platforms:** PC Web + Android APK  
**Related documents:** CORVIIN HUB PRD v1.0; Updated Feature Scope v1.1; Web & Mobile Architecture and Flow v1.0

---

## 1. Purpose and technical objectives

This document translates CORVIIN HUB product requirements into an implementable technical architecture for a responsive web application and Android APK sharing one client codebase.

Technical objectives:
1. Maintain one React client for browser and Android delivery.
2. Provide a modular backend API with server-enforced workspace isolation.
3. Use a relational data model for operational records and relationships.
4. Store uploaded files in private object storage rather than database blobs.
5. Preserve audit history and workflow transitions.
6. Keep CRM, tasks, campaigns, calendars and meetings linked through stable identifiers.
7. Support future members, configurable workflows and additional modules.
8. Make mobile actions reliable on variable networks and Android devices.

## 2. Proposed technology stack

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Frontend | React + TypeScript | Shared application UI |
| Build tooling | Vite | Development and production builds |
| Styling | Tailwind CSS + shared design tokens | Responsive visual system |
| Routing | React Router | Route and nested module navigation |
| Server state | TanStack Query | API cache, mutation and refetch |
| Local UI state | Zustand or React Context for limited global state | UI-only state |
| Forms | React Hook Form | Form state and validation |
| Validation/contracts | Zod | Client-side schema validation and shared validation |
| Mobile runtime | Capacitor (Android) | Package web client as Android app |
| Backend | Node.js + NestJS | Modular REST API and business logic |
| API contract | REST + OpenAPI/Swagger | Typed and documented API |
| Database | PostgreSQL | Persistent relational data |
| ORM | Prisma | Data access, schema and migrations |
| File storage | Private S3-compatible storage (e.g. Cloudflare R2 or AWS S3) | Asset binaries |
| Push notifications | Firebase Cloud Messaging | Android push delivery |
| Realtime (optional initially) | Socket.IO/WebSockets | Live updates and notification delivery |
| Testing | Vitest, React Testing Library, Jest/Supertest, Playwright | Unit, integration and end-to-end tests |
| CI | GitHub Actions or equivalent | Lint, test, build and deployment pipeline |

This is the recommended baseline, not a claim that every optional library must be adopted. Confirm current versions and provider pricing before implementation.

## 3. System context and architecture

### 3.1 Logical architecture

```text
                 ┌─────────────────────────────┐
                 │         Users               │
                 │  PC Browser / Android App   │
                 └──────────────┬──────────────┘
                                │ HTTPS
                  ┌─────────────▼──────────────┐
                  │       React Client        │
                  │       React + Vite         │
                  │  Responsive web interface │
                  └─────────────┬──────────────┘
                                │
                     ┌──────────▼──────────┐
                     │ Capacitor Android   │
                     │ Native container    │
                     └──────────┬──────────┘
                                │ HTTPS API
                  ┌─────────────▼──────────────┐
                  │        NestJS API         │
                  │ Auth / Workspace Guard   │
                  │ Domain Modules / Services │
                  └──────┬──────────┬─────────┘
                         │          │
             ┌───────────▼───┐  ┌───▼────────────────┐
             │ PostgreSQL   │  │ Private Object     │
             │ + Prisma     │  │ Storage (S3 API)   │
             └──────────────┘  └────────────────────┘
                         │
                  ┌──────▼────────┐
                  │ Background    │
                  │ Jobs / FCM    │
                  │ / Email later │
                  └───────────────┘
```

The browser uses the React client directly. The Android APK embeds the same built client through Capacitor. Both call the same backend APIs. The Android application is a native shell around a web UI; it is not a separately developed Kotlin UI.

### 3.2 Architectural style

Use a **modular monolith** for the initial backend:
- One deployable NestJS API.
- Clear domain modules and service boundaries.
- Shared PostgreSQL database.
- Background job processing separated logically from HTTP request handling.
- Avoid microservices until scale, team ownership or deployment needs justify them.

### 3.3 Environment separation

Maintain at least:
- Local development.
- Staging/test.
- Production.

Each environment must have separate credentials, database, storage bucket/container and push configuration. Never use production secrets in local development or commit secrets to source control.

## 4. Repository and package structure

Recommended monorepo:

```text
corviin-hub/
├── apps/
│   ├── client/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── routes/
│   │   │   ├── layouts/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── tasks/
│   │   │   │   ├── plans-goals/
│   │   │   │   ├── calendar/
│   │   │   │   ├── campaigns/
│   │   │   │   ├── assets/
│   │   │   │   ├── crm/
│   │   │   │   ├── meetings/
│   │   │   │   ├── team/
│   │   │   │   └── settings/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   ├── schemas/
│   │   │   ├── styles/
│   │   │   └── utils/
│   │   ├── android/
│   │   ├── public/
│   │   ├── capacitor.config.ts
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── workspaces/
│       │   ├── tasks/
│       │   ├── plans/
│       │   ├── goals/
│       │   ├── campaigns/
│       │   ├── assets/
│       │   ├── crm/
│       │   ├── meetings/
│       │   ├── calendar/
│       │   ├── notifications/
│       │   ├── activity/
│       │   ├── common/
│       │   └── database/
│       └── package.json
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── contracts/
│       │   ├── enums/
│       │   ├── schemas/
│       │   └── types/
│       └── package.json
├── infrastructure/
│   ├── deployment/
│   └── scripts/
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   └── API.md
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

Use a workspace-capable package manager such as pnpm or npm workspaces. Keep the Android project under the client app because it packages that client.

## 5. Frontend technical requirements

### 5.1 Application shell

Implement:
- Authenticated route boundary.
- Workspace selection and workspace context.
- Desktop collapsible sidebar.
- Mobile bottom navigation and More menu.
- Global search entry point.
- Notification centre.
- User/profile menu.
- Contextual create menu.
- Consistent page header, breadcrumbs and loading/error boundaries.

### 5.2 Responsive component strategy

Use shared components with responsive variants rather than duplicated page implementations.

Examples:
- `ResponsiveRecordList`: desktop table/list, mobile cards.
- `ResponsiveFilters`: inline desktop filters, mobile filter drawer.
- `RecordDetailLayout`: desktop tabs/side panel, mobile stacked sections.
- `QuickActionBar`: desktop toolbar, mobile sticky or bottom action area.
- `ResponsiveCalendar`: desktop grid/agenda, mobile agenda-first.

Do not force wide data grids into phone widths. Use a deliberately selected set of fields for mobile cards.

### 5.3 State management

Separate:
- **Server state:** fetched records, cache, invalidation and optimistic updates via TanStack Query.
- **UI state:** open dialogs, selected tab, expanded panels, temporary filters.
- **Form state:** React Hook Form with schema validation.
- **Session/workspace state:** authenticated identity and active workspace, refreshed from trusted server responses.

Do not treat browser local storage as the authority for permissions or workspace membership.

### 5.4 Frontend route model

Suggested routes:

```text
/login
/workspace/select
/app/:workspaceSlug/dashboard
/app/:workspaceSlug/my-tasks
/app/:workspaceSlug/tasks
/app/:workspaceSlug/tasks/:taskId
/app/:workspaceSlug/plans-goals
/app/:workspaceSlug/goals/:goalId
/app/:workspaceSlug/plans/:planId
/app/:workspaceSlug/calendar/content
/app/:workspaceSlug/calendar/team-tasks
/app/:workspaceSlug/calendar/meetings-visits
/app/:workspaceSlug/campaigns
/app/:workspaceSlug/campaigns/:campaignId
/app/:workspaceSlug/assets
/app/:workspaceSlug/crm/tech
/app/:workspaceSlug/crm/real-estate/partners
/app/:workspaceSlug/crm/real-estate/buyers
/app/:workspaceSlug/crm/records/:recordId
/app/:workspaceSlug/meetings
/app/:workspaceSlug/meetings/:meetingId
/app/:workspaceSlug/team
/app/:workspaceSlug/settings
```

Route guards improve navigation but do not replace backend authorisation.

## 6. Backend architecture

### 6.1 NestJS modules

| Module | Responsibility |
|---|---|
| AuthModule | Authentication, session/token lifecycle |
| UsersModule | User profiles and account state |
| WorkspacesModule | Workspaces, memberships and access |
| TasksModule | Tasks, checklist, work sessions, comments |
| PlansModule | Plans, milestones and risks |
| GoalsModule | Goals, measures and progress |
| CampaignsModule | Campaign records, stages and stage history |
| AssetsModule | File metadata, upload authorisation, versions and links |
| CrmModule | CRM record types, pipelines, interactions and follow-ups |
| MeetingsModule | Meetings, visits, participants, notes and action items |
| CalendarModule | Calendar query aggregation and event views |
| NotificationsModule | In-app and push notification records |
| ActivityModule | Audit/activity event creation and retrieval |
| DatabaseModule | Prisma client and transaction helpers |

Controllers should validate inputs and delegate business rules to services. Avoid embedding business logic in controllers or frontend components.

### 6.2 API conventions

- REST API under `/api/v1`.
- JSON request/response bodies.
- ISO 8601 timestamps in UTC at API boundaries; render in the user's configured timezone.
- UUID identifiers.
- Consistent pagination, sorting and filtering.
- DTO/schema validation on every write endpoint.
- OpenAPI documentation generated from NestJS.
- Standard error response shape with machine-readable code and human-readable message.
- Idempotency keys for operations that may be retried and must not duplicate effects, where applicable.

Example error structure:

```json
{
  "statusCode": 403,
  "code": "WORKSPACE_ACCESS_DENIED",
  "message": "You do not have access to this workspace.",
  "requestId": "request-id"
}
```

### 6.3 API response conventions

Use a consistent response envelope only if the team chooses it globally. A suggested paginated response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 0,
    "hasNextPage": false
  }
}
```

Do not return private storage credentials, password hashes, refresh tokens or internal secrets in API responses.

## 7. Authentication and authorisation

### 7.1 Authentication

Select one supported authentication strategy before implementation:
- Managed identity provider, or
- Backend-managed secure session/authentication.

For browser clients, prefer secure, HttpOnly, Secure, SameSite cookies where the deployment topology supports them. If bearer tokens are used for native clients, define short-lived access tokens, refresh-token rotation, revocation and secure storage. Avoid long-lived credentials in local storage.

### 7.2 Authorisation model

Initial release:
- Authenticated user.
- Workspace membership check.
- Equal operational permissions for the three initial members.

Future-ready:
- Workspace roles and permission grants.
- Record-level ownership/assignment rules if required later.
- Restricted actions for destructive operations and settings.

### 7.3 Workspace enforcement

For every workspace-scoped request:
1. Authenticate the user.
2. Resolve the requested workspace.
3. Verify active membership.
4. Apply `workspaceId` to every database query and mutation.
5. Validate that linked records belong to the same workspace, unless an explicitly supported cross-workspace relationship is designed.
6. Record the actor in the audit event.

Never trust a client-supplied `workspaceId` without verifying membership. Avoid fetching a record by ID alone and checking workspace only in the UI.

### 7.4 Data isolation options

Use application-level mandatory workspace scoping in repository/service methods. Consider PostgreSQL Row-Level Security as defence in depth after the connection/session strategy is designed and tested. RLS must not be added superficially; pooled connections must set and clear tenant context safely.

## 8. Data model

The following is a logical model, not a final Prisma schema. Confirm field nullability, deletion behaviour and indexing during implementation.

### 8.1 Core entities

**User**
- id, displayName, email/username, phone (optional), avatar (optional), accountStatus, createdAt, updatedAt.

**Workspace**
- id, name, slug, workspaceType, status, settings, createdAt.

**WorkspaceMember**
- id, workspaceId, userId, role, membershipStatus, joinedAt.
- Unique constraint on `(workspaceId, userId)`.

**Task**
- id, workspaceId, title, description, creatorId, assigneeId, status, priority, progress, plannedStartAt, dueAt, actualStartedAt, completedAt, completionNote, createdAt, updatedAt, archivedAt.

**TaskChecklistItem**
- id, taskId, title, isCompleted, position, completedBy, completedAt.

**TaskWorkSession**
- id, taskId, userId, startedAt, pausedAt, resumedAt, endedAt, createdAt.
- Prefer a session-event model or multiple session rows to retain multiple pause/resume cycles accurately.

**TaskScheduleHistory**
- id, taskId, previousStartAt, newStartAt, previousDueAt, newDueAt, changedBy, reason, changedAt.

**TaskComment**
- id, taskId, authorId, body, createdAt, updatedAt.

**Goal**
- id, workspaceId, title, description, expectedOutcome, ownerId, startAt, targetAt, priority, status, measurementType, targetValue, currentValue, progressMode, manualProgress, createdAt, updatedAt.

**Plan**
- id, workspaceId, title, strategy, description, ownerId, startAt, targetAt, status, createdAt, updatedAt.

**PlanMilestone**
- id, planId, title, description, dueAt, status, completedAt.

**Campaign**
- id, workspaceId, title, description, objective, audience, category, platform, ownerId, stage, status, startAt, targetPublishAt, progress, createdAt, updatedAt, archivedAt.

**CampaignStageHistory**
- id, campaignId, fromStage, toStage, changedBy, changedAt, note.

**CampaignContent**
- id, campaignId, title, contentType, script/copy fields, plannedPublishAt, actualPublishAt, publicUrl, status, createdAt, updatedAt.
- Decide whether content is a distinct entity or represented as campaign-linked production records; do not overload the Campaign table with every content revision.

**Asset**
- id, workspaceId, storageKey, originalFileName, mimeType, sizeBytes, category, description, uploaderId, uploadedAt, checksum, currentVersionId, deletedAt.

**AssetVersion**
- id, assetId, versionNumber, storageKey, sizeBytes, mimeType, uploadedBy, createdAt, changeNote.

**AssetLink**
- id, assetId, linkedEntityType, linkedEntityId, campaignStage (optional), linkedBy, createdAt.
- Validate linked entity workspace equality in the service layer.

**CrmRecord**
- id, workspaceId, crmType, recordCategory, displayName, companyName, phone, email, source, assignedToId, pipelineStage, status, nextFollowUpAt, createdBy, createdAt, updatedAt, archivedAt.
- Use typed extension tables or structured validated JSON for record-type-specific fields. For high-value searchable fields, prefer relational columns rather than opaque JSON.

**CrmInteraction**
- id, workspaceId, crmRecordId, interactionType, subject, body, occurredAt, createdBy, outcome, metadata.
- Interaction types may include call, message, email, note, meeting, site visit, stage change and follow-up completion.

**CrmFollowUp**
- id, workspaceId, crmRecordId, title, dueAt, assignedToId, status, priority, linkedTaskId (optional), createdBy, completedAt.

**RealEstatePartnerDetails**
- crmRecordId, partnerType, location, project/service requirements and other validated fields.

**RealEstateBuyerDetails**
- crmRecordId, preferredContact, locality, propertyType, configuration, budgetMin, budgetMax, timeline, purpose, preferredProjectId (if project entity is implemented).

**TechLeadDetails**
- crmRecordId, enquiryCategory, businessType, service, requirement, budget and other technology-specific fields.

**Meeting**
- id, workspaceId, title, meetingType, startAt, endAt, location, meetingUrl, organiserId, status, agenda, objective, notes, outcome, createdBy, createdAt, updatedAt.

**MeetingParticipant**
- id, meetingId, userId (optional), externalName, externalContact, participantType, responseStatus.

**MeetingDecision**
- id, meetingId, title, description, ownerId, dueAt, createdBy, createdAt.

**MeetingActionItem**
- id, meetingId, title, description, assigneeId, dueAt, priority, status, linkedTaskId.

**SiteVisit**
- id, workspaceId, crmRecordId, project/property reference, scheduledAt, location, responsibleMemberId, confirmationStatus, outcome, feedback, completedAt.

**Notification**
- id, workspaceId, recipientId, type, title, body, linkedEntityType, linkedEntityId, readAt, createdAt, deliveryStatus.

**ActivityEvent**
- id, workspaceId, actorId, entityType, entityId, action, beforeData, afterData, reason, createdAt, requestId.

### 8.2 Relationship rules

- Workspace has many memberships and operational records.
- User can belong to many workspaces.
- Task has one assignee and one creator; it can link to multiple supported records through explicit relation tables where needed.
- Campaign has stage history, content/production records, tasks and asset links.
- Asset is a stored file with one or more explicit links to campaigns or other records.
- CRM record has many interactions and follow-ups.
- Buyer can have multiple site visits.
- Meeting has participants, decisions and action items.
- Meeting action items can link to tasks.
- Activity events reference the affected entity and workspace.

### 8.3 Data integrity constraints

- Foreign keys for core relationships.
- Unique membership per user/workspace.
- Validate linked records share the same workspace.
- Validate stage transitions against configured workflow.
- Prevent invalid time ranges (end before start).
- Prevent negative file sizes or invalid progress values.
- Store monetary values as fixed-precision decimal or integer minor units with currency metadata; do not use floating-point for currency.
- Use soft deletion/archive for operational records where history must remain.
- Define explicit cascade/restrict behaviour; do not cascade-delete audit history.

## 9. CRM technical design

### 9.1 CRM record strategy

Use a common CRM identity and interaction model, with distinct record categories and typed detail models:
- Tech enquiries/clients/partners.
- Real Estate developers and partners.
- Real Estate buyers/property customers.

This keeps common operations (search, owner, source, activity, follow-up) consistent while preserving separate field sets and pipelines.

### 9.2 Pipeline configuration

Represent pipeline stages as controlled values or workspace/record-type configuration. Persist stage changes as activity events. Do not allow arbitrary client-provided stage strings.

### 9.3 Search

Initial search requirements:
- Name and company name.
- Phone number (normalised representation plus display representation).
- Email where available.
- Workspace and record-type scope.
- Pagination and bounded result size.

Use database indexes for exact/prefix search. Consider PostgreSQL full-text/trigram search only if measured needs justify it. Avoid sending entire CRM datasets to the client for filtering.

### 9.4 Follow-up consistency

A follow-up must have:
- CRM record relationship.
- Assigned member.
- Due date/time.
- Status.
- Completion timestamp/actor.
- Optional linked task.

When follow-up is completed, append an interaction/activity event. Do not infer that a note means a follow-up was completed.

### 9.5 Contact actions

Call, SMS, email and WhatsApp buttons may initially invoke device/app hand-off links where supported. This does not mean message delivery or call completion is verified. If integrated communication logging is required, select and implement an explicit provider integration and capture delivery/result webhooks.

## 10. Task, calendar and scheduling logic

### 10.1 Time handling

- Persist timestamps in UTC.
- Store workspace/user timezone configuration (default may be Asia/Kolkata, subject to confirmation).
- Render in the selected user's timezone.
- Treat all-day dates separately from timestamped events.
- Use explicit timezone conversion at API boundaries.

### 10.2 Task lifecycle

Validate allowed transitions in backend services:
- To Do → In Progress.
- In Progress → On Hold / Blocked / Completed.
- On Hold → In Progress / Cancelled.
- Blocked → In Progress / Cancelled.
- Completed → reopen only through an explicit audited action if reopening is allowed.
- Cancelled → reopen only through an explicit audited action if reopening is allowed.

Final transitions must be configurable only through controlled settings. Do not allow arbitrary state mutation.

### 10.3 Work sessions

A task may have multiple work sessions. Each start/pause/resume/stop event must preserve:
- Task.
- Acting user.
- Event type.
- Timestamp.
- Optional note.

A robust implementation may store immutable `TaskWorkSessionEvent` rows instead of overwriting pause/resume timestamps in one row.

### 10.4 Rescheduling

Update current planned dates and insert a schedule-history record in one database transaction. The previous planned dates must be captured before update. Require a reason optionally or mandatorily according to product decision.

### 10.5 Calendar query model

The calendar API should return a normalised event DTO with:
- id and entity type.
- title.
- start/end.
- all-day flag.
- status/priority.
- workspace.
- owner/assignee.
- linked record metadata.
- navigable target route.

Calendar is an aggregated read model over tasks, campaign milestones, meetings and visits; do not create duplicate calendar copies of those records.

## 11. Campaign workflow technical design

### 11.1 Stage model

Stages:
1. Initial Idea
2. Scripting & Planning
3. Recording & Asset Upload
4. Editing & Final Asset
5. Posting & Completion

Represent the stage as a controlled enum/configuration. Maintain immutable stage transition history.

### 11.2 Stage data

Use campaign-level fields for shared metadata and stage-specific related records/tables for complex production data:
- Idea/brief.
- Script and revisions.
- Recording session and footage checklist.
- Edit/review versions.
- Publishing details and proof.

Do not place all stage-specific fields into one enormous unvalidated JSON blob.

### 11.3 Stage transition validation

Before moving a campaign:
- Validate required fields/checklist items for the target transition.
- Confirm required approved asset exists before posting, if that rule is enabled.
- Record actor, timestamp and previous/next stage.
- Create or update linked stage tasks only according to explicit business rules.
- Allow authorised rollback/reopen through an audited operation.

## 12. File upload and storage architecture

### 12.1 Storage model

- PostgreSQL stores file metadata, ownership, relationships and versions.
- Object storage stores file bytes.
- Buckets/containers must be private.
- Use opaque storage keys; do not expose internal bucket paths as public URLs.

### 12.2 Upload flow

```text
Client selects file
   ↓
API requests upload authorisation
   ↓
API validates workspace membership, metadata and policy
   ↓
API issues short-lived signed upload URL or multipart session
   ↓
Client uploads directly to private object storage
   ↓
Client confirms upload
   ↓
API verifies object metadata/checksum where supported
   ↓
Asset + AssetVersion + AssetLink rows are committed
   ↓
Activity event is written
```

For uploads initiated from a campaign, create the campaign `AssetLink` in the same logical completion workflow.

### 12.3 Download and preview

- API checks workspace and linked-record access.
- API issues a short-lived signed download URL or streams the file.
- Avoid permanent public URLs for private business assets.
- Set safe content disposition and content type.
- Consider malware scanning and MIME/content validation before production use.

### 12.4 Large files

Define configurable upload limits by file type. Use multipart/resumable uploads for large videos, retry failed parts and clean up abandoned multipart sessions. Exact limits depend on storage provider, network and operational budget and must be decided before launch.

### 12.5 Deletion

Removing an asset relationship must not delete the underlying file. Permanent deletion must:
1. Check authorisation.
2. Check remaining references.
3. Confirm user intent.
4. Mark metadata deleted or schedule storage deletion according to retention policy.
5. Write an audit event.

## 13. Notifications and background jobs

### 13.1 Notification events

Examples:
- Task assigned.
- Task due soon or overdue.
- Follow-up due.
- Meeting/site visit approaching.
- Campaign deadline changed.
- Script/final asset awaiting review.
- Comment/mention.

### 13.2 Delivery model

- Persist notification records first.
- Dispatch push messages asynchronously.
- Track delivery attempts/status where supported.
- Do not block core task/CRM writes on push provider availability.
- Use FCM for Android push after Android app registration/configuration.
- In-app notification centre reads from the backend.

### 13.3 Job processing

Use a durable job queue for:
- Reminder scheduling.
- Push delivery.
- File post-processing.
- Expired upload cleanup.
- Periodic overdue/follow-up calculations if not calculated at query time.

Select a queue technology (e.g. Redis-backed BullMQ) only after deployment architecture is confirmed. Jobs must be retry-safe and idempotent.

## 14. API endpoint catalogue (initial proposal)

All endpoints are under `/api/v1`. This is a starting contract and should be refined in OpenAPI.

### Auth and workspaces
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh` (if token strategy is selected)
- `GET /auth/me`
- `GET /workspaces`
- `GET /workspaces/:workspaceId`
- `GET /workspaces/:workspaceId/members`

### Dashboard
- `GET /workspaces/:workspaceId/dashboard/summary`
- `GET /workspaces/:workspaceId/dashboard/today`
- `GET /workspaces/:workspaceId/dashboard/activity`

### Tasks
- `GET /workspaces/:workspaceId/tasks`
- `POST /workspaces/:workspaceId/tasks`
- `GET /workspaces/:workspaceId/tasks/:taskId`
- `PATCH /workspaces/:workspaceId/tasks/:taskId`
- `POST /workspaces/:workspaceId/tasks/:taskId/start`
- `POST /workspaces/:workspaceId/tasks/:taskId/pause`
- `POST /workspaces/:workspaceId/tasks/:taskId/resume`
- `POST /workspaces/:workspaceId/tasks/:taskId/block`
- `POST /workspaces/:workspaceId/tasks/:taskId/complete`
- `POST /workspaces/:workspaceId/tasks/:taskId/reschedule`
- `GET /workspaces/:workspaceId/tasks/:taskId/history`

### Plans and goals
- `GET/POST /workspaces/:workspaceId/plans`
- `GET/PATCH /workspaces/:workspaceId/plans/:planId`
- `GET/POST /workspaces/:workspaceId/goals`
- `GET/PATCH /workspaces/:workspaceId/goals/:goalId`
- `POST /workspaces/:workspaceId/plans/:planId/milestones`

### Campaigns
- `GET/POST /workspaces/:workspaceId/campaigns`
- `GET/PATCH /workspaces/:workspaceId/campaigns/:campaignId`
- `POST /workspaces/:workspaceId/campaigns/:campaignId/transition`
- `GET /workspaces/:workspaceId/campaigns/:campaignId/history`
- `GET /workspaces/:workspaceId/campaigns/:campaignId/assets`

### Assets
- `GET /workspaces/:workspaceId/assets`
- `POST /workspaces/:workspaceId/assets/upload-intents`
- `POST /workspaces/:workspaceId/assets/:assetId/confirm-upload`
- `GET /workspaces/:workspaceId/assets/:assetId`
- `POST /workspaces/:workspaceId/assets/:assetId/download-intent`
- `POST /workspaces/:workspaceId/assets/:assetId/links`
- `DELETE /workspaces/:workspaceId/assets/:assetId/links/:linkId`
- `POST /workspaces/:workspaceId/assets/:assetId/versions`

### CRM
- `GET /workspaces/:workspaceId/crm/records`
- `POST /workspaces/:workspaceId/crm/records`
- `GET /workspaces/:workspaceId/crm/records/:recordId`
- `PATCH /workspaces/:workspaceId/crm/records/:recordId`
- `POST /workspaces/:workspaceId/crm/records/:recordId/stage`
- `GET /workspaces/:workspaceId/crm/records/:recordId/interactions`
- `POST /workspaces/:workspaceId/crm/records/:recordId/interactions`
- `GET/POST /workspaces/:workspaceId/crm/follow-ups`
- `POST /workspaces/:workspaceId/crm/follow-ups/:followUpId/complete`
- `GET/POST /workspaces/:workspaceId/crm/records/:recordId/site-visits`

### Meetings
- `GET/POST /workspaces/:workspaceId/meetings`
- `GET/PATCH /workspaces/:workspaceId/meetings/:meetingId`
- `POST /workspaces/:workspaceId/meetings/:meetingId/reschedule`
- `POST /workspaces/:workspaceId/meetings/:meetingId/complete`
- `POST /workspaces/:workspaceId/meetings/:meetingId/action-items`
- `POST /workspaces/:workspaceId/meetings/:meetingId/action-items/:itemId/create-task`

### Calendar, team, notifications and activity
- `GET /workspaces/:workspaceId/calendar/events`
- `GET /workspaces/:workspaceId/team`
- `GET /workspaces/:workspaceId/notifications`
- `POST /workspaces/:workspaceId/notifications/:notificationId/read`
- `GET /workspaces/:workspaceId/activity`

Use `GET`, `POST`, `PATCH` and `DELETE` consistently. Avoid using `GET/POST` literally in implementation; each verb is a separate endpoint.

## 15. Security requirements

### 15.1 Baseline controls
- HTTPS everywhere outside local development.
- Secure password hashing if credentials are managed directly (Argon2id or an appropriately configured modern password hashing algorithm).
- Secure cookie/token strategy and session revocation.
- Server-side workspace and entity-level authorisation.
- DTO validation and output filtering.
- Rate limiting on authentication and sensitive endpoints.
- CORS allowlist configured for known client origins.
- CSRF protection when cookie-based auth is used.
- Security headers.
- Secrets stored in environment/secret manager, never in repository.
- Dependency scanning and regular updates.
- Audit sensitive actions.

### 15.2 File security
- Private buckets.
- Short-lived signed URLs.
- File type and size validation.
- Random storage keys.
- Do not trust filename or MIME type supplied by browser alone.
- Consider malware scanning.
- Prevent unauthorised asset-link enumeration.

### 15.3 Privacy
CRM may contain personal contact information. Restrict it to authenticated workspace members, avoid unnecessary exposure in logs/analytics, and define retention and deletion rules before production.

### 15.4 Threat cases to test
- User changes workspace ID in request.
- User guesses another record's UUID.
- User links an asset or task from another workspace.
- Expired session reuses an old API request.
- Signed URL is reused after expiry.
- Malicious or oversized file upload.
- Duplicate retry creates duplicate follow-up/task.
- User attempts permanent deletion without permission.

## 16. Performance and reliability

Set measurable targets before launch. Initial engineering targets for validation:
- Common list/detail API requests: p95 under 500 ms under expected pilot load, excluding object-storage transfer.
- Initial interactive view: target under 3 seconds on representative broadband/mobile test profiles.
- Paginate all potentially large lists.
- Avoid N+1 database access patterns.
- Index workspace-scoped filters and common search fields.
- Use database transactions for multi-record state transitions.
- Use background jobs for slow notifications and file processing.
- Cache only where invalidation is understood.
- Add request IDs and structured logs.
- Monitor API errors, latency, database health, storage failures and job retries.

These are proposed targets, not measured guarantees. Revisit after load testing and real usage.

## 17. Database indexing and query strategy

Candidate indexes:
- `WorkspaceMember(userId, workspaceId)` unique.
- `Task(workspaceId, assigneeId, status, dueAt)`.
- `Task(workspaceId, dueAt)`.
- `Campaign(workspaceId, stage, targetPublishAt)`.
- `CrmRecord(workspaceId, crmType, recordCategory, pipelineStage)`.
- `CrmRecord(workspaceId, assignedToId, nextFollowUpAt)`.
- Normalised phone search index scoped by workspace.
- `Meeting(workspaceId, startAt, status)`.
- `SiteVisit(workspaceId, scheduledAt)`.
- `Asset(workspaceId, category, uploadedAt)`.
- `ActivityEvent(workspaceId, entityType, entityId, createdAt)`.

Validate indexes using actual query plans and data volumes. Avoid indexing every field without evidence.

## 18. Testing strategy

### 18.1 Unit tests
- Workflow transition rules.
- Workspace membership guard.
- CRM pipeline validation.
- Follow-up completion.
- Task schedule history.
- Campaign stage validation.
- Asset relationship rules.
- Date/time and timezone conversion.

### 18.2 Integration tests
- Database transactions and foreign keys.
- Cross-workspace access denial.
- CRM record and interaction creation.
- Task start/pause/resume/complete.
- Meeting action item to task conversion.
- Asset upload confirmation and campaign linking.
- Notification persistence and dispatch retry.

### 18.3 End-to-end tests
- Login → workspace → dashboard.
- Create and complete a task.
- Create buyer → log contact → schedule site visit → record outcome.
- Create developer partner → schedule meeting → convert action item to task.
- Create campaign → progress stages → attach assets → publish.
- Test desktop and mobile breakpoints.
- Android app back navigation, file picker and push notification deep links.

### 18.4 Security tests
- Workspace isolation across all endpoints.
- IDOR attempts.
- Invalid/expired tokens.
- Rate limits.
- Upload type/size enforcement.
- XSS-safe rendering of notes and user content.
- CSRF where relevant.

### 18.5 Test data
Use synthetic test records. Do not use real customer contact details in automated test fixtures.

## 19. Deployment and operations

### 19.1 Deployment units
- Static client hosting/CDN.
- NestJS API service.
- PostgreSQL managed database.
- Private object storage.
- Background worker (if queue is used).
- Android build pipeline and Play/internal distribution process.

### 19.2 CI pipeline
On pull request:
1. Install locked dependencies.
2. Lint and type-check.
3. Run unit tests.
4. Run API integration tests where configured.
5. Build client and API.
6. Check Prisma migration validity.
7. Run security/dependency checks.

On release:
1. Build immutable versioned artifacts.
2. Deploy to staging.
3. Run smoke tests.
4. Apply reviewed database migrations.
5. Deploy production API/client.
6. Verify health checks and critical flows.
7. Build/sign Android APK from the approved client release.

### 19.3 Database migrations
- Use Prisma migrations.
- Review migrations before production.
- Back up before destructive schema changes.
- Prefer expand/migrate/contract for changes requiring compatibility.
- Never edit production schema manually without a documented migration.

### 19.4 Backups and recovery
Before production, define:
- Database backup frequency.
- Point-in-time recovery availability.
- Object-storage versioning/backup approach.
- Retention periods.
- Recovery Point Objective (RPO).
- Recovery Time Objective (RTO).
- Restore test cadence.

A backup is not proven until a restore has been tested.

## 20. Android / Capacitor requirements

- Capacitor Android project lives within the client app.
- Web and Android share routes, components, API clients and validation.
- Use Capacitor plugins for native capabilities such as file picker, camera, push notifications and status bar only where required.
- Use secure native storage for tokens if bearer-token authentication is selected.
- Configure Android application ID, app name, icons, splash screen, signing and versioning.
- Handle Android back button predictably:
  - close modal/drawer first;
  - navigate to previous in-app route next;
  - exit only from root according to product behaviour.
- Test keyboard resize, safe areas, orientation and file upload.
- Use deep links to open a specific authorised record from notifications.
- Do not assume every browser API behaves identically inside Android WebView.
- Build and test a signed release APK/AAB; do not distribute debug builds as production releases.

## 21. Observability and support

Implement:
- Structured server logs with request/correlation ID.
- Error monitoring for client and API.
- API health/readiness endpoints.
- Database connection and slow-query monitoring.
- Background job failure/retry monitoring.
- Storage upload error metrics.
- Android crash reporting where appropriate.

Logs must not contain passwords, tokens, signed URLs, full private documents or unnecessary CRM personal data.

## 22. Implementation sequence

### Phase 0 — Engineering foundation
- Confirm auth provider and deployment.
- Create monorepo and CI.
- Configure PostgreSQL/Prisma.
- Define workspace membership and audit patterns.
- Build responsive shell and design tokens.

### Phase 1 — Operational core
- Authentication/workspaces.
- Team directory.
- Tasks, checklists, comments and history.
- Dashboard summaries.
- Basic in-app notifications.

### Phase 2 — CRM and scheduling
- Tech CRM.
- Real Estate Buyers.
- Real Estate Developers/Partners.
- Interactions and follow-ups.
- Meetings and site visits.
- Meeting action items to tasks.

### Phase 3 — Campaign and assets
- Campaign lifecycle and stage history.
- Stage-specific task links.
- Asset upload intents and private storage.
- Campaign asset relationships and versions.

### Phase 4 — Plans, goals and calendars
- Plans/goals/milestones.
- Aggregated calendar API.
- Three calendar experiences.
- Team workload views.

### Phase 5 — Android and production hardening
- Capacitor Android integration.
- Push notifications and deep links.
- Device testing and upload reliability.
- Security, performance, backup and restore validation.
- Production release.

## 23. Technical risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Workspace leakage | Critical data exposure | Mandatory server-side scoping; cross-tenant tests; consider RLS |
| Overloaded CRM schema | Hard to evolve | Common CRM core plus typed detail models |
| Giant campaign record | Difficult validation and maintenance | Separate stage-specific entities |
| Large video uploads fail | Lost work and user frustration | Multipart/resumable uploads and retry |
| Audit history overwritten | Loss of accountability | Append-only activity/history records |
| Mobile UI feels like desktop shrink | Poor adoption | Mobile-specific responsive patterns and device testing |
| Duplicate records on retry | Data inconsistency | Idempotency keys and unique constraints where applicable |
| Timezone errors | Missed deadlines/meetings | UTC storage, explicit timezone and tests |
| Notification provider failure | Missed alerts | Persist first; dispatch asynchronously with retries |
| Unclear deletion behaviour | Broken references/data loss | Archive/soft delete and explicit permanent-delete flow |

## 24. Decisions required before implementation

1. Authentication provider and cookie/token strategy.
2. Hosting provider, region and production domain.
3. PostgreSQL hosting and backup plan.
4. Object storage provider, upload limits and retention.
5. Queue technology and whether realtime updates are required in MVP.
6. User/workspace membership provisioning.
7. Exact task status transitions and reopen policy.
8. CRM custom fields and pipeline configurability.
9. Whether communication integrations are required or device hand-offs are sufficient.
10. Notification channels and reminder schedule.
11. Timezone and working-hours defaults.
12. Offline requirements.
13. Android application ID, signing owner and distribution method.
14. Data retention, archive and permanent deletion rules.

## 25. Definition of done

A feature is technically complete only when:
- Requirements and acceptance criteria are mapped.
- UI works on desktop and mobile.
- API validates inputs and enforces workspace access.
- Database constraints and migrations are included.
- Activity history is recorded for important changes.
- Loading, empty, error and success states are implemented.
- Unit/integration/E2E tests cover critical behaviour.
- OpenAPI documentation is updated.
- Logging avoids sensitive data.
- Feature is deployed and smoke-tested in staging.
- Any operational configuration or support notes are documented.

---

## Appendix A — Product-to-technical traceability

| Product area | Main technical modules | Key data entities |
|---|---|---|
| Authentication/workspace | Auth, Users, Workspaces | User, Workspace, WorkspaceMember |
| Dashboard | Dashboard query service | Task, Campaign, Goal, Meeting, FollowUp, ActivityEvent |
| Tasks | Tasks | Task, ChecklistItem, WorkSession, ScheduleHistory, Comment |
| Plans & Goals | Plans, Goals | Plan, Milestone, Goal |
| Calendars | Calendar, Tasks, Campaigns, Meetings | Aggregated calendar DTOs and source records |
| Campaigns | Campaigns | Campaign, StageHistory, Content, Task |
| Assets | Assets | Asset, AssetVersion, AssetLink |
| CRM | CRM | CrmRecord, typed detail, Interaction, FollowUp, SiteVisit |
| Meetings | Meetings | Meeting, Participant, Decision, ActionItem |
| Team | Users, Workspaces, Tasks, Activity | User, WorkspaceMember, Task, ActivityEvent |
| Settings | Workspaces, configuration | Workspace settings and workflow configuration |

## Appendix B — Important implementation cautions

- The proposed schema is a starting logical model, not a final migration file.
- Confirm Prisma relation names, delete policies, enum strategy and indexing with the engineering team.
- Do not store uploaded file bytes in PostgreSQL.
- Do not trust workspace IDs, role claims or record relationships supplied by the client.
- Do not equate “tap WhatsApp/call” with a verified sent message or completed call.
- Do not create duplicate calendar records; calendar should aggregate source records.
- Do not hard-code Anant, Rohit and Utkarsh into permission logic or schema.
