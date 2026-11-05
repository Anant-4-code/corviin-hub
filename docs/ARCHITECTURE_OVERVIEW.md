# CORVIIN HUB — System Architecture Overview

**Document ID:** CH-ARCH-001  
**Version:** 1.0  
**Product:** CORVIIN HUB  

---

## 1. System Topology

CORVIIN HUB adopts a **Modular Monolith** architecture backed by a shared relational persistence layer, private S3 asset storage, and a single responsive React frontend packaged for Web and Android APK via Capacitor.

```text
               ┌────────────────────────────────────────────────────────┐
               │                     Client Layer                       │
               │  PC Web / Tablet / Mobile Web (React 18 + Vite)        │
               │  Android APK Container (Capacitor WebView)             │
               └───────────────────────────┬────────────────────────────┘
                                           │ HTTPS + Headers
                                           │ (x-profile-id, x-workspace-id)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                   NestJS API Gateway                   │
               │  - Global ValidationPipe (whitelist & transform)       │
               │  - CORS & Security Headers                             │
               │  - Swagger / OpenAPI Documentation                     │
               │  - Request Context Interceptor                         │
               └───────────────────────────┬────────────────────────────┘
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         ▼                                                                   ▼
┌───────────────────┐                                               ┌───────────────────┐
│ Operational Core  │                                               │ Growth & Assets   │
│ - HealthModule    │                                               │ - CampaignsModule │
│ - ProfilesModule  │                                               │ - CrmModule       │
│ - WorkspacesModule│                                               │ - AssetsModule    │
│ - TasksModule     │                                               │ - MeetingsModule  │
│ - PlansGoalsModule│                                               │ - TeamModule      │
│ - CalendarModule  │                                               │ - SettingsModule  │
└────────┬──────────┘                                               └─────────┬─────────┘
         │                                                                    │
         └─────────────────────────────────┬──────────────────────────────────┘
                                           │ Prisma Client
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                    Data Storage Layer                  │
               │  PostgreSQL (15+) — Workspace Scoped Relational DB     │
               │  Private Object Storage (Cloudflare R2 / S3)           │
               └────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

### 2.1 Workspace Isolation
- **Two Isolated Workspaces:** Corviin Tech and Corviin Real Estate.
- **Server-Side Authority:** Workspace scoping is enforced on the server. The client transmits the current workspace via the `x-workspace-id` request header. Every database query will include `where: { workspaceId }`.
- **Cache Eviction on Switch:** When switching workspaces in the UI, TanStack Query invalidates and refetches all workspace-scoped server state, preventing cross-tenant data bleed.

### 2.2 Acting Profile Selector (No Login)
- **Shared-Device Context:** Built for trusted internal pilot usage. Users select from dynamic profile records (initially **Anant**, **Rohit**, **Utkarsh**).
- **Security Notice:** The acting profile is passed via the `x-profile-id` header for operational attribution (who created/assigned/rescheduled work). The UI persistently clarifies that identity is unverified.
- **Zero Rewrite Migration Path:** The profile context abstraction (`@ActingProfile()` in NestJS and `useAppStore` in React) will cleanly transition to standard JWT/OAuth authentication in Phase 10 without refactoring feature modules.

### 2.3 Strict Zero-Animation Policy
- In compliance with the Design System specification, CORVIIN HUB contains **zero decorative animations or motion effects**.
- No page transitions, no hover transforms/lifts, no shimmering skeletons, and no animated counters.
- Visual feedback is immediate and static (solid borders, distinct surface tones, static loading text).

### 2.4 Single Frontend for Web and Android
- Rather than maintaining separate Kotlin and React codebases, a single responsive React SPA is wrapped into an Android APK using Capacitor.
- Touch targets conform to WCAG 2.2 AA standards (>= 44x44 CSS px), and views adapt from dense tables on desktop to actionable cards and agenda lists on mobile.

### 2.5 Single Source of Truth
- Tasks, CRM leads, meetings, and campaign assets are modeled as canonical records.
- Calendars, dashboards, and member workload views are dynamic query projections over existing records rather than separate, duplicate database tables.

