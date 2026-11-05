# CORVIIN HUB — Notifications, Activity Timeline & Audit History

**Document ID:** CH-FS-17 | **Version:** 1.0

## 1. Purpose

Provide timely, actionable notifications and reliable operational history. Notifications tell a member what needs attention; activity/audit records explain what happened and who did it.

These are related but distinct systems.

## 2. Notification centre

Desktop:
- Bell icon in top bar with unread count.
- Popover preview.
- Full notification page/drawer.

Mobile:
- Bell icon in app header.
- Full-screen notification list.
- Group by Today, Earlier or unread/read.

Each notification:
- Title
- Short message
- Event time
- Read/unread state
- Linked entity
- Action destination

## 3. Notification types

- Task assigned/reassigned.
- Task due soon/overdue.
- Follow-up due.
- Meeting/site visit approaching.
- Meeting rescheduled/cancelled.
- Campaign deadline changed.
- Script/final asset awaiting review.
- Comment or mention.
- Relevant status/approval change.

Avoid notifying every member about every minor edit. Use recipient rules and preferences.

## 4. Notification interactions

- Open linked record.
- Mark read/unread.
- Mark all read.
- Filter unread.
- Notification click should navigate to the correct record and section.
- If record is no longer accessible, show a safe unavailable message.

## 5. Delivery channels

- In-app notifications are the baseline.
- Android push via FCM when configured.
- Email only if provider and templates are configured.
- Delivery failures must not delete the stored notification.

## 6. Activity timeline

Record-level timeline shows relevant actions:
- Created
- Edited
- Assigned/reassigned
- Status changed
- Started/paused/resumed/completed
- Rescheduled
- Stage changed
- Commented
- Uploaded/replaced/approved asset
- Meeting completed/decision recorded
- Follow-up completed

Display:
- Actor
- Action
- Timestamp
- Relevant change summary
- Reason/comment where provided

## 7. Audit event data

Minimum:
- Workspace ID
- Entity type and ID
- Action
- Actor/member ID
- Timestamp
- Previous values where relevant
- New values where relevant
- Reason/comment where relevant
- Request/correlation ID

Audit writes should be performed in the same transaction as the business change where feasible, or via a reliable transactional outbox pattern.

## 8. Immutability and deletion

Ordinary edits must not silently erase history. Archive/soft-delete operational records where appropriate. Permanent deletion must be restricted, confirmed and audited. Retention and legal deletion requirements must be decided before production.

## 9. Privacy

Do not include passwords, tokens, signed URLs or unnecessary personal data in notifications or logs. Notification previews should avoid exposing sensitive CRM details on a locked phone screen; user preference may control preview detail.

## 10. Acceptance criteria

- [ ] Notifications are actionable and link to records.
- [ ] In-app notification persists independently of push delivery.
- [ ] Activity timeline identifies actor and timestamp.
- [ ] Important changes store before/after values.
- [ ] Ordinary edits cannot erase operational history.
- [ ] Sensitive data is not leaked through push previews or logs.
