# CORVIIN HUB --- Application Architecture & User Flow

**Document:** Web (PC) + Mobile (Android)\
**Version:** 1.0\
**Product direction:** Clean, uncluttered, responsive, easy to learn,
and fast for daily operations.

------------------------------------------------------------------------

## 1. Product vision

CORVIIN HUB is one operations platform for **Corviin Tech** and
**Corviin Real Estate**. It should feel like a focused work tool, not a
complicated enterprise dashboard.

### Experience principles

1.  **Show the next useful action.** Prioritise tasks, follow-ups,
    deadlines and upcoming meetings.
2.  **Progressive disclosure.** Show essential information first; place
    advanced fields, history and secondary actions inside detail views
    or expandable sections.
3.  **One clear primary action per screen.** Avoid competing buttons and
    crowded toolbars.
4.  **Consistent patterns.** Reuse the same page structure, status
    labels, filters, forms and detail layouts.
5.  **Mobile-first interaction.** Large touch targets, short forms,
    bottom navigation, quick actions and minimal typing.
6.  **Desktop efficiency.** Use tables, multi-column layouts,
    keyboard-friendly controls and persistent navigation where they
    improve speed.
7.  **No duplicate data.** Tasks, CRM records, campaigns, meetings and
    assets should link to one another rather than create copies.
8.  **Workspace separation.** Tech and Real Estate share the application
    shell but retain separate records, pipelines, settings and
    reporting.

### What the product should not become

-   A dashboard full of charts that users do not act on.
-   A page with every field visible at once.
-   A mobile screen that simply shrinks the desktop table.
-   Multiple ways to create the same record with inconsistent fields.
-   A CRM that forces users to navigate through many pages for a simple
    call, follow-up or site visit.

------------------------------------------------------------------------

## 2. Application structure

### Main application shell

**Global elements** - Workspace switcher: Corviin Tech / Corviin Real
Estate. - Page title and short contextual description. - Global
search. - Notifications. - User profile and settings. - Contextual
**Create** action.

**Primary modules** 1. Dashboard 2. My Tasks 3. All Tasks 4. Plans &
Goals 5. Calendar 6. Campaigns 7. Assets & Storage 8. CRM 9. Meetings
10. Team 11. Settings

Keep the main navigation limited to these modules. Do not add separate
top-level navigation for every sub-feature.

### Suggested route map

``` text
/
├── /login
├── /workspace/select
└── /app/:workspace
    ├── /dashboard
    ├── /my-tasks
    ├── /tasks
    │   └── /:taskId
    ├── /plans-goals
    │   ├── /goals/:goalId
    │   └── /plans/:planId
    ├── /calendar
    │   ├── /content
    │   ├── /team-tasks
    │   └── /meetings-visits
    ├── /campaigns
    │   └── /:campaignId
    │       ├── /overview
    │       ├── /script-planning
    │       ├── /recording
    │       ├── /editing
    │       ├── /publishing
    │       └── /assets
    ├── /assets
    ├── /crm
    │   ├── /tech
    │   └── /real-estate
    │       ├── /partners
    │       └── /buyers
    │   └── /:recordId
    ├── /meetings
    │   └── /:meetingId
    ├── /team
    └── /settings
```

The route names are a suggested information architecture; implementation
may adjust route syntax while preserving the user-facing structure.

------------------------------------------------------------------------

## 3. Navigation by device

### Desktop / PC

Use a **collapsible left sidebar** and a compact top bar.

``` text
┌──────────────────────────────────────────────────────────────────────┐
│ CORVIIN HUB   [Corviin Tech ▼]        Search       Notifications  Me │
├───────────────┬──────────────────────────────────────────────────────┤
│ Overview      │ Page title                         [ + Create ]      │
│ Dashboard     │                                                      │
│               │ Main content area                                    │
│ Work          │                                                      │
│ My Tasks      │                                                      │
│ All Tasks     │                                                      │
│ Plans & Goals │                                                      │
│ Calendar      │                                                      │
│               │                                                      │
│ Growth        │                                                      │
│ Campaigns     │                                                      │
│ CRM           │                                                      │
│ Meetings      │                                                      │
│               │                                                      │
│ Resources     │                                                      │
│ Assets        │                                                      │
│ Team          │                                                      │
│               │                                                      │
│ Settings      │                                                      │
└───────────────┴──────────────────────────────────────────────────────┘
```

**Desktop behaviour** - Sidebar remains visible; users can collapse it
to icons. - Use tables for dense records, with optional
list/Kanban/calendar views. - Open record details as a dedicated page or
right-side detail panel depending on complexity. - Use filters in a
compact toolbar; advanced filters go into a popover or expandable
panel. - Keep primary actions at the top-right of the page. - Use
breadcrumbs on nested detail pages. - Avoid horizontal scrolling for
normal page layouts; allow it only inside intentionally dense data
tables when necessary.

### Mobile / Android

Use a **bottom navigation bar** for the most-used destinations, with a
More area for secondary modules.

``` text
┌──────────────────────────────┐
│ CORVIIN HUB     Tech ▼   🔔   │
├──────────────────────────────┤
│ Good morning                 │
│ Your work at a glance        │
│                              │
│ [ Due today ] [ Overdue ]    │
│                              │
│ Today's tasks                │
│ ┌──────────────────────────┐ │
│ │ Task title               │ │
│ │ Due  •  Priority         │ │
│ │ [Open]                   │ │
│ └──────────────────────────┘ │
│                              │
│ Follow-ups                   │
│ ...                          │
│                              │
├──────────────────────────────┤
│ Home  Tasks  Calendar  CRM  More │
└──────────────────────────────┘
```

**Mobile primary tabs** - Home - Tasks - Calendar - CRM - More

**More contains** - Campaigns - Plans & Goals - Meetings - Assets -
Team - Settings

**Mobile behaviour** - Use cards instead of wide tables. - Use
full-screen forms or bottom sheets for quick creation. - Keep the main
action reachable with one thumb. - Use sticky bottom actions for
important forms (Save, Update, Complete). - Use expandable sections for
long details. - Show only the most useful fields in list cards; open the
record for the rest. - Provide tap-to-call, tap-to-email, map/location
and meeting-link actions where relevant. - Avoid tiny icons without
labels for important actions. - Do not place more than five destinations
in the bottom navigation.

------------------------------------------------------------------------

## 4. Responsive design rules

  -----------------------------------------------------------------------
  Area                    Desktop / PC            Mobile / Android
  ----------------------- ----------------------- -----------------------
  Navigation              Collapsible sidebar     Bottom tabs + More

  Dashboard               Multi-column widgets    Single-column cards

  Task list               Table, Kanban, grouped  Task cards
                          list                    

  Calendar                Month/week/day/agenda   Agenda-first; compact
                                                  month

  CRM                     Searchable table +      Search + filter + lead
                          filters                 cards

  CRM details             Two-column detail       Single-column sections
                          layout                  

  Campaign board          Stage columns / list    Stage selector +
                                                  campaign cards

  Forms                   Multi-column where      One column, progressive
                          logical                 steps

  Record details          Tabs or side panel      Stacked expandable
                                                  sections

  Actions                 Toolbar + contextual    Clear buttons and
                          menus                   action sheets

  Filters                 Inline + advanced       Filter drawer / bottom
                          popover                 sheet
  -----------------------------------------------------------------------

**Breakpoints (starting points, adjust after testing)** - Small mobile:
below 480 px - Large mobile: 480--767 px - Tablet: 768--1023 px -
Desktop: 1024 px and above - Wide desktop: 1440 px and above

Use fluid widths and content constraints rather than designing only for
fixed device sizes.

------------------------------------------------------------------------

## 5. Dashboard architecture

The dashboard should answer three questions immediately: 1. What needs
my attention today? 2. What is coming up next? 3. Is any important work
delayed or blocked?

### Desktop dashboard layout

``` text
┌─────────────────────────────────────────────────────────────────┐
│ Good morning                 [Date range]       [ + Create ]     │
├────────────┬────────────┬────────────┬────────────┬──────────────┤
│ Due today  │ Overdue    │ In progress│ Follow-ups │ Meetings     │
├───────────────────────────────┬─────────────────────────────────┤
│ My work today                 │ Upcoming calendar                │
│ Task list with status         │ Meetings, visits, deadlines      │
├───────────────────────────────┼─────────────────────────────────┤
│ Campaign progress             │ Plans & goals                    │
├───────────────────────────────┴─────────────────────────────────┤
│ Recent activity                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile dashboard order

1.  Greeting, workspace and date.
2.  Due today / overdue summary.
3.  My tasks today.
4.  Follow-ups due.
5.  Upcoming meetings and site visits.
6.  Active campaign / goal progress.
7.  Recent activity.

**Dashboard rules** - Prioritise actionable lists over decorative
charts. - Allow each widget to open the relevant filtered module. - Show
empty states with a useful action (for example, "No follow-ups due"). -
Do not show the same information in multiple widgets. - Keep
workspace-specific metrics separate.

------------------------------------------------------------------------

## 6. Tasks and work management

### My Tasks

A focused personal work queue. Default view: **Today**, with quick
switches for Upcoming, Overdue, In Progress and Completed.

Each task card/list row should show: - Title - Due date/time -
Priority - Status - Related campaign, plan, goal or CRM record - One
primary action based on status

### All Tasks

Shared task register for the current workspace.

Desktop views: - List/table (default) - Kanban - Calendar - Group by
assignee

Mobile views: - Assigned to me - By team member - Status filters -
Search

### Task detail layout

1.  Header: title, status, priority, primary action.
2.  Description and schedule.
3.  Assignee and creator.
4.  Checklist / subtasks.
5.  Linked records.
6.  Comments and attachments.
7.  Work sessions and time history.
8.  Reschedule history.
9.  Activity log.

**Task lifecycle**

``` text
Create task
   ↓
Set workspace, title, assignee and deadline
   ↓
To Do
   ↓ Start
In Progress
   ├── Pause → On Hold
   ├── Block → Blocked
   └── Complete → Completed
          ↓
     Completion note / review if configured
```

Starting, pausing, resuming, completing and rescheduling must create
history events. Never overwrite the original planned dates or actual
timestamps.

------------------------------------------------------------------------

## 7. Calendar architecture

Keep the three calendar purposes distinct, but provide one Calendar
entry point with clear tabs.

### Calendar tabs

1.  Content & Campaigns
2.  Team Tasks
3.  Meetings & Visits

### Desktop

-   Default to week or agenda view depending on the selected calendar.
-   Provide month/week/day/agenda controls.
-   Filters remain visible in a compact toolbar.
-   Clicking an item opens its detail panel or record page.
-   Allow drag-to-reschedule only with confirmation and a recorded
    reason where required.

### Mobile

-   Default to agenda/list view.
-   Show a compact date strip or month selector.
-   Group items by day.
-   Use a filter drawer.
-   Open event details in a full-screen view.
-   Keep Add action visible without covering content.

### Team Task Calendar

-   Show one member section per person.
-   Tap/click a member heading to expand or collapse their tasks for the
    selected date.
-   On mobile, use an accordion to prevent a long crowded screen.
-   Task cards show time, deadline, status, priority and linked item.

### Meetings & Visits Calendar

-   Show meeting type, date/time, location or link, participants and
    linked CRM record.
-   A completed meeting should lead to notes, outcome and follow-up
    actions.
-   Site visits should connect to the relevant buyer and
    property/project record.

------------------------------------------------------------------------

## 8. Campaign architecture

### Campaign list

Separate workspace-specific campaign records. Provide: - Search - Status
and stage filters - Owner filter - Deadline filter - List and board
views

Campaign cards should remain simple: - Campaign title - Short
description - Current stage - Owner - Next deadline - Progress indicator

### Campaign detail page

Use a consistent header and stage navigation:

``` text
Campaign name                         [Edit] [More]
Short objective / description
Owner • Status • Start date • Target publish date

[Idea] → [Scripting] → [Recording] → [Editing] → [Posting]

Overview | Tasks | Assets | Activity
```

Each stage displays only the fields and actions relevant to that stage.
Keep advanced production details collapsed until needed.

**Five stages** 1. Initial Idea 2. Scripting & Planning 3. Recording &
Asset Upload 4. Editing & Final Asset 5. Posting & Completion

**Important interaction** - Stage changes should be explicit, not
accidental. - Stage checklists should show what remains. -
Stage-specific tasks use the shared task system. - Assets uploaded from
a campaign automatically link to that campaign. - The campaign Assets
tab shows only assets linked to that campaign. - Global Assets & Storage
can still search all workspace assets. - Reuse across campaigns must be
an explicit link or controlled copy. - Removing an asset link must not
silently delete the stored file.

### Mobile campaign flow

-   Campaign cards in a single-column list.
-   Stage shown as a compact progress stepper.
-   Stage details in expandable sections.
-   Upload button opens Android file picker/camera where permitted.
-   Show upload progress, failure and retry.
-   Keep the next stage action at the bottom of the screen.

------------------------------------------------------------------------

## 9. CRM architecture --- highest-priority usability area

CRM should be fast for the most common actions: **find a record,
call/message, update status, add a note, schedule follow-up, and open a
meeting/site visit**.

### CRM landing page

**Corviin Tech** - Enquiries - Clients - Technology partners

**Corviin Real Estate** - Developers & Partners - Buyers & Property
Customers

Do not mix Real Estate buyers and developers in one form or one
pipeline. They are different record types with different fields and
workflows.

### Desktop CRM layout

``` text
CRM / Real Estate / Buyers

[Search name, phone, project...]       [ + Add buyer ]

[Status ▼] [Assigned member ▼] [Budget ▼] [Follow-up ▼] [More filters]

┌────────────┬──────────────┬────────────┬───────────┬──────────────┐
│ Name       │ Requirement  │ Project    │ Status    │ Next follow-up│
├────────────┼──────────────┼────────────┼───────────┼──────────────┤
│ Buyer A    │ 2 BHK • ...  │ Project X  │ Qualified │ 06 Nov       │
│ Buyer B    │ 1 BHK • ...  │ —          │ New       │ Today        │
└────────────┴──────────────┴────────────┴───────────┴──────────────┘
```

Desktop CRM features: - Searchable, sortable table. - Saved
filters/views such as "My follow-ups", "New enquiries" and "Site visits
due". - Bulk actions only for safe operations. - Quick preview panel for
common details. - Dedicated detail page for full interaction history.

### Mobile CRM layout

``` text
┌──────────────────────────────┐
│ Buyers              [ + Add ]│
│ [ Search name / phone... ]   │
│ [Filter] [Sort]              │
├──────────────────────────────┤
│ Buyer name                   │
│ 2 BHK • Budget • Locality    │
│ Qualified • Follow-up today  │
│ [Call] [Message] [Open]      │
├──────────────────────────────┤
│ Buyer name                   │
│ Requirement summary          │
│ New • Follow-up tomorrow     │
│ [Call] [Message] [Open]      │
└──────────────────────────────┘
```

Mobile CRM rules: - Search by name or phone at the top. - Show status
and next follow-up prominently. - Keep Call, Message and Open actions
visible. - Use short forms with required fields first. - Put optional
information under "More details". - Use pickers for status, locality,
property type and assigned member. - Make follow-up creation possible
without leaving the record. - Do not show a wide desktop table on a
phone.

### CRM record detail page

Recommended section order: 1. **Header:** name/company, record type,
status, owner. 2. **Quick actions:** Call, Message, Email, Add note,
Schedule follow-up. 3. **Requirement / business details:** show the most
relevant fields for that record type. 4. **Next action:** next follow-up
date and assigned member. 5. **Activity timeline:** calls, messages,
notes, stage changes, meetings and visits. 6. **Linked records:**
projects, campaigns, tasks, meetings, proposals or site visits. 7.
**Documents:** relevant files and attachments. 8. **History:** important
changes and who made them.

### Real Estate CRM --- Buyers

**Short create form (required essentials)** - Customer name - Phone
number - Assigned member - Enquiry source

**Optional / progressive details** - Email and preferred contact
method - Preferred locality - Property type and configuration (1/2/3
BHK) - Budget range - Buying timeline - Preferred project/property -
Notes

**Buyer pipeline**

``` text
New Enquiry
   ↓
Contact Pending → Contacted
   ↓
Requirement Captured
   ↓
Qualified Buyer
   ↓
Project / Property Shared
   ↓
Site Visit Planned
   ↓
Site Visit Completed
   ↓
Follow-up / Discussion
   ├── Booking / Converted
   ├── Not Interested / Lost
   └── Follow Up Later
```

A site visit should be a linked visit record, not just free text in the
buyer notes. It should store date/time, property, location, responsible
member, confirmation, outcome and next follow-up.

### Real Estate CRM --- Developers & Partners

**Short create form** - Company / partner name - Contact person -
Phone - Partner type - Assigned member

**Optional / progressive details** - Email and location - Project names
and locations - Business and marketing requirements - Source -
Partnership status - Notes and documents

**Partner pipeline**

``` text
New Partner Lead
   ↓
Initial Contact
   ↓
Meeting Planned
   ↓
Requirement Discussion
   ↓
Proposal / Service Details
   ↓
Follow-up / Negotiation
   ↓
Partnership Confirmed
   ↓
Active Partner

Alternative outcomes: Not Interested / Lost / Follow Up Later
```

One developer or builder may connect to multiple projects and campaigns.

### Tech CRM

Keep the same interaction model but use technology-specific fields: -
Enquiry category / service - Business type - Requirement - Budget (if
provided) - Source - Assigned member - Follow-up date - Related
proposal/project

**Suggested pipeline** New Enquiry → Contact Pending → Contacted →
Requirement Discussion → Qualified → Proposal / Quotation → Negotiation
→ Won / Client or Lost / Follow Up Later.

### CRM interaction flow

``` text
Open CRM
   ↓
Choose workspace record type
   ↓
Search existing record OR Add new
   ↓
Open record
   ↓
Call / Message / Add note / Update status
   ↓
Schedule follow-up or meeting / site visit
   ↓
Complete interaction and record outcome
   ↓
Create next task automatically or with one-tap confirmation
   ↓
Record remains in activity timeline
```

**Critical CRM rule:** every follow-up should have an owner, due date
and status. Avoid relying on notes alone to remember the next action.

------------------------------------------------------------------------

## 10. Meetings and visit records

Meeting details should be simple at creation and comprehensive after the
meeting.

### Quick schedule form

-   Title
-   Type
-   Date and start time
-   Organiser
-   Participants
-   Related client/lead or campaign
-   Location or meeting link

### Detail sections

-   Overview
-   Agenda
-   Preparation
-   Notes
-   Decisions
-   Action items
-   Attachments
-   Outcome and follow-up
-   Activity history

Convert action items into tasks while retaining the meeting
relationship.

Mobile should provide quick actions to call participants, open the
location, join the meeting and add notes.

------------------------------------------------------------------------

## 11. Plans & Goals

Keep the distinction clear: - **Goal:** the outcome to achieve. -
**Plan:** the approach to achieve it. - **Task:** the actionable work.

List cards should show title, owner, target date, progress and status.
Detailed metrics, milestones, risks and linked tasks belong inside the
record.

Progress should be calculated from linked tasks or milestones where
practical. If manually entered, label it as manual progress.

------------------------------------------------------------------------

## 12. Assets & Storage

Global Assets & Storage is the workspace library. Campaign detail pages
show a filtered view of campaign-linked assets.

### Asset experience

-   Search and filter by campaign, category, type, uploader, date and
    tags.
-   Preview supported files.
-   Show file name, size, uploader, upload date, category and linked
    records.
-   Support version history.
-   Use private storage and authorised access.
-   Provide upload progress, failure feedback and retry.
-   Use resumable or multipart uploads for large video files where
    supported.

**Mobile** - Upload from device files or camera/gallery where
supported. - Show upload queue and progress. - Keep metadata entry
short. - Avoid attempting to preview unsupported large files; provide a
clear download/open action.

------------------------------------------------------------------------

## 13. Create flows and quick actions

Use one contextual Create menu on desktop and a prominent plus action on
mobile. The options should depend on the current workspace and page.

Examples: - Dashboard: task, lead, campaign, meeting. - CRM record:
note, follow-up, meeting, site visit, task. - Campaign: stage task,
asset upload, milestone. - Meeting: action item / linked task. - Plan:
goal, milestone, linked task.

Do not show every possible create action everywhere. Show the actions
relevant to the current context.

### Form design standard

-   Required fields first.
-   Optional fields in "More details".
-   Sensible defaults (current workspace, current user as creator,
    common date).
-   Clear validation beside the field.
-   Save draft where a workflow may take time.
-   Confirm destructive actions.
-   Preserve entered values if validation fails.
-   Use the same field labels across create, edit and detail views.

------------------------------------------------------------------------

## 14. Notifications and activity

### Notifications should be actionable

Examples: - Task assigned to you. - Task due soon or overdue. -
Follow-up due. - Meeting or site visit approaching. - Campaign deadline
changed. - Script or final asset awaiting review. - Comment or mention.

Each notification should open the relevant record and, where possible,
the relevant section.

### Activity history

Record who created, edited, assigned, rescheduled, started, paused,
completed, uploaded, approved or changed a record. Keep old and new
values for important changes, with timestamp and optional reason.

Do not silently erase operational history.

------------------------------------------------------------------------

## 15. Core user journeys

### Journey A --- Daily work (all members)

``` text
Login → Select workspace → Dashboard
   ↓
Review due / overdue tasks and follow-ups
   ↓
Open My Tasks → Start task
   ↓
Update progress / add note / upload file
   ↓
Complete task → Add completion note
   ↓
Dashboard and activity update
```

### Journey B --- New Real Estate buyer

``` text
CRM → Real Estate → Buyers → Add buyer
   ↓
Enter name, phone, owner and source
   ↓
Save → Buyer detail
   ↓
Call / capture requirement / update status
   ↓
Add project or property shared
   ↓
Schedule site visit
   ↓
Complete visit → record feedback
   ↓
Create next follow-up → continue pipeline
```

### Journey C --- New developer / builder partner

``` text
CRM → Real Estate → Developers & Partners
   ↓
Add partner → assign owner
   ↓
Initial contact → capture requirements
   ↓
Schedule meeting → record notes and decisions
   ↓
Prepare proposal / service details
   ↓
Follow-up / negotiation
   ↓
Confirm partnership → link projects and campaigns
```

### Journey D --- Campaign production

``` text
Campaigns → Create campaign (Initial Idea)
   ↓
Assign owner and initial tasks
   ↓
Scripting & Planning → write / review script
   ↓
Recording → upload raw footage and references
   ↓
Editing → review drafts and approve final asset
   ↓
Posting → schedule / publish / add public URL
   ↓
Record performance → complete / archive
```

### Journey E --- Meeting to completed action

``` text
Schedule meeting → add agenda and participants
   ↓
Prepare documents / questions
   ↓
Conduct meeting → write notes and decisions
   ↓
Create action items → convert to tasks
   ↓
Set follow-up / next meeting
   ↓
Complete meeting record
```

### Journey F --- Mobile quick update

``` text
Open app → Tasks or CRM
   ↓
Search / open record
   ↓
One-tap action (Call, Start, Complete, Note)
   ↓
Enter only necessary information
   ↓
Save → return to the same context
```

------------------------------------------------------------------------

## 16. Visual design system

### Overall visual direction

-   Calm, minimal and professional.
-   Light theme as the default starting point.
-   Neutral backgrounds with one restrained primary accent.
-   Use colour primarily for status, priority and meaningful alerts.
-   Avoid excessive gradients, glows, shadows, borders and decorative
    cards.

### Layout

-   Use whitespace to separate content.
-   Keep cards flat or very lightly elevated.
-   Prefer section headings and dividers over nesting cards inside
    cards.
-   Use consistent spacing and alignment.
-   Keep line lengths readable.
-   Use a clear hierarchy: page title, section title, field label,
    supporting text.

### Status design

Use both a short text label and a restrained colour indicator. Never
communicate status through colour alone.

Suggested semantic categories: - Neutral: To Do, Draft, Scheduled -
Blue: In Progress - Amber: Due Soon, Needs Attention - Red: Overdue,
Blocked, Failed - Green: Completed, Approved, Won - Grey: Cancelled,
Archived

### Interaction details

-   Touch targets should be comfortable on mobile (aim for at least 44 ×
    44 CSS px).
-   Provide loading, empty, error and success states.
-   Use confirmation for permanent deletion and other destructive
    actions.
-   Do not hide critical actions inside hover-only interactions.
-   Respect device safe areas and the on-screen keyboard.

------------------------------------------------------------------------

## 17. Data and access architecture

### Workspace isolation

Every operational record must belong to a workspace. Every API request
must verify that the signed-in user is allowed to access that workspace.
Do not rely only on hiding data in the frontend.

### Shared entities

-   User / Member
-   Workspace / Workspace membership
-   Task / Checklist item / Work session
-   Goal / Plan / Milestone
-   Campaign / Campaign stage history
-   Asset / Asset version / Asset relationship
-   CRM record / Interaction / Follow-up
-   Meeting / Participant / Agenda item / Decision / Action item
-   Notification
-   Activity event

### CRM modelling

Use a shared interaction and activity model, but keep distinct record
types and field schemas for: - Tech enquiries and clients - Real Estate
developers and partners - Real Estate buyers and property customers

### Audit and history

For important changes, store: - Workspace ID - Entity type and ID -
Action - Actor/member ID - Timestamp - Previous and new values where
relevant - Reason or comment where relevant

### File storage

Store file metadata and relationships in PostgreSQL; store file bytes in
private object storage such as an S3-compatible service. Use short-lived
authorised URLs for upload/download. Do not store large video binaries
directly in PostgreSQL.

------------------------------------------------------------------------

## 18. Suggested implementation architecture

Based on the one-codebase web + Android requirement:

``` text
CORVIIN HUB
│
├── Client application
│   ├── React + TypeScript
│   ├── Vite
│   ├── Responsive component system
│   ├── Web application (PC / browser)
│   └── Capacitor Android shell (APK)
│
├── Backend API
│   ├── Node.js + NestJS
│   ├── Authentication and workspace authorisation
│   ├── Tasks / CRM / Campaigns / Calendar / Meetings
│   ├── Activity and notification services
│   └── File upload authorisation
│
├── Data
│   ├── PostgreSQL
│   └── Prisma ORM + migrations
│
├── File storage
│   └── Private S3-compatible object storage
│
└── Shared package
    ├── TypeScript types
    ├── Validation schemas
    └── Shared constants
```

The browser and Android app use the same React client and backend.
Capacitor packages the client for Android and exposes native
capabilities through plugins. This is a web-based UI inside a native
Android container, not a separate Kotlin interface.

### Frontend structure (suggested)

``` text
apps/
  client/
    src/
      app/
      components/
      layouts/
      features/
        dashboard/
        tasks/
        plans-goals/
        calendar/
        campaigns/
        assets/
        crm/
        meetings/
        team/
        settings/
      services/
      hooks/
      stores/
      routes/
      styles/
    android/
  api/
    src/
      auth/
      workspaces/
      tasks/
      plans/
      campaigns/
      assets/
      crm/
      meetings/
      notifications/
      activity/
  packages/
    shared/
      types/
      schemas/
      constants/
```

------------------------------------------------------------------------

## 19. Build order --- reduce complexity and deliver value early

### Phase 1 --- Foundation

-   Authentication
-   Workspace selection and server-side isolation
-   Member profiles and permissions
-   Responsive application shell
-   Activity logging foundation

### Phase 2 --- Daily operations

-   Dashboard
-   My Tasks and All Tasks
-   Task detail, work sessions and reschedule history
-   Team directory
-   Basic notifications

### Phase 3 --- CRM first release

-   Tech CRM
-   Real Estate Buyers
-   Real Estate Developers & Partners
-   Record details, interaction timeline and follow-ups
-   Site visits and linked meetings

### Phase 4 --- Campaign and assets

-   Campaign stages
-   Stage-specific tasks
-   Campaign-linked assets
-   Global Assets & Storage
-   Upload and version handling

### Phase 5 --- Planning and calendar

-   Plans & Goals
-   Three calendar views
-   Meeting detail, notes, decisions and action items
-   Team workload and calendar filters

### Phase 6 --- Mobile polish and release

-   Capacitor Android integration
-   Native file picker and camera use where needed
-   Push notifications
-   Deep links to records
-   Offline-friendly drafts / safe retry behaviour where practical
-   Android device testing and production release

------------------------------------------------------------------------

## 20. MVP acceptance checklist

### Usability

-   [ ] A new member can identify the main navigation without training.
-   [ ] Common actions are reachable in a few clear steps.
-   [ ] Forms show only essential fields first.
-   [ ] Empty, loading, error and success states are designed.
-   [ ] Mobile screens do not require horizontal scrolling for normal
    workflows.
-   [ ] The mobile app is usable with one hand for frequent actions.

### CRM

-   [ ] Tech, Real Estate Buyers and Real Estate Partners have distinct
    forms and pipelines.
-   [ ] Search by name and phone works.
-   [ ] Call/message actions are available on mobile where supported.
-   [ ] Every active record can have an owner and next follow-up.
-   [ ] Interactions appear in a chronological timeline.
-   [ ] Site visits link to the correct buyer and property/project.

### Operations

-   [ ] Tasks created from campaigns or meetings appear in the shared
    task system.
-   [ ] Calendar items open their source records.
-   [ ] Campaign assets are linked automatically when uploaded from a
    campaign.
-   [ ] Reschedule and completion history is retained.
-   [ ] Workspace data is isolated server-side.

### Responsive and Android

-   [ ] Desktop sidebar and tables work at common PC widths.
-   [ ] Mobile bottom navigation and cards work at common phone widths.
-   [ ] Forms remain usable when the keyboard is open.
-   [ ] File uploads show progress and recoverable errors.
-   [ ] Android back navigation behaves predictably.
-   [ ] Notifications and deep links open the intended record.

------------------------------------------------------------------------

## 21. Final product recommendation

Build **one responsive React application** with two presentation
modes: - **PC mode:** information-dense, sidebar navigation, tables,
multi-column layouts and quick record inspection. - **Mobile mode:**
task-focused, bottom navigation, cards, short forms, agenda views and
prominent call/follow-up actions.

Keep the underlying records, workflows, API and database shared. Adapt
the interface to the device instead of maintaining two separate
products.

For the first release, prioritise **Tasks + CRM + Follow-ups +
Meetings/Site Visits**. These create the daily operational value. Add
the full campaign production workflow, asset library and advanced
planning after the core flows are reliable.
