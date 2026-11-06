# CORVIIN HUB — Supabase PostgreSQL Guide

## Overview

Supabase provides the managed PostgreSQL infrastructure for CORVIIN HUB production deployments. This guide describes connection pooling, migration execution, and security practices.

---

## 1. Connection Architecture

Supabase provides two distinct connection strings:

| Connection Type | Port | URL Format | Purpose |
|---|---|---|---|
| **Transaction Pooler (Supavisor)** | `6543` | `postgresql://postgres.[ref]:[pwd]@aws-0-[region].pooler.supabase.com:6543/postgres` | Used as `DATABASE_URL` for application runtime queries (handles high concurrency). |
| **Direct Session Connection** | `5432` | `postgresql://postgres.[ref]:[pwd]@aws-0-[region].pooler.supabase.com:5432/postgres` | Used as `DIRECT_URL` for DDL migrations and Prisma CLI schema changes. |

### Environment Configuration for Supabase

In production environment / CI/CD secrets:

```ini
# Production Supabase Connection Strings
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Object Storage stays Cloudflare R2 (Do NOT use Supabase Storage)
R2_ACCOUNT_ID=[CLOUDFLARE_ACCOUNT_ID]
R2_ACCESS_KEY_ID=[R2_ACCESS_KEY_ID]
R2_SECRET_ACCESS_KEY=[R2_SECRET_ACCESS_KEY]
R2_BUCKET_NAME=corviin-hub-assets
```

---

## 2. Deploying Schema Migrations to Supabase

### Option A: Using the SQL Editor or Direct psql

A complete baseline migration script is generated and version-controlled at:
`apps/api/prisma/migrations/20261106000000_init/migration.sql`

1. Open Supabase Dashboard -> **SQL Editor**.
2. Paste the contents of `apps/api/prisma/migrations/20261106000000_init/migration.sql`.
3. Click **Run**. All 12 domain tables, composite indexes, and foreign keys will be created atomically.

### Option B: Using Prisma Migrate

```bash
cd apps/api
npx prisma db push --config prisma.config.ts
npm run prisma:seed
```

---

## 3. Strict Security Rules

1. **Zero Client Connections**: The React web frontend and Capacitor Android app **never** connect to Supabase PostgreSQL directly. All database access flows strictly through the authenticated NestJS REST API.
2. **Never Commit Secrets**: Database passwords and direct connection strings must never be committed to git.
3. **No Supabase Storage**: File uploads are handled exclusively via Cloudflare R2 presigned URLs. Supabase Storage is not used.

