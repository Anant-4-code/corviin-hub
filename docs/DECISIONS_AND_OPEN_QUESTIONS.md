# CORVIIN HUB — Technical Decisions & Open Questions

**Document ID:** CH-DOC-002  
**Version:** 1.0  
**Status:** Active working document  
**Date:** 5 November 2026  

---

## 1. Confirmed Technical & Architecture Decisions

| # | Domain | Confirmed Decision | Source / Reason |
|---|---|---|---|
| 1 | **Architecture** | Monorepo structure using npm workspaces (`apps/web`, `apps/api`, `packages/shared`, `infrastructure/`, `docs/`). | TRD §4 / Build Phases |
| 2 | **Frontend Stack** | React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + Zustand. | TRD §4.1 / Approved Baseline |
| 3 | **Backend Stack** | Node.js + NestJS (REST API under `/api/v1`) with Swagger/OpenAPI documentation. | TRD §4.2 / Build Phases |
| 4 | **Android Strategy** | Single React frontend packaged as Android APK via Capacitor. No separate Kotlin UI. | TRD §4.3 / Product Decision |
| 5 | **Workspaces** | Two isolated business units: **Corviin Tech** and **Corviin Real Estate**. All operational data strictly partitioned server-side. | PRD §2 / TRD §4.4 |
| 6 | **Initial Profile Mode** | Shared-device acting profile selector (Anant, Rohit, Utkarsh) with **no passwords or login**. Identity is not verified. | PRD §2.1 / Build Phases Phase 1 |
| 7 | **Visual Design** | Clean, mature CRM styling inspired by Pinterest CRM layouts. **Absolute zero-animation policy**: no page transitions, shimmers, or hover lifts. | UI/UX Spec / Design Requirement Update |
| 8 | **Theme Parity** | First-class Light and Dark modes with semantic design tokens persisted locally. | UI/UX Spec §8 |
| 9 | **Persistence (Deferred)** | Relational PostgreSQL with Prisma ORM and private S3-compatible object storage scheduled for Phase 4 & Phase 7. | TRD §6 / Build Phases Phase 4 |
| 10 | **Data Authority** | Tasks, campaigns, meetings, and assets are single sources of truth. Calendars and dashboards are read-only query projections, not duplicate tables. | PRD §3 / TRD §4.6 |

---

## 2. Identified Open Questions & Recommended Resolutions

### Q1: In-app dialer/messaging vs Native Intent Hand-off
- **Context:** CRM records require calling and messaging contacts (clients, partners, buyers).
- **Options:** 
  1. *Native OS Hand-offs (Recommended for initial release):* `tel:` and `https://wa.me/` URI triggers launching default phone dialer or WhatsApp client on PC/mobile.
  2. *Integrated VoIP/Cloud APIs:* Twilio or WhatsApp Business Cloud API integration.
- **Status:** Native hand-offs implemented for Phase 1–3; Cloud API integration deferred to Phase 7.

### Q2: Object Storage Provider for Private Assets
- **Context:** Private S3-compatible media and document storage for campaign raw video rushes and client briefs.
- **Options:** Cloudflare R2 (zero egress fees, S3 compatible) vs AWS S3 (standard, global).
- **Status:** Architecture supports any S3-compatible provider via `@aws-sdk/client-s3`. Final provider selection deferred to Phase 7.

### Q3: Notification Dispatch Channels
- **Context:** Critical deadline and stage-change alerts.
- **Options:** In-app notification center only vs in-app + Firebase Cloud Messaging (FCM) push on Android.
- **Status:** In-app notification center implemented in frontend shell; FCM background worker planned for Phase 8 (Android packaging).

---

## 3. Scope Boundaries & Deferred Items

The following items are intentionally deferred to subsequent build phases:
- **Phase 3:** Full business logic CRUD workflows for Tasks, Campaigns, CRM pipelines, and Meetings.
- **Phase 4:** PostgreSQL database schema, Prisma migrations, and database seed scripts.
- **Phase 7:** Direct-to-S3 presigned upload infrastructure and binary asset storage.
- **Phase 8:** Android APK compilation and physical device testing via Capacitor.
- **Phase 10:** Production cloud hosting, HTTPS domain configuration, and automated backup routines.

