# CORVIIN HUB — Database Backup & Disaster Recovery Guide

## Overview

This guide outlines the backup, retention, and disaster recovery procedures for CORVIIN HUB's PostgreSQL database and Cloudflare R2 object storage.

---

## 1. PostgreSQL Database Backups

### Automated Managed Backups (Supabase)
- **Point-in-Time Recovery (PITR)**: Supabase supports Continuous WAL archiving enabling rollbacks to any second within the retention window (7 to 30 days depending on plan).
- **Daily Physical Snapshots**: Automated daily full snapshots stored in multi-region encrypted cloud storage.

### Manual Logical Backup (`pg_dump`)

To create an immediate full logical snapshot:

```bash
# Export full database with schema and data
pg_dump "$DIRECT_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="corviin_hub_backup_$(date +%Y%m%d_%H%M%S).dump"
```

### Logical Database Restore (`pg_restore`)

To restore from a dump file:

```bash
# Restore into an empty or fresh database
pg_restore \
  --dbname="$DIRECT_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  "corviin_hub_backup_YYYYMMDD_HHMMSS.dump"
```

---

## 2. Cloudflare R2 Object Storage Retention

1. **Bucket Versioning**: Enabled on `corviin-hub-assets` bucket to safeguard against accidental overwrites or malicious deletions.
2. **Lifecycle Policies**:
   - Soft-deleted assets transition to cold tier after 90 days.
   - Incomplete multipart uploads are aborted after 7 days.
3. **Cross-Region Replication**: For mission-critical enterprise deployments, replicate bucket objects to a secondary cloud region.

---

## 3. Disaster Recovery Plan

| Step | Action | Recovery Target |
|---|---|---|
| **1. Database Failover** | Provision fresh Supabase instance or restore latest PITR snapshot. | RTO < 30 mins |
| **2. Apply Migrations** | Run `npx prisma db push` or execute `migration.sql` if restoring to empty DB. | RTO < 5 mins |
| **3. Reconfigure API** | Update `DATABASE_URL` and `DIRECT_URL` in backend environment. | RTO < 5 mins |
| **4. Verify Storage** | Confirm R2 bucket connectivity via `/api/health`. | RTO < 2 mins |
| **5. Health Validation** | Execute `npx jest test/persistence-integration.spec.ts` against restored DB. | RTO < 5 mins |

