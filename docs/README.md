# CORVIIN HUB — Master Documentation Index

**Product:** CORVIIN HUB — Internal Operations Platform for Corviin Group  
**Directory:** `docs/`  

---

## 1. Product & Architecture Specifications (Source of Truth)

- [`CORVIIN_HUB_PRD_v1.0.md`](./CORVIIN_HUB_PRD_v1.0.md): Product Requirements Document (vision, user personas, operational scope)
- [`CORVIIN_HUB_TRD_v1.0.md`](./CORVIIN_HUB_TRD_v1.0.md): Technical Requirements Document (architecture baseline, multi-tenancy, database strategy)
- [`CORVIIN_HUB_Updated_Feature_Scope_v1.1.md`](./CORVIIN_HUB_Updated_Feature_Scope_v1.1.md): Updated feature decisions (no-login profile switcher, 3 calendars, 5-stage campaigns)
- [`CORVIIN_HUB_Web_Mobile_Architecture_and_Flow_v1.0.md`](./CORVIIN_HUB_Web_Mobile_Architecture_and_Flow_v1.0.md): Responsive design, user journeys, route map
- [`CORVIIN_HUB_UI_UX_Specification_v1.0.md`](./CORVIIN_HUB_UI_UX_Specification_v1.0.md): Comprehensive UI/UX specification, zero-animation rule, light/dark themes
- [`CORVIIN_HUB_Detailed_Feature_Working.md`](./CORVIIN_HUB_Detailed_Feature_Working.md): Baseline functional details and mechanics
- [`CORVIIN_HUB_BUILD_PHASES_V1.0.md`](./CORVIIN_HUB_BUILD_PHASES_V1.0.md): Phased implementation roadmap (Phases 0–10)

---

## 2. Technical Implementation Documents

- [`ARCHITECTURE_OVERVIEW.md`](./ARCHITECTURE_OVERVIEW.md): Frontend, backend, and cross-cutting architectural principles
- [`API_OVERVIEW.md`](./API_OVERVIEW.md): NestJS endpoint catalog, context interceptors, and Swagger integration
- [`ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md): Step-by-step developer environment setup
- [`DECISIONS_AND_OPEN_QUESTIONS.md`](./DECISIONS_AND_OPEN_QUESTIONS.md): Technical decisions and open questions log
- [`REPOSITORY_STRUCTURE.md`](./REPOSITORY_STRUCTURE.md): Detailed monorepo directory hierarchy
- [`implementation/BUILD_STATUS.md`](./implementation/BUILD_STATUS.md): Master tracker with live implementation status

---

## 3. Individual Feature Specifications

All 18 feature specifications are located in [`CORVIIN_HUB_Feature_Specifications_v1.0/`](./CORVIIN_HUB_Feature_Specifications_v1.0/):
- `00_PRODUCT_UI_UX_DESIGN_SYSTEM.md`: Shared visual language, design tokens, component rules
- `01_DASHBOARD.md`: Dashboard summary metrics and daily work
- `02_MY_TASKS.md`: Assigned tasks, work sessions, timer logs
- `03_ALL_TASKS.md`: Workspace task register, Kanban, workload distribution
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
- `README.md`: Feature specification index

