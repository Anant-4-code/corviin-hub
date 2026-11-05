# CORVIIN HUB — Team Feature Specification

**Document ID:** CH-FS-15 | **Version:** 1.0

## 1. Purpose

Provide visibility into workspace members, responsibilities, workload and operational activity. The Team module supports coordination; it is not intended as an employee surveillance or performance-scoring system.

## 2. Team landing page

Desktop:
- Member directory/grid or table.
- Search.
- Workspace membership/status filters.
- Member detail panel/page.

Mobile:
- Member cards with avatar/name, active status and open task count.
- Tap to open member detail.

Initial members are Anant, Rohit and Utkarsh, but the implementation must load membership dynamically and support future additions.

## 3. Member card

Show:
- Name and avatar/initials.
- Workspace membership.
- Active/open task count.
- Overdue task count.
- Upcoming deadlines.
- Current availability/status only if explicitly supported and not inferred.

Do not show private account/security information.

## 4. Member detail

Sections:
1. Profile and contact details permitted for workspace.
2. Workspace access.
3. Assigned tasks.
4. Completed tasks.
5. Plans/goals owned or participating.
6. Campaigns owned.
7. Meetings and visits.
8. Recent activity.

Filters by date range and status should be available for operational lists.

## 5. Workload view

Provide a concise workload summary:
- Open tasks.
- Overdue tasks.
- Tasks due this week.
- Active campaigns.
- Upcoming meetings/visits.

Do not use task count alone as a definitive measure of workload. If task estimates are later introduced, define their meaning and use.

## 6. Team activity

Show meaningful events with actor, action, record and timestamp. Respect record access and avoid exposing sensitive CRM data to unauthorised viewers.

## 7. Member management

Initial scope includes viewing members. Future additions may include invitation, deactivate/reactivate membership and role assignment. These administrative actions must be explicitly permissioned and audited.

## 8. Acceptance criteria

- [ ] Team list is dynamic, not hard-coded.
- [ ] Member detail aggregates linked operational records.
- [ ] Workload figures are workspace-scoped.
- [ ] Activity shows who performed each action.
- [ ] Private account/security data is not exposed.
