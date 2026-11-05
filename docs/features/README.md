# CORVIIN HUB — Feature-by-Feature UI/UX & Functional Specifications

**Package:** CORVIIN HUB Feature Specifications v1.0  
**Status:** Detailed working specifications for design and engineering

This package expands the CORVIIN HUB PRD, TRD and Web & Mobile Architecture into individual feature-level documents. Each document explains the purpose, page structure, PC experience, mobile experience, sub-features, forms, interactions, workflows, data behaviour, states, security considerations and acceptance criteria where relevant.

## Documents

| # | File | Coverage |
|---:|---|---|
| 00 | `00_PRODUCT_UI_UX_DESIGN_SYSTEM.md` | Shared UI system, app shell, navigation, responsive rules |
| 01 | `01_DASHBOARD.md` | Dashboard widgets, summaries, activity and navigation |
| 02 | `02_MY_TASKS.md` | Personal task queue, task detail, work controls |
| 03 | `03_ALL_TASKS.md` | Shared task register, list, Kanban, calendar, bulk actions |
| 04 | `04_PLANS_AND_GOALS.md` | Goals, plans, milestones, progress and risk |
| 05 | `05_CALENDAR_CONTENT_CAMPAIGNS.md` | Content and campaign calendar |
| 06 | `06_CALENDAR_TEAM_TASKS.md` | Team task calendar and member workload |
| 07 | `07_CALENDAR_MEETINGS_VISITS.md` | Meetings and site visits calendar |
| 08 | `08_CAMPAIGNS.md` | Five-stage campaign production workflow and campaign assets |
| 09 | `09_ASSETS_AND_STORAGE.md` | Global asset library, upload, versions, preview and permissions |
| 10 | `10_CRM_OVERVIEW.md` | Shared CRM UX, navigation, interactions and follow-ups |
| 11 | `11_CRM_TECH.md` | Corviin Tech CRM |
| 12 | `12_CRM_REAL_ESTATE_PARTNERS.md` | Developer, builder and partner CRM |
| 13 | `13_CRM_REAL_ESTATE_BUYERS.md` | Buyer CRM, property requirements and site visits |
| 14 | `14_MEETINGS.md` | Meeting records, notes, decisions and action items |
| 15 | `15_TEAM.md` | Team directory, member detail and workload |
| 16 | `16_SETTINGS.md` | Personal and workspace settings |
| 17 | `17_NOTIFICATIONS_ACTIVITY_AUDIT.md` | Notifications, activity timeline and audit |
| 18 | `18_GLOBAL_SEARCH_AND_CREATE_FLOWS.md` | Global search, contextual create and cross-module links |

## Product-wide rules

1. One responsive React client serves PC web and Android through Capacitor.
2. Tech and Real Estate share the product shell but operational data is workspace-scoped.
3. The initial team is Anant, Rohit and Utkarsh; do not hard-code the application to three members.
4. My Tasks and All Tasks use the same task records.
5. The three calendars are views over source records, not duplicate event databases.
6. Campaign tasks use the shared task engine.
7. Campaign Assets displays only campaign-linked assets by default; the global library can find the same files.
8. Tech CRM, Real Estate Buyers and Real Estate Developers/Partners have distinct fields and pipelines.
9. Every important operation records the actor and timestamp.
10. Desktop uses information-efficient tables and multi-column layouts; mobile uses cards, short forms and agenda-first views.
11. Workspace isolation is enforced on the server for every request.
12. Unconfirmed choices (auth provider, exact upload limits, notification provider, offline support, hosting) remain decisions to finalise.

## How to use this package

- Product/design: use the page hierarchy, interaction rules, states and responsive requirements to produce wireframes and prototypes.
- Frontend: map each page and interaction to reusable components and route-level feature modules.
- Backend: map workflows to API endpoints, data entities, validation, authorisation and audit events.
- QA: convert acceptance criteria and workflows into test cases.
- Team: review open decisions before treating a behaviour as final.

These documents are detailed v1.0 specifications. They should be reviewed and versioned as the team approves design decisions. They do not replace the PRD or TRD; they provide feature-level detail beneath them.
