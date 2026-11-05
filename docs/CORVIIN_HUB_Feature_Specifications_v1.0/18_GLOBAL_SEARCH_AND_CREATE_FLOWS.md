# CORVIIN HUB — Global Search, Contextual Create & Cross-Module Navigation

**Document ID:** CH-FS-18 | **Version:** 1.0

## 1. Purpose

Define the shared search and create experience that connects the modules and reduces navigation effort.

## 2. Global search

Search should help members locate:
- Tasks
- Campaigns
- CRM records
- Meetings
- Plans and goals
- Assets (metadata only)
- Team members, where permitted

Search must be workspace-scoped by default. Results show record type and enough context to distinguish similar names.

### Desktop
- Search entry in top bar.
- Keyboard shortcut may be added.
- Results grouped by type.
- Recent searches optional.
- Enter opens selected result.

### Mobile
- Search icon opens full-screen search.
- Search field receives focus.
- Results appear as cards with type, title and summary.
- Tap opens record.

## 3. Search rules

- Server-side search with pagination and limits.
- Debounce typing.
- Normalise phone number queries for CRM.
- Respect workspace membership and entity-level permissions.
- Do not reveal that an inaccessible record exists.
- Empty state offers a create action only when the user has permission.

## 4. Contextual Create

A single Create system should present relevant actions based on the current page.

Examples:
- Dashboard: Task, CRM record, Campaign, Meeting.
- My Tasks/All Tasks: Task.
- Plan/Goal detail: linked Task or Milestone.
- Campaign detail: stage Task, Asset, Milestone.
- CRM detail: Note, Follow-up, Meeting, Site Visit, Task.
- Meeting detail: Decision or Action Item.
- Asset page: Upload Asset.

## 5. Create form behaviour

- Pre-fill active workspace.
- Pre-fill linked entity when launched from a record.
- Pre-fill assignee with current user only when sensible.
- Keep creator set by backend identity.
- Validate required fields.
- Preserve values on failure.
- Show saved record and offer to open it.
- Prevent duplicate submission on repeated taps.

## 6. Cross-module linking

- Task can link to campaign, plan, goal, CRM record or meeting.
- Campaign tasks link to campaign.
- Campaign assets link to campaign and stage.
- CRM follow-ups link to CRM record and may link to task.
- Site visits link to buyer and property/project.
- Meeting action items link to meeting and converted task.
- Goal/plan link to related tasks/campaigns.

All relationships must be validated server-side for workspace consistency.

## 7. Acceptance criteria

- [ ] Search results are workspace-scoped.
- [ ] Result type is clearly visible.
- [ ] Contextual Create shows relevant record types.
- [ ] Forms prefill linked context.
- [ ] Duplicate submission is prevented.
- [ ] Cross-module relationships are navigable and validated.
