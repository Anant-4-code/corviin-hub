# CORVIIN HUB — Product Requirements Document (PRD)

**Document ID:** CH-PRD-001  
**Version:** 1.0  
**Status:** Draft for product and engineering review  
**Date:** 5 November 2026  
**Platforms:** Responsive PC Web + Android APK  
**Product owner:** Corviin Group  
**Related documents:** CORVIIN HUB Updated Feature Scope v1.1; CORVIIN HUB Web & Mobile Architecture and Flow v1.0

---

## 1. Executive summary

CORVIIN HUB is an internal operations platform for Corviin Group. It brings daily work, customer relationships, campaign production, meetings, visits, plans, assets and team activity into one application.

The product serves two operational workspaces:

- **Corviin Tech**
- **Corviin Real Estate**

Both workspaces use the same application and shared product patterns. Their operational records, CRM pipelines, campaign data, assets, settings and reporting must remain logically separated.

The product will be delivered through one responsive React client. The same client will run in desktop/mobile browsers and be packaged as an Android application using Capacitor. A shared backend, database and private file-storage layer will support both delivery channels.

The defining product goal is not to expose the largest possible number of features. It is to make frequent work fast and understandable: check what is due, update a task, contact a lead, record an interaction, schedule a follow-up, arrange a meeting or site visit, and move a campaign forward.

## 2. Product vision and principles

### 2.1 Vision

Provide a simple, dependable operating workspace where every member can see what needs attention, take action, and understand the current state of work across Corviin Tech and Corviin Real Estate.

### 2.2 Product principles

1. **Clarity before density:** prioritise the next useful action over dashboards full of low-value metrics.
2. **Progressive disclosure:** essential fields first; optional details, audit history and advanced settings on demand.
3. **One source of truth:** link tasks, CRM records, campaigns, meetings, plans and assets instead of duplicating records.
4. **Mobile is a first-class experience:** mobile screens use cards, short forms, agenda views and thumb-friendly actions—not compressed desktop tables.
5. **Desktop supports throughput:** use tables, filters, multi-column views and quick inspection where they improve productivity.
6. **Accountability by design:** record who created, changed, assigned, started, rescheduled, uploaded, approved and completed each item.
7. **Workspace isolation:** Tech and Real Estate records must not leak across workspaces.
8. **Low-friction CRM:** calling, messaging, note-taking, status updates and follow-up scheduling should be quick.
9. **History is retained:** important operational changes must be auditable and must not be silently overwritten.
10. **Future-ready membership:** the initial team is three members, but the product must support adding members without schema or UI redesign.

### 2.3 Non-goals

The initial product is not intended to be:
- A public customer-facing portal.
- A full accounting, payroll or invoicing system.
- A replacement for a dedicated marketing automation or ad-buying platform.
- A full video-editing application.
- A general-purpose chat or social network.
- A native Kotlin UI maintained separately from the web client.
- An advanced BI/data warehouse product in the first release.

Integrations beyond the explicitly selected initial requirements should be treated as later scope.

## 3. Users, roles and access

### 3.1 Initial users

The initial team consists of:
- Anant
- Rohit
- Utkarsh

All three have equal operational access in the initial release. They can view, create, edit, assign, reschedule and complete records within their authorised workspaces.

### 3.2 User model

Do not hard-code the application to three users. Support:
- User account and profile.
- Workspace membership.
- Membership status.
- Workspace-level role/permission extension for future use.
- Notification preferences.
- Session and security settings.

### 3.3 Accountability

Every material write operation must identify the authenticated actor. The assignee, record owner, creator and last editor are separate concepts and must not be conflated.

### 3.4 Workspace access

A user can access a workspace only through an active membership. Every operational record belongs to one workspace. Workspace access is enforced by the backend, not merely by hiding UI elements.

## 4. Product scope and priority

### 4.1 Initial module scope

1. Dashboard
2. My Tasks
3. All Tasks
4. Plans & Goals
5. Calendar
6. Campaigns
7. Assets & Storage
8. Clients & Leads / CRM
9. Meetings
10. Team
11. Settings

### 4.2 Priority definitions

- **P0 — Release critical:** required for the first usable production release.
- **P1 — Important:** required for a complete operational workflow; can follow the foundation release.
- **P2 — Later enhancement:** valuable but not required to prove the core product.

### 4.3 Recommended delivery priority

| Capability | Priority | Reason |
|---|---:|---|
| Authentication and workspace isolation | P0 | Security and data correctness |
| Responsive application shell | P0 | Foundation for all modules |
| Tasks and task history | P0 | Daily operational backbone |
| CRM records, interaction timeline and follow-ups | P0 | Core business workflow |
| Meetings and site visits | P0 | Completes CRM follow-through |
| Dashboard and notifications | P0 | Daily entry point |
| Campaign stages and linked tasks | P1 | Content and marketing operations |
| Assets and private upload storage | P1 | Campaign and document workflow |
| Plans, goals and milestones | P1 | Planning and progress visibility |
| Advanced calendar views | P1 | Scheduling and team coordination |
| Advanced reports, saved views and automation | P2 | Optimisation after real usage |

The product scope remains the eleven modules. This priority order is a suggested implementation sequence, not a removal of agreed modules.

## 5. Platform requirements

### 5.1 PC web

The web experience is optimised for desktop/laptop use:
- Persistent collapsible left navigation.
- Top bar with workspace switcher, search, notifications and profile.
- Tables, list and Kanban views where appropriate.
- Multi-column detail pages.
- Compact filters and bulk actions where safe.
- Keyboard-friendly interaction.
- No horizontal page scrolling at common desktop widths.

### 5.2 Mobile web and Android

Mobile is designed for one-handed use and short operational actions:
- Bottom navigation: Home, Tasks, Calendar, CRM, More.
- More contains Campaigns, Plans & Goals, Meetings, Assets, Team and Settings.
- Cards instead of wide tables.
- Agenda-first calendars.
- Short forms with required fields first.
- Full-screen forms or bottom sheets.
- Large touch targets and sticky save/action areas.
- Quick Call, Message, Open, Start, Complete and Follow-up actions where applicable.
- Safe-area and on-screen-keyboard handling.

### 5.3 Responsive breakpoints

Starting design breakpoints:
- Small mobile: below 480 CSS px.
- Large mobile: 480–767 CSS px.
- Tablet: 768–1023 CSS px.
- Desktop: 1024 CSS px and above.
- Wide desktop: 1440 CSS px and above.

Use fluid layouts and test real device widths; breakpoints are not substitutes for responsive behaviour.

## 6. Functional requirements

Each requirement has an identifier for traceability. “Must” denotes required behaviour for the stated scope.

### 6.1 Authentication and workspace

- **FR-AUTH-01:** Users must be able to sign in and sign out securely.
- **FR-AUTH-02:** The application must display only workspaces in which the user has active membership.
- **FR-AUTH-03:** Users with membership in both workspaces must be able to switch between Corviin Tech and Corviin Real Estate.
- **FR-AUTH-04:** Every API read/write must enforce workspace access on the server.
- **FR-AUTH-05:** The active workspace must be visually apparent throughout the application.
- **FR-AUTH-06:** Expired or revoked sessions must not retain access to protected records.

### 6.2 Dashboard

- **FR-DASH-01:** Show due-today, overdue, in-progress, completed-in-period, follow-ups-due and upcoming-meeting/visit summaries.
- **FR-DASH-02:** Show active plans/goals and active campaigns for the selected workspace.
- **FR-DASH-03:** Show today's tasks grouped by assignee.
- **FR-DASH-04:** Show upcoming calendar items and recent activity.
- **FR-DASH-05:** Each summary card must open the relevant filtered module.
- **FR-DASH-06:** Dashboard data must respect workspace access and selected date range.
- **FR-DASH-07:** Empty states must explain the absence of data and provide a relevant next action.

### 6.3 Tasks

- **FR-TASK-01:** Members must be able to create, view, edit, assign and cancel tasks in an authorised workspace.
- **FR-TASK-02:** A task must store title, description, workspace, creator, assignee, priority, status, planned start, deadline and progress.
- **FR-TASK-03:** A task may link to a goal, plan, campaign, CRM record, meeting or other supported record.
- **FR-TASK-04:** Tasks must support checklist items, comments and attachments.
- **FR-TASK-05:** Members must be able to start, pause, resume, block and complete tasks.
- **FR-TASK-06:** Each work session must preserve start, pause/resume and end timestamps and the acting member.
- **FR-TASK-07:** Completion must record the actual completion timestamp and actor; a completion note may be added.
- **FR-TASK-08:** Rescheduling must preserve old schedule, new schedule, actor, timestamp and reason.
- **FR-TASK-09:** My Tasks must show the signed-in member's tasks in the active workspace.
- **FR-TASK-10:** All Tasks must provide list/table and Kanban views; calendar and member grouping are also required in the full scope.
- **FR-TASK-11:** Filters must include member, status, priority, date range, overdue, campaign, plan/goal and CRM record.
- **FR-TASK-12:** The UI must distinguish creator, assignee and last actor.

Suggested statuses: To Do, In Progress, On Hold, Blocked, Completed, Cancelled. Review status, if enabled, is separate from task execution status.

### 6.4 Plans and goals

- **FR-PLAN-01:** A goal represents an outcome; a plan represents the approach; tasks represent actionable work.
- **FR-PLAN-02:** Goals must support owner, participants, outcome, start/target dates, priority, status and optional measurable target/current value.
- **FR-PLAN-03:** Plans must support strategy, steps, owner, participants, dates, milestones, resources and risks.
- **FR-PLAN-04:** Goals and plans must link to relevant tasks, campaigns and each other.
- **FR-PLAN-05:** Progress should be calculated from linked tasks/milestones where configured.
- **FR-PLAN-06:** Manually entered progress must be clearly labelled as manual.
- **FR-PLAN-07:** Views must support active, upcoming, at-risk/delayed, completed and member-based grouping.

### 6.5 Calendars

The Calendar module contains three distinct calendar experiences.

**Content & Campaign Calendar**
- **FR-CAL-01:** Show campaign milestones and content workflow dates: research, scripting, review, recording, editing, approval, scheduled post and actual post.
- **FR-CAL-02:** Provide month, week, day and agenda views.
- **FR-CAL-03:** Calendar items must open their source campaign/content record.
- **FR-CAL-04:** Rescheduling must preserve schedule history and distinguish planned from actual publication.

**Team Task Calendar**
- **FR-CAL-05:** Show tasks grouped by member for the selected date.
- **FR-CAL-06:** Member sections must expand/collapse to reveal that member's tasks.
- **FR-CAL-07:** Show planned start, deadline, status, priority, related record and actual work timestamps.
- **FR-CAL-08:** Support opening, adding, starting, pausing, resuming, completing and rescheduling tasks, subject to permissions.

**Meetings & Visits Calendar**
- **FR-CAL-09:** Show internal meetings, client meetings, partner/developer meetings, buyer meetings, site visits, online meetings and other events.
- **FR-CAL-10:** Show date/time, type, location/link, organiser, participants and linked CRM/project/campaign record.
- **FR-CAL-11:** Support schedule, edit, reschedule, complete, cancel and no-show outcomes.
- **FR-CAL-12:** Meeting outcomes and follow-ups must link to the meeting record.

### 6.6 Campaigns

- **FR-CAMP-01:** Campaigns must be workspace-scoped.
- **FR-CAMP-02:** Provide separate Tech and Real Estate campaign lists/filters.
- **FR-CAMP-03:** Campaign cards must show title, description, owner, stage, dates, progress and next deadline.
- **FR-CAMP-04:** Support five stages: Initial Idea; Scripting & Planning; Recording & Asset Upload; Editing & Final Asset; Posting & Completion.
- **FR-CAMP-05:** Each stage must expose only relevant fields, checklist items and actions.
- **FR-CAMP-06:** Stage changes must be explicit and recorded in activity history.
- **FR-CAMP-07:** Stage-specific tasks must use the shared task engine and appear in My Tasks, All Tasks and Team Task Calendar.
- **FR-CAMP-08:** Campaign details must have an Assets section showing assets linked to that campaign.
- **FR-CAMP-09:** Uploading from a campaign must create an asset relationship to that campaign automatically.
- **FR-CAMP-10:** Asset reuse across campaigns must be an explicit relationship or controlled copy.
- **FR-CAMP-11:** Removing an asset from a campaign must remove the relationship only; permanent file deletion is a separate confirmed action.
- **FR-CAMP-12:** Posting stage must store platform, scheduled/actual date, publishing owner, caption, public URL, published proof and performance notes.

### 6.7 Assets and storage

- **FR-ASSET-01:** Provide a global asset library per workspace.
- **FR-ASSET-02:** Support categories including references/research, scripts/copy, raw footage, images, audio/VO, draft edits, final approved assets, published proof and other documents.
- **FR-ASSET-03:** Store metadata including workspace, linked campaign/stage, category, file type, size, uploader, date, description, tags and version.
- **FR-ASSET-04:** Support search/filter by campaign, category, file type, uploader, date, tags, project and client where linked.
- **FR-ASSET-05:** Provide upload progress, success/failure state and retry where possible.
- **FR-ASSET-06:** Files must be stored privately and accessed through authorised mechanisms.
- **FR-ASSET-07:** Support preview for compatible formats and an appropriate open/download fallback for others.
- **FR-ASSET-08:** Support version history and linked-record visibility.
- **FR-ASSET-09:** Large video uploads should use resumable or multipart transfer where supported and configured.
- **FR-ASSET-10:** Permanent deletion must be permission-checked and confirmed.

### 6.8 CRM

CRM is a high-priority product area. Its primary actions are search, contact, update status, add interaction, schedule follow-up and link a meeting/visit.

**Common CRM**
- **FR-CRM-01:** CRM landing page must separate Tech and Real Estate record categories.
- **FR-CRM-02:** Search must support relevant identifiers such as name, company and phone number.
- **FR-CRM-03:** CRM records must have an assigned member, source, status and next follow-up where applicable.
- **FR-CRM-04:** Record detail must show an ordered activity timeline.
- **FR-CRM-05:** Members must be able to add notes, calls/messages as logged interactions, meetings, follow-ups and tasks.
- **FR-CRM-06:** Quick actions must be available without navigating through unnecessary pages.
- **FR-CRM-07:** A follow-up must have an owner, due date/time and status; notes alone are not a follow-up.
- **FR-CRM-08:** CRM records must link to relevant campaigns, projects, tasks, meetings, proposals and visits.

**Tech CRM**
- **FR-CRM-T-01:** Support categories such as business/client, software/website enquiry, automation enquiry, potential project, technology partner and existing client.
- **FR-CRM-T-02:** Capture contact/company, phone/email, business type, service, requirement, optional budget, source, assigned member, status, follow-up and notes.
- **FR-CRM-T-03:** Support pipeline: New Enquiry → Contact Pending → Contacted → Requirement Discussion → Qualified → Proposal/Quotation → Negotiation → Won/Client or Lost, with Follow Up Later.

**Real Estate Developers & Partners**
- **FR-CRM-P-01:** Support developer, builder, construction company, landowner, channel partner, broker/agent and other partner types.
- **FR-CRM-P-02:** Capture company/contact, phone/email, location, partner type, project names/locations, business/marketing requirements, partnership status, assigned member, source, follow-up, meetings and documents.
- **FR-CRM-P-03:** Support pipeline: New Partner Lead → Initial Contact → Meeting Planned → Requirement Discussion → Proposal/Service Details → Follow-up/Negotiation → Partnership Confirmed → Active Partner, with Not Interested/Lost and Follow Up Later outcomes.
- **FR-CRM-P-04:** One partner must be linkable to multiple projects and campaigns.

**Real Estate Buyers**
- **FR-CRM-B-01:** Capture customer name, phone/email, preferred contact, locality, property type/configuration, budget, timeline, purpose if volunteered, preferred project, source/campaign, assigned member, status, follow-up, notes and visit history.
- **FR-CRM-B-02:** Support pipeline: New Enquiry → Contact Pending → Contacted → Requirement Captured → Qualified Buyer → Project/Property Shared → Site Visit Planned → Site Visit Completed → Follow-up/Discussion → Booking/Converted, with Not Interested/Lost and Follow Up Later outcomes.
- **FR-CRM-B-03:** Site visits must be separate linked records with date/time, property/project, location, responsible member, confirmation, outcome, feedback and next follow-up.
- **FR-CRM-B-04:** Buyer and developer records must use distinct forms, fields, filters and pipelines.

### 6.9 Meetings

- **FR-MTG-01:** Meetings must be first-class records, not only calendar events.
- **FR-MTG-02:** Capture title, type, workspace, date/start/end, location/link, organiser, participants, linked CRM/campaign/project, agenda, objective, preparation and attachments.
- **FR-MTG-03:** Detail sections must include overview, agenda, preparation, notes, decisions, action items, attachments, outcome/follow-up and history.
- **FR-MTG-04:** Action items must be convertible to tasks while retaining the meeting relationship.
- **FR-MTG-05:** Statuses must include Scheduled, Confirmed, Completed, Rescheduled, Cancelled and No Show.
- **FR-MTG-06:** Preserve creator, original schedule, reschedule reasons, participant changes, decisions, action-item changes and completion details.

### 6.10 Team

- **FR-TEAM-01:** Show member profiles and workspace membership.
- **FR-TEAM-02:** Show assigned/completed tasks, workload, upcoming deadlines, plans/goals, campaigns, meetings/visits and recent activity.
- **FR-TEAM-03:** Clearly show who performed each action.
- **FR-TEAM-04:** Support future member additions without hard-coded member lists.

### 6.11 Settings

- **FR-SET-01:** Support profile, account, security and session settings.
- **FR-SET-02:** Support workspace selection and workspace-level configuration.
- **FR-SET-03:** Configure task defaults, statuses, priorities, categories and reminders.
- **FR-SET-04:** Configure campaign types, stages and asset categories.
- **FR-SET-05:** Configure CRM fields and pipelines separately by workspace/record type.
- **FR-SET-06:** Configure calendar defaults, week start, working hours, reminders and visibility.
- **FR-SET-07:** Configure notification preferences.
- **FR-SET-08:** Show storage usage, upload limits and retention configuration.
- **FR-SET-09:** Show access/security, activity and backup status where available.

### 6.12 Activity and audit

- **FR-AUD-01:** Record important create/update/delete/assignment/status/schedule/stage/upload/approval/completion actions.
- **FR-AUD-02:** Store workspace, entity type/id, action, actor, timestamp, previous/new values where applicable and reason/comment where relevant.
- **FR-AUD-03:** Show record-level history in context.
- **FR-AUD-04:** Operational history must not be silently erased by ordinary edits.
- **FR-AUD-05:** Deletion of business records should use archive/soft-delete where appropriate; permanent deletion is restricted and audited.

## 7. Core user journeys and acceptance outcomes

### 7.1 Daily task journey

1. Member signs in and selects a workspace.
2. Dashboard shows due/overdue work and follow-ups.
3. Member opens My Tasks and starts a task.
4. Member adds progress, comments or files.
5. Member completes the task with an optional completion note.
6. Task status, timestamps and activity timeline update.

**Acceptance:** the task is visible in the correct workspace, its assignee and actor are distinct, and its work/reschedule history is retained.

### 7.2 New buyer journey

1. Open CRM → Real Estate → Buyers.
2. Create buyer using name, phone, assigned member and source.
3. Open buyer detail and contact the buyer.
4. Capture requirement and update pipeline.
5. Link a project/property and schedule a site visit.
6. Record visit outcome and create the next follow-up.

**Acceptance:** buyer, site visit, follow-up and interactions are linked and visible in the buyer timeline.

### 7.3 Developer/partner journey

1. Open CRM → Real Estate → Developers & Partners.
2. Create partner and assign an owner.
3. Record contact and requirements.
4. Schedule a meeting and capture decisions.
5. Prepare service/proposal details and follow up.
6. Confirm partnership and link projects/campaigns.

**Acceptance:** partner has its own pipeline and can relate to multiple projects/campaigns.

### 7.4 Campaign journey

1. Create campaign in Initial Idea.
2. Assign owner and create initial tasks.
3. Complete script and planning.
4. Record production and upload raw assets.
5. Review edits and approve final assets.
6. Schedule/publish and store public URL/performance notes.

**Acceptance:** stage history, linked tasks and campaign assets remain traceable.

### 7.5 Meeting-to-task journey

1. Schedule a meeting and add participants/agenda.
2. Record preparation and meeting notes.
3. Capture decisions and action items.
4. Convert action items into tasks.
5. Set next follow-up or meeting.

**Acceptance:** tasks created from a meeting retain the source meeting relationship.

## 8. UX and design requirements

### 8.1 Visual direction

- Minimal, professional and calm.
- Light theme as the initial default; dark theme may be supported through settings.
- Neutral surfaces with a restrained primary accent.
- Colour is primarily semantic: status, priority and alerts.
- Avoid excessive gradients, glows, nested cards and decorative charts.
- Use consistent spacing, typography and alignment.

### 8.2 Interaction rules

- Aim for at least 44 × 44 CSS px touch targets on mobile.
- Important actions must not depend on hover.
- Show text labels with status colours; never use colour alone.
- Provide loading, empty, error, success and offline/retry states as appropriate.
- Confirm destructive actions.
- Preserve form values after validation errors.
- Keep one dominant primary action per screen.
- Do not expose every optional field in the initial create form.

### 8.3 Accessibility

Target WCAG 2.2 AA as the design goal:
- Keyboard access for core desktop flows.
- Visible focus indicators.
- Adequate contrast.
- Programmatic labels for inputs.
- Error text associated with fields.
- Status not communicated by colour alone.
- Scalable text and usable layouts at zoom.
- Screen-reader names for icon-only controls.

## 9. Non-functional product requirements

- **NFR-01 Performance:** common screens should feel responsive on typical broadband and mid-range Android devices; establish measurable budgets during technical design.
- **NFR-02 Reliability:** failed writes must provide clear feedback and must not silently lose user-entered data.
- **NFR-03 Security:** enforce authentication, workspace authorisation, private file access and secure transport.
- **NFR-04 Privacy:** collect only operational information needed for the workflow; restrict sensitive customer data to authorised members.
- **NFR-05 Auditability:** preserve actor and event history for important operations.
- **NFR-06 Responsiveness:** support current common desktop browsers, tablets and Android phone sizes.
- **NFR-07 Maintainability:** use shared components, typed contracts, migrations and automated tests.
- **NFR-08 Scalability:** support additional members, records and workspace configuration without hard-coded assumptions.
- **NFR-09 Backup/recovery:** define database and file backup policies before production launch.
- **NFR-10 Observability:** errors and critical backend failures must be diagnosable without exposing private customer data in logs.

Specific numeric SLOs, retention periods, upload limits and supported browser versions are deployment decisions to be agreed before production.

## 10. Success metrics

Establish a baseline during pilot use, then track:
- Daily/weekly active members.
- Percentage of tasks with an assignee and deadline.
- On-time task completion rate.
- Overdue task count and age.
- Follow-ups completed by due date.
- CRM records with a next action.
- Time from new enquiry to first recorded contact.
- Site visits scheduled versus completed.
- Campaign stage cycle time.
- Campaigns published by target date.
- Asset upload success rate.
- Percentage of meeting action items converted to tasks.
- Mobile completion rate for common task/CRM actions.

Metrics should help identify workflow friction, not be used as an employee surveillance score.

## 11. MVP release criteria

A release candidate is acceptable when:
1. A user can authenticate and access only authorised workspaces.
2. Core tasks can be created, assigned, started, paused, resumed, completed and rescheduled with history.
3. Tech CRM, Real Estate Buyers and Real Estate Partners have distinct pipelines and forms.
4. CRM search and interaction timelines work.
5. Follow-ups have owner, due date and status.
6. Meetings and site visits link to the relevant CRM record.
7. Meeting action items can become tasks.
8. Dashboard summaries link to the corresponding records.
9. Responsive layouts work without normal page-level horizontal scrolling on mobile.
10. Errors, loading and empty states are handled.
11. Critical access-control, data-integrity and workflow tests pass.
12. Production backups, monitoring and support ownership are documented.

## 12. Open product decisions

These must be resolved before or during implementation; do not silently assume them:
- Authentication provider and account invitation process.
- Whether all initial users belong to both workspaces by default.
- Exact priority labels and whether task review/approval is enabled.
- Whether CRM call/message actions are only device hand-offs or require integrated communication providers.
- Whether email, WhatsApp, calendar or property portal integrations are in the first release.
- Exact CRM required fields and configurable custom-field policy.
- Notification channels: in-app, Android push, email or combinations.
- File-size limits, allowed file types and retention policy.
- Backup retention and disaster-recovery objectives.
- Whether offline editing is required or only safe retry/draft persistence.
- Production domain, hosting region and data residency requirements.

## 13. Traceability

Engineering should map each FR identifier to:
- UI route/component.
- API endpoint.
- Data entity.
- Permission rule.
- Automated test.
- Release milestone.

The PRD defines expected product behaviour. Implementation details and system constraints are defined in the companion Technical Requirements Document (TRD).
