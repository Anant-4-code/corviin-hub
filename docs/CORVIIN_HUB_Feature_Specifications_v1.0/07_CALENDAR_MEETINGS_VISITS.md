# CORVIIN HUB — Meetings & Visits Calendar Specification

**Document ID:** CH-FS-07 | **Version:** 1.0

## 1. Purpose

Provide a schedule view for internal meetings, client/partner meetings, buyer meetings and property/site visits. Each calendar item must link to a full Meeting or Site Visit record.

## 2. Event categories

- Internal meeting
- Client meeting
- Developer/builder/partner meeting
- Buyer meeting
- Property/site visit
- Online meeting
- Other

## 3. Layout

Desktop:
- Month/week/day/agenda.
- Filters for event type, organiser, participant, status and date.
- Event cards show title, time, type, location/link and linked CRM record.

Mobile:
- Agenda-first list grouped by date.
- Event cards with time, title, type and quick Open/Call/Map/Join actions.
- Filter drawer.
- Schedule action.

## 4. Schedule flow

Quick form:
- Title
- Type
- Date
- Start and end time
- Organiser
- Participants
- Location or meeting URL
- Related CRM record
- Optional campaign/project
- Agenda/objective

Validate end time after start time. For site visits, require the related buyer/property context according to the configured workflow.

## 5. Event detail

- Overview
- Participants
- Location/link
- Agenda
- Preparation
- Notes
- Decisions
- Action items
- Attachments
- Outcome/follow-up
- History

## 6. Interactions

- Schedule/edit/reschedule.
- Add/remove participants.
- Open related CRM record.
- Open map or meeting link.
- Add notes and decisions.
- Mark completed, cancelled or no-show.
- Create action items and convert to tasks.
- Schedule next follow-up.

Reschedule must retain previous date/time, new date/time, actor, timestamp and reason.

## 7. Site visit specifics

Site visit fields:
- Buyer CRM record.
- Property/project.
- Date/time.
- Location.
- Responsible member.
- Confirmation status.
- Visit status.
- Outcome/feedback.
- Next follow-up.

Site visit should appear in buyer detail and the calendar. It must not be represented only as a free-text note.

## 8. Reminders

Allow configurable reminders for organiser and participants. Push delivery is best-effort; the event remains stored even if notification delivery fails.

## 9. Acceptance criteria

- [ ] Calendar events open full source records.
- [ ] Site visits link to a buyer and property/project.
- [ ] Reschedule history is retained.
- [ ] Meeting action items can become tasks.
- [ ] Mobile provides tap-to-call/map/join where device support exists.
