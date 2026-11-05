# CORVIIN HUB — Content & Campaign Calendar Specification

**Document ID:** CH-FS-05 | **Version:** 1.0

## 1. Purpose

Provide a production schedule for campaign and content work. This calendar displays dates from campaign/content records and their milestones; it must not create duplicate copies of the underlying records.

## 2. Page structure

Tabs within Calendar:
- Content & Campaigns
- Team Tasks
- Meetings & Visits

Content & Campaigns opens this document's calendar.

Desktop:
- Month / Week / Day / Agenda switcher.
- Previous, Next and Today controls.
- Workspace and campaign filters.
- Main calendar canvas.
- Selected item opens detail panel.

Mobile:
- Compact date strip or month selector.
- Agenda-first event list grouped by date.
- Filter drawer.
- Add Content/Milestone action.

## 3. Event types

- Topic research deadline
- Script writing deadline
- Script review
- Recording
- Editing
- Final approval
- Scheduled post
- Actual published post
- Campaign target milestone

Use distinct text labels and restrained semantic colours. Provide a legend or accessible labels.

## 4. Event display

Each event should show:
- Content/campaign title.
- Event type/stage.
- Planned date/time.
- Owner.
- Status.
- Campaign name if event is content-specific.

On mobile, show a compact event card with the next action.

## 5. Interactions

- Click/tap opens source campaign or content record.
- Add milestone opens a form with campaign preselected when created from a campaign.
- Reschedule updates source record and appends schedule history.
- Mark Published records actual publication date/time and public URL.
- Create Task creates a linked task rather than a calendar-only item.
- Drag-to-reschedule on desktop is optional and must confirm/record the change.

## 6. Planned vs actual

Keep planned schedule and actual execution separate:
- Planned recording date vs actual recording.
- Target publish date vs actual publish date.
- Planned approval date vs approval timestamp.

Never replace the planned date with actual date.

## 7. Filters

- Campaign
- Owner
- Stage/event type
- Status
- Date range
- Platform

## 8. Empty and error states

No scheduled content: offer Create Campaign or Add Milestone.
No results after filters: offer Clear Filters.
Campaign unavailable: show a safe unavailable state rather than a broken event card.

## 9. Acceptance criteria

- [ ] Calendar events open their source records.
- [ ] Planned and actual timestamps remain distinct.
- [ ] Reschedule history is preserved.
- [ ] Mobile defaults to agenda-style layout.
- [ ] Filters do not mix workspace records.
