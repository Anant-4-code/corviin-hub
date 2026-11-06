# CORVIIN HUB — Master API Audit Matrix (Phase 5)

## Overview
This document audits every implemented backend controller and endpoint in CORVIIN HUB against its corresponding feature specification in `docs/features/`. It records the specification requirement, endpoint route, server-side validation, workspace scoping, database persistence, test status, and remaining Phase 5 integration work.

---

## 1. API Audit Matrix

| Module | Route / Endpoint | HTTP | Specification Requirement | Validation & Scoping | Persistence | Test Status | Phase 5 Status |
|---|---|---|---|---|---|:---:|:---:|
| **Health** | `/api/v1/health` | `GET` | Health check, uptime, version, db & storage status | Public, no auth required | Prisma ping, R2 check | PASS (Jest) | Verified |
| **Workspaces** | `/api/v1/workspaces` | `GET` | List active workspaces (Tech & Real Estate) | Scoped to system workspaces | Prisma `Workspace` | PASS (Jest) | Verified |
| **Workspaces** | `/api/v1/workspaces/:id` | `GET` | Retrieve workspace details by ID or slug | ID validation | Prisma `Workspace` | PASS (Jest) | Verified |
| **Profiles** | `/api/v1/profiles` | `GET` | List dynamic acting profiles | Scoped to active profiles | Prisma `Profile` | PASS (Jest) | Verified |
| **Profiles** | `/api/v1/profiles/:id` | `GET` | Retrieve profile detail by ID | ID validation | Prisma `Profile` | PASS (Jest) | Verified |
| **Team** | `/api/v1/team` | `GET` | List workspace members with live workload | `x-workspace-id` scoped | Prisma `WorkspaceMembership` | PASS (Jest & Vitest) | Verified |
| **Team** | `/api/v1/team/:id` | `GET` | Retrieve member profile with 8 operational tabs | Scoped to workspace | Prisma `Profile` + aggregated metrics | PASS (Jest & Vitest) | Verified |
| **Team** | `/api/v1/team` | `POST` | Add member to directory and workspace | DTO validation, unique email | Prisma `Profile` + `WorkspaceMembership` | PASS (Jest) | Verified |
| **Team** | `/api/v1/team/:id` | `PUT` | Edit member details or change status | DTO validation | Prisma `Profile` | PASS (Jest) | Verified |
| **Tasks** | `/api/v1/tasks` | `GET` | All Tasks listing with pagination, filters, search | `x-workspace-id` strictly scoped | Prisma `Task` | PASS (Jest & Vitest) | Verified |
| **Tasks** | `/api/v1/tasks/my` | `GET` | Personal My Tasks view scoped to profile | `x-workspace-id` + `assigneeId` | Prisma `Task` | PASS (Jest & Vitest) | Verified |
| **Tasks** | `/api/v1/tasks/:id` | `GET` | Single task detail with subtasks, comments, sessions | Scoped to workspace | Prisma `Task` + relations | PASS (Jest) | Verified |
| **Tasks** | `/api/v1/tasks` | `POST` | Create operational task with assignment | DTO validation, deadline check | Prisma `Task` + `AuditEvent` | PASS (Jest & Vitest) | Verified |
| **Tasks** | `/api/v1/tasks/:id` | `PUT` | Update task fields (status, priority, blocker) | Valid state transitions | Prisma `Task` + `AuditEvent` | PASS (Jest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/work-session/start` | `POST` | Start immutable work session interval | Task exists in workspace | Prisma `TaskWorkSession` | PASS (Jest & Vitest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/work-session/pause` | `POST` | Pause current active work session | Active session exists | Prisma `TaskWorkSession` | PASS (Jest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/work-session/resume` | `POST` | Resume paused work session | Valid task | Prisma `TaskWorkSession` | PASS (Jest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/reschedule` | `POST` | Reschedule task deadline with mandatory reason | Mandatory reason, new deadline | Prisma `TaskRescheduleHistory` | PASS (Jest & Vitest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/checklist` | `POST` | Add subtask checklist item | Checklist label required | Prisma `TaskChecklistItem` | PASS (Jest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/checklist/:itemId/toggle` | `PATCH` | Toggle subtask completed state | Valid item ID | Prisma `TaskChecklistItem` | PASS (Jest & Vitest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/comments` | `POST` | Add comment to task | Author attribution | Prisma `TaskComment` | PASS (Jest) | Verified |
| **Tasks** | `/api/v1/tasks/:id/attachments` | `POST` | Link asset attachment to task | Valid asset ID in workspace | Prisma `TaskAttachment` | PASS (Jest) | Verified |
| **Plans & Goals** | `/api/v1/plans-goals/goals` | `GET` | List strategic goals with metrics | `x-workspace-id` scoped | Prisma `Goal` | PASS (Jest & Vitest) | Verified |
| **Plans & Goals** | `/api/v1/plans-goals/goals` | `POST` | Create strategic goal with progress mode | DTO validation | Prisma `Goal` | PASS (Jest & Vitest) | Verified |
| **Plans & Goals** | `/api/v1/plans-goals/goals/:id` | `GET` | Goal detail with linked plans & campaigns | Workspace validation | Prisma `Goal` | PASS (Jest) | Verified |
| **Plans & Goals** | `/api/v1/plans-goals/plans` | `GET` | List operational plans with milestones | `x-workspace-id` scoped | Prisma `Plan` | PASS (Jest) | Verified |
| **Plans & Goals** | `/api/v1/plans-goals/plans` | `POST` | Create plan with structured milestones | DTO validation | Prisma `Plan` + `PlanMilestone` | PASS (Jest) | Verified |
| **Campaigns** | `/api/v1/campaigns` | `GET` | 5-stage marketing pipeline board/table | `x-workspace-id` scoped | Prisma `Campaign` | PASS (Jest & Vitest) | Verified |
| **Campaigns** | `/api/v1/campaigns/:id` | `GET` | Campaign detail with scripts, footage, links | Workspace validation | Prisma `Campaign` + relations | PASS (Jest & Vitest) | Verified |
| **Campaigns** | `/api/v1/campaigns` | `POST` | Create marketing campaign | Title, platform, target date | Prisma `Campaign` + `AuditEvent` | PASS (Jest & Vitest) | Verified |
| **Campaigns** | `/api/v1/campaigns/:id/stage` | `POST` | Transition campaign stage with tasks/events | Valid 5-stage transition | Prisma `CampaignStageHistory` (Transaction) | PASS (Jest & Vitest) | Verified |
| **Campaigns** | `/api/v1/campaigns/:id/scripts` | `POST` | Save script version with feedback | Script versioning | Prisma `CampaignScript` | PASS (Jest & Vitest) | Verified |
| **Campaigns** | `/api/v1/campaigns/:id/footage-checklist` | `POST` | Manage footage items (scenes, b-roll) | Checklist categories | Prisma `CampaignFootageItem` | PASS (Jest) | Verified |
| **Campaigns** | `/api/v1/campaigns/:id/assets` | `POST` | Link asset to campaign stage | Asset ownership validation | Prisma `CampaignAssetLink` | PASS (Jest) | Verified |
| **Assets & Storage** | `/api/v1/assets` | `GET` | Paginated digital asset catalog | `x-workspace-id` scoped | Prisma `Asset` | PASS (Jest & Vitest) | Verified |
| **Assets & Storage** | `/api/v1/assets/:id` | `GET` | Asset detail, versions, relationships | Workspace scoping | Prisma `Asset` + versions | PASS (Jest) | Verified |
| **Assets & Storage** | `/api/v1/assets/upload-intent` | `POST` | Generate presigned PUT URL for Cloudflare R2 | Size, MIME, policy validation | Cloudflare R2 presigned URL | PASS (Jest & Vitest) | Verified |
| **Assets & Storage** | `/api/v1/assets/confirm-upload` | `POST` | Confirm upload & record metadata in PostgreSQL | Token verification | Prisma `Asset` + `AssetVersion` | PASS (Jest & Vitest) | Verified |
| **Assets & Storage** | `/api/v1/assets/:id/versions` | `POST` | Upload new version of existing asset | Version increment | Prisma `AssetVersion` | PASS (Jest) | Verified |
| **Assets & Storage** | `/api/v1/assets/:id/relationships` | `POST` | Link asset to campaign, task, CRM record | Same-workspace validation | Prisma `AssetRelationship` | PASS (Jest) | Verified |
| **Assets & Storage** | `/api/v1/assets/:id` | `DELETE` | Soft delete / archive asset | Workspace validation | Prisma `Asset` | PASS (Jest) | Verified |
| **Assets & Storage** | `/api/v1/assets/storage-summary` | `GET` | Storage quota, usage bytes, count by category | `x-workspace-id` scoped | Aggregated Prisma queries | PASS (Jest & Vitest) | Verified |
| **CRM Tech** | `/api/v1/crm/tech` | `GET` | Corviin Tech pipeline board & table | Workspace type: TECH only | Prisma `CrmTechRecord` | PASS (Jest & Vitest) | Verified |
| **CRM Tech** | `/api/v1/crm/tech/:id` | `GET` | Tech account detail with proposals & activity | Scoped to Tech workspace | Prisma `CrmTechRecord` + relations | PASS (Jest & Vitest) | Verified |
| **CRM Tech** | `/api/v1/crm/tech` | `POST` | Create Tech enquiry / lead | Category, budget, company | Prisma `CrmTechRecord` | PASS (Jest & Vitest) | Verified |
| **CRM Tech** | `/api/v1/crm/tech/:id/stage` | `POST` | Transition Tech pipeline stage | Stage transition rule | Prisma `CrmTechStageHistory` | PASS (Jest & Vitest) | Verified |
| **CRM Tech** | `/api/v1/crm/tech/:id/proposals` | `POST` | Add proposal/quotation to tech deal | Value, currency, title | Prisma `CrmTechProposal` | PASS (Jest & Vitest) | Verified |
| **CRM Partners** | `/api/v1/crm/partners` | `GET` | Real Estate partner pipeline | Workspace type: REAL_ESTATE | Prisma `CrmPartnerRecord` | PASS (Jest & Vitest) | Verified |
| **CRM Partners** | `/api/v1/crm/partners/:id` | `GET` | Partner profile with projects & notes | Scoped to Real Estate | Prisma `CrmPartnerRecord` + relations | PASS (Jest & Vitest) | Verified |
| **CRM Partners** | `/api/v1/crm/partners` | `POST` | Create developer / builder / partner lead | Partner type, contact info | Prisma `CrmPartnerRecord` | PASS (Jest & Vitest) | Verified |
| **CRM Partners** | `/api/v1/crm/partners/:id/stage` | `POST` | Transition partner stage | 9 partner stages | Prisma `CrmPartnerStageHistory` | PASS (Jest & Vitest) | Verified |
| **CRM Buyers** | `/api/v1/crm/buyers` | `GET` | Real Estate buyer pipeline board & table | Workspace type: REAL_ESTATE | Prisma `CrmBuyerRecord` | PASS (Jest & Vitest) | Verified |
| **CRM Buyers** | `/api/v1/crm/buyers/:id` | `GET` | Buyer detail with site visits & properties | Scoped to Real Estate | Prisma `CrmBuyerRecord` + relations | PASS (Jest & Vitest) | Verified |
| **CRM Buyers** | `/api/v1/crm/buyers` | `POST` | Create buyer enquiry with budget & locality | Budget, configuration, contact | Prisma `CrmBuyerRecord` | PASS (Jest & Vitest) | Verified |
| **CRM Buyers** | `/api/v1/crm/buyers/:id/stage` | `POST` | Transition buyer pipeline stage | 11 buyer stages | Prisma `CrmBuyerStageHistory` | PASS (Jest & Vitest) | Verified |
| **CRM Buyers** | `/api/v1/crm/buyers/:id/site-visits` | `POST` | Schedule site visit with property details | Scheduled time, property | Prisma `SiteVisit` | PASS (Jest & Vitest) | Verified |
| **CRM Buyers** | `/api/v1/crm/buyers/:id/shared-properties` | `POST` | Record shared property portfolio item | Property name, price, link | Prisma `CrmBuyerSharedProperty` | PASS (Jest) | Verified |
| **CRM Follow-ups** | `/api/v1/crm/follow-ups` | `POST` | Schedule CRM follow-up across any entity | Due date, assignee, entity | Prisma `CrmFollowUp` | PASS (Jest) | Verified |
| **CRM Interactions** | `/api/v1/crm/interactions` | `POST` | Log client/partner interaction note or call | Type (CALL, EMAIL, MEETING) | Prisma `CrmInteraction` | PASS (Jest) | Verified |
| **Meetings** | `/api/v1/meetings` | `GET` | Meetings list & calendar data | `x-workspace-id` scoped | Prisma `Meeting` | PASS (Jest & Vitest) | Verified |
| **Meetings** | `/api/v1/meetings/:id` | `GET` | Meeting detail with agenda, decisions, items | Workspace scoping | Prisma `Meeting` + relations | PASS (Jest & Vitest) | Verified |
| **Meetings** | `/api/v1/meetings` | `POST` | Schedule operational meeting | Title, time, participants | Prisma `Meeting` + agenda | PASS (Jest & Vitest) | Verified |
| **Meetings** | `/api/v1/meetings/:id/action-items/:itemId/convert-to-task` | `POST` | Convert action item into operational task | Atomic transaction | Prisma `$transaction` (`Task` + `ActionItem`) | PASS (Jest & Vitest) | Verified |
| **Meetings** | `/api/v1/meetings/:id/reschedule` | `POST` | Reschedule meeting with reason | New time, mandatory reason | Prisma `Meeting` + `AuditEvent` | PASS (Jest & Vitest) | Verified |
| **Meetings** | `/api/v1/meetings/:id/cancel` | `POST` | Cancel meeting with reason | Cancellation note | Prisma `Meeting` + `AuditEvent` | PASS (Jest & Vitest) | Verified |
| **Calendar** | `/api/v1/calendar/content-campaigns` | `GET` | Content and campaign publishing schedule | Scoped to workspace | Aggregated Prisma queries | PASS (Jest & Vitest) | Verified |
| **Calendar** | `/api/v1/calendar/team-tasks` | `GET` | Team workload deadlines & scheduled tasks | Dynamic member groups | Prisma `Task` + `Profile` | PASS (Jest & Vitest) | Verified |
| **Calendar** | `/api/v1/calendar/meetings-visits` | `GET` | Unified meetings and real estate site visits | Scoped to workspace | Prisma `Meeting` + `SiteVisit` | PASS (Jest & Vitest) | Verified |
| **Notifications** | `/api/v1/notifications` | `GET` | In-app notification inbox | Scoped to profile & workspace | Prisma `InAppNotification` | PASS (Jest & Vitest) | Verified |
| **Notifications** | `/api/v1/notifications/:id/read` | `PATCH` | Mark individual notification as read | ID validation | Prisma `InAppNotification` | PASS (Jest & Vitest) | Verified |
| **Notifications** | `/api/v1/notifications/mark-all-read` | `POST` | Mark all inbox notifications as read | Scoped to recipient | Prisma `InAppNotification` | PASS (Jest) | Verified |
| **Notifications** | `/api/v1/notifications/activity` | `GET` | Workspace activity audit trail | Chronological order | Prisma `AuditEvent` (append-only) | PASS (Jest & Vitest) | Verified |
| **Settings** | `/api/v1/settings/personal` | `GET` | Personal preferences (theme, timezone, format) | Profile-scoped | Prisma `PersonalSettings` | PASS (Jest & Vitest) | Verified |
| **Settings** | `/api/v1/settings/personal` | `PUT` | Update personal profile settings | Valid preferences | Prisma `PersonalSettings` | PASS (Jest & Vitest) | Verified |
| **Settings** | `/api/v1/settings/workspace` | `GET` | Workspace-level defaults & pipeline config | Workspace-scoped | Prisma `WorkspaceSettings` | PASS (Jest & Vitest) | Verified |
| **Settings** | `/api/v1/settings/workspace` | `PUT` | Update workspace operational settings | Workspace isolation | Prisma `WorkspaceSettings` | PASS (Jest & Vitest) | Verified |
| **Global Search** | `/api/v1/search` | `GET` | Multi-entity cross-domain search | `x-workspace-id` strictly scoped | Parallel indexed Prisma queries | PASS (Jest & Vitest) | Verified |
| **Contextual Create** | `/api/v1/search/create-options` | `GET` | Permitted create actions for workspace | Tech vs Real Estate permissions | Domain action mapping | PASS (Jest & Vitest) | Verified |
| **Dashboard** | `/api/v1/dashboard/summary` | `GET` | Live workspace KPI metrics & counts | Scoped to workspace | Real Prisma table counts & sums | PASS (Jest) | Verified |

