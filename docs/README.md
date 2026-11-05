# CORVIIN HUB — Documentation Index

**Document ID:** CH-DOC-000  
**Version:** 1.0  
**Product:** CORVIIN HUB  

---

## 1. Master Product Specifications

- [`PRD.md`](./PRD.md): Product Requirements Document (vision, user personas, operational scope).
- [`TRD.md`](./TRD.md): Technical Requirements Document (architecture baseline, multi-tenancy, database strategy).
- [`UPDATED_FEATURE_SCOPE.md`](./UPDATED_FEATURE_SCOPE.md): Updated feature decisions (no-login profile switcher, 3 calendars, 5-stage campaigns).
- [`WEB_MOBILE_ARCHITECTURE_AND_FLOW.md`](./WEB_MOBILE_ARCHITECTURE_AND_FLOW.md): Responsive design, user journeys, route map.
- [`CORVIIN_HUB_UI_UX_SPECIFICATION.md`](./CORVIIN_HUB_UI_UX_SPECIFICATION.md): Comprehensive UI/UX specification, zero-animation rule, light/dark themes.
- [`DETAILED_FEATURE_WORKING.md`](./DETAILED_FEATURE_WORKING.md): Baseline functional details and mechanics.

---

## 2. Implementation & Project Operations

- [`implementation/CORVIIN_HUB_BUILD_PHASES.md`](./implementation/CORVIIN_HUB_BUILD_PHASES.md): Phased vibe-coding roadmap and prompts (Phases 0–10).
- [`implementation/BUILD_STATUS.md`](./implementation/BUILD_STATUS.md): Master tracker with live implementation status for all phases and features.
- [`DECISIONS_AND_OPEN_QUESTIONS.md`](./DECISIONS_AND_OPEN_QUESTIONS.md): Technical decisions and open questions log.
- [`REPOSITORY_STRUCTURE.md`](./REPOSITORY_STRUCTURE.md): Detailed monorepo directory hierarchy.
- [`ARCHITECTURE_OVERVIEW.md`](./ARCHITECTURE_OVERVIEW.md): Frontend, backend, and cross-cutting architectural principles.
- [`API_OVERVIEW.md`](./API_OVERVIEW.md): NestJS endpoint catalog, context interceptors, and Swagger integration.
- [`ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md): Step-by-step developer environment setup.

---

## 3. Individual Feature Specifications

All 18 feature specifications are indexed in [`features/README.md`](./features/README.md):
- `00_PRODUCT_UI_UX_DESIGN_SYSTEM.md`: Design tokens, semantic colors, and component rules
- `01_DASHBOARD.md`: Workspace summary metrics and daily action stream
- `02_MY_TASKS.md`: Assigned tasks, work session timer, and completion notes
- `03_ALL_TASKS.md`: Workspace task register, Kanban board, and workload breakdown
- `04_PLANS_AND_GOALS.md`: Goals, plans, and milestones hierarchy
- `05_CALENDAR_CONTENT_CAMPAIGNS.md`: Content production and campaign schedule
- `06_CALENDAR_TEAM_TASKS.md`: Team task timetable with member accordions
- `07_CALENDAR_MEETINGS_VISITS.md`: Client meetings and buyer site visits
- `08_CAMPAIGNS.md`: 5-stage campaign production pipeline
- `09_ASSETS_AND_STORAGE.md`: Global media library and presigned S3 storage
- `10_CRM_OVERVIEW.md`: CRM architecture and multi-pipeline overview
- `11_CRM_TECH.md`: Software and automation client pipeline
- `12_CRM_REAL_ESTATE_PARTNERS.md`: Builder, developer, and channel partner pipeline
- `13_CRM_REAL_ESTATE_BUYERS.md`: Flat buyer enquiries and site visit workflows
- `14_MEETINGS.md`: Meeting minutes, decisions, and action-item-to-task conversion
- `15_TEAM.md`: Dynamic member directory, attribution, and workload
- `16_SETTINGS.md`: Personal preferences and workspace configuration
- `17_NOTIFICATIONS_ACTIVITY_AUDIT.md`: Notification center and append-only audit trail
- `18_GLOBAL_SEARCH_AND_CREATE_FLOWS.md`: Global search and contextual create action
