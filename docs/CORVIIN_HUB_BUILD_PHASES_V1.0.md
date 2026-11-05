# CORVIIN HUB — Vibe-Coding Build Phases & Master Prompt Pack

**Document ID:** CH-IMPLEMENTATION-ROADMAP-001  
**Version:** 1.1  
**Status:** Updated implementation guide  
**Date:** 5 November 2026  
**Product:** CORVIIN HUB  
**Target:** Responsive PC Web + Android APK  
**Build approach:** AI-assisted / vibe coding, one phase and one feature at a time

---

## 1. Purpose of this document

This document defines the recommended build sequence for CORVIIN HUB using an AI coding agent (Antigravity, Cursor, Windsurf, Claude Code or a similar tool).

The objective is to avoid asking an AI agent to generate the entire application in one attempt. Instead:

1. Establish the complete application skeleton.
2. Build the frontend and backend foundations in parallel.
3. Implement the features individually, in a controlled order.
4. Validate each feature before moving to the next.
5. Complete database, storage, deployment and environment setup.
6. Connect and test every feature across the application.
7. Package the same frontend as an Android APK.
8. Stabilise, document and release the application.

**Important implementation principle:** Design the database entities, API contracts and relationships from the beginning, even if the first UI passes use mock data. Do not postpone thinking about the data model until every screen has been built. The later database phase means implementing and integrating the production persistence layer—not inventing the data architecture at the end.

---

## 2. Reference documents — mandatory source of truth

Place the existing CORVIIN HUB Markdown documents in the repository under:

```text
corviin-hub/
└── docs/
    ├── PRD.md
    ├── TRD.md
    ├── UPDATED_FEATURE_SCOPE.md
    ├── WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
    ├── implementation/
    │   └── CORVIIN_HUB_BUILD_PHASES.md
    └── features/
        ├── README.md
        ├── 00_PRODUCT_UI_UX_DESIGN_SYSTEM.md
        ├── 01_DASHBOARD.md
        ├── 02_MY_TASKS.md
        ├── 03_ALL_TASKS.md
        ├── 04_PLANS_AND_GOALS.md
        ├── 05_CALENDAR_CONTENT_CAMPAIGNS.md
        ├── 06_CALENDAR_TEAM_TASKS.md
        ├── 07_CALENDAR_MEETINGS_VISITS.md
        ├── 08_CAMPAIGNS.md
        ├── 09_ASSETS_AND_STORAGE.md
        ├── 10_CRM_OVERVIEW.md
        ├── 11_CRM_TECH.md
        ├── 12_CRM_REAL_ESTATE_PARTNERS.md
        ├── 13_CRM_REAL_ESTATE_BUYERS.md
        ├── 14_MEETINGS.md
        ├── 15_TEAM.md
        ├── 16_SETTINGS.md
        ├── 17_NOTIFICATIONS_ACTIVITY_AUDIT.md
        └── 18_GLOBAL_SEARCH_AND_CREATE_FLOWS.md
```

The filenames above are the intended repository filenames. If the supplied files have slightly different names, preserve the originals and update this index rather than silently dropping a document.

### Document precedence

When requirements appear to conflict, use this order:

1. `PRD.md` — product intent, user needs and scope.
2. `UPDATED_FEATURE_SCOPE.md` — updated business and functional decisions.
3. `TRD.md` — technical architecture and implementation constraints.
4. `WEB_MOBILE_ARCHITECTURE_AND_FLOW.md` — navigation and user journeys.
5. `features/00_PRODUCT_UI_UX_DESIGN_SYSTEM.md` — shared visual and interaction rules.
6. The relevant individual feature specification — exact feature behaviour and acceptance criteria.
7. This roadmap — implementation order and delivery gates.

Do not invent missing requirements. Identify conflicts or gaps in a `docs/DECISIONS_AND_OPEN_QUESTIONS.md` file and ask for confirmation when a decision materially changes the product.

### Required AI-agent reading behaviour

At the start of every new coding session, the agent must:

- Read this roadmap.
- Read the PRD, TRD, updated feature scope and architecture/flow documents.
- Read the UI/UX design system before changing shared UI.
- Read the relevant feature Markdown before implementing that feature.
- Inspect the existing repository and current implementation before editing.
- Reuse existing components, types, API clients and patterns where appropriate.
- Never replace a working implementation just to generate a different version.
- Report which reference files were read and which acceptance criteria are being implemented.

---

## 3. Product decisions that must remain consistent

### 3.1 Product structure

CORVIIN HUB is one application with two operational workspaces:

- **Corviin Tech**
- **Corviin Real Estate**

The workspaces share the application shell and common modules. Their operational records, CRM pipelines, campaigns, assets, settings and reports remain separated.

### 3.2 Initial profile switcher — no login

For the initial internal version, the app must open directly to a simple **Select Profile** screen or profile switcher. There is no username/password login, OTP, email login or external authentication flow in this initial version.

The three selectable profiles are:

- Anant
- Rohit
- Utkarsh

After selecting a profile, the user enters CORVIIN HUB. The active profile must remain clearly visible in the top bar/profile menu. The user can switch profile from the app without logging out.

The implementation must use stable user IDs, not display names as database keys. Seed the three initial users, but load them dynamically from the backend so additional members can be added later.

**Critical security and audit limitation:** A no-login profile switcher is a convenience selector, not authentication. Anyone with access to the app can select another profile and act as that person. Therefore:
- Clearly treat this as a trusted-device/internal prototype mode.
- Never describe the selected profile as a verified identity.
- Record the selected profile as the *acting profile* in activity records, not as cryptographically verified proof of who performed an action.
- Do not expose the app publicly or store sensitive customer data until proper authentication and access control are introduced.
- Keep the user identity/session abstraction separate from the UI so proper authentication can be added later without rewriting all features.
- Do not implement hidden PINs or pretend security. If a PIN or device lock is later requested, treat it as a separate explicitly approved requirement.

### 3.3 Equal initial access

Anant, Rohit and Utkarsh have equal operational access in the initial version. Do not hard-code only three members into UI logic. All lists and assignments must be dynamic.

### 3.4 Workspace selector

The user selects the active profile and then the workspace (Corviin Tech or Corviin Real Estate), or uses a clear workspace switcher in the shell. Switching workspaces must not mix records.

### 3.5 Platforms

- PC: responsive web app in a browser.
- Android: APK packaged from the same React frontend using Capacitor.
- One shared API and data model.
- Do not build a separate Android UI in Kotlin unless the product owner later changes this decision.

---

## 4. Recommended technical baseline

Use the TRD as the governing technical document. The following is the default implementation baseline:

| Layer | Baseline |
|---|---|
| Monorepo | npm workspaces or pnpm workspaces |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + shared design tokens |
| Routing | React Router |
| API state | TanStack Query |
| Local UI state | Zustand or React Context, used selectively |
| Forms | React Hook Form |
| Validation | Zod |
| Backend | Node.js + NestJS |
| API | REST with versioned routes and OpenAPI/Swagger |
| Database | PostgreSQL |
| ORM | Prisma |
| File storage | Private S3-compatible object storage (provider selected before production) |
| Android | Capacitor |
| Testing | Vitest, React Testing Library, Jest/Supertest, Playwright |
| CI | GitHub Actions or equivalent |

Avoid adding libraries without a clear need. Confirm supported versions and hosting costs before production setup.

### Suggested repository structure

```text
corviin-hub/
├── apps/
│   ├── web/                    # React + Vite + Capacitor client
│   └── api/                    # NestJS backend
├── packages/
│   └── shared/                 # Shared types, Zod schemas, enums, contracts
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── UPDATED_FEATURE_SCOPE.md
│   ├── WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
│   ├── implementation/
│   └── features/
├── infrastructure/
│   ├── database/
│   ├── storage/
│   └── deployment/
├── scripts/
├── .env.example
├── package.json
└── README.md
```

The React app should be the shared web and Android client. Capacitor configuration belongs with that client; do not create a second independently maintained frontend.

---

## 5. Overall implementation sequence

<details>
<summary>Phase overview</summary>

| Phase | Name | Main output |
|---|---|---|
| 0 | Repository and requirements audit | Clean repo, docs indexed, decisions recorded |
| 1 | Whole-app skeleton — frontend + backend together | Running shell, routes, API foundation, profile/workspace switchers |
| 2 | Shared design system and application shell | Responsive desktop/mobile UI foundation |
| 3 | Core feature implementation, one feature at a time | Complete individual modules with mock/API adapter |
| 4 | Database and persistence implementation | PostgreSQL, Prisma, migrations, seed data |
| 5 | Backend feature completion and API integration | Persistent, validated, workspace-scoped APIs |
| 6 | Cross-feature relationships and workflows | One connected operating system, no duplicate records |
| 7 | File storage, notifications and operational services | Uploads, audit, notifications and background behaviour |
| 8 | Android packaging and mobile validation | Installable APK from shared frontend |
| 9 | Testing, security review and performance | Release candidate |
| 10 | Deployment, backups and handover | Production/staging deployment and documentation |

</details>

**Build order clarification:** Phases 3, 4 and 5 can overlap carefully. The UI can be developed against typed mock data and API contracts while backend modules are prepared. Before a feature is considered complete, it must be connected to its real API and persistent database. Do not mark mock-only functionality as production-ready.

---


---

# DESIGN REQUIREMENT UPDATE — CLEAN, STATIC, SELF-EXPLANATORY UI

**Applies to every phase and every feature. This section overrides any earlier wording that could be interpreted as permission to add animations, motion effects, AI-style visuals or decorative interface elements.**

## A. The exact visual direction

CORVIIN HUB must look and feel like a carefully designed, mature business application built by an experienced product design team—not like an AI-generated SaaS template, a landing page, a futuristic concept dashboard or a generic admin-panel generator output.

Use the supplied Pinterest CRM design search as the visual inspiration board:

https://in.pinterest.com/search/pins/?q=crm%20design&rs=ac&len=3&source_id=ac_yFpq0CUQ&eq=crm&etslf=5392

Treat it as a direction reference, not as permission to copy a particular pin or reproduce another product's branding. The intended qualities are a clear CRM information hierarchy, practical navigation, restrained colour, readable data tables, useful record details and consistent light/dark presentation. The design should be original to CORVIIN HUB.

### Visual principles

- Clean, restrained, professional and practical.
- Strong typography and clear information hierarchy.
- Consistent spacing and alignment.
- Subtle borders and surface separation instead of decorative shadows.
- Compact but readable information density on desktop.
- Comfortable touch-friendly layouts on mobile.
- Use colour to communicate status, category and priority—not as decoration.
- Prefer real product content and useful data over decorative placeholder cards.
- Every screen should make its purpose and next action obvious.
- The application must feel consistent across Dashboard, Tasks, CRM, Campaigns, Calendar, Meetings, Assets and Settings.

### Explicitly avoid the generic AI-generated look

Do not use:
- Purple/blue/pink gradient backgrounds as a default visual treatment.
- Glassmorphism, translucent floating panels or frosted-glass cards.
- Neon borders, glow, bloom, outer-glow shadows or luminous accents.
- Random decorative blobs, abstract 3D shapes, floating orbs or ornamental illustrations.
- Excessive rounded cards nested inside other rounded cards.
- A card for every single data point.
- Oversized hero headings or marketing-page layouts inside the business application.
- Unnecessary charts, fake analytics, decorative progress rings or meaningless percentages.
- Emoji as the primary icon system.
- Random icon styles, inconsistent stroke weights or mixed icon libraries.
- Overly large empty spaces that make operational screens inefficient.
- Dense walls of text, tiny labels or low-contrast secondary text.
- Repeated AI-generated filler copy such as “Unlock insights”, “Supercharge productivity” or “Your journey starts here”.
- Fake names, fake leads, fake transactions or fake metrics presented as real data.

Use a consistent professional icon set such as Lucide. Icons must be familiar, correctly chosen and accompanied by visible text where the meaning may not be obvious.

## B. No animation or motion

**The interface must be static and immediate. Do not add animations.**

Do not implement:
- Page transition animations.
- Route transition effects.
- Animated counters or count-up metrics.
- Animated charts or progress bars.
- Skeleton shimmer or pulsing placeholders.
- Auto-scrolling carousels.
- Parallax, scroll-triggered animation or reveal effects.
- Animated backgrounds, gradients or decorative motion.
- Bouncing, floating, rotating or scaling icons.
- Hover transforms, card lifts or animated shadows.
- Spring, elastic or bounce effects.
- Animated modal, drawer, dropdown or sidebar transitions.
- Loading spinners that rotate continuously as decoration.

Interaction feedback must be immediate and non-animated:
- Use clear static hover, focus, selected, pressed and disabled states.
- Use a simple static loading indicator or concise loading text where necessary.
- Use a static progress indicator for uploads or long-running operations.
- Show success and error feedback using a message or toast that appears without an entrance animation.
- Respect reduced-motion preferences, but the default design must already contain no decorative motion.

A functional loading state is allowed; a decorative animated loading effect is not. Do not add animation libraries such as Framer Motion or GSAP unless a future, explicitly approved requirement needs them. Do not add CSS keyframes or transition utilities for visual motion.

## C. Light mode and dark mode — both are first-class themes

Implement both themes as complete, carefully designed visual systems. Neither theme should look like an afterthought or a simple colour inversion.

Provide a theme selector with:
- Light
- Dark
- System (optional, if reliable)

Persist the selected preference locally. Theme changes must apply consistently to every route, dialog, dropdown, table, chart, form, calendar, notification, empty state and mobile screen.

### Light theme direction

- Use a soft neutral or warm-white application background.
- Use white or near-white surfaces for primary content.
- Use dark charcoal text with strong readability.
- Use subtle neutral borders and restrained separators.
- Use one controlled brand accent colour for primary actions and selected states.
- Avoid pure-white glare across every nested surface; use a small, consistent surface hierarchy.
- Status colours must remain restrained and readable.

### Dark theme direction

- Use deep charcoal or graphite backgrounds, not pure black everywhere.
- Use slightly differentiated dark surfaces for sidebar, main content, panels and overlays.
- Use light neutral text with clear contrast.
- Use restrained borders and separators.
- Use the same brand accent and semantic status meaning as light mode, adjusted for contrast.
- Avoid neon, glow, luminous outlines and saturated coloured surfaces.
- Do not simply apply `filter: invert()` or swap black and white.

### Theme implementation rules

- Define semantic design tokens such as `background`, `surface`, `surface-muted`, `text-primary`, `text-secondary`, `border`, `accent`, `success`, `warning`, `danger` and `info`.
- Components must use semantic tokens rather than hard-coded colour values.
- Test both themes on every feature before marking it complete.
- Charts, tables, calendar events, badges and form controls must remain readable in both themes.
- Avoid a separate component implementation for each theme. Use shared components with theme tokens.
- Store the preference as `light`, `dark` or `system`; do not store arbitrary colour overrides in each feature.

## D. Self-explanatory UX — no training required

The application must be understandable to a first-time user without a trainer, onboarding call or separate instruction manual.

A person should be able to open a page and understand:
1. Where they are.
2. What this page is for.
3. What information they are seeing.
4. What the primary action does.
5. What happens after they perform the action.
6. How to return or undo/recover from a mistake where supported.

### Required usability rules

- Use familiar business terminology. Avoid internal engineering terms in the UI.
- Use clear page titles and one-line descriptions explaining the page's purpose.
- Use action labels such as “Create task”, “Add lead”, “Schedule meeting”, “Upload asset” and “Move to next stage”; avoid vague labels such as “Go”, “Process”, “Manage” or “Continue” when the action can be named precisely.
- Put primary actions in predictable locations.
- Keep forms short and group fields by purpose.
- Mark required fields clearly.
- Use sensible defaults where the requirements permit them.
- Provide examples or short helper text for fields that may be misunderstood.
- Explain statuses in plain language where their meaning is not self-evident.
- Use confirmation dialogs for destructive or consequential actions, with a clear description of what will happen.
- Make empty states explain what belongs in the section and provide the relevant create action.
- Make error messages say what failed and what the user can do next.
- Keep filters visible and understandable; show active filters and provide a clear reset action.
- Use breadcrumbs or an obvious back action on nested detail pages.
- Keep related information together on a record detail page.
- Do not rely on hover-only controls; all essential actions must be accessible on touch devices and by keyboard.
- Use tooltips only as secondary explanations, never as the only way to understand a control.
- Do not force users to remember hidden gestures, keyboard shortcuts or undocumented workflows.
- Avoid unnecessary multi-step wizards. Use them only when a process genuinely has dependent stages.
- Use progressive disclosure for advanced fields, but make the expandable section clearly labelled.
- When a user changes profile or workspace, visibly show the active selection.

### Example of self-explanatory empty states

Prefer:
- “No tasks yet. Create a task to assign work and set a deadline.” + **Create task**
- “No buyers found. Add a buyer enquiry to start tracking follow-ups.” + **Add buyer**
- “No files linked to this campaign. Upload a file or link an existing asset.” + **Add asset**

Avoid:
- “Nothing here.”
- “No data.”
- “Oops!”
- Generic empty illustrations with no explanation or action.

## E. Desktop and mobile design expectations

### Desktop / PC

- Use a stable left sidebar with clear active navigation.
- Use a compact top bar for workspace, profile, search, notifications and theme.
- Use tables for operational lists where comparison and scanning matter.
- Keep filters near the list they control.
- Use right-side detail panels only for quick inspection; use a full detail page for complex records.
- Use consistent column alignment, row heights and action placement.
- Avoid excessive card grids when a table or grouped list is clearer.
- Keep primary actions visible without making toolbars crowded.

### Mobile / Android

- Use the agreed bottom navigation: Home, Tasks, Calendar, CRM and More.
- Use readable cards and compact lists, not squeezed desktop tables.
- Use agenda-first calendar views.
- Use single-column forms with large controls.
- Keep primary actions within comfortable thumb reach.
- Use full-screen forms or static bottom sheets when appropriate.
- Avoid horizontal scrolling for essential content.
- Keep table data accessible through mobile-friendly record cards or a deliberate responsive layout.
- Ensure the on-screen keyboard does not hide the active field or Save action.
- Keep the same terminology and workflow as desktop; only the layout and interaction pattern should adapt.

## F. Updated visual acceptance checklist

Every feature and shared component must pass this checklist in both light and dark themes:

- [ ] No decorative animation or motion is present.
- [ ] No gradient/glow/glassmorphism or generic AI-dashboard styling is present.
- [ ] Typography, spacing, borders and iconography are consistent.
- [ ] The page purpose is obvious from its title and description.
- [ ] The primary action is easy to identify.
- [ ] Action labels describe the result of the action.
- [ ] Empty states explain what belongs here and what to do next.
- [ ] Errors explain the problem and the next recovery step.
- [ ] Forms explain required fields and unclear inputs.
- [ ] Statuses are understandable without relying only on colour.
- [ ] Desktop information is easy to scan.
- [ ] Mobile controls are comfortable to use.
- [ ] Keyboard and focus states work.
- [ ] Both themes have readable contrast and consistent surface hierarchy.
- [ ] No fake metrics, fake records or decorative filler are shown.
- [ ] The feature has been reviewed as a real workflow, not just as a screenshot.

---

## G. Mandatory design prompt addendum — append to every coding prompt

Append this block to Phase 0–10 prompts and every individual feature prompt. It is mandatory and overrides any conflicting default styling generated by the coding agent.

```text
CORVIIN HUB — STRICT VISUAL AND UX DIRECTION

The product must have a clean, mature, professional CRM/business-operations interface. Use the supplied Pinterest CRM design search as visual inspiration:
https://in.pinterest.com/search/pins/?q=crm%20design&rs=ac&len=3&source_id=ac_yFpq0CUQ&eq=crm&etslf=5392

Do not copy a specific design or brand. Create an original CORVIIN HUB interface using the reference's general CRM/product-design direction.

ABSOLUTE RULE: NO ANIMATION.
Do not add page transitions, hover transforms, animated counters, animated charts, shimmer skeletons, parallax, floating elements, animated backgrounds, spring effects, bouncing icons, pulsing elements or decorative transitions. All interaction feedback must be immediate and static. Do not install animation libraries for visual effects.

TWO COMPLETE THEMES:
Implement both Light and Dark themes. Both must be polished and usable, not one theme plus an inverted version. Use semantic design tokens for backgrounds, surfaces, text, borders, accent and status colours. Persist the selected theme. Test every component in both themes.

NO AI-GENERATED TEMPLATE LOOK:
Avoid generic SaaS templates, purple/blue/pink gradients, glassmorphism, neon, glow, 3D blobs, decorative floating shapes, excessive nested cards, oversized headings, meaningless charts, fake analytics, emoji icon systems and generic marketing copy. Do not make the application look like a landing page.

DESIGN FOR REAL DAILY WORK:
Prioritise readable tables, clear lists, sensible filters, useful record detail pages, consistent navigation, practical forms and clear action placement. Use real information hierarchy. Keep desktop information-efficient and mobile action-efficient.

SELF-EXPLANATORY WITHOUT TRAINING:
Assume the person using the app has never seen it before and nobody will train them. Every page must explain its purpose through its title and short description. Every action must have a clear label. Forms must explain unclear fields and mark required inputs. Empty states must explain what belongs there and provide the next action. Errors must explain what failed and how to recover. Do not depend on hidden gestures, hover-only controls, undocumented shortcuts or external training.

Do not add a visual element merely because it looks modern. Every element must improve understanding, navigation, data scanning or task completion.

Before considering the UI complete, inspect the actual page in both themes and at desktop and mobile widths. Report any checklist item that is not satisfied.
```

## H. Phase-specific updates

Apply these additional changes to the existing phase prompts:

- **Phase 1:** Build the initial shell with static interactions and both theme foundations. Do not add animated transitions or decorative effects.
- **Phase 2:** Treat the design system as the source of all theme tokens, typography, spacing and reusable components. Add a theme preview so every shared component can be checked in both themes.
- **Phase 3:** Every feature must be self-explanatory and pass the visual acceptance checklist. Do not mark a feature complete after building only its happy-path screen.
- **Phase 4–7:** Preserve the same UI rules while adding persistence, APIs, storage and integrations. Backend complexity must not leak into user-facing labels or workflows.
- **Phase 8:** Keep the same static design and interaction patterns on Android. Respect mobile layout and touch targets.
- **Phase 9:** Add a specific visual/UX audit for animation, theme parity, clarity, accessibility and first-time usability.
- **Phase 10:** Verify the deployed web app and APK retain both themes and all responsive behaviour.

## I. Additional release gate — first-time usability

Before release, ask a person who has not participated in development to complete a small set of ordinary tasks without coaching:

1. Switch to their profile.
2. Open the correct workspace.
3. Find their tasks.
4. Create and assign a task.
5. Find a CRM record and add a follow-up.
6. Create a meeting.
7. Find a campaign and upload or link an asset.
8. Switch between light and dark themes.
9. Return to the dashboard.

Observe where they hesitate, misunderstand labels or make mistakes. Fix the interface rather than writing a training document to compensate. The goal is that routine usage is self-explanatory. This test does not replace functional, accessibility or security testing.

# PHASE 0 — Repository and requirements audit

## Goal

Prepare the coding environment and make the AI agent understand the existing documents before generating application code.

## Tasks

1. Create or inspect the repository.
2. Create the directory structure.
3. Add all source Markdown documents under `docs/`.
4. Create a document index.
5. Create a decisions/open-questions log.
6. Inspect installed Node.js, package manager, Git and Android build prerequisites.
7. Check whether any existing code should be preserved.
8. Create a phased implementation checklist.

## Deliverables

- Repository structure.
- `docs/README.md` with links to every source document.
- `docs/DECISIONS_AND_OPEN_QUESTIONS.md`.
- `docs/implementation/BUILD_STATUS.md`.
- `.gitignore`.
- Root `README.md`.

## Completion gate

- [ ] All source documents are present and readable.
- [ ] No existing project code was overwritten.
- [ ] The agent has identified unresolved decisions.
- [ ] The build phases and status tracker exist.

## Prompt 0 — Repository audit and preparation

```text
You are the principal software architect and implementation engineer for CORVIIN HUB.

Before writing application code, inspect the complete repository and all Markdown requirements.

MANDATORY REFERENCES:
- docs/PRD.md
- docs/TRD.md
- docs/UPDATED_FEATURE_SCOPE.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md
- every document inside docs/features/, especially 00_PRODUCT_UI_UX_DESIGN_SYSTEM.md

TASK:
1. Inspect the repository, package files, existing source code and Git status.
2. Do not delete, overwrite or regenerate existing working code.
3. Verify that all required Markdown references exist. If filenames differ, map the actual files in docs/README.md.
4. Read and summarise the product requirements, technical constraints, feature modules, workflows and acceptance criteria.
5. Identify conflicts, ambiguities, missing decisions and technical risks.
6. Create docs/DECISIONS_AND_OPEN_QUESTIONS.md. Separate confirmed decisions from unresolved questions. Do not silently invent answers.
7. Create docs/implementation/BUILD_STATUS.md containing every phase and feature with status: Not Started, In Progress, Blocked or Complete.
8. Create or correct the repository skeleton only. Do not implement feature screens yet.
9. Add a root README with setup prerequisites, repository structure and the planned development commands.
10. Verify that the project can be opened by the selected coding environment.

PRODUCT-SPECIFIC RULE:
The initial app uses a no-login profile selector with Anant, Rohit and Utkarsh. This is a trusted internal prototype convenience, not secure authentication. Keep identity/session abstractions replaceable so real authentication can be added later. Do not claim that profile selection proves identity.

OUTPUT:
- Summary of inspected files.
- Repository tree.
- Decisions and open questions.
- Exact files created or modified.
- Commands to run.
- Phase 0 checklist with evidence.

STOP after Phase 0. Do not start Phase 1 until the repository audit is complete.
```

---

# PHASE 1 — Whole-app skeleton: frontend and backend simultaneously

## Goal

Build the complete technical skeleton before implementing individual business features. The frontend and backend foundations must be created in the same phase so the UI is designed around real API boundaries rather than becoming a disconnected mockup.

## Frontend skeleton

Create:

- React + TypeScript + Vite app.
- Tailwind CSS and global design tokens.
- React Router route structure.
- Shared application layout.
- Desktop sidebar.
- Mobile bottom navigation.
- Top bar.
- Profile selector and profile switcher.
- Workspace switcher.
- Global search placeholder.
- Notification entry point.
- Contextual Create button placeholder.
- Reusable page header, card, table, tabs, dialog, drawer, form field, badge, empty state, loading state and error state.
- Responsive breakpoints and accessible keyboard/focus behaviour.
- All primary module routes, even if pages are initially placeholders.

## Backend skeleton

Create:

- NestJS application.
- Versioned REST API base, such as `/api/v1`.
- Health endpoint.
- Configuration module.
- Validation pipe.
- Standard error response structure.
- Request logging.
- CORS configuration for local development.
- Swagger/OpenAPI.
- Profile directory endpoint for the three initial profiles.
- Active-profile context abstraction.
- Workspace directory endpoint.
- Workspace context abstraction.
- Placeholder modules/controllers for all feature areas.
- API client contract for frontend integration.

## Initial route map

```text
/
├── /select-profile
└── /app
    ├── /dashboard
    ├── /my-tasks
    ├── /tasks
    ├── /plans-goals
    ├── /calendar
    │   ├── /content-campaigns
    │   ├── /team-tasks
    │   └── /meetings-visits
    ├── /campaigns
    │   └── /:campaignId
    ├── /assets
    ├── /crm
    │   ├── /tech
    │   ├── /real-estate/partners
    │   └── /real-estate/buyers
    ├── /meetings
    │   └── /:meetingId
    ├── /team
    │   └── /:memberId
    └── /settings
```

Routes may be refined to match the architecture document, but preserve the required module coverage.

## Profile switching behaviour

- Initial route is `/select-profile` if no profile is selected on the device.
- Show three profile cards: Anant, Rohit and Utkarsh.
- Selecting a profile enters the app.
- The top bar displays the active profile.
- Profile menu has “Switch Profile”.
- Switching profile changes the acting-profile context without deleting or duplicating records.
- Persist the selected profile locally for convenience.
- Provide a clear switch action; do not hide it behind several menus.
- Load the available profiles from the API, not from a hard-coded UI array.
- For development, seed the three initial profiles through a temporary seed source or database seed in the appropriate phase.
- Keep the actor ID in API request context. Never rely on a user-supplied display name as the canonical identity.
- Show a persistent internal-mode notice in non-production prototype builds: “Shared-device profile selection — identity is not verified.”

## Workspace switching behaviour

- Show Corviin Tech and Corviin Real Estate in a clear workspace selector.
- Switching workspace changes the active workspace context and reloads workspace-scoped data.
- Do not display records from the previous workspace while the new workspace is loading.
- All feature routes must respect the active workspace.
- Initial profiles have access to both workspaces unless a later approved decision changes this.

## Deliverables

- Running frontend shell.
- Running backend API.
- Frontend can call backend health/profile/workspace endpoints.
- All module routes render placeholders.
- Desktop and mobile navigation works.
- Profile and workspace switching works at skeleton level.
- Swagger endpoint opens.
- No business feature logic yet.

## Completion gate

- [ ] Frontend and backend start independently.
- [ ] Frontend health-checks the backend.
- [ ] Profile selection and switching work.
- [ ] Workspace selection and switching work.
- [ ] All module routes load.
- [ ] Responsive shell works at mobile and desktop widths.
- [ ] Shared UI components exist.
- [ ] API errors and loading states are handled.
- [ ] No business feature is falsely marked complete.

## Prompt 1 — Build the complete frontend/backend skeleton

```text
Act as a senior full-stack engineer, software architect and product UI engineer. Build PHASE 1 of CORVIIN HUB only.

READ THESE REFERENCES FIRST:
- docs/PRD.md
- docs/TRD.md
- docs/UPDATED_FEATURE_SCOPE.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md
- docs/features/00_PRODUCT_UI_UX_DESIGN_SYSTEM.md
- docs/features/README.md

PRODUCT:
CORVIIN HUB is one internal operations application for Corviin Tech and Corviin Real Estate. It must run as a responsive PC web application and later as an Android APK using the same React frontend through Capacitor.

TECHNICAL BASELINE:
- Monorepo.
- Frontend: React, TypeScript, Vite, Tailwind CSS.
- Routing: React Router.
- API state: TanStack Query.
- Forms: React Hook Form and Zod.
- Backend: Node.js and NestJS.
- API: REST under /api/v1, documented with Swagger/OpenAPI.
- Shared contracts: packages/shared.
- Keep the implementation modular and typed.

PHASE SCOPE:
Build only the complete application skeleton. Do not implement task management, CRM, campaigns, meetings or other business workflows in this phase.

FRONTEND REQUIREMENTS:
1. Build a polished, professional, uncluttered CORVIIN HUB application shell.
2. Desktop: collapsible left sidebar, top bar and responsive main content.
3. Mobile: bottom navigation with Home, Tasks, Calendar, CRM and More. Put Campaigns, Plans & Goals, Meetings, Assets, Team and Settings inside More.
4. Add page title, breadcrumb, workspace selector, active profile menu, global search placeholder, notification entry and contextual Create placeholder.
5. Create all routes listed in the roadmap.
6. Every route must render a well-designed placeholder page with its correct title, description and planned feature sections. No dead links.
7. Create reusable components for buttons, inputs, cards, tables, tabs, status badges, dialogs, drawers, page headers, empty states, loading skeletons and error states.
8. Establish design tokens, typography, spacing, border radii, semantic colours and responsive rules based on the UI/UX design-system document.
9. Use realistic layout hierarchy and restrained visual styling. Avoid excessive gradients, glow, oversized cards and decorative charts.
10. Desktop should be information-efficient. Mobile should be action-efficient, not a squeezed desktop layout.
11. Support keyboard navigation, visible focus states, semantic labels and touch targets around 44 CSS pixels.
12. Do not use fake charts or invented operational data. Label any sample content as demo data.

NO-LOGIN PROFILE SELECTOR — EXACT REQUIREMENT:
1. The first screen is a Select Profile screen when no profile is currently selected.
2. Display Anant, Rohit and Utkarsh as the initial selectable profiles.
3. Selecting one enters the application.
4. Display the active profile in the top bar.
5. Provide a prominent, simple Switch Profile action.
6. Fetch profile records through a backend endpoint. Do not hard-code profile names throughout the UI.
7. Use stable profile IDs.
8. Persist only the selected profile ID locally for convenience.
9. Keep an ActorContext/ActiveProfile abstraction so proper authentication can replace the selector later.
10. Clearly label this as a shared-device, unverified profile mode. It is not authentication and must not be presented as secure identity verification.

WORKSPACE SELECTOR:
- Corviin Tech
- Corviin Real Estate
Both are visible options. Switching workspace updates a central workspace context and invalidates/refetches workspace-specific queries.

BACKEND REQUIREMENTS:
1. Build NestJS modules for Health, Profiles, Workspaces and placeholder modules for all product modules.
2. Implement GET /api/v1/health.
3. Implement GET /api/v1/profiles.
4. Implement GET /api/v1/workspaces.
5. Implement a clear request context for acting profile and active workspace.
6. Validate incoming request data.
7. Use consistent success/error response conventions.
8. Configure CORS for local frontend development through environment variables.
9. Add Swagger/OpenAPI.
10. Add structured request/error logging without logging sensitive CRM content.
11. Do not claim that a client-provided profile ID is authenticated. Treat it as the selected acting profile for this internal prototype.
12. Keep business logic out of controllers; use services.

INTEGRATION:
- Create a typed frontend API client.
- Connect the health check and profile/workspace endpoints.
- Implement loading, empty and failure states.
- Do not create fake success responses for failed API calls.
- Use environment variables for API base URL.
- Provide .env.example files.

CODE QUALITY:
- Strict TypeScript.
- Small, cohesive components.
- No giant page components.
- No duplicated navigation definitions.
- No `any` unless documented and unavoidable.
- No unused imports, variables or functions.
- No secrets in source control.
- Add lint, format, typecheck and build scripts.
- Add basic tests for route rendering, profile switching and API health handling.

DELIVERABLES:
- Complete repository tree.
- Frontend and backend source.
- Shared contracts.
- Environment examples.
- README with exact setup/run commands.
- Swagger endpoint.
- Screenshots are optional; do not substitute screenshots for working code.
- Update docs/implementation/BUILD_STATUS.md with evidence.

VALIDATION:
Run install, lint, typecheck, tests and production builds. Fix errors before completion. Test desktop and mobile widths.

STOP after Phase 1. Report files changed, commands run, test results, known gaps and the next phase. Do not begin Phase 2 automatically.
```

---

# PHASE 2 — Design system and shell refinement

## Goal

Refine the shared UI shell and reusable components before building feature-specific pages. Follow the mandatory Design Requirement Update: no animation, original professional CRM-style visual language, complete light/dark themes and self-explanatory UX without training.

## Tasks

- Finalise typography, colour tokens, spacing and layout.
- Define light and dark theme behaviour if required by the design specification.
- Finalise desktop sidebar and mobile bottom navigation.
- Create consistent page header, filters, action bars, forms and detail-page layouts.
- Create table, board, card, timeline, calendar and activity primitives.
- Create confirmation patterns for destructive actions.
- Create responsive modal, drawer and bottom-sheet patterns.
- Add global toast/feedback system.
- Add accessible focus, keyboard and screen-reader labels.
- Add skeleton, empty, error, permission-denied and offline states.

## Completion gate

- [ ] Common patterns are reusable.
- [ ] No feature has a unique visual language without justification.
- [ ] Desktop and mobile layouts have been checked.
- [ ] Accessibility baseline is in place.
- [ ] UI components have basic tests or a component preview page.

## Prompt 2 — Design system

```text
Implement PHASE 2 only: refine the CORVIIN HUB shared UI/UX design system.

MANDATORY REFERENCES:
- docs/features/00_PRODUCT_UI_UX_DESIGN_SYSTEM.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- docs/PRD.md
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

First inspect the Phase 1 implementation. Preserve working code and improve it incrementally.

Create a coherent design system for a modern internal operations product:
- Professional, calm, clean and uncluttered.
- Strong hierarchy and readable density.
- Desktop: collapsible sidebar, efficient tables, filters, multi-column detail pages.
- Mobile: bottom navigation, cards, agenda views, short forms, bottom sheets/full-screen forms and sticky primary actions where useful.
- Consistent design tokens for colour, typography, spacing, borders, shadows, radius and breakpoints.
- Reusable primitives for forms, buttons, status, tables, cards, tabs, dialogs, drawers, timelines, activity, filters, empty states, loading and errors.
- Accessible keyboard/focus behaviour and touch targets.
- Semantic status labels; never communicate status through colour alone.

Do not invent feature-specific requirements. Do not fill screens with meaningless metrics or fake data. Avoid excessive animation, gradients and decorative glow.

Create a component preview/development page or equivalent so the shared components can be inspected.

Run lint, typecheck, tests and build. Update BUILD_STATUS.md with evidence. Stop after Phase 2.
```

---

# PHASE 3 — Implement features one by one

## Rules for every feature

Each feature must be implemented as a complete vertical slice, not just a static screen.

A vertical slice includes:

1. Read its individual Markdown specification.
2. Inspect related modules and existing shared components.
3. Confirm its route and navigation entry.
4. Build desktop UI.
5. Build mobile UI.
6. Define typed models and Zod validation schemas.
7. Define API contract and backend endpoints/services.
8. Use a mock adapter only if the real persistence layer is not yet ready.
9. Implement loading, empty, error, validation and success states.
10. Add tests.
11. Connect navigation and contextual actions.
12. Update feature status and record any gaps.

**Feature completion definition:** A feature is not complete because its page looks finished. It must also pass the no-animation, light/dark parity and self-explanatory UX checklist in the Design Requirement Update. It is complete only when its user flows work, validation is present, API contracts are defined, backend behaviour exists, tests pass and its database integration is completed in the persistence phase.

## Recommended feature order

| Order | Feature | Required reference |
|---:|---|---|
| 1 | Team / member directory | `15_TEAM.md` |
| 2 | Tasks engine — shared task model and actions | `02_MY_TASKS.md`, `03_ALL_TASKS.md` |
| 3 | My Tasks | `02_MY_TASKS.md` |
| 4 | All Tasks | `03_ALL_TASKS.md` |
| 5 | Plans & Goals | `04_PLANS_AND_GOALS.md` |
| 6 | Meetings | `14_MEETINGS.md` |
| 7 | Calendar — Team Tasks | `06_CALENDAR_TEAM_TASKS.md` |
| 8 | Calendar — Meetings & Visits | `07_CALENDAR_MEETINGS_VISITS.md` |
| 9 | Campaigns | `08_CAMPAIGNS.md` |
| 10 | Calendar — Content & Campaigns | `05_CALENDAR_CONTENT_CAMPAIGNS.md` |
| 11 | Assets & Storage | `09_ASSETS_AND_STORAGE.md` |
| 12 | CRM Overview | `10_CRM_OVERVIEW.md` |
| 13 | Tech CRM | `11_CRM_TECH.md` |
| 14 | Real Estate Partners CRM | `12_CRM_REAL_ESTATE_PARTNERS.md` |
| 15 | Real Estate Buyers CRM | `13_CRM_REAL_ESTATE_BUYERS.md` |
| 16 | Dashboard | `01_DASHBOARD.md` |
| 17 | Notifications, Activity & Audit | `17_NOTIFICATIONS_ACTIVITY_AUDIT.md` |
| 18 | Global Search & Create Flows | `18_GLOBAL_SEARCH_AND_CREATE_FLOWS.md` |
| 19 | Settings | `16_SETTINGS.md` |

### Why this order?

- Team and acting-profile references are needed by assignments and audit events.
- The task engine is foundational for My Tasks, All Tasks, plans, campaigns and meetings.
- Meetings and calendars depend on shared event/task records.
- Campaigns need tasks and asset relationships.
- CRM needs meetings, follow-ups, tasks and workspace context.
- Dashboard, global search and notifications become meaningful after the core records exist.
- Settings should be implemented after the configurable behaviours it controls are known.

## Prompt 3 — Feature implementation master template

Copy this prompt for each feature. Replace `[FEATURE NAME]`, `[FEATURE REFERENCE]` and `[RELATED REFERENCES]`.

```text
You are the senior full-stack engineer implementing one vertical feature slice in CORVIIN HUB.

FEATURE:
[FEATURE NAME]

MANDATORY FEATURE SPECIFICATION:
docs/features/[FEATURE REFERENCE]

RELATED REFERENCES:
- docs/PRD.md
- docs/TRD.md
- docs/UPDATED_FEATURE_SCOPE.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- docs/features/00_PRODUCT_UI_UX_DESIGN_SYSTEM.md
- [RELATED REFERENCES]
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

FIRST:
1. Inspect the current repository and existing feature implementation.
2. Read the complete feature specification, not just its heading.
3. Identify dependencies on other modules and shared entities.
4. Inspect existing API contracts, shared components, routes and backend conventions.
5. Produce a short implementation plan with files likely to change.
6. Identify any conflict or missing decision. Do not invent a product rule.

IMPLEMENT:
A. Frontend
- Implement the feature according to its Markdown specification.
- Provide responsive desktop and mobile layouts.
- Reuse the shared design system.
- Implement all specified list, detail, create, edit, filter, sort, status and action flows.
- Add form validation and useful error messages.
- Include loading, empty, error, success and confirmation states.
- Ensure links to related records navigate correctly.
- Do not add decorative or out-of-scope features.

B. Backend
- Implement the feature's NestJS module, controller, service and DTO/schema validation.
- Follow the existing REST API conventions under /api/v1.
- Keep business logic in services.
- Validate active workspace and acting-profile context.
- Enforce workspace scoping in backend queries, not merely in frontend filters.
- Return consistent errors and status codes.
- Record meaningful activity events for important changes.
- Do not trust a client-provided workspace ID without validating it against the selected context.
- Remember that the current acting profile is not authenticated identity.

C. Data and contracts
- Define typed entities and shared API contracts.
- Keep stable IDs and explicit relationships.
- Avoid duplicating information already owned by another module.
- Keep the data model compatible with PostgreSQL and Prisma.
- If the database phase is not yet complete, use a repository/service abstraction and a deterministic mock adapter. Do not put mock arrays directly inside page components.
- Do not call a mock adapter production-ready.

D. Integration
- Connect the UI to the feature API through the shared API client.
- Invalidate/refetch relevant TanStack Query data after mutations.
- Link the feature to existing modules where specified.
- Avoid duplicate records when converting or linking records.
- Preserve activity/history where required.
- Show clear feedback for failed operations.

E. Quality
- Add unit tests for business rules.
- Add API integration tests.
- Add UI tests for critical flows.
- Add or update end-to-end tests when a user journey crosses routes.
- Run lint, typecheck, tests and build.
- Fix all errors caused by this implementation.

ACCEPTANCE:
Use the acceptance criteria in the feature Markdown as the source of truth. Add a checklist to the feature's implementation status. Explicitly identify any acceptance criterion not completed.

DO NOT:
- Rebuild the entire application.
- Change unrelated features.
- silently alter the schema of existing modules.
- create fake working buttons.
- leave TODOs for essential flows.
- hard-code Anant, Rohit and Utkarsh into reusable business logic.
- bypass workspace isolation.
- claim completion based only on screenshots.

DELIVER:
1. Working feature.
2. Files changed.
3. API endpoints and contracts.
4. Data entities/relationships added or changed.
5. Tests and exact results.
6. Known limitations.
7. Updated docs/implementation/BUILD_STATUS.md.
8. Recommended next feature based on the roadmap.

STOP after this feature. Wait for approval before starting another feature.
```

## Feature-specific prompts

Use the master template above, then append the relevant instruction below.

### 3.1 Team

```text
FEATURE-SPECIFIC REQUIREMENTS:
Implement a dynamic Team directory and member detail pages. Seed Anant, Rohit and Utkarsh as initial members, but never hard-code the list. Show workspace membership, open/overdue task counts, upcoming deadlines, linked campaigns, plans, meetings and recent activity as allowed by the specification. Do not infer availability or create employee-surveillance scoring. Ensure member IDs are used in assignments and audit records.
```

### 3.2 Tasks engine, My Tasks and All Tasks

```text
FEATURE-SPECIFIC REQUIREMENTS:
Build one shared task engine. My Tasks and All Tasks must be different views over the same task records, not separate task databases.

Support title, description, workspace, assignee, creator/acting profile, planned start, deadline, priority, status, progress, linked plan/goal/campaign/client/meeting, checklist/subtasks, attachments, comments, completion note and activity history as specified.

Statuses: To Do, In Progress, On Hold, Blocked, Completed, Cancelled.

Preserve planned dates separately from actual work timestamps. Record start, pause, resume and completion sessions. Rescheduling must append an immutable history event with previous date, new date, acting profile, timestamp and reason where supplied. Do not overwrite the old schedule history.

Provide list and Kanban views, useful filters, sorting and grouping. My Tasks filters by selected acting profile; All Tasks shows the workspace's authorised shared tasks. Switching profile changes the My Tasks view, not task ownership.
```

### 3.3 Plans & Goals

```text
FEATURE-SPECIFIC REQUIREMENTS:
Keep the concepts distinct: a Goal is the intended outcome, a Plan is the approach or work grouping, and Tasks are actionable work. Support milestones, owners/participants, target dates, progress and linked tasks. If progress can be manual or calculated, store the progress mode explicitly. Do not silently mix manual and calculated progress.
```

### 3.4 Meetings and calendars

```text
FEATURE-SPECIFIC REQUIREMENTS:
Meetings must be full records with type, date/time, location or meeting link, organiser, participants, linked CRM/campaign/project, agenda, objective, preparation, notes, decisions, action items, attachments, outcome and follow-up.

Action items may be converted into tasks. The conversion must retain the meeting relationship and prevent duplicate task creation.

Implement three separate calendar views:
1. Content & Campaigns.
2. Team Tasks.
3. Meetings & Visits.

These calendars must display the same underlying records as their source modules. Do not create independent copies of tasks, campaigns or meetings just to display them on a calendar. Preserve planned versus actual timestamps.
```

### 3.5 Campaigns and assets

```text
FEATURE-SPECIFIC REQUIREMENTS:
Campaign stages are:
1. Initial Idea.
2. Scripting & Planning.
3. Recording & Asset Upload.
4. Editing & Final Asset.
5. Posting & Completion.

Implement stage-specific workspaces, tasks, approval/revision history, deadlines and activity. Campaign stage changes must be validated and audited.

The campaign detail page must have Overview, Stage Workspace, Tasks, Assets and Activity sections.

Uploads performed inside a campaign must automatically link the uploaded asset to that campaign. The global Assets & Storage library must show workspace files and preserve campaign relationships. Removing a campaign link must not delete the file. Support explicit reuse/linking of an existing asset to another campaign without duplicating the underlying binary.
```

### 3.6 CRM

```text
FEATURE-SPECIFIC REQUIREMENTS:
Implement distinct workspace-aware CRM pipelines and forms:
- Tech CRM.
- Real Estate Developers & Partners.
- Real Estate Buyers.

Do not merge all lead types into one confusing form. Use shared underlying CRM primitives only where appropriate.

Tech pipeline:
New Enquiry → Contact Pending → Contacted → Requirement Discussion → Qualified → Proposal/Quotation → Negotiation → Won/Client or Lost, Follow Up Later.

Real Estate partner pipeline:
New Partner Lead → Initial Contact → Meeting Planned → Requirement Discussion → Proposal/Service Details → Follow-up/Negotiation → Partnership Confirmed → Active Partner / Not Interested/Lost / Follow Up Later.

Buyer pipeline:
New Enquiry → Contact Pending → Contacted → Requirement Captured → Qualified Buyer → Project/Property Shared → Site Visit Planned → Site Visit Completed → Follow-up/Discussion → Booking/Converted / Not Interested/Lost / Follow Up Later.

Capture only necessary contact and qualification data. Link interactions, follow-ups, meetings, site visits, tasks, campaigns and projects. A developer can be related to multiple projects/campaigns. Site visits are separate records linked to buyer and relevant property/project.
```

### 3.7 Dashboard, notifications, global search and settings

```text
FEATURE-SPECIFIC REQUIREMENTS:
Dashboard values must be calculated from actual workspace-scoped records. Every summary card should open the relevant filtered module. Do not use fabricated metrics.

Notifications and activity are different concepts:
- Notifications tell a member that an action is needed or something changed.
- Activity/audit records describe what happened and by whom.
Preserve meaningful actor, action, record, timestamp and workspace.

Global search must search only records the active workspace context can access. Search results should navigate to the original record, not create copies.

Settings must distinguish personal preferences from workspace configuration. Keep settings aligned with the settings feature specification. Do not add unsupported administration or permission systems.
```

---

# PHASE 4 — Database and persistent data layer

## Goal

Replace temporary mock repositories with PostgreSQL persistence through Prisma. This phase establishes the production source of truth.

## Tasks

1. Configure PostgreSQL for local development.
2. Configure Prisma.
3. Design and review the relational schema.
4. Add migrations.
5. Add seed scripts for:
   - Anant
   - Rohit
   - Utkarsh
   - Corviin Tech
   - Corviin Real Estate
6. Add stable IDs and workspace membership relationships.
7. Add workspace ID to all workspace-owned records.
8. Add foreign keys, indexes and uniqueness constraints.
9. Add soft-delete/archive strategy where required.
10. Add immutable activity and reschedule history tables.
11. Add repository implementations for each feature.
12. Replace mock adapters feature by feature.
13. Add transaction boundaries for multi-record operations.
14. Add backup/restore instructions.

## Core data modelling principles

- Every operational record belongs to a workspace.
- The three initial profiles are rows in a members/users table, not hard-coded constants.
- Profile selection does not authenticate the person.
- Tasks are shared records referenced by other modules.
- Meetings, campaigns, CRM records and assets have explicit relationships.
- A stored asset and its campaign link are separate concepts.
- Audit history is append-only for important events.
- Planned and actual dates are distinct.
- Do not store large files as PostgreSQL blobs; store file metadata and object-storage keys.
- Use database constraints and backend checks together.

## Completion gate

- [ ] PostgreSQL runs locally.
- [ ] Prisma schema is reviewed.
- [ ] Migrations run from an empty database.
- [ ] Seed script creates the two workspaces and three profiles.
- [ ] All completed features use persistent repositories.
- [ ] Workspace isolation is tested at API/database query level.
- [ ] Backup and restore process is documented.

## Prompt 4 — Database and persistence

```text
Implement PHASE 4: CORVIIN HUB PostgreSQL persistence.

MANDATORY REFERENCES:
- docs/TRD.md
- docs/PRD.md
- docs/UPDATED_FEATURE_SCOPE.md
- every feature specification in docs/features/
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

Inspect all current frontend and backend models, DTOs, API contracts and mock repositories before designing the schema.

GOAL:
Implement PostgreSQL + Prisma as the persistent source of truth. Do not redesign the product or discard existing feature work.

REQUIREMENTS:
1. Build a normalised relational schema for all implemented modules and their relationships.
2. Use stable primary keys and explicit foreign keys.
3. Seed the initial profiles Anant, Rohit and Utkarsh as records. Do not hard-code these three in the domain model.
4. Seed Corviin Tech and Corviin Real Estate as separate workspaces.
5. Add workspace ownership to every workspace-scoped operational record.
6. Create indexes for workspace-scoped lists, assignee, status, deadlines, CRM stages and common lookup paths.
7. Preserve planned dates separately from actual timestamps.
8. Model task work sessions and immutable reschedule history.
9. Model activity/audit records as append-only events for important operations.
10. Model assets separately from asset-to-campaign links.
11. Model many-to-many relationships explicitly where required.
12. Use transactions for multi-step workflows such as converting a meeting action item into a task.
13. Define soft deletion/archive only where justified by the product specifications. Do not silently hard-delete operational history.
14. Store file metadata and storage object keys in PostgreSQL; keep file binaries in private object storage.
15. Create versioned Prisma migrations and deterministic seed scripts.
16. Implement repository adapters and replace mock repositories without changing frontend contracts unnecessarily.
17. Add integration tests against a test database.
18. Add documented backup and restore procedures.

NO-LOGIN MODE:
The selected profile is an acting-profile context only. The database may store actor IDs for operational attribution, but do not label those values as verified authenticated identities. Keep the identity abstraction replaceable.

WORKSPACE ISOLATION:
Every query and mutation must be workspace-scoped. Do not trust a workspace ID sent by the browser without validating it against the active context. Test that a Tech record cannot be read or changed through a Real Estate context and vice versa.

MIGRATION SAFETY:
- Never reset or drop a database containing user data to make a migration pass.
- Do not use destructive schema changes without an explicit migration plan.
- Generate migrations and inspect SQL.
- Document rollback/recovery strategy.

DELIVER:
Prisma schema, migrations, seed scripts, repository implementations, test instructions, ERD source if supported, backup/restore documentation and updated BUILD_STATUS.md.

Run formatting, lint, typecheck, tests and migration checks. Stop after Phase 4.
```

---

# PHASE 5 — Backend completion and real API integration

## Goal

Ensure every feature uses real backend services, server validation and persistent data.

## Tasks

- Review every feature endpoint against its Markdown specification.
- Implement pagination, sorting and filtering.
- Implement consistent validation and error handling.
- Enforce workspace scoping in every read/write operation.
- Validate actor/profile IDs against known profile records.
- Implement activity events and reschedule history.
- Implement transactions for conversions and linked operations.
- Add API integration tests.
- Generate/update Swagger documentation.
- Remove production paths that silently fall back to mock data.
- Add safe development-only fixtures where needed.

## Prompt 5 — Backend integration audit

```text
Implement PHASE 5 only: finish and audit all CORVIIN HUB backend APIs.

Read the TRD and all feature specifications. Inspect each NestJS module and compare its endpoints and behaviours to the feature acceptance criteria.

For every implemented module:
- Confirm create/read/update/archive behaviour.
- Confirm DTO and server-side validation.
- Confirm workspace-scoped queries and mutations.
- Confirm pagination, sorting and filtering where required.
- Confirm stable relationships and foreign keys.
- Confirm meaningful activity events.
- Confirm immutable reschedule and work-session history where applicable.
- Confirm transactions for multi-record workflows.
- Confirm standard error responses.
- Confirm API documentation.
- Confirm tests for success, validation failure, not-found and cross-workspace access.

No-login mode:
The acting profile is selected by the user and is not verified authentication. Do not describe it as secure identity. Do not expose sensitive data in a public deployment.

Do not create endpoints that return hard-coded arrays as if they were database-backed. Remove production mock fallbacks. If a feature is not implemented, return a clear unsupported/not-implemented response and record it as incomplete.

Run the full backend test suite and update BUILD_STATUS.md. Stop after Phase 5.
```

---

# PHASE 6 — Connect all features into one operating system

## Goal

The modules must behave as connected views of shared records. This phase is essential: CORVIIN HUB must not become a collection of unrelated CRUD pages.

## Required cross-feature connections

| Source action | Expected connection |
|---|---|
| Create a task | Appears in My Tasks, All Tasks and Team Task Calendar |
| Assign/reassign a task | Updates member workload and activity |
| Link a task to a plan | Appears in that plan's task list and progress |
| Link a task to a campaign | Appears in campaign tasks and relevant calendar |
| Create a meeting | Appears in Meetings and Meetings & Visits Calendar |
| Create meeting action item | Can create one linked task without duplication |
| Schedule buyer site visit | Appears in buyer history and Meetings & Visits Calendar |
| Add CRM follow-up | Appears in CRM and relevant task/calendar view as designed |
| Upload from campaign | Appears in campaign Assets and global Assets library |
| Link existing asset to campaign | Adds relationship without copying the file |
| Remove campaign asset link | Removes relationship only, not stored file |
| Change campaign stage | Updates campaign board, detail and activity |
| Publish content | Updates campaign/content status and records actual publish date |
| Complete a task | Updates task views, linked plan progress and activity |
| Switch profile | Changes My Tasks and actor context; does not rewrite ownership/history |
| Switch workspace | Reloads all workspace-scoped records and clears stale views |

## Integration requirements

- Use stable record IDs.
- Use shared query keys and invalidation rules.
- Do not create duplicate records for calendar display.
- Avoid circular update loops.
- Use backend transactions for workflows involving multiple records.
- Preserve source-record links.
- Add audit events for meaningful transitions.
- Ensure dashboard counts match module data.
- Make global search navigate to the original record.

## Prompt 6 — Cross-module integration

```text
Implement PHASE 6: connect all CORVIIN HUB modules and workflows.

MANDATORY REFERENCES:
- docs/PRD.md
- docs/UPDATED_FEATURE_SCOPE.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- every relevant feature specification under docs/features/
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

First inspect the existing schema, APIs, UI flows and tests. Create a cross-module relationship matrix before changing code.

CORE RULE:
Each operational record has one source of truth. Other modules display, filter or link to that record. Do not duplicate tasks, meetings, campaigns, assets or CRM records just to show them in multiple screens.

Implement and test every connection in the roadmap's Phase 6 table:
- Tasks ↔ My Tasks ↔ All Tasks ↔ Team Task Calendar.
- Tasks ↔ Plans and Goals.
- Tasks ↔ Campaigns.
- Meetings ↔ Meetings & Visits Calendar.
- Meeting action items ↔ Tasks with duplicate-prevention.
- CRM records ↔ interactions ↔ follow-ups ↔ meetings ↔ tasks.
- Buyer records ↔ site visits ↔ project/property links.
- Campaigns ↔ stage tasks ↔ content calendar ↔ assets.
- Campaign asset relationships ↔ global asset library.
- Task completion ↔ plan progress and activity.
- Campaign stage transitions ↔ campaign board, detail and activity.
- Dashboard metrics ↔ actual persisted module records.
- Global search ↔ original accessible records.
- Profile switching ↔ acting profile and My Tasks filtering.
- Workspace switching ↔ complete workspace query isolation.

IMPLEMENTATION:
1. Add service-level workflow methods for cross-module transactions.
2. Add explicit relationship fields/tables where needed.
3. Add query invalidation/refetch rules.
4. Add deep links and breadcrumbs between related records.
5. Add duplicate-prevention/idempotency where users can repeat an action.
6. Ensure removing a relationship does not delete the source record.
7. Preserve history and actor attribution.
8. Add end-to-end tests for complete cross-module journeys.
9. Verify counts and statuses are consistent across all views.

Do not mark a connection complete because a link exists. Verify that the data and workflow behave correctly in both directions where applicable.

Deliver a relationship matrix with test evidence, update BUILD_STATUS.md and stop after Phase 6.
```

---

# PHASE 7 — Assets, notifications and operational services

## Goal

Complete infrastructure-backed services that support the modules.

## Tasks

- Configure private object storage.
- Implement secure upload/download flow (short-lived signed URLs or equivalent).
- Validate file type, size and upload errors.
- Store metadata and ownership in database.
- Implement asset versioning if specified.
- Implement notification preferences and delivery.
- Implement in-app notifications.
- Add push notifications only after Android configuration is ready.
- Add activity/audit views.
- Add retry/error behaviour for network failures.
- Add backup and storage monitoring.

## Prompt 7 — Storage and notifications

```text
Implement PHASE 7 only for CORVIIN HUB.

Read:
- docs/TRD.md
- docs/features/09_ASSETS_AND_STORAGE.md
- docs/features/17_NOTIFICATIONS_ACTIVITY_AUDIT.md
- docs/features/08_CAMPAIGNS.md
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

Implement private object storage using the selected provider and environment configuration. Do not hard-code provider credentials.

ASSETS:
- Store binary files in object storage, not as database blobs.
- Store metadata, workspace ownership, uploader/acting profile, MIME type, size, checksum where appropriate, object key and timestamps in PostgreSQL.
- Enforce workspace access for uploads and downloads.
- Use short-lived signed URLs or an equivalent secure transfer pattern.
- Validate file type and size.
- Preserve campaign-to-asset relationships independently of the file.
- Removing a relationship must not delete the binary.
- Implement versioning and replacement behaviour only as required by the asset specification.
- Show upload progress, failure, retry and success states.

NOTIFICATIONS:
- Implement in-app notifications and read/unread state.
- Respect workspace and member context.
- Use the notification specification to decide which events generate notifications.
- Keep notifications distinct from the append-only activity/audit timeline.
- Do not send duplicate notifications when a retried request repeats an event.
- Keep push notifications as a separately configurable delivery channel.

AUDIT:
- Record actor/acting profile, action, entity, entity ID, workspace and timestamp.
- Never present no-login actor attribution as verified identity.
- Avoid logging passwords, secrets, private file URLs or unnecessary CRM personal data.

Add tests, environment examples, operational documentation and update BUILD_STATUS.md. Stop after Phase 7.
```

---

# PHASE 8 — Android APK from the shared frontend

## Goal

Package the same React frontend as an Android app using Capacitor.

## Tasks

1. Add Capacitor to `apps/web`.
2. Configure Android application ID and app name.
3. Configure app icon and splash screen.
4. Configure API base URL per environment.
5. Add Android platform project.
6. Test profile and workspace switching.
7. Test all navigation and forms on small screens.
8. Test file upload/camera/gallery access only where required and permitted.
9. Handle Android back button correctly.
10. Handle network offline/error states.
11. Test APK installation on a physical Android device.
12. Document debug and release APK build steps.

## Prompt 8 — Android packaging

```text
Implement PHASE 8: package the existing CORVIIN HUB React frontend as an Android APK using Capacitor.

MANDATORY REFERENCES:
- docs/TRD.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- docs/features/00_PRODUCT_UI_UX_DESIGN_SYSTEM.md
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

IMPORTANT:
There must remain one shared React frontend. Do not create a separate Kotlin/Jetpack Compose UI or duplicate business logic.

TASKS:
1. Inspect the current web build and ensure it is production-buildable.
2. Add and configure Capacitor in the existing frontend app.
3. Add the Android platform project.
4. Configure application ID, app name, icons and splash screen.
5. Configure environment-specific backend API URL.
6. Verify safe-area handling, keyboard behaviour, scrolling, modal and drawer behaviour.
7. Verify Android back button closes modal/drawer before navigating back.
8. Verify profile switching and workspace switching.
9. Verify login is not introduced; retain the requested no-login profile selector.
10. Test all critical mobile flows on a small Android viewport and physical device.
11. Test network interruption, loading and retry behaviour.
12. Configure file access only for features that explicitly require it, following Android permissions best practices.
13. Document debug APK and signed release APK generation.

Do not claim that the APK is tested unless an actual build and installation test succeeds. Run web build and Android build, report exact output and any environment dependency. Update BUILD_STATUS.md and stop after Phase 8.
```

---

# PHASE 9 — Testing, security and release readiness

## Goal

Verify that the system is reliable before deployment.

## Test layers

### Unit tests
- Business rules.
- Validation schemas.
- Status transitions.
- Progress calculations.
- Date/time handling.
- Permission/workspace predicates.
- Duplicate-prevention logic.

### API integration tests
- CRUD operations.
- Invalid payloads.
- Missing records.
- Workspace isolation.
- Cross-module transactions.
- Audit event creation.
- Asset permissions.

### End-to-end tests
- Select Anant → Corviin Tech → create task → assign Rohit → verify in Rohit's My Tasks after switching profile.
- Switch workspace → verify Tech records are not visible in Real Estate.
- Create campaign → create campaign task → upload asset → verify campaign and global asset views.
- Create buyer lead → schedule site visit → verify buyer timeline and calendar.
- Create meeting → convert action item to task → verify no duplicate.
- Complete task → verify plan progress and activity.
- Switch profiles → verify ownership is unchanged.

### Security and operational review

The no-login mode is a known limitation. Before using real sensitive customer data or exposing the application publicly, implement real authentication, session security and authorisation. Workspace isolation is still required in the prototype, but it does not replace authentication.

Also verify:
- No secrets in source code.
- Production CORS is restricted.
- Uploads are private.
- Server-side validation is enforced.
- Database backups work.
- Error logs do not expose sensitive data.
- Destructive operations require confirmation and appropriate safeguards.
- No client-side-only workspace protection.

## Prompt 9 — Release candidate audit

```text
Perform PHASE 9: a full release-readiness audit of CORVIIN HUB.

Read the PRD, TRD, every feature specification and this roadmap. Inspect the actual implementation and run the test suites. Do not assume features work because they were previously marked complete.

AUDIT:
1. Run lint, format checks, typecheck, unit tests, API integration tests and end-to-end tests.
2. Verify all feature acceptance criteria against the actual code.
3. Verify desktop responsive behaviour.
4. Verify Android responsive behaviour and APK installation if the build environment supports it.
5. Verify all cross-module workflows.
6. Verify workspace isolation through direct API requests, not only the UI.
7. Verify profile switching does not change record ownership or rewrite history.
8. Verify the no-login limitation is documented prominently.
9. Verify no mock data or mock API adapter is active in production builds.
10. Verify no fake buttons, dead links or silent mutation failures remain.
11. Verify upload privacy, file validation and signed URL expiry.
12. Verify database migration and backup/restore procedures.
13. Review accessibility, keyboard navigation and touch targets.
14. Review performance, large lists, pagination and loading states.
15. Check for secrets, unsafe logging and overly permissive CORS.
16. Audit every screen for decorative animation, AI-template styling, light/dark theme parity and self-explanatory first-time use.
17. Confirm empty states, forms, actions and error messages make sense without training.

Create:
- docs/RELEASE_READINESS_REPORT.md
- docs/KNOWN_ISSUES.md
- docs/DEPLOYMENT_CHECKLIST.md
- Updated docs/implementation/BUILD_STATUS.md

Classify issues as Blocker, Critical, Major, Minor or Cosmetic. Do not hide failures or downgrade severity to make the release look complete.

Do not deploy publicly or claim production security while the no-login profile selector remains the only identity mechanism. Stop after the audit and report the release decision.
```

---

# PHASE 10 — Deployment, backups and handover

## Goal

Deploy the web app and backend, configure production data/storage and provide a repeatable release process.

## Tasks

- Choose hosting based on expected usage, reliability and cost.
- Configure production environment variables.
- Configure managed PostgreSQL and private object storage.
- Configure domain and HTTPS.
- Configure CORS and allowed origins.
- Run production migrations safely.
- Seed initial records only through a controlled process.
- Configure monitoring and error reporting.
- Configure scheduled database backups and restore tests.
- Deploy frontend and backend.
- Build signed Android release APK.
- Document update and rollback procedures.
- Document adding future team members.
- Document the transition from profile selector to real authentication.

## Prompt 10 — Deployment and handover

```text
Implement PHASE 10: prepare and deploy CORVIIN HUB according to the approved hosting decisions.

MANDATORY REFERENCES:
- docs/TRD.md
- docs/DEPLOYMENT_CHECKLIST.md
- docs/RELEASE_READINESS_REPORT.md
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

Do not choose paid services or incur costs without presenting the options and obtaining approval.

TASKS:
1. Review hosting, database, storage and domain decisions.
2. Prepare separate development/staging/production environment configuration where appropriate.
3. Configure HTTPS, CORS, secrets and environment variables.
4. Configure PostgreSQL and private object storage.
5. Run reviewed migrations safely.
6. Configure backups and perform a restore test.
7. Deploy the backend and frontend.
8. Verify health checks, logs and monitoring.
9. Build and test the signed Android release APK.
10. Document deploy, update, rollback and recovery procedures.
11. Document how to add future members without changing code.
12. Document the migration path from the no-login profile selector to proper authentication.
13. Record exact deployment URLs and versions in the handover documentation. Never invent a URL or claim a deployment succeeded without evidence.

Do not expose the application publicly with sensitive customer data while no-login profile selection is the only identity mechanism. If this is still the intended temporary setup, restrict access to an approved trusted environment and clearly state the limitation.

Deliver:
- Deployment report.
- Environment variable reference without secret values.
- Backup/restore runbook.
- Release procedure.
- APK build procedure.
- Known limitations.
- Final BUILD_STATUS.md.

Stop after deployment and handover.
```

---

## 6. Mandatory coding-agent rules for every phase

Add these rules to the coding agent's persistent project instructions (for example `AGENTS.md`, `CLAUDE.md` or the equivalent supported by the chosen tool).

```text
CORVIIN HUB — NON-NEGOTIABLE ENGINEERING RULES

1. Read the relevant Markdown specification before implementation.
2. Treat docs/PRD.md, docs/TRD.md, docs/UPDATED_FEATURE_SCOPE.md, docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md and docs/features/*.md as the requirements source.
3. Never implement the entire product in one generation. Work only on the currently approved phase or feature.
4. Inspect existing code before changing it. Preserve working code and avoid unrelated rewrites.
5. Use one React frontend for web and Android through Capacitor.
6. Use one shared backend and one PostgreSQL source of truth.
7. Keep modules separated by domain, but connect them through stable shared records and service contracts.
8. Enforce workspace isolation in backend services and database queries.
9. Treat Anant, Rohit and Utkarsh as initial database records, not hard-coded application limits.
10. The requested no-login profile selector is not authentication. It selects an acting profile only. Never claim verified identity or production-grade security.
11. Do not create fake buttons, fake success states or nonfunctional controls.
12. Do not leave essential flows as TODOs.
13. Do not put mock data directly inside page components. Use a typed repository/API abstraction.
14. Do not ship mock adapters in production.
15. Preserve activity history, work sessions and reschedule history.
16. Keep planned dates separate from actual timestamps.
17. Do not duplicate records to display them in multiple modules.
18. Use database transactions for workflows that change multiple related records.
19. Validate on the server. Frontend validation is not a security boundary.
20. Use environment variables for secrets and deployment-specific values.
21. Never overwrite or delete user data to resolve a migration problem.
22. Add tests for every critical business rule and workflow.
23. Run lint, typecheck, tests and build after meaningful changes.
24. Update docs/implementation/BUILD_STATUS.md after each phase.
25. Report honestly what works, what is mocked, what is incomplete and what was tested.
26. Stop at the phase boundary. Do not automatically start the next phase.
27. If requirements conflict, record the conflict and ask rather than guessing.
28. Prefer simple, maintainable solutions over unnecessary abstraction or premature complexity.
```

---

## 7. Master project kickoff prompt

Use this once after placing all reference Markdown files in `docs/`. It instructs the coding agent to understand the entire project and begin with Phase 0, not to generate everything at once.

```text
You are the principal product engineer, solution architect, senior React/TypeScript engineer, senior NestJS backend engineer and quality engineer responsible for building CORVIIN HUB.

PROJECT CONTEXT:
CORVIIN HUB is an internal operations platform for Corviin Group. It has two workspaces: Corviin Tech and Corviin Real Estate. The initial selectable acting profiles are Anant, Rohit and Utkarsh. The app will run on PC web and Android APK using one shared React frontend and one shared backend.

MANDATORY SOURCE DOCUMENTS:
Read and follow:
- docs/PRD.md
- docs/TRD.md
- docs/UPDATED_FEATURE_SCOPE.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md
- every relevant document under docs/features/

Do not rely on this prompt as a replacement for the detailed feature documents. The Markdown files contain the actual product requirements and acceptance criteria.

CORE PRODUCT REQUIREMENTS:
- One application, two isolated workspaces.
- Dynamic member directory, initially Anant, Rohit and Utkarsh.
- Initial no-login profile selector and switcher; this is an unverified acting-profile convenience only, not authentication.
- Desktop-efficient and mobile-first responsive interaction.
- Modules: Dashboard, My Tasks, All Tasks, Plans & Goals, three calendars, Campaigns, Assets & Storage, three CRM areas, Meetings, Team, Settings, Notifications/Activity/Audit, Global Search/Create.
- Shared tasks and meetings must appear in their related views without duplicating records.
- Campaign lifecycle has five defined stages.
- Assets have independent file records and campaign relationships.
- Planned and actual dates remain distinct.
- Important changes retain actor, timestamp and history.
- Same React client is packaged for Android using Capacitor.

TECHNICAL DIRECTION:
Use the approved TRD baseline: React, TypeScript, Vite, Tailwind, NestJS, REST/OpenAPI, PostgreSQL, Prisma, shared typed contracts and Capacitor. Do not add paid services or incur cost without approval.

BUILD METHOD:
Follow docs/implementation/CORVIIN_HUB_BUILD_PHASES.md exactly.
Work in controlled phases:
0. Repository and requirements audit.
1. Complete frontend/backend skeleton simultaneously.
2. Design system and shell refinement.
3. Features one by one.
4. Database and persistence.
5. Backend completion and API integration.
6. Cross-feature integration.
7. Storage, notifications and operational services.
8. Android APK.
9. Testing/security/release audit.
10. Deployment and handover.

IMPORTANT EXECUTION RULE:
Do not generate the whole application in one pass. Do not skip phases. Do not implement future phases early unless a dependency is essential and you explain it. Start with Phase 0 only. After each phase, run its validation, update BUILD_STATUS.md, report exact evidence and stop for approval.

FIRST RESPONSE:
Before coding, report:
1. Which reference documents were found and read.
2. Current repository condition.
3. Proposed repository structure.
4. Any conflicts or open questions.
5. The exact Phase 0 actions you will perform.

Then execute Phase 0 only.
```

---

## 8. How to use this roadmap with a vibe-coding agent

Recommended operating cycle:

1. Put all reference Markdown files in `docs/`.
2. Put this roadmap at `docs/implementation/CORVIIN_HUB_BUILD_PHASES.md`.
3. Add the mandatory engineering rules to the agent's persistent instructions.
4. Start with the Master Project Kickoff Prompt.
5. Review Phase 0 output.
6. Give the Phase 1 prompt and inspect the generated skeleton.
7. Approve one feature at a time using the Phase 3 master template.
8. Do not move forward until the phase's completion gate has evidence.
9. Keep Git commits small and phase-specific.
10. Ask the agent to show the exact files changed and test results after each run.

### Suggested Git commit pattern

```text
chore: prepare CORVIIN HUB repository and docs
feat: build application shell and API foundation
feat: establish shared design system
feat: implement team module
feat: implement shared task engine
feat: implement my tasks and all tasks
feat: implement plans and goals
feat: implement meetings and calendars
feat: implement campaign workflow
feat: implement assets library
feat: implement CRM modules
feat: implement dashboard and global search
feat: add PostgreSQL persistence
feat: connect cross-module workflows
feat: add storage and notifications
build: package Android app with Capacitor
test: complete release readiness audit
deploy: publish CORVIIN HUB
```

### Do not accept these common vibe-coding failures

- A beautiful frontend with buttons that do nothing.
- Every page storing its own copy of tasks or meetings.
- A profile switcher that changes the displayed name but not the actor context.
- Workspace filtering performed only in React.
- Hard-coded sample data presented as real business records.
- Database tables created without foreign keys or migration files.
- A campaign asset upload that stores a file but does not link it to the campaign.
- A calendar containing separately duplicated events.
- A dashboard with invented counts.
- A mobile app that is merely a desktop page scaled down.
- An APK that uses a different codebase from the web app.
- An implementation marked complete without test evidence.

---

## 9. Final definition of done

CORVIIN HUB is ready for internal release only when:

- [ ] All reference specifications are implemented or explicitly recorded as deferred.
- [ ] Frontend and backend are modular and maintainable.
- [ ] Profile selection and switching work as specified, with the no-login limitation clearly documented.
- [ ] Corviin Tech and Corviin Real Estate data are isolated server-side.
- [ ] All initial members are seeded dynamically.
- [ ] All required modules work on desktop and mobile.
- [ ] Every feature uses persistent database records.
- [ ] Cross-module relationships and workflows work without duplicate records.
- [ ] Assets upload to private storage and retain correct relationships.
- [ ] Activity and history are preserved.
- [ ] Dashboard and search use real accessible data.
- [ ] Unit, API integration and end-to-end tests pass.
- [ ] Production builds pass.
- [ ] Android APK builds and installs successfully.
- [ ] Deployment, backup and recovery instructions are documented.
- [ ] Known limitations are visible and honest.
- [ ] Real authentication is implemented before public exposure or handling sensitive data.

**The most important rule:** Build the skeleton once, then implement one complete feature at a time. Do not confuse a generated screen with a finished feature, or a collection of pages with a connected application.
