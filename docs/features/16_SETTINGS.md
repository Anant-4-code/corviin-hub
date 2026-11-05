# CORVIIN HUB — Settings Feature Specification

**Document ID:** CH-FS-16 | **Version:** 1.0

## 1. Purpose

Provide a controlled place for personal preferences, workspace configuration and operational defaults. Settings must be organised by scope so users understand whether a change affects only their account or everyone in a workspace.

## 2. Settings information architecture

Sections:
1. My Profile
2. Account & Security
3. Workspace
4. Tasks & Priorities
5. Campaigns
6. CRM Pipelines & Fields
7. Calendar
8. Notifications
9. Storage
10. Access & Activity
11. Backup/Operational Status (read-only where managed by administrators)

## 3. Profile

Fields:
- Display name
- Avatar
- Contact information where permitted
- Preferred timezone
- Locale/date format
- Theme preference

Changes to profile must not alter historical actor identity.

## 4. Account and security

- Password/account management according to authentication provider.
- Active sessions/devices.
- Sign out other sessions where supported.
- Security notices.
- Do not expose tokens or credentials.

## 5. Workspace settings

- Workspace display name/branding.
- Workspace defaults.
- Membership and access visibility.
- Business-specific configuration.

Workspace-level settings require appropriate permission. The initial team has equal operational access, but sensitive administration may later be separately permissioned.

## 6. Task settings

- Default priority.
- Available task statuses.
- Task categories if configured.
- Default reminder timing.
- Working days/hours if used for scheduling.

Changing statuses must not invalidate existing records or erase history.

## 7. Campaign settings

- Campaign categories/types.
- Platforms.
- Stage labels/configuration only if workflow configurability is approved.
- Asset category list.
- Required transition checklist configuration.

## 8. CRM configuration

Separate configuration for:
- Tech CRM
- Real Estate Developers/Partners
- Real Estate Buyers

Settings may include:
- Pipeline stage labels/order.
- Custom fields.
- Required-field rules.
- Sources.
- Partner types.
- Property configuration options.

Do not allow users to remove a field that existing records depend on without a migration/compatibility plan.

## 9. Calendar settings

- Week start day.
- Default view.
- Timezone.
- Working hours.
- Reminder defaults.
- Visibility preferences.

## 10. Notification settings

Per-user preferences:
- Task assignment
- Deadline reminders
- Overdue tasks
- Follow-ups
- Meetings/visits
- Campaign deadlines
- Comments/mentions

Show channels only when configured (in-app, Android push, email). Do not imply delivery for an unconfigured channel.

## 11. Storage settings

Show:
- Used storage.
- Upload policy/limits.
- Allowed file types.
- Retention information.
- Versioning policy.

If users cannot change these values, show them as read-only.

## 12. Destructive/configuration actions

- Confirm changes that affect other members.
- Show impact before removing a pipeline stage/category.
- Archive or migrate existing values rather than silently deleting them.
- Record actor and timestamp.

## 13. Mobile UX

Use a settings index list and full-screen detail pages. Avoid a dense desktop two-column settings panel on mobile.

## 14. Acceptance criteria

- [ ] Personal and workspace settings are clearly separated.
- [ ] Workspace settings are permission-checked.
- [ ] CRM pipelines are separately configured by record type.
- [ ] Changes preserve existing record history.
- [ ] Notification channels are shown only when supported.
