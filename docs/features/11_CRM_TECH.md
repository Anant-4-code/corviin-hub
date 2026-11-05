# CORVIIN HUB — Tech CRM Feature Specification

**Document ID:** CH-FS-11 | **Version:** 1.0

## 1. Purpose

Manage technology enquiries, prospective projects, existing clients and technology partners for Corviin Tech.

## 2. Record categories

- Business/client
- Software or website enquiry
- Automation enquiry
- Potential project
- Technology partner
- Existing client

Use category to select the relevant detail fields and pipeline behaviour.

## 3. Landing page

Desktop table columns:
- Contact/person
- Company
- Enquiry/service
- Stage
- Assigned member
- Source
- Next follow-up
- Last activity

Mobile cards:
- Contact/company
- Service requirement
- Stage
- Follow-up date
- Call / Message / Open

Filters:
- Category
- Pipeline stage
- Assigned member
- Source
- Service type
- Follow-up date
- Budget range if recorded

## 4. Create Tech record

Required essentials:
- Contact or company name
- Phone or another reliable contact method (business rule to confirm)
- Record category
- Assigned member
- Source

Optional/progressive:
- Email
- Business type
- Service
- Requirement
- Budget (only if supplied)
- Website
- Location
- Notes
- Attachments

Use “More details” for optional fields. Do not require a budget if the prospect has not provided one.

## 5. Pipeline

1. New Enquiry
2. Contact Pending
3. Contacted
4. Requirement Discussion
5. Qualified
6. Proposal / Quotation
7. Negotiation
8. Won / Client
9. Lost
10. Follow Up Later

Won, Lost and Follow Up Later may be represented as outcome states or terminal/parked stages, but the chosen model must be consistent and reportable.

## 6. Record detail

Sections:
- Overview
- Contact and business details
- Requirement and service
- Pipeline and next action
- Interactions
- Meetings
- Tasks
- Proposals/quotation references
- Projects/services
- Attachments
- Activity history

## 7. Actions and workflows

- Log call/message/email.
- Add requirement note.
- Change stage.
- Schedule follow-up.
- Schedule meeting.
- Create task linked to enquiry.
- Convert Won record to Client without losing original enquiry history.
- Mark Lost with optional reason.
- Set Follow Up Later with a due date.

## 8. Duplicate handling

Before creating, optionally check for matching phone/email/company. Show possible duplicates and allow user to open an existing record. Do not silently merge records.

## 9. Reporting

Initial useful views:
- New enquiries by period/source.
- Enquiries by pipeline stage.
- Follow-ups due/overdue.
- Qualified opportunities.
- Won/lost counts.
- Workload by assigned member.

Avoid revenue forecasts until deal value/probability fields and definitions are agreed.

## 10. Mobile UX

- Add record in a short form.
- Tap-to-call and messaging hand-off.
- Stage change via simple picker.
- Add note and follow-up without leaving record.
- Keep requirement summary and next follow-up near the top.

## 11. Acceptance criteria

- [ ] Tech categories are supported.
- [ ] Tech pipeline is distinct from Real Estate pipelines.
- [ ] Record can link to tasks, meetings, proposals and projects.
- [ ] Won conversion preserves interaction history.
- [ ] Mobile quick actions work where device supports them.
