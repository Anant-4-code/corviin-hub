# CORVIIN HUB — Meetings Management Feature Specification

**Document ID:** CH-FS-14 | **Version:** 1.0

## 1. Purpose

Meetings are full operational records containing scheduling, participants, preparation, notes, decisions, action items and follow-up. A meeting is more than a calendar block.

## 2. Meetings list

Desktop columns:
- Title
- Type
- Date/time
- Organiser
- Participants
- Related client/lead
- Status
- Next action

Mobile cards:
- Title
- Date/time
- Type
- Related person/company
- Status
- Open / Call / Join / Map action as relevant

Filters:
- Date range
- Type
- Organiser
- Participant
- Status
- Workspace
- Linked CRM record

## 3. Quick schedule form

Required:
- Title
- Type
- Date
- Start/end time
- Organiser

Optional/conditional:
- Participants
- Location or meeting URL
- Related CRM record
- Campaign/project
- Agenda
- Objective
- Preparation notes
- Attachments
- Reminder

Validate time range and workspace consistency. For an external meeting, allow external participants who do not have a CORVIIN HUB account.

## 4. Meeting detail page

### Overview
Title, type, status, date/time, location/link, organiser, participants and linked records.

### Agenda
Agenda topic, optional owner, optional time allocation and status.

### Preparation
Background, links, documents, questions and required decisions.

### Detailed notes
- Summary
- Topic-by-topic notes
- Information received
- Questions
- Concerns/blockers
- Commitments

### Decisions
- Decision text
- Responsible person
- Due date
- Supporting files
- Created by/time

### Action items
- Description
- Assigned member
- Due date
- Priority
- Status
- Linked task

### Attachments
Meeting documents, images and relevant files.

### Outcome and follow-up
- Meeting outcome
- Next steps
- Next follow-up date
- Next meeting
- Linked CRM update

### History
Creator, schedule changes, participant changes, notes, decisions, action item changes and completion.

## 5. Action items to tasks

When converting an action item:
- Create a Task with title, description, assignee, due date and priority.
- Link task to source meeting and action item.
- Preserve the action item record.
- Prevent duplicate task creation on repeated clicks.
- Update action item with linkedTaskId and conversion status.

## 6. Meeting statuses

- Scheduled
- Confirmed
- Completed
- Rescheduled
- Cancelled
- No Show

Status transitions must be controlled and audited.

## 7. Calendar integration

Meetings appear in Meetings & Visits Calendar. Calendar actions open the same meeting record. Reschedule changes the source meeting and records history.

## 8. Mobile UX

- Quick schedule form.
- Tap-to-call participants.
- Tap-to-open map/location.
- Tap-to-join online meeting.
- Quick notes during/after meeting.
- Action items as compact cards.
- Sticky Add Note / Complete actions where useful.

## 9. Notifications

Reminders for organiser and participants according to preferences. Changes to time/location should notify relevant participants if notification delivery is configured.

## 10. Acceptance criteria

- [ ] Meeting stores agenda, notes, decisions and action items.
- [ ] Action items convert to linked tasks without duplication.
- [ ] Meeting appears in calendar.
- [ ] Status and reschedule history are retained.
- [ ] Mobile provides contextual call/map/join actions.
