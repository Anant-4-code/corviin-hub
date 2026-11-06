# CORVIIN HUB — Database Setup Guide

## Architecture Overview

CORVIIN HUB uses a unified, enterprise-grade persistence architecture:

- **Database Provider**: Supabase PostgreSQL for managed production / PostgreSQL 17 for local development.
- **ORM & Data Layer**: Prisma 7 with the high-performance `@prisma/adapter-pg` driver adapter.
- **Object Storage**: Cloudflare R2 (S3-compatible API) for all binary assets, footage, documents, and attachments.
- **Backend API**: NestJS REST API with PrismaService, StorageService, and workspace-scoped data access.

---

## 1. Local Development Setup

### Automated Local PostgreSQL Cluster

For local development and testing, a dedicated PostgreSQL 17 cluster runs on port `5433` (preventing conflicts with any default system service on port 5432):

```bash
# 1. Initialize local cluster (one-time setup)
& "C:\Program Files\PostgreSQL\17\bin\initdb.exe" -D "apps/api/.pgdata" -U postgres -A trust -E UTF8

# 2. Start database server
& "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D "apps/api/.pgdata" -l "apps/api/.pgdata/logfile" -o "-p 5433" start

# 3. Create development & test databases
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -h 127.0.0.1 -p 5433 -U postgres corviin_hub
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -h 127.0.0.1 -p 5433 -U postgres corviin_hub_test
```

### Environment Configuration (`apps/api/.env`)

```ini
# Database URLs (Local port 5433)
DATABASE_URL="postgresql://postgres@localhost:5433/corviin_hub?schema=public"
DIRECT_URL="postgresql://postgres@localhost:5433/corviin_hub?schema=public"
TEST_DATABASE_URL="postgresql://postgres@localhost:5433/corviin_hub_test?schema=public"

# Cloudflare R2 (Local uses MockStorageProvider automatically when mock keys are detected)
R2_ACCOUNT_ID=mock-r2-account-id
R2_ACCESS_KEY_ID=mock-r2-access-key-id
R2_SECRET_ACCESS_KEY=mock-r2-secret-access-key
R2_BUCKET_NAME=corviin-hub-assets
R2_ENDPOINT=https://mock-r2-account-id.r2.cloudflarestorage.com
R2_REGION=auto
```

---

## 2. Prisma Database Commands

All database operations are managed from `apps/api`:

```bash
cd apps/api

# Generate Prisma Client
npm run prisma:generate

# Push schema directly to PostgreSQL
npm run prisma:push

# Run deterministic database seed
npm run prisma:seed

# Launch interactive Prisma Studio GUI
npm run prisma:studio
```

---

## 3. Master Relational Schema Domains

The schema in `apps/api/prisma/schema.prisma` models 12 distinct functional domains:

1. **Workspaces & Profiles**:
   - `workspaces`: Corviin Tech (`ws-tech-0001-0000-000000000001`) and Corviin Real Estate (`ws-real-0002-0000-000000000002`).
   - `profiles`: Anant, Rohit, Utkarsh, Vikramaditya Rao.
   - `workspace_memberships`: Role-based member links per workspace.
2. **Operational Tasks**:
   - `tasks`, `task_checklist_items`, `task_work_sessions`, `task_reschedule_history`, `task_comments`, `task_attachments`, `task_activity_events`.
3. **Marketing Campaigns**:
   - `campaigns`, `campaign_scripts`, `campaign_footage_items`, `campaign_stage_history`, `campaign_asset_links`.
4. **Corviin Tech CRM**:
   - `crm_tech_records`, `crm_tech_proposals`, `crm_tech_project_refs`, `crm_tech_stage_history`.
5. **Real Estate Partner CRM**:
   - `crm_partner_records`, `crm_partner_projects`, `crm_partner_stage_history`.
6. **Real Estate Buyer CRM**:
   - `crm_buyer_records`, `crm_buyer_shared_properties`, `crm_buyer_stage_history`, `site_visits`.
7. **Unified Follow-ups & Interactions**:
   - `crm_follow_ups`, `crm_interactions`.
8. **Meetings Management**:
   - `meetings`, `meeting_action_items`, `meeting_agenda_topics`, `meeting_decisions`.
9. **Plans & Goals**:
   - `goals`, `plans`, `plan_milestones`.
10. **Digital Asset Management**:
    - `assets`, `asset_versions`, `asset_relationships`.
11. **Notifications & Auditing**:
    - `in_app_notifications`, `audit_events` (strictly append-only).
12. **Settings**:
    - `personal_settings` (profile-scoped), `workspace_settings` (workspace-scoped).

---

## 4. Workspace Isolation Guarantees

Every query, repository, and controller enforces strict workspace scoping:
- No query ever returns entities from another workspace.
- Storage keys follow `workspaces/{workspaceId}/assets/...` namespacing.
- Foreign keys and composite unique constraints (`[workspaceId, ...]`) ensure multi-tenant partition integrity.

