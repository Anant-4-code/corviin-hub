# CORVIIN HUB

## Detailed Feature Working & Functional Specification

**Version:** 1.0 -- Scope Draft\
**Platforms:** PC Web Application + Android APK\
**Architecture:** One project, shared backend, shared database, shared
file storage and APIs\
**Workspaces:** Corviin Tech and Corviin Real Estate

------------------------------------------------------------------------

## 1. Product Overview

CORVIIN HUB is an internal business operations platform for Corviin
Group. It combines task management, project tracking, campaign planning,
content production, asset storage, CRM, meetings, team coordination,
notifications and reporting.

The product has two workspaces: - **Corviin Tech** - **Corviin Real
Estate**

Both workspaces use the same application structure and core modules.
Their tasks, projects, campaigns, content, assets, clients, leads,
meetings, members and reports remain logically separated. A user may
have access to one or both workspaces.

### Main objectives

-   Make clear what work needs to be done, who owns it and when it is
    due.
-   Track task progress and preserve who changed, reviewed and completed
    work.
-   Manage projects, milestones and delivery status.
-   Plan campaigns, topics, scripts, production dates, approvals and
    publishing.
-   Organise footage, designs, documents and other assets.
-   Maintain client and lead records, follow-ups and interaction
    history.
-   Record meetings, decisions and action items.
-   Give managers visibility into workload, delays and progress.
-   Provide the same operational data on desktop and Android.

### Core principles

1.  Task-first: accountability and completion history are central.
2.  One product, two workspaces: shared features, separated business
    data.
3.  Traceability: important actions are recorded.
4.  Connected records: tasks can be linked to projects, campaigns,
    content, clients and meetings.
5.  Role-based access: users only access records they are authorised to
    use.
6.  Desktop-first for detailed planning; Android-first for quick
    updates, uploads and approvals.
7.  The backend is the source of truth for both clients.

------------------------------------------------------------------------

## 2. Application Structure and Workspace Behaviour

### 2.1 Single project, two applications

The product consists of: - PC web application. - Android application
distributed as an APK. - Shared backend API. - Shared PostgreSQL
database. - Shared authentication and permission system. - Shared
file-storage service. - Shared notification service.

A task created on the web should appear in Android after
synchronisation. An update made on Android should be visible on the web
after it is saved to the backend.

### 2.2 Workspace selection

After login, users with access to both workspaces can select Corviin
Tech or Corviin Real Estate. Users with access to only one workspace
enter that workspace directly. The active workspace should remain
visible in the header.

### 2.3 Workspace isolation

Every business record must be associated with a workspace, including
tasks, projects, campaigns, content, assets, clients, leads, meetings,
reports and settings.

The backend must check workspace access on every request. Hiding a menu
item in the frontend is not sufficient. A Tech-only user must not be
able to access Real Estate records by changing a URL, record ID or API
parameter.

### 2.4 Shared versus configurable

Shared: - Application layout and core modules - Authentication and user
identity - Task engine and activity framework - Notification framework -
API contracts and reporting engine

Configurable per workspace: - Departments and teams - Task categories
and statuses - Project and campaign types - Content and asset
categories - Role assignments - Notification defaults - Workspace accent
colour and terminology

------------------------------------------------------------------------

## 3. Main Navigation

1.  Dashboard
2.  My Tasks
3.  All Tasks
4.  Projects
5.  Campaigns
6.  Content Calendar
7.  Assets & Storage
8.  Clients & Leads
9.  Meetings
10. Team
11. Reports
12. Notifications
13. Settings

Menu visibility depends on the user's workspace membership and
permissions.

------------------------------------------------------------------------

## 4. Dashboard

### Purpose

The dashboard is the user's operational overview. It answers: - What
must I do today? - What is overdue? - Which projects or campaigns need
attention? - What is waiting for review? - What has recently changed? -
How is the team progressing?

### Sections

**A. Summary cards** - Active tasks - Tasks assigned to me - Tasks due
today - Overdue tasks - Tasks awaiting review - Tasks completed in the
selected period - Active projects - Active campaigns

Selecting a card opens the relevant filtered list.

**B. My Work** Group tasks into Today, Upcoming, Overdue, Waiting for My
Review and Recently Completed. Show title, linked project/campaign,
priority, due date and status.

**C. Project and Campaign Progress** Show name, manager, status,
completion percentage, next milestone and due date. Progress must follow
a documented calculation rule. A basic rule is completed tasks divided
by total tasks; weighted tasks can be supported later.

**D. Team Workload** For authorised managers, show each member's open,
overdue, upcoming and review-pending tasks.

**E. Recent Activity** Show task creation, assignment, status changes,
comments, uploads, approvals, meeting updates and other important events
in chronological order.

**F. Quick Actions** Create task, project, campaign, content idea,
upload asset, add client/lead or schedule meeting.

Filters can include date range, team, project, campaign, status and
assignee.

------------------------------------------------------------------------

## 5. Task Management

### 5.1 Purpose

Task Management is the core module. It creates a clear record of work,
responsibility, deadline, progress, review and completion.

### 5.2 Creating a task

A task can contain: - Title and detailed description - Workspace -
Linked project, campaign, client or content item - Category and tags -
Priority - Start date and due date/time - Estimated effort, if enabled -
Owner - One or more assignees - Reviewer or approver - Checklist or
subtasks - Dependencies - Attachments - Reminder settings

The system validates required fields and date combinations.

### 5.3 Responsibility roles

-   **Creator:** created the task.
-   **Owner:** accountable for its completion.
-   **Assignee:** performs the work.
-   **Reviewer:** checks the submitted work.
-   **Approver:** gives final approval when required.

For a simple task, owner and assignee may be the same person. For
multi-person work, the owner remains accountable while assignees can own
subtasks.

### 5.4 Task status workflow

Suggested statuses: 1. Backlog -- recorded but not scheduled. 2. To Do
-- ready to start. 3. In Progress -- work has started. 4. On Hold --
temporarily paused. 5. Blocked -- cannot proceed because of an issue or
dependency. 6. In Review -- submitted for checking. 7. Changes Requested
-- corrections are required. 8. Approved -- accepted by
reviewer/approver. 9. Completed -- work is finished. 10. Cancelled -- no
longer required.

Workspaces may use a shorter or customised workflow.

**Example:** An assignee moves a task from To Do to In Progress. When
finished, they submit it for review with a note or deliverable. The
reviewer approves it, or requests changes with a reason. Each transition
records the actor and timestamp.

### 5.5 Progress

Progress may be based on: - Status - Percentage complete - Checklist
completion - Subtask completion

Recommended rule: if subtasks/checklist items exist, calculate progress
from completed items; otherwise allow a manual percentage. The UI should
identify how progress was calculated.

### 5.6 Subtasks and checklists

Example parent task: Publish campaign video. - Finalise topic - Prepare
script - Record footage - Edit video - Review caption - Obtain
approval - Publish - Add published URL

Each subtask can have an assignee, status, due date and completion
record.

### 5.7 Dependencies

Tasks can depend on other tasks. Example: editing depends on recording;
publishing depends on approval. Show prerequisites, dependent tasks and
blocked reasons. Warn when a user attempts to complete work before its
prerequisite. Any permitted override should be logged.

### 5.8 Comments and attachments

Users can comment, reply if threading is enabled, mention members,
attach files and record blockers. Comments show author and time.
Attachments show file name, uploader, upload date, size and
preview/download availability. Access follows workspace and record
permissions.

### 5.9 Review and approval

1.  Assignee submits work for review.
2.  Reviewer is notified.
3.  Reviewer checks the deliverable.
4.  Reviewer approves or requests changes.
5.  A change request includes a comment/reason.
6.  Assignee updates and resubmits.
7.  Final decision remains in the task history.

### 5.10 Reminders and recurring tasks

Notifications can be sent for assignment, approaching due date, overdue
work, review requests, changes requested, blockers and completion.

Recurring tasks may be daily, weekly, monthly or a custom interval. Each
occurrence is a separate task with its own status and history;
completing one does not complete future occurrences.

### 5.11 Views and filters

Views: - List - Kanban by status - Table - Calendar - My Tasks - Team
Tasks - Overdue - Completed

Filters: - Status, priority, assignee, owner, reviewer - Due date and
completion date - Project, campaign, client - Category, tags and creator

Bulk actions require confirmation and must only update fields the user
is authorised to change.

### 5.12 Completion history

Retain: - Completed by and completion date/time - Completion note and
deliverables - Reviewer and approval details - Status transitions -
Reopen history - Time spent, only if time tracking is enabled

Reopening a task must not erase its earlier completion event.

------------------------------------------------------------------------

## 6. Project Management

### Purpose

Projects group related tasks, milestones, documents, meetings and
deliverables.

### Project creation

Fields include project name, description, workspace, type, manager,
team, start and target dates, priority, status, client, objectives, tags
and reference documents.

### Lifecycle

Draft → Planned → Active → On Hold / At Risk → Completed → Archived or
Cancelled.

### Project overview

Show description, objectives, owner, team, dates, status, task
completion, milestones, upcoming deadlines, blocked/overdue tasks,
recent activity, meetings, files and linked client.

### Milestones

Each milestone has a name, description, target date, owner, related
tasks, status, completion date and evidence. Completion should be based
on its defined conditions or an authorised owner's confirmation.

### Project tasks

Tasks can be created within a project or linked to it. The project view
groups tasks by status and highlights overdue, blocked and
review-pending work.

### Project progress

Show task completion and milestone completion. Project health indicators
should use explicit rules, such as overdue critical milestones or
blocked high-priority tasks---not an unexplained score.

### Documents and history

Link briefs, requirements, proposals, designs, reports, meeting notes
and deliverables. Important changes appear in the project activity
timeline.

------------------------------------------------------------------------

## 7. Campaign Management

### Purpose

Campaigns organise marketing and business campaigns from planning
through production, approval, publication and reporting. The module can
support Real Estate marketing and Tech promotions.

### Campaign creation

Fields: - Campaign name, objective and description - Workspace and
campaign type - Target audience - Platforms/channels - Owner and team -
Start/end dates - Planned budget and actual spend reference -
Client/project link - Key message and CTA - Success metrics - Reference
files

### Campaign lifecycle

Idea → Planning → Ready for Production → In Production → Internal Review
→ Client Review (optional) → Approved → Scheduled → Live → Completed.
Paused and Cancelled may also be used.

### Planning

The campaign owner defines the objective, audience, channels, content
required, dates, responsibilities, budget and success measures.

### Campaign calendar

Display campaign dates, content production dates, review deadlines,
approvals, publishing dates, milestones and reporting dates. Provide
month, week and agenda views.

### Task generation

Create linked tasks such as research topic, prepare script, design
creative, record footage, edit video, review, obtain approval, schedule,
publish and report. Generated tasks use the standard task engine.

### Budget and KPIs

Where reliable data exists, track planned budget, actual spend, reach,
impressions, engagement, clicks, enquiries/leads, qualified leads, cost
per lead and conversion. Clearly distinguish manually entered data from
integrated platform data.

### Campaign report

Show objective, planned/actual dates, content published,
completed/delayed tasks, budget, KPIs, leads, learnings and final
status.

------------------------------------------------------------------------

## 8. Content Planning and Calendar

### Purpose

Manage individual content items within campaigns or an ongoing content
plan.

### Idea bank

Save topic, description, category, audience, format, reference link,
hook, CTA, priority, creator and status. Ideas can be searched, tagged
and converted into planned content.

### Content item

Fields include title, topic, campaign, project/client, platform, format,
objective, audience, hook, script, caption, hashtags, CTA, references,
writer, creator, editor, reviewer, production date, review deadline,
publishing date and published URL.

### Production workflow

Idea → Planned → Script Required → Script in Progress → Script Review →
Script Approved → Production Required → Recording → Editing → Review →
Changes Required → Final Approval → Scheduled → Published → Archived.

### Script management

Store hook, main script, scene/shot breakdown, voice-over, on-screen
text, caption, CTA, hashtags and references. Maintain revisions so users
can identify who changed the script and when.

### Content calendar

Show title, platform, format, campaign, responsible member, production
status and publishing date. Filter by platform, campaign, status, format
and member. Distinguish planned dates from confirmed scheduled
publication.

### Review and publishing

Creator submits content. Reviewer approves or requests changes with
comments. After publication, record platform, date/time, public URL,
final asset and publishing owner. If no publishing integration exists,
the member publishes manually and records the result.

### Performance

Where available, store views, reach, impressions, likes, comments,
shares, saves, clicks and leads. Record metric source and reporting
date.

------------------------------------------------------------------------

## 9. Asset and File Management

### Purpose

Provide an organised library for footage, designs, documents, scripts
and project references.

### Supported categories

Images, posters, raw footage, edited videos, audio, scripts, captions,
PDFs, office documents, presentations, logos, brand files, client files
and references. Actual file types and upload limits must be specified
during implementation.

### Organisation

Organise by workspace, project, campaign, client, content item, category
and custom folder. Folder placement is not a substitute for permission
checks.

### Upload workflow

1.  User selects or drops a file.
2.  Validate type and size.
3.  Upload to secure object storage.
4.  Save metadata and workspace/record relationships.
5.  Display the asset in its folder and linked records.
6.  Show clear success or failure and retry options.

### Metadata

File name, type, size, workspace, folder, uploader, upload date,
modified date, tags, description, linked records and version.

### Search and preview

Search file names and metadata; filter by type, category, uploader,
date, project, campaign, client, tags and folder. Preview supported
formats; otherwise show file details and download action.

### Versioning

When a new version replaces an asset, retain earlier versions according
to policy, record uploader and timestamp, identify the current version
and allow authorised restore if enabled.

### Storage management

Show total storage, file count, largest files, usage by category/project
and upload failures. Deletion should be controlled and warn about linked
records.

------------------------------------------------------------------------

## 10. Clients and Leads CRM

### Purpose

Maintain business relationships, enquiries, follow-ups and interaction
history. Configure record types separately: - Tech: business clients,
service enquiries, software prospects and partners. - Real Estate:
developer enquiries, property buyer enquiries and project prospects.

### Lead creation

Fields can include name, phone, email, company, lead type/source,
interested service or project, requirement, budget range where relevant,
location, owner, priority, status, next follow-up, notes and contact
consent/preferences where applicable. Collect only information needed
for the business purpose.

### Lead sources

Website, Instagram, Facebook, WhatsApp, phone, referral, property
portal, campaign, walk-in, manual entry or other configured source.

### Pipeline

New → Contact Pending → Contacted → Requirement Understood → Qualified →
Proposal/Details Shared → Meeting/Site Visit Planned →
Discussion/Negotiation → Won or Lost; Nurture/Follow Up Later can be a
separate stage.

Stages are configurable. Tech and Real Estate may need different stages.

### Assignment and follow-up

A lead has an assigned owner, assignment date, status, next action and
follow-up date. Follow-up records contain date/time, type, responsible
member, summary, outcome and next action. A follow-up can create a
reminder or task; completing it does not automatically mark the lead
won/lost.

### Interaction timeline

Show captured calls, meetings, notes, emails, WhatsApp interactions
(only if integrated), status changes, assignments, follow-ups, documents
and tasks. Never imply an interaction was recorded if no integration or
manual entry exists.

### Conversion

An authorised user can convert a lead into a client/opportunity. Retain
lead history, link relevant project/service records, avoid duplicates
and record who converted it and when.

### CRM views and reports

All leads, My Leads, New, Follow-ups Due, Overdue Follow-ups, Qualified,
Won, Lost, by source, by campaign and by owner. Reports may include
response time, qualification rate, conversion and source performance.

### Import and integrations

CSV import can include preview, field mapping and duplicate detection.
Website, WhatsApp, property portal and other integrations require
separate implementation and authorisation.

------------------------------------------------------------------------

## 11. Meetings and Calendar

### Purpose

Record internal, client, project and campaign meetings and convert
decisions into accountable work.

### Meeting creation

Title, type, workspace, date, start/end time, location/link, organiser,
participants, client/lead, project/campaign, agenda and preparation
files.

### Workflow

1.  Organiser creates meeting.
2.  Participants are selected.
3.  Meeting appears on calendar.
4.  Notifications are sent according to preferences.
5.  Notes and outcomes are recorded.
6.  Decisions and action items are added.
7.  Action items can become tasks.
8.  Meeting is marked complete and retained in history.

### Notes and action items

Store summary, decisions, unresolved points, action items, owners, due
dates, files and next meeting date. A task created from an action item
retains a link to the originating meeting.

### Calendar

Month, week, day and agenda views. Filters can include meetings, task
due dates, campaign dates, content dates and project milestones.

------------------------------------------------------------------------

## 12. Team and Employee Management

### Purpose

Manage workspace membership, roles, teams and operational workload.

### Member profile

Name, work email, required contact details, profile image, workspace
membership, department, designation, role, reporting manager,
active/inactive status, joined date and assigned projects. Avoid
unnecessary personal data.

### Membership

A person may belong to Tech, Real Estate or both. Membership in one
workspace does not grant access to the other.

### Workload

Authorised managers can view open tasks, due soon, overdue, blocked,
review-pending and recently completed tasks by member. Interpret task
counts with complexity and estimates; task count alone is not a complete
productivity measure.

### Optional attendance

Attendance may be added later if genuinely required. It should remain
separate from task completion and is not required for the core product.

------------------------------------------------------------------------

## 13. Reports and Analytics

### Task reports

Tasks created/completed, open, overdue, blocked, awaiting review,
completion by project/campaign/member, completion time where timestamps
are reliable and reopened tasks.

### Project reports

Active projects, progress, milestone completion, delayed milestones,
overdue tasks, status history and work completed in a selected period.

### Campaign/content reports

Active campaigns, planned versus published content, content by
platform/format, awaiting approval, delayed content, published count and
performance metrics when available.

### CRM reports

Leads by source/status/owner, follow-ups due/overdue, qualified,
won/lost, conversion and campaign attribution where source data supports
it.

### Team reports

Work assigned, completed, overdue, awaiting review, workload
distribution and activity summaries. Do not treat raw task counts as a
definitive employee performance score.

### Filters and exports

Filter by workspace, date, project, campaign, team, member, status and
lead source. Export to CSV, Excel or PDF according to permissions.

------------------------------------------------------------------------

## 14. Notifications and Activity Centre

### Notification events

Task assignment, due soon, overdue, status change, mention, review
request, changes requested, approval, milestone deadline, campaign
deadline, meeting update, follow-up due and upload result.

### Channels

Start with in-app notifications and Android push notifications. Email or
other channels can be added later. Avoid exposing confidential details
on locked-device previews unless the user opts in.

### Controls

Users can configure supported notification categories and delivery
preferences. Essential security notifications may remain mandatory.

### Activity log

Record actor, timestamp, affected record and relevant change details for
creation, updates, assignments, status transitions, due-date changes,
approvals, uploads, archiving and permission changes. Restrict access to
logs.

------------------------------------------------------------------------

## 15. Administration and Settings

### Group administration

Group Admin may access both workspaces, manage workspace admins and
group membership, view permitted group-level summaries and administer
group security policies. Cross-workspace access must be explicitly
authorised.

### Workspace administration

Business Admin manages only their workspace: members, roles,
departments, task categories, project/campaign/content/asset types,
notification defaults and workspace settings.

### Suggested roles

**Group Admin** - Access both workspaces. - Manage group-level
configuration and workspace admins. - View permitted group-level
summaries.

**Business Admin** - Administer one workspace. - Manage its members and
settings. - Access workspace records according to policy.

**Project Manager** - Manage assigned projects, tasks, milestones and
project reports.

**Team Member** - Work on assigned tasks, update progress and
participate in permitted discussions.

**Reviewer/Approver** - Review assigned work, approve or request
changes.

**Viewer** - Read permitted records without operational edit access.

Roles are permission bundles. Record-level restrictions may also be
required.

### Account settings

Profile, password change, active sessions, notification preferences,
device sessions, sign out and account deactivation.

### Security settings

Strong password hashing, HTTPS, session expiry, optional MFA, security
logs, rate limiting, access revocation, private file access and tested
backups.

### Archive and retention

Archiving removes inactive records from default views without destroying
history. Permanent deletion must be restricted, confirmed and follow
retention/legal requirements.

------------------------------------------------------------------------

## 16. Global Search and Navigation

Global search should find permitted tasks, projects, campaigns, content,
clients/leads, meetings, assets and team members. Apply workspace and
record permissions before returning results. Results show record type,
title, workspace and useful context. Quick-create actions should be
accessible from navigation.

------------------------------------------------------------------------

## 17. PC Web Application

The web app is the primary interface for detailed planning and
administration.

Optimise for: - Large task tables and Kanban boards - Project and
campaign dashboards - Content calendars - Bulk updates - Asset
organisation - CRM pipelines - Detailed reports - Workspace settings

Support common desktop/laptop sizes, smaller browser windows and
tablets. Useful desktop interactions include sortable tables, keyboard
navigation, bulk selection, drag-and-drop where appropriate and file
uploads.

------------------------------------------------------------------------

## 18. Android Application (APK)

### Main mobile functions

-   Login and workspace selection
-   Dashboard summary
-   My Tasks and task creation
-   Status/progress updates
-   Comments and attachments
-   Project/campaign details
-   Review and approval
-   Content calendar
-   Lead status and follow-up notes
-   Meetings
-   Push notifications
-   Recent activity

### Mobile task workflow

A member opens a task from the app or notification, reviews details,
updates status, adds a comment or attachment and submits work for
review. The update is sent to the shared backend and then appears on the
web app.

### Device permissions

Use camera, photo picker and file picker only when needed. Request
permissions at the point of use. Microphone access is not required
unless a later approved feature needs it.

### Offline support

A later or agreed offline mode may cache recently synchronised tasks and
queue supported changes. Clearly label unsynchronised work. If multiple
users edit the same record offline, apply a conflict policy; never
silently overwrite changes.

### Push notifications

Notifications can cover assignments, reminders, approvals and meetings.
Opening one must authenticate the user and re-check access to the target
record.

------------------------------------------------------------------------

## 19. Cross-Platform Synchronisation

The web and Android clients use the same API and database. The backend
is the source of truth.

-   Web saves changes to the backend.
-   Android fetches updated records.
-   Android submits changes to the backend.
-   Web reflects updates through refresh or real-time events.

Use record versions or timestamps to detect stale edits. If a conflict
occurs, request refresh or offer a safe merge. If an update fails, show
an error, preserve unsent input where possible and allow retry. Never
show success before the backend confirms it.

------------------------------------------------------------------------

## 20. Main Data Entities

  Entity                 Purpose
  ---------------------- ------------------------------------------
  Group                  Parent organisation
  Workspace              Corviin Tech or Corviin Real Estate
  User                   Login identity
  Workspace Membership   User's workspace role and membership
  Role / Permission      Access-control definitions
  Team / Department      Workspace team structure
  Task                   Assigned unit of work
  Task Assignee          Users assigned to a task
  Checklist Item         Task completion step
  Task Dependency        Prerequisite relationship
  Task Comment           Task discussion
  Task Attachment        File relationship
  Task Activity          Task history
  Project                Delivery/work container
  Project Member         Project membership
  Milestone              Project checkpoint
  Campaign               Marketing/business campaign
  Content Item           Planned or produced content
  Content Version        Script/content revision
  Asset                  Stored file metadata
  Asset Version          Historical file version
  Folder                 Asset organisation
  Client                 Business relationship
  Lead                   Potential client/buyer enquiry
  Lead Interaction       Call, note, meeting or other interaction
  Follow-up              Next contact action
  Meeting                Scheduled discussion
  Meeting Participant    Attendee relationship
  Meeting Action Item    Follow-up work
  Notification           User notification
  Activity Log           Cross-module audit history
  Workspace Setting      Workspace configuration

Tasks should link to relevant records without unnecessarily duplicating
the same information.

------------------------------------------------------------------------

## 21. Recommended Technical Architecture

This is a proposed direction, not a claim that the product has already
been built.

### Monorepo structure

``` text
corviin-hub/
├── apps/
│   ├── web/                 # React + TypeScript
│   ├── android/             # Kotlin + Jetpack Compose
│   └── api/                 # Node.js + NestJS
├── packages/
│   └── shared/              # Shared API contracts and schemas
├── infrastructure/
│   ├── database/
│   ├── migrations/
│   ├── storage/
│   └── deployment/
└── docs/
    ├── PRD.md
    ├── FEATURES.md
    ├── API.md
    └── SECURITY.md
```

### Suggested stack

  -----------------------------------------------------------------------
  Layer                   Suggested technology    Responsibility
  ----------------------- ----------------------- -----------------------
  Web                     React, TypeScript, Vite Web UI

  Styling                 Tailwind CSS            UI styling

  Android                 Kotlin, Jetpack Compose Native APK

  Backend                 Node.js, NestJS         Business logic/API

  Database                PostgreSQL              Structured data

  ORM                     Prisma                  Data access/migrations

  Authentication          Secure session/token    Login and sessions
                          approach                

  File storage            S3-compatible storage / Files and media
                          Cloudflare R2           

  Real-time               WebSockets              Live updates

  Push                    Firebase Cloud          Android notifications
                          Messaging               

  API docs                OpenAPI/Swagger         API contract

  Local Android cache     Room                    Cached data

  Background sync         WorkManager             Queued synchronisation
  -----------------------------------------------------------------------

Final technology selection should consider hosting cost, expected media
volume, backup requirements, security and maintenance.

### Backend modules

Auth, Users, Workspaces, Memberships, Roles/Permissions, Teams,
Dashboard, Tasks, Projects, Campaigns, Content, Assets, CRM, Meetings,
Notifications, Reports, Activity Logs and Administration.

------------------------------------------------------------------------

## 22. Security, Privacy and Reliability

Minimum requirements: 1. Authenticate every protected request. 2.
Authorise every action on the backend. 3. Enforce workspace isolation on
every business record. 4. Verify membership and record access before
returning data. 5. Hash passwords with a suitable password-hashing
algorithm; never store plaintext passwords. 6. Use HTTPS in production.
7. Keep secrets in environment variables or a secrets manager. 8.
Validate upload type and size. 9. Use private storage and authorised,
short-lived download access. 10. Rate-limit sensitive endpoints. 11. Log
important administrative and record changes. 12. Back up the database
and test restoration. 13. Define retention and deletion policies. 14.
Avoid confidential push-notification previews. 15. Apply least-privilege
access to users and integrations.

Define how personal data is collected, accessed, exported, retained and
deleted.

------------------------------------------------------------------------

## 23. Development Phases

### Phase 1 -- Foundation

Monorepo, web shell, backend, database, authentication, workspace
selection, memberships, roles, permissions, isolation and basic
dashboard.

**Outcome:** users can securely enter the correct workspace.

### Phase 2 -- Core Tasks

Task creation/editing, ownership, assignment, priority, dates, statuses,
comments, attachments, checklists, dependencies, review, history,
list/Kanban views and notifications.

**Outcome:** team can assign, execute, review and track work.

### Phase 3 -- Projects

Projects, members, project task views, milestones, progress and reports.

**Outcome:** tasks are organised into larger deliverables.

### Phase 4 -- Campaigns and Content

Campaigns, dates, objectives, task generation, idea bank, content items,
scripts, revisions, calendar, approvals, publishing records and basic
reporting.

**Outcome:** campaign and content production is managed end to end.

### Phase 5 -- Assets

Secure uploads, folders, metadata, search, previews, linked records,
versions and storage reports.

**Outcome:** team can find and use the correct assets.

### Phase 6 -- CRM and Meetings

Clients/leads, workspace-specific fields, pipelines, assignments,
follow-ups, interaction history, meetings, notes and action items.

**Outcome:** enquiries and client follow-ups are part of the same
system.

### Phase 7 -- Android

Login, workspace selection, dashboard, My Tasks, updates, comments,
uploads, approvals, calendar, push and synchronisation. Offline support
can be included if required.

**Outcome:** members can use the same system from Android.

### Phase 8 -- Reports and Administration

Advanced reports, exports, workspace configuration, audit views, archive
tools, backup validation and security/performance testing.

**Outcome:** platform is ready for broader internal use.

------------------------------------------------------------------------

## 24. Acceptance Criteria

The product is not complete merely because screens exist. Each module
must pass functional and security tests.

### Workspace

-   Tech-only user cannot access Real Estate records.
-   Real Estate-only user cannot access Tech records.
-   Dual-workspace user can switch.
-   Group Admin access follows approved policy.
-   Changing record IDs or API parameters cannot bypass isolation.

### Tasks

-   Permitted user can create and assign a task.
-   Assignees can update permitted fields.
-   Dates and priority appear correctly.
-   Reviewer can approve or request changes.
-   Completion history records actor and timestamp.
-   Reopening does not erase earlier completion.
-   Reminder and overdue rules work.

### Projects and campaigns

-   Tasks link to the correct project/campaign.
-   Progress follows documented rules.
-   Milestones and deadlines appear correctly.
-   Content dates appear in the calendar.

### Assets

-   Upload validation works.
-   Assets belong to the correct workspace.
-   Unauthorised users cannot download private files.
-   Failed uploads are visible and retryable.
-   Version history follows policy.

### CRM and meetings

-   Leads can be created, assigned, updated and searched.
-   Follow-ups appear in the correct user's workload.
-   Meeting action items create linked tasks.
-   CRM data is separated by workspace.

### Cross-platform

-   Web-created task appears on Android.
-   Android update appears on web.
-   Supported uploads work on Android.
-   Push opens the correct authorised record.
-   Failed sync does not falsely report success.
-   Conflicting edits are handled safely.

------------------------------------------------------------------------

## 25. Decisions to Confirm Before Development

1.  Should one Group Admin manage both workspaces, with separate
    Business Admins?
2.  Should members use one account and select a workspace according to
    their membership?
3.  Should version 1 be internal-only, with a client portal later?
4.  Should both workspaces share CORVIIN HUB branding with different
    accent colours, or use separate themes?
5.  Should both use the proposed task workflow, with optional
    workspace-specific stages?
6.  Is offline task viewing and queued Android updates required in the
    first APK release?
7.  Which external integrations are required in version 1?
8.  Is time tracking required, or is status/progress tracking enough?
9.  Is attendance required, or should the first release remain focused
    on work management?
10. Which actions require approval, and who can approve them?

------------------------------------------------------------------------

## 26. Recommended Version 1 Scope

### Must have

-   Authentication and two isolated workspaces
-   User roles and membership
-   Dashboard
-   Task creation, assignment, dates, priority, status, comments,
    attachments, checklists and history
-   Review and approval
-   Projects and milestones
-   Campaign planning and dates
-   Content items, scripts and calendar
-   Asset upload and organisation
-   Basic clients and leads
-   Follow-up tasks
-   Meetings and action items
-   In-app notifications
-   Basic reports
-   PC web application

### Next release

-   Android APK with core task and approval workflows
-   Android push notifications
-   Advanced asset versioning
-   Advanced reports and exports
-   Offline mode and background synchronisation
-   External CRM, messaging, calendar or publishing integrations as
    specifically approved

If Android is essential for the first pilot, build a minimum Android
client in parallel with the web task module while keeping the shared API
and permission model consistent.

------------------------------------------------------------------------

## 27. Final Product Definition

CORVIIN HUB is a unified internal work-management and
business-operations platform for Corviin Group. It provides two separate
workspaces---Corviin Tech and Corviin Real Estate---inside one product.

Its central workflow is:

**Plan work → Create tasks → Assign responsibility → Execute → Update
progress → Review → Approve → Complete → Record history → Report
results.**

Campaigns and content use the same task engine. Scripts, footage,
designs and documents are stored in the asset system and linked to the
work they support. Clients and leads are managed through follow-ups,
meetings and action items. Managers use dashboards and reports to
understand progress and identify work that needs attention.

The web application and Android APK share one backend and one source of
truth. Workspace-level access controls let both businesses use the same
product structure without mixing their operational data.
