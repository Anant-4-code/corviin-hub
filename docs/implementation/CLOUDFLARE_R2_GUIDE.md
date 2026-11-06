# CORVIIN HUB — Cloudflare R2 Object Storage Integration Guide

## Overview

Cloudflare R2 provides S3-compatible, zero-egress-fee distributed object storage for CORVIIN HUB. It stores all non-text binaries, including:
- 4K video footage and B-roll recordings.
- Creative images, diagrams, hero banners, and thumbnails.
- Project proposals, quotation PDFs, agreements, and legal contracts.
- Meeting recordings, audio voiceovers, and presentation decks.

---

## 1. Storage Architecture & Architecture Pattern

CORVIIN HUB implements an asynchronous, presigned direct-upload pattern to maximize performance and prevent server bottlenecks:

```
[ Browser / Mobile Client ]
         │
         │ 1. POST /api/assets/upload-intent (filename, size, mimeType)
         ▼
[ NestJS Backend API (StorageService) ]
         │
         │ 2. Generates S3 presigned PUT URL (15-min expiry)
         ▼
[ Browser / Mobile Client ]
         │
         │ 3. PUT binary directly to Cloudflare R2 via presigned URL
         ▼
[ Cloudflare R2 Object Storage ]
         │
         │ 4. POST /api/assets/confirm-upload (intentId, storageKey)
         ▼
[ NestJS Backend API ]
         │
         │ 5. Creates Asset metadata record in PostgreSQL (Prisma)
         ▼
[ PostgreSQL Database ]
```

---

## 2. Key Namespacing & Tenant Isolation

Storage keys are deterministically scoped to enforce strict workspace isolation:

```
workspaces/{workspaceId}/assets/{year}/{month}/{uniqueId}-{sanitizedFileName}
```

Example:
`workspaces/ws-tech-0001-0000-000000000001/assets/2026/11/ast-98ab-architecture_diagram.png`

Rules:
- Files from `ws-tech` are segregated under the `workspaces/ws-tech-...` prefix.
- Filenames are sanitized via `StorageService.sanitizeFilename()`, stripping path traversal sequences (`..`), spaces, and shell metacharacters.
- No binary files are ever stored directly in PostgreSQL. Only the storage key, content type, byte size, and version metadata are saved in the database.

---

## 3. Configuration & Fallback Behavior

### Production Configuration (`.env`)

```ini
R2_ACCOUNT_ID=d9472e3820a4...
R2_ACCESS_KEY_ID=e7a1b920...
R2_SECRET_ACCESS_KEY=7c8d9e0f1a...
R2_BUCKET_NAME=corviin-hub-assets
R2_ENDPOINT=https://d9472e3820a4....r2.cloudflarestorage.com
R2_REGION=auto
```

### Local / Offline Development

When `R2_ACCESS_KEY_ID` is missing or starts with `mock-`:
- `StorageModule` automatically falls back to `MockStorageProvider`.
- Presigned upload and download URLs are simulated in memory.
- All unit and integration tests run offline without external cloud credentials.

