# CORVIIN HUB

## Updated Feature Scope & Detailed Working Specification

**Version:** 1.1 -- Initial Product Scope\
**Date:** 5 November 2026\
**Platforms:** PC Web Application + Android APK\
**Architecture:** One project, shared backend, database, storage and
APIs\
**Workspaces:** Corviin Tech and Corviin Real Estate\
**Initial team:** Anant, Rohit and Utkarsh

------------------------------------------------------------------------

## 1. Product Overview

CORVIIN HUB is a shared internal operations platform for Corviin Group.
It manages daily tasks, plans, goals, calendars, campaigns, campaign
assets, clients, leads, meetings, visits and team activity.

The product has two separate workspaces: - **Corviin Tech** - **Corviin
Real Estate**

Both use the same application structure, but business records, campaign
data, assets, CRM pipelines and reports remain separated by workspace.

### Main navigation

1.  Dashboard
2.  My Tasks
3.  All Tasks
4.  Plans & Goals
5.  Calendar
6.  Campaigns
7.  Assets & Storage
8.  Clients & Leads
9.  Meetings
10. Team
11. Settings

### Initial team access

The initial members are Anant, Rohit and Utkarsh. All three have equal
operational access in the initial version. Each can view, create, edit,
assign, reschedule and complete work, manage campaigns and assets,
maintain CRM records, and create meetings.

Equal access does not remove accountability. The system must record the
actual person who performed each action. The data model should support
adding members and more granular permissions later.

### Workspace separation

Every task, plan, goal, campaign, content item, asset, client, lead,
meeting and visit belongs to a workspace. Tech records must not appear
in Real Estate and vice versa. A user may switch workspaces if they have
membership in both.

------------------------------------------------------------------------

## 2. Dashboard

### Purpose

The Dashboard is the operational overview for the selected workspace. It
should quickly answer: what needs attention today, what is overdue, what
campaigns are active, what meetings are upcoming and what has recently
changed?

### Sections

**A. Summary cards** - Tasks due today - Overdue tasks - Tasks in
progress - Completed tasks in selected period - Active plans and goals -
Active campaigns - Upcoming meetings and visits - Follow-ups due -
Active clients/leads

Each card opens the corresponding filtered module.

**B. Today's work** Show tasks grouped by Anant, Rohit and Utkarsh. Each
task displays title, priority, status, planned start, deadline and
linked campaign/goal/client.

**C. Campaign overview** Show campaign cards or compact rows with
workspace, owner, current stage, progress, next deadline and status.

**D. Plans and goals** Show active goals, target dates, progress and the
plans/tasks contributing to them.

**E. Calendar preview** Show today's meetings, visits, content
publishing and task deadlines, with links to the dedicated calendars.

**F. Recent activity** Show who created, assigned, started, updated,
rescheduled, uploaded, reviewed or completed a record, and when.

**G. Quick actions** Add task, plan/goal, campaign, content item, asset,
client/lead, meeting or visit.

------------------------------------------------------------------------

## 3. My Tasks

### Purpose

My Tasks shows the signed-in member's responsibilities in the active
workspace.

### Task fields

-   Title and description
-   Workspace
-   Assigned member
-   Created by
-   Planned start date/time
-   Deadline date/time
-   Priority
-   Status and progress
-   Linked plan/goal
-   Linked campaign, client or meeting
-   Checklist/subtasks
-   Attachments and reference links
-   Comments and updates
-   Completion note
-   Activity history

### Suggested statuses

-   To Do
-   In Progress
-   On Hold
-   Blocked
-   Completed
-   Cancelled

Review can be represented as a separate review state (Awaiting Review /
Changes Required) if needed.

### Start, pause, resume and complete

A member can: 1. Start work. 2. Pause work. 3. Resume work. 4. Mark the
task blocked and record a reason. 5. Complete the task and add a
completion note.

When work starts, record the actual start timestamp and member. When
completed, record the actual completion timestamp and member. If work is
paused and resumed, preserve each work session.

### Rescheduling

When a planned date or deadline changes, preserve: - Previous
date/time - New date/time - Changed by - Change timestamp - Reason

Do not overwrite the old date without retaining history.

### Task detail page

Opening a task shows full description, assignee, dates, linked records,
checklist, comments, attachments, progress, work sessions, completion
data and reschedule history.

### Filters

Today, Upcoming, Overdue, In Progress, Blocked, Completed, by campaign,
by plan/goal, by member and by priority.

------------------------------------------------------------------------

## 4. All Tasks

### Purpose

All Tasks is the shared task register for the active workspace, covering
Anant, Rohit and Utkarsh.

### Views

-   **List:** compact rows with sorting and filters.
-   **Kanban:** columns grouped by status.
-   **Table:** detailed fields and bulk operations.
-   **Calendar:** tasks by planned date/deadline.
-   **Member grouping:** tasks grouped under each of the three members.

All three members can create tasks, assign them to any member, update
priority and dates, change status, add comments and attachments, and
view the task history.

The interface must distinguish the assignee from the person who last
edited or completed the task.

### Filters

Member, status, priority, date range, overdue, campaign, plan/goal,
client and created by.

------------------------------------------------------------------------

## 5. Plans & Goals

### Purpose

A **goal** defines the result to achieve. A **plan** describes the
approach. **Tasks** are the actionable work that delivers the plan.

### Goal fields

-   Goal title and description
-   Expected outcome
-   Workspace
-   Owner and participating members
-   Start date and target date
-   Priority and status
-   Measurement method
-   Target/current value, if measurable
-   Progress
-   Linked plans, campaigns and tasks
-   Notes and files

Examples: complete a software milestone, build a target number of
developer relationships, publish a content series or complete client
onboarding.

### Plan fields

-   Plan title and description
-   Linked goal
-   Strategy/approach
-   Key steps
-   Owner and participants
-   Start/end dates
-   Milestones
-   Required resources
-   Risks/blockers
-   Linked tasks and campaigns
-   Status

### Progress

Where possible, calculate progress from linked tasks or milestones. If
entered manually, label it as manually updated. One goal may contain
multiple plans; each plan may contain multiple tasks.

### Views

Active Goals, Active Plans, Upcoming Targets, Delayed/At Risk, Completed
and By Member.

------------------------------------------------------------------------

## 6. Calendar -- Three Separate Calendars

The Calendar section must contain three distinct calendars with separate
purposes. Each should support month, week, day and agenda views, date
navigation, filters and opening the underlying record.

### 6.1 Content & Campaign Calendar

**Purpose:** Manage campaign dates, content production, review, approval
and posting schedules.

Calendar entries: - Campaign start/end dates - Stage deadlines - Topic
research - Script writing/review - Recording - Editing - Final
approval - Scheduled post - Actual published date - Reporting date

Clicking an entry opens the relevant campaign or content record. Show
title, workspace, platform, format, owner, stage, planned date,
deadline, linked tasks, script and assets.

Actions: - Add content item or milestone - Reschedule - Open
campaign/content - Create linked task - Mark published and record public
URL

Every reschedule creates a history entry. Distinguish planned publishing
date from actual publication date.

### 6.2 Meetings & Visits Calendar

**Purpose:** Schedule internal meetings, client meetings,
developer/builder meetings, buyer meetings and property/site visits.

Entry types: - Internal meeting - Client meeting - Developer/builder
meeting - Buyer meeting - Site/property visit - Online meeting - Other
appointment

Each entry shows title, type, date/time, location/link, organiser,
participants, linked client/lead, campaign/project, agenda, preparation
notes, status and follow-up requirement.

Actions: - Schedule/edit/reschedule - Add participants - Open linked
client/lead - Add meeting notes - Create action items and convert them
into tasks - Mark completed, cancelled or no-show - Record outcome and
next follow-up

### 6.3 Team Task Calendar

**Purpose:** Shared daily schedule for all three members.

The calendar shows three member sections: - Anant - Rohit - Utkarsh

Each name is clickable. Clicking expands that member's tasks for the
selected day; clicking again collapses the list.

Each expanded task displays: - Task title - Planned start date/time -
Deadline - Status and priority - Related campaign/plan/goal - Actual
work start - Actual completion, if completed - Overdue/delay indicator

Actions: - Add task assigned to that member - Open/edit task - Start,
pause, resume or complete work - Reschedule - Add note or blocker - View
task logs

Navigation and filters: - Previous day / next day / Today - Date
picker - Status filter - Campaign/plan filter - All members or selected
members

**Work logs:** preserve planned start, planned deadline, actual start,
actual completion, pause/resume events, reschedules, actor and
reason/note.

A rescheduled task appears on its current planned date, but its earlier
date and all changes remain in its history.

------------------------------------------------------------------------

## 7. Campaign Management

### Purpose

Campaign Management is a stage-based workflow. Every campaign has its
own card and dedicated detail page containing its information, tasks,
scripts, files, dates, team and progress.

The Campaigns page must have two separate sections or tabs: - **Tech
Campaigns** - **Real Estate Campaigns**

Both use the same five-stage process, while allowing workspace-specific
categories and fields.

### Campaign card

Each card shows: - Campaign title - Short description - Workspace -
Owner - Current stage - Start and target completion/posting dates -
Progress - Next deadline - Status - Asset indicator/count

Clicking the card opens the dedicated campaign workspace.

### Stage 1 -- Initial Idea

**Purpose:** Capture the campaign concept before detailed production
planning.

Fields: - Campaign title - Short description - Objective - Target
audience - Workspace and campaign category - Initial concept/idea -
Proposed platform - Owner - Priority - Tentative start date - Target
completion/posting date - Initial references and notes

The campaign card should stay simple, showing title and short
description. The detail page holds the full information.

Actions: save draft, edit, assign owner, add initial tasks and move to
Scripting & Planning when ready.

### Stage 2 -- Scripting & Planning

**Purpose:** Convert the idea into a complete content and production
plan.

Fields: - Final topic/title - Objective and audience - Platform and
format (reel, post, carousel, story, video, blog, etc.) - Hook -
Script/copy - Scene or shot breakdown - Voice-over text - On-screen
text - Caption, hashtags and CTA - Research and references - Required
assets - Production checklist - Writer/planner and reviewer - Planned
recording date - Script deadline - Target posting date

Actions: - Add/edit script - Save script revisions - Add research and
reference links - Create planning tasks - Assign tasks to Anant, Rohit
or Utkarsh - Add checklist items - Submit script for review - Move to
Recording & Asset Upload

Script history records who edited it and when.

### Stage 3 -- Recording & Asset Upload

**Purpose:** Record or collect source material required for editing.

Fields: - Recording date/time - Location, if relevant - Recording
owner/team - Shot list - Required footage checklist - Raw video files -
Images and photographs - Audio/voice-over files - Supporting documents -
Missing footage/retake notes - Upload status - Recording completion date

Actions: create recording tasks, upload raw footage, tag assets, mark
footage uploaded, identify missing files, record retakes and move to
Editing & Final Asset when ready.

### Stage 4 -- Editing & Final Asset

**Purpose:** Produce and approve the final campaign content.

Fields: - Assigned editor - Editing start date and deadline - Editing
instructions - Aspect ratio/output format - Draft edit files - Revision
notes - Reviewer and review status - Final video/design/image - Final
caption and CTA - Approval date - Final asset version

Actions: upload draft, add review comments, request changes, upload
revisions, approve final asset and move to Posting & Completion.

Draft and final versions must be distinguishable. The final approved
version must be clearly identified.

### Stage 5 -- Posting & Completion

**Purpose:** Publish approved content and retain a record of the result.

Fields: - Platform/channel - Scheduled posting date/time - Actual
posting date/time - Publishing owner - Final caption/copy - Public post
URL - Published asset - Posting checklist - Campaign completion date -
Final notes - Performance metrics, if available

Actions: schedule, reschedule, mark published, add URL, verify the
published asset, record available performance and complete/archive the
campaign.

Do not mark a public post as published without platform and publication
details, unless the campaign is explicitly marked as not requiring
public posting.

### Stage-specific tasks

Every stage can contain tasks assigned to any member. Examples: -
Research topic - Write script - Review script - Record footage - Upload
raw footage - Edit video - Review final edit - Prepare caption -
Schedule post - Publish and add link

These tasks must also appear in My Tasks, All Tasks and the Team Task
Calendar.

### Campaign-specific assets -- critical behaviour

Every campaign card opens a dedicated detail page with an **Assets**
section. That section displays only assets linked to that campaign by
default.

Suggested campaign asset categories: - References and research - Scripts
and copy - Raw footage - Images and photographs - Audio and voice-over -
Draft edits - Final approved assets - Published content/proof - Other
campaign documents

Rules: - Uploading from inside a campaign automatically links the asset
to that campaign. - Users can preview and download campaign assets
according to access. - The same asset is also discoverable in the global
Assets & Storage module. - The global asset record retains the campaign
relationship. - If a file is reused in multiple campaigns, support
explicit multi-campaign linking or a controlled copy. - Removing an
asset from a campaign removes the relationship; it does not
automatically delete the stored file. - Permanent deletion is a separate
confirmed action.

------------------------------------------------------------------------

## 8. Assets & Storage

### Purpose

Provide a central library for all workspace files while allowing
campaign-specific access from each campaign card.

### Global library

Show assets in the active workspace. Filter by campaign, category, file
type, uploader, upload date, tags and linked project/client.

### Asset metadata

-   Workspace and campaign
-   Campaign stage
-   Category
-   File name/type/size
-   Uploader and upload date
-   Description and tags
-   Version
-   Linked records

### Upload workflow

1.  Select or drop file.
2.  Validate type and size.
3.  Upload to private file storage.
4.  Save metadata and record relationships.
5.  Display upload result and retry on failure.

Support images, posters, raw footage, edited videos, audio, scripts,
captions, PDFs, documents, spreadsheets, presentations, logos and
references, subject to defined upload limits.

### Search, preview and versions

Search by filename and metadata. Preview supported formats. Retain
draft/final versions, uploader and timestamps. Provide authorised
downloads. Define practical maximum file sizes because raw video can be
large.

------------------------------------------------------------------------

## 9. Clients & Leads Management

The CRM must use different forms and pipelines for Tech and Real Estate.
The landing page has separate Tech and Real Estate sections.

### 9.1 Corviin Tech CRM

Record categories: - Business/client - Software or website enquiry -
Automation enquiry - Potential project - Technology partner - Existing
client

Fields: - Contact and company name - Phone/email - Business type -
Service interested in - Requirement/brief - Budget, if provided - Lead
source - Assigned member - Status and next follow-up - Notes and
attachments

Suggested pipeline: 1. New Enquiry 2. Contact Pending 3. Contacted 4.
Requirement Discussion 5. Qualified 6. Proposal/Quotation 7. Negotiation
8. Won / Client 9. Lost 10. Follow Up Later

A client record can link services, active projects, proposals, meetings,
tasks, commercial notes and interaction history.

### 9.2 Corviin Real Estate CRM

Real Estate must have two distinct CRM categories:

1.  **Developer / Builder / Business Partners**
2.  **Flat Buyers / Property Customers**

They must have separate forms, fields, pipelines, filters and reporting.

#### A. Developer, Builder and Partner CRM

Record types: - Developer - Builder - Construction company - Landowner -
Channel partner - Broker/agent - Other business partner

Fields: - Company/developer name - Primary contact - Phone/email -
Office/location - Business/partner type - Project names and locations -
Services required - Marketing requirements - Current
marketing/partnership status - Assigned member - Lead source and next
follow-up - Meeting history - Notes and documents

Suggested pipeline: 1. New Partner Lead 2. Initial Contact 3. Meeting
Planned 4. Requirement Discussion 5. Proposal/Service Details Shared 6.
Follow-up / Negotiation 7. Partnership Confirmed 8. Active Partner 9.
Not Interested / Lost 10. Follow Up Later

One developer/builder record may link to multiple projects and
campaigns.

#### B. Flat Buyer / Property Customer CRM

Fields: - Customer name - Phone/email - Preferred contact method -
Preferred locality - Property type - Configuration (1 BHK, 2 BHK, 3 BHK,
etc.) - Budget range - Purchase timeline - Purpose, if volunteered -
Preferred project - Lead source/campaign - Assigned member - Status and
next follow-up - Notes and visit history

Suggested pipeline: 1. New Enquiry 2. Contact Pending 3. Contacted 4.
Requirement Captured 5. Qualified Buyer 6. Project/Property Shared 7.
Site Visit Planned 8. Site Visit Completed 9. Follow-up / Discussion 10.
Booking / Converted 11. Not Interested / Lost 12. Follow Up Later

#### Buyer site visit workflow

From the buyer record: - Schedule a site visit. - Select
project/property. - Set date/time and location/meeting point. - Assign
responsible member. - Record visit confirmation. - Mark completed,
cancelled or no-show. - Add visit notes and feedback. - Create next
follow-up task. - Retain the visit in the buyer's history.

------------------------------------------------------------------------

## 10. Meetings

### Purpose

Meetings records internal discussions, client meetings, developer
meetings, buyer meetings and property visits. A meeting is a full
record---not merely a calendar entry.

### Meeting creation fields

-   Title and type
-   Workspace
-   Date and start/end time
-   Location or online link
-   Organiser
-   Participants (internal and external)
-   Related client/lead
-   Related campaign/project
-   Agenda and objective
-   Preparation notes
-   Attachments/reference links
-   Reminder settings

### Meeting detail page

**A. Overview:** title, type, date/time, location/link, organiser,
participants and status.

**B. Agenda:** planned topics, optional topic owner and time allocation.

**C. Preparation:** background, documents, links, questions and points
to confirm.

**D. Detailed meeting notes:** - Discussion summary - Topic-wise notes -
Information received - Questions raised - Concerns/blockers -
Commitments made

**E. Decisions:** decision text, related topic, responsible person if
relevant, date and supporting notes/files.

**F. Action items:** description, assigned member, due date, priority,
status and linked task. Action items can be converted into tasks,
retaining a link to the meeting.

**G. Attachments:** briefs, proposals, screenshots, documents, photos
and other files.

**H. Outcome and follow-up:** outcome, agreed next steps, follow-up
requirement/date, next meeting/visit and linked CRM record.

### Meeting statuses

Scheduled, Confirmed, Completed, Rescheduled, Cancelled and No Show.

### Meeting history

Retain creator, original schedule, rescheduled dates/reasons,
participant changes, notes updates, decisions, action-item changes,
completion status and actual meeting time if different from planned.

------------------------------------------------------------------------

## 11. Team

### Initial members

-   Anant
-   Rohit
-   Utkarsh

All three have equal operational access in the initial version.

### Team member profile

Show name, profile image, workspace access, tasks assigned/completed,
current workload, upcoming deadlines, plans/goals owned, campaigns,
meetings/visits and recent activity.

### Team workload

Answer: - What is each person doing today? - What is overdue? - What did
each person complete? - What is planned next? - Who owns each campaign
stage or follow-up?

### Action attribution

Record Created by, Assigned by, Started by, Updated by, Rescheduled by,
Completed by, Uploaded by and Reviewed/Approved by.

Do not hard-code the product to three accounts; allow future members.

------------------------------------------------------------------------

## 12. Settings

### Profile and account

Name, profile image, contact details, password/security, active sessions
and sign out.

### Workspace

Switch workspace, workspace identity/branding, categories, campaign
types, asset categories, CRM fields and pipelines.

### Calendar

Default view, week start day, working hours, default reminders and
visibility preferences.

### Tasks

Default priority/status, task categories and reminder preferences.

### Notifications

Task assignments, deadlines, overdue reminders, campaign stage
deadlines, posting reminders, meetings/visits, lead follow-ups, comments
and mentions.

### Storage

Usage, supported upload types, size limits and archive/retention
preferences where authorised.

### System/security

Sessions, access settings, activity history and backup status where
exposed.

------------------------------------------------------------------------

## 13. Global Activity and Audit Logs

For important events, record: - Workspace - Record type and ID -
Action - Previous and new value where relevant - Member who performed
it - Timestamp - Reason/comment where relevant

Examples include task date changes, work start/completion, campaign
stage changes, script revisions, raw footage uploads, final asset
approval, posting reschedules, lead status changes, site visit
reschedules and meeting note updates.

A record's history should be visible from that record. Important
operational history must not be silently erased.

------------------------------------------------------------------------

## 14. PC Web and Android APK

### PC Web

Optimise for dashboards, detailed task tables/Kanban, three calendars,
campaign cards and stage details, script editing, large file management,
CRM pipelines, meeting notes and team workload.

### Android APK

Optimise for dashboard, today's tasks, start/pause/complete, comments,
notes, camera/file uploads, campaign updates, viewing scripts/assets,
lead follow-ups, meeting/visit scheduling and push notifications.

Both clients use the same backend and database. Updates on one platform
appear on the other after successful synchronisation. Failed uploads or
updates must be visible and retryable. If offline mode is added,
unsynchronised changes and conflicts must be clearly handled.

------------------------------------------------------------------------

## 15. Suggested Data Structure

  Entity                   Purpose
  ------------------------ -----------------------------------------
  Workspace                Tech or Real Estate
  User                     Login identity
  Workspace Membership     User's workspace access
  Task                     Work item
  Task Assignment          Assigned member(s)
  Task Work Session        Start/pause/resume/complete log
  Task Reschedule Log      Planned date change history
  Task Checklist Item      Task steps
  Plan                     Approach for achieving a goal
  Goal                     Intended outcome
  Goal Milestone           Goal checkpoint
  Campaign                 Campaign record
  Campaign Stage History   Stage transitions
  Content Item             Content planned/produced
  Script Version           Script revision
  Asset                    Stored file metadata
  Asset Version            File version history
  Campaign Asset Link      Explicit campaign-to-asset relationship
  Client                   Business relationship
  Lead                     Potential customer/partner
  Lead Interaction         Contact history
  Follow-up                Next contact action
  Meeting                  Scheduled discussion
  Meeting Participant      Attendee
  Meeting Note             Detailed notes
  Meeting Decision         Decision record
  Meeting Action Item      Follow-up work
  Site Visit               Property visit
  Calendar Entry           Scheduled item
  Notification             User alert
  Activity Log             Cross-module history

Every business record belongs to a workspace. A campaign can have many
tasks, content items and assets. Leads can have many interactions,
follow-ups, meetings and visits. Meeting action items can create linked
tasks.

------------------------------------------------------------------------

## 16. Suggested Technical Architecture

Proposed monorepo:

``` text
corviin-hub/
├── apps/
│   ├── web/                 # React + TypeScript
│   ├── android/             # Kotlin + Jetpack Compose
│   └── api/                 # Node.js + NestJS
├── packages/
│   └── shared/              # Shared contracts and validation
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

Suggested stack: - Web: React, TypeScript, Vite, Tailwind CSS - Android:
Kotlin, Jetpack Compose - Backend: Node.js, NestJS - Database:
PostgreSQL - ORM/migrations: Prisma - File storage: private
S3-compatible storage or Cloudflare R2 - Real-time updates: WebSockets
where useful - Android push: Firebase Cloud Messaging - Offline
cache/sync, if required: Room and WorkManager - API documentation:
OpenAPI/Swagger

Choose hosting and storage after estimating video volume, upload sizes,
backup needs and budget.

------------------------------------------------------------------------

## 17. Recommended Initial Build Order

### Phase 1 -- Foundation

Authentication, Tech and Real Estate workspaces, three member accounts,
equal access, workspace isolation, navigation and dashboard.

### Phase 2 -- Tasks

My Tasks, All Tasks, assignment, start/pause/resume/complete, planned
versus actual dates, deadlines, reschedule history, comments, checklists
and Team Task Calendar.

### Phase 3 -- Plans and Calendars

Plans, goals, progress, Content & Campaign Calendar and Meetings &
Visits Calendar.

### Phase 4 -- Campaigns

Separate Tech and Real Estate campaign sections, cards, five-stage
workflow, scripts, recording, editing, posting and campaign-specific
asset access.

### Phase 5 -- Assets

Global library, campaign-linked assets, categories, search, upload,
previews, versions and private file access.

### Phase 6 -- CRM

Tech CRM, Real Estate Developer/Builder CRM, Real Estate Flat Buyer CRM,
separate pipelines, follow-ups and site visits.

### Phase 7 -- Meetings and Team

Detailed meeting pages, notes, decisions, action items, task conversion,
team workload and activity logs.

### Phase 8 -- Android and reporting

Android workflows, push notifications, cross-platform sync, basic
reports, exports, security and backup testing.

------------------------------------------------------------------------

## 18. Initial Release Acceptance Checklist

### Workspace and team

-   [ ] Tech and Real Estate records are separate.
-   [ ] Anant, Rohit and Utkarsh have the agreed workspace access.
-   [ ] All three have equal operational access.
-   [ ] Every action records the actual member.

### Tasks

-   [ ] Tasks can be assigned to any of the three.
-   [ ] My Tasks and All Tasks work.
-   [ ] Start, pause, resume and completion are logged.
-   [ ] Planned and actual dates are separate.
-   [ ] Reschedule history is retained.
-   [ ] Team Task Calendar expands each member's tasks by day.

### Plans and calendars

-   [ ] Plans and goals link to tasks.
-   [ ] Content & Campaign Calendar is separate.
-   [ ] Meetings & Visits Calendar is separate.
-   [ ] Team Task Calendar is separate.
-   [ ] Date changes preserve history.

### Campaigns and assets

-   [ ] Tech and Real Estate campaign sections are separate.
-   [ ] Every campaign uses the five agreed stages.
-   [ ] Each stage supports details, tasks and dates.
-   [ ] Campaign card opens its dedicated detail page.
-   [ ] Campaign detail page has its own linked Assets section.
-   [ ] Campaign assets are also searchable in global Assets & Storage.
-   [ ] Draft and final assets are distinguishable.

### CRM

-   [ ] Tech CRM has its own form and pipeline.
-   [ ] Real Estate Developer/Builder CRM is separate.
-   [ ] Real Estate Flat Buyer CRM is separate.
-   [ ] Buyer records support property requirements and site visits.
-   [ ] Developer records can link to multiple projects/campaigns.
-   [ ] Follow-ups and interaction history are retained.

### Meetings

-   [ ] Meetings can be scheduled and rescheduled.
-   [ ] Meeting details include agenda, preparation and notes.
-   [ ] Decisions and action items can be recorded.
-   [ ] Action items can become linked tasks.
-   [ ] Meeting history is retained.

### Cross-platform

-   [ ] Web and Android use the same backend.
-   [ ] Updates on one platform appear on the other.
-   [ ] File access is permission-checked.
-   [ ] Failed uploads/sync are visible and retryable.

------------------------------------------------------------------------

## 19. Product Definition

CORVIIN HUB is a unified operations platform with two distinct
workspaces: Corviin Tech and Corviin Real Estate. The initial team is
Anant, Rohit and Utkarsh, with equal operational access and transparent
action history.

The operating flow is:

**Set goals → Create plans → Break plans into tasks → Assign members →
Schedule work → Execute and log progress → Manage campaigns and assets →
Handle clients and leads → Record meetings and visits → Review
outcomes.**

The product has three dedicated calendars: 1. Content & Campaign
Calendar 2. Meetings & Visits Calendar 3. Team Task Calendar

Campaigns follow five stages from initial idea to posting and
completion. Each campaign has a dedicated linked asset area, while
Assets & Storage provides a global library. Real Estate CRM separates
developer/builder relationships from flat-buyer enquiries. Meeting
records retain agendas, detailed notes, decisions, attachments and
follow-up tasks.

The PC web application and Android APK use one shared backend and one
source of truth.
