# CORVIIN HUB — My Tasks Feature Specification

**Document ID:** CH-FS-02 | **Version:** 1.0

## 1. Purpose

My Tasks is the signed-in member's personal work queue within the active workspace. It should make it easy to decide what to work on next and update task progress without navigating through the full task register.

## 2. Navigation and views

Default view: **Today**.

Tabs or quick filters:
- Today
- Upcoming
- Overdue
- In Progress
- Completed

Desktop:
- Compact task list/table with title, due date, priority, status and related record.
- Optional grouping by date.
- Search and filters in a compact toolbar.

Mobile:
- Stacked task cards grouped by Today, Tomorrow, Later and Overdue.
- A filter drawer for status/priority/date.
- Prominent task action button.

## 3. Task card design

Display:
- Task title.
- Due date/time.
- Planned start if present.
- Priority.
- Status.
- Linked campaign, goal, plan, CRM record or meeting.
- Optional checklist progress.
- One context-sensitive action.

Context-sensitive actions:
- To Do: Start.
- In Progress: Pause or Complete.
- On Hold: Resume.
- Blocked: Open blocker/details.
- Completed: View.

Do not show every possible action as equal-weight buttons.

## 4. Task detail

Open as a desktop detail panel for quick inspection or dedicated page for complex tasks. Mobile opens a full-screen detail page.

Sections:
1. Header: title, status, priority and primary action.
2. Description.
3. Schedule: planned start and deadline.
4. People: creator, assignee and last updated by.
5. Checklist.
6. Linked records.
7. Comments.
8. Attachments.
9. Work sessions.
10. Reschedule history.
11. Activity timeline.
12. Completion note.

## 5. Create task flow

Required fields:
- Title
- Assignee
- Deadline (date/time; exact requiredness to be confirmed)
- Workspace (pre-filled and locked to active workspace unless user has explicit switch permission)

Optional:
- Description
- Planned start
- Priority
- Checklist
- Linked record
- Attachment

Defaults:
- Creator = authenticated user.
- Workspace = active workspace.
- Status = To Do.
- Assignee may default to current user but must remain editable.

## 6. Work controls

### Start
- Validate task is in a startable state.
- Create a work-session start event.
- Set status to In Progress.
- Record actor and timestamp.
- Prevent duplicate active sessions unless concurrent sessions are intentionally supported.

### Pause
- Close or pause the active work session.
- Set status to On Hold.
- Record actor and timestamp.

### Resume
- Start a new work-session segment or resume event.
- Set status to In Progress.
- Preserve earlier sessions.

### Complete
- Ask for confirmation only if task has incomplete required checklist items.
- Allow completion note.
- Record completedAt and completedBy.
- Stop active work session.
- Update dashboard and linked progress calculations.

### Block
- Record blocker description and actor.
- Set status Blocked.
- Allow optional expected resolution date.
- Show blocker visibly in My Tasks and All Tasks.

## 7. Rescheduling

Reschedule dialog:
- New planned start (optional)
- New deadline
- Reason/comment
- Confirm

After save:
- Update current schedule.
- Add schedule history containing old values, new values, actor and timestamp.
- Show “Rescheduled” activity.
- Keep original schedule available in history.

## 8. Filters and sorting

Filters:
- Status
- Priority
- Date range
- Linked campaign/plan/goal
- Overdue
- Checklist incomplete

Sorting:
- Due soonest
- Priority
- Recently updated
- Planned start

## 9. Mobile-specific UX

- One-tap Start/Resume/Complete from the card.
- Completion confirmation should not require a long form.
- Comments and notes use a compact composer.
- Attachments use native file picker where supported.
- Keep task title and deadline visible at the top while scrolling.
- Avoid modal stacking.

## 10. Notifications

Notify assignee when assigned or reassigned. Remind before due date according to user preferences. Notify relevant users of important changes only where configured.

## 11. Data and audit

Store creator, assignee, planned start, deadline, status, priority, actual work events, completion details and schedule history. Never infer actual start from planned start.

## 12. Acceptance criteria

- [ ] My Tasks shows only tasks assigned to current member in active workspace.
- [ ] Task controls create immutable work history.
- [ ] Pause/resume does not erase prior work sessions.
- [ ] Rescheduling preserves old and new schedule.
- [ ] Linked records are navigable.
- [ ] Mobile card actions are usable one-handed.
