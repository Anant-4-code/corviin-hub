# CORVIIN HUB — Cross-Module Relationship Matrix

## 1. Overview & Architecture Principle

CORVIIN HUB is a unified operational system with a single canonical persistent source of truth in PostgreSQL via Prisma. A record created or updated in one module is directly referenced across all relevant views and modules without duplicate record creation.

Cross-module operations:
1. Strictly enforce workspace isolation (`workspaceId`).
2. Maintain acting-profile attribution without altering historical audit logs.
3. Keep file binaries in Cloudflare R2 with metadata and relation links in PostgreSQL.
4. Support idempotent multi-step workflows with database transaction boundaries.

---

## 2. Master Cross-Module Relationship Matrix

| Source Entity | Related Entity | Cardinality | Canonical Source of Truth | Expected Behavior & Cross-Module Synchronization |
|---|---|---|---|---|
| **Task** (`Task`) | **Plan / Goal** (`Plan` / `Goal`) | Many-to-One (`linkedRecordId`, `type='goal'/'plan'`) | `tasks` table | Linked task appears in Plan/Goal task list. Status transitions (`COMPLETED`) trigger recalculation of plan/goal progress when progress mode is `TASK_COMPLETION`. |
| **Task** (`Task`) | **Campaign** (`Campaign`) | Many-to-One (`linkedRecordId`, `type='campaign'`) | `tasks` table | Stage tasks linked to a campaign appear in campaign stage views and contribute to campaign progress. Also visible in My Tasks / All Tasks. |
| **Task** (`Task`) | **Meeting Action Item** (`MeetingActionItem`) | One-to-One (`convertedTaskId`) | `tasks` & `meeting_action_items` | Converting an action item creates a canonical Task with back-reference to `meetingId`. Subsequent calls are idempotent and return the existing task. |
| **Task** (`Task`) | **CRM Follow-Up** (`CrmFollowUp`) | One-to-One (`linkedTaskId`) | `crm_follow_ups` & `tasks` | Follow-ups can optionally generate a Task. Completion of follow-up preserves link to the underlying CRM client/buyer record. |
| **Task** (`Task`) | **Team Member Profile** (`Profile`) | Many-to-One (`assigneeId`) | `tasks` & `profiles` | Assigning/reassigning tasks updates member active workload count in Team directory without altering creator or historical session attribution. |
| **Task** (`Task`) | **Team Task Calendar** | Direct View Projection | `tasks` (`plannedStart`, `deadline`) | Tasks appear dynamically in Team Task Calendar by planned dates; updates to task dates reflect immediately in the calendar without duplicating events. |
| **Meeting** (`Meeting`) | **Meetings & Visits Calendar** | Direct View Projection | `meetings` (`date`, `startTime`, `endTime`) | Scheduled meetings appear in Meetings & Visits Calendar; rescheduling updates the meeting record and calendar view atomically. |
| **Meeting** (`Meeting`) | **CRM Record** (`CrmTechRecord` / `CrmBuyerRecord` / `CrmPartnerRecord`) | Many-to-One (`linkedRecordId`) | `meetings` & CRM tables | Client/partner meetings link to the CRM record and appear in the CRM record's interaction timeline. |
| **Site Visit** (`SiteVisit`) | **Buyer CRM Record** (`CrmBuyerRecord`) | Many-to-One (`buyerRecordId`) | `site_visits` & `crm_buyer_records` | Scheduled site visits appear in Buyer's visit history and in the Meetings & Visits Calendar. Updating outcome reflects in buyer follow-ups. |
| **Site Visit** (`SiteVisit`) | **Meetings & Visits Calendar** | Direct View Projection | `site_visits` (`visitDate`, `startTime`, `endTime`) | Displays in calendar alongside meetings, with distinctive badge and customer/project details. |
| **Campaign** (`Campaign`) | **Content Calendar** | Direct View Projection | `campaigns` & stage 5 posting | Planned publication date displays in Content & Campaign Calendar. Marking published records `actualPublishDate` while preserving `targetPublishDate`. |
| **Campaign** (`Campaign`) | **Asset** (`Asset`) | Many-to-Many (`campaign_asset_links`, `asset_relationships`) | `assets` & relationship join tables | Files uploaded via campaign store in R2 and register in `assets`. Linking an existing asset reuses `assetId`. Unlinking removes relationship only; file in R2 remains intact. |
| **Campaign** (`Campaign`) | **Campaign Stage Tasks** | One-to-Many (`linkedRecordId`) | `tasks` table | Stage tasks use the shared task engine. Transitioning stages records stage history and preserves task history. |
| **Asset** (`Asset`) | **Cloudflare R2 Object Storage** | One-to-One (`storageKey`) | Cloudflare R2 & `assets` | Asset metadata is persistent in DB; physical object is stored in R2. Permanent deletion requires explicit confirmation and verification of active relationships. |
| **Profile Selector** | **Acting Context** | Session Context | `profiles` & `workspace_memberships` | Changing acting profile reloads My Tasks and member workload queries without rewriting historical audit records, creators, or work sessions. |
| **Workspace Selector** | **Workspace Context** | Session Context | `workspaces` | Switching workspaces resets all workspace-scoped TanStack query caches, preventing data leakages across Corviin Tech and Corviin Real Estate. |
| **Dashboard** (`DashboardSummary`) | **All Operational Modules** | Dynamic Aggregation | PostgreSQL DB queries | Aggregates tasks, overdue counts, active campaigns, upcoming meetings/visits, CRM leads, and R2 storage usage per active workspace. |
| **Global Search** | **All Workspace Entities** | Search Index / Query | Indexed domain tables | Returns matching tasks, campaigns, CRM records, meetings, and assets with original IDs for direct deep-link navigation. |
| **Audit Events** (`AuditEvent`) | **All Domain Transitions** | Append-Only Stream | `audit_events` | Immutable log recording actor context, entity type/id, timestamp, action, and before/after values for all cross-module operations. |

---

## 3. Query Invalidation & Frontend State Synchronization

When a mutation occurs in any module, the affected TanStack Query caches must be systematically invalidated using unified query keys:

| Mutation Trigger | Impacted Query Keys |
|---|---|
| `tasks.createTask` | `['tasks', workspaceId]`, `['dashboard', workspaceId]`, `['calendar', 'team', workspaceId]`, `['plans', workspaceId]`, `['campaigns', workspaceId]` |
| `tasks.assignTask` | `['tasks', workspaceId]`, `['team', workspaceId]`, `['team', 'workload', workspaceId]` |
| `tasks.completeTask` | `['tasks', workspaceId]`, `['dashboard', workspaceId]`, `['plans', workspaceId]`, `['campaigns', workspaceId]` |
| `meetings.convertActionItem` | `['meetings', workspaceId, meetingId]`, `['tasks', workspaceId]`, `['dashboard', workspaceId]` |
| `meetings.scheduleVisit` | `['crm', 'buyers', workspaceId]`, `['calendar', 'meetings-visits', workspaceId]`, `['dashboard', workspaceId]` |
| `campaigns.changeStage` | `['campaigns', workspaceId]`, `['dashboard', workspaceId]`, `['audit', workspaceId]` |
| `campaigns.publishContent` | `['campaigns', workspaceId]`, `['calendar', 'content', workspaceId]`, `['dashboard', workspaceId]` |
| `assets.linkToCampaign` | `['campaigns', workspaceId, campaignId]`, `['assets', workspaceId]` |
| `assets.unlinkFromCampaign` | `['campaigns', workspaceId, campaignId]` (Asset remains in `['assets', workspaceId]`) |
| `workspace.switch` | Reset all queries: `queryClient.removeQueries({ queryKey: [previousWorkspaceId] })` |
| `profile.switch` | Invalidate profile-scoped queries: `['tasks', 'my', workspaceId, profileId]` |

---

## 4. Idempotency & Transaction Safeguards

1. **Meeting Action Item Conversion**:
   - Condition: Check `item.status === 'CONVERTED' && item.convertedTaskId`.
   - Behavior: If already converted, return existing task and `alreadyConverted: true`.
   - Persistence: Atomic update marking action item converted and inserting task record.

2. **Asset Linking**:
   - Condition: Check if `assetId` is already linked to `campaignId`.
   - Behavior: If link exists, return existing link. If not, create relationship record without re-uploading file to R2.

3. **Campaign Content Publication**:
   - Condition: Updating actual publication date preserves `targetPublishDate` for planned vs actual SLA reporting.

