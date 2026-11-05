# CORVIIN HUB — CRM Information Architecture & Shared UX

**Document ID:** CH-FS-10 | **Version:** 1.0

## 1. Purpose

CRM is the relationship-management area for enquiries, clients, buyers, developers and partners. Its primary workflow is:

**Find record → contact → capture information → update stage → schedule next action → follow through.**

CRM should be one of the easiest parts of CORVIIN HUB to use, especially on Android.

## 2. CRM landing page

Show workspace-specific CRM entry points.

### Corviin Tech
- Enquiries
- Clients
- Technology Partners

### Corviin Real Estate
- Developers & Partners
- Buyers & Property Customers

Real Estate Buyers and Developers/Partners must not share one generic create form or one pipeline.

## 3. Desktop CRM layout

Header:
- CRM title and record type.
- Search by name/company/phone.
- Add record action.

Toolbar:
- Status/pipeline filter.
- Assigned member.
- Source.
- Follow-up date.
- Record-specific filters.
- Sort.

Main list:
- Table with record name, requirement/category, assigned member, stage, next follow-up and last activity.
- Clicking row opens detail.
- Optional preview panel for quick inspection.

## 4. Mobile CRM layout

- Search by name/phone at top.
- Add button.
- Filter and sort controls.
- Cards show name, concise requirement, status, next follow-up and assigned member.
- Quick actions: Call, Message, Open.
- Record detail is a single-column page with expandable sections.

Do not shrink the desktop CRM table onto mobile.

## 5. Shared record detail structure

1. Header: name/company, record type, pipeline stage and assigned member.
2. Quick actions: Call, Message, Email, Add Note, Follow-up, Meeting.
3. Key details: record-specific fields.
4. Next action: follow-up owner, due date and status.
5. Activity timeline: calls, messages, notes, stage changes, meetings and visits.
6. Linked records: projects, campaigns, tasks, meetings, proposals and visits.
7. Documents/attachments.
8. Audit/history.

## 6. Quick actions

- Call: hand off to device dialler where supported.
- Message: open supported messaging app/URI where available.
- Email: open mail client where supported.
- Add note: create interaction entry.
- Schedule follow-up: create a follow-up record with owner and due date.
- Schedule meeting/site visit: create linked event/record.
- Create task: prelink CRM record.

A device hand-off is not proof that a call/message was completed or delivered. Record actual outcome only when user logs it or an integration verifies it.

## 7. Follow-up rules

Every follow-up has:
- CRM record
- Title/reason
- Assigned member
- Due date/time
- Status
- Priority (optional)
- Completion timestamp/actor
- Optional linked task

Follow-ups must appear on dashboard, CRM record, calendar where relevant and assigned member's work queue if linked to a task.

## 8. Interaction timeline

Timeline entries:
- Call logged
- Message logged
- Email logged
- Note added
- Stage changed
- Follow-up created/completed
- Meeting scheduled/completed
- Site visit scheduled/completed
- Task created/completed
- Document added

Each entry shows actor and timestamp. Keep timeline chronological and readable.

## 9. CRM filters and saved views

Common:
- Assigned to me
- New records
- Follow-ups due today
- Overdue follow-ups
- Recently updated
- No next action

Record-specific filters are detailed in each CRM document. Saved views may be added after the first usable release.

## 10. Validation and data quality

- Normalise phone numbers for search while preserving display value.
- Validate email format if provided.
- Avoid duplicate creation where possible; warn on likely matching phone/email within the same workspace and record type.
- Do not block creation solely because optional data is unavailable.
- Distinguish unknown, not provided and not applicable where meaningful.
- Avoid collecting personal information not required for the business workflow.

## 11. Acceptance criteria

- [ ] CRM separates Tech, Real Estate Buyers and Real Estate Partners.
- [ ] Search supports name and phone.
- [ ] Quick actions are available on mobile.
- [ ] Follow-ups are structured records, not just notes.
- [ ] Interaction timeline records actor and timestamp.
- [ ] Linked meetings, visits, tasks and campaigns are navigable.
