# CORVIIN HUB — All Tasks Feature Specification

**Document ID:** CH-FS-03 | **Version:** 1.0

## 1. Purpose

All Tasks is the shared task register for the active workspace. It provides team visibility, workload coordination, task assignment and operational oversight. It is not a second task system: it displays the same Task records used by My Tasks, calendars, campaigns, plans and meetings.

## 2. Page layout

### Desktop
- Header: All Tasks, workspace context and Create Task.
- View switcher: List, Kanban, Calendar, By Member.
- Filter bar: member, status, priority, date, overdue and linked entity.
- Main data area.
- Optional right-side detail panel.

### Mobile
- Search bar.
- Horizontal quick filters: Mine, Open, Overdue, In Progress.
- Filter drawer for advanced filters.
- Task cards grouped by status or date.
- Add task floating/primary action.

## 3. Views

### 3.1 List/table
Columns:
- Task
- Assignee
- Status
- Priority
- Planned start
- Deadline
- Related record
- Last updated

Allow sorting and column visibility on desktop. Do not overload mobile with table columns.

### 3.2 Kanban
Columns based on task status. Cards show title, assignee, due date, priority and linked record. Drag-and-drop status changes must invoke backend transition validation and record activity. If transition is invalid, restore the card and explain why.

### 3.3 Calendar
Shows task planned start/deadline according to calendar rules. A task with both start and deadline should not appear as two unrelated tasks; define a consistent visual representation.

### 3.4 By Member
Group tasks by assignee. Show open count and overdue count. Expand a member group to inspect tasks.

## 4. Task creation and editing

Create task opens the shared task form. All Tasks may assign to any active workspace member. Editing must preserve creator identity and update last editor separately.

## 5. Bulk operations

Potential safe bulk actions:
- Reassign selected tasks.
- Change priority.
- Add/remove a label if labels are supported.
- Archive selected tasks.

Bulk completion, cancellation or deletion should require explicit confirmation and clear impact summary. Do not allow bulk changes to bypass workflow validation or audit.

## 6. Filters

Required:
- Assignee
- Creator
- Status
- Priority
- Planned start range
- Deadline range
- Overdue
- Campaign
- Plan/goal
- CRM record
- Meeting

Filters should be shareable via URL query state where practical. Saved views may be added later.

## 7. Detail navigation

Clicking a task opens its full detail. From the detail, members can inspect comments, checklist, work sessions, reschedule history and linked records.

## 8. Permissions

Initial team members have equal operational access within authorised workspaces. Backend must still verify membership and action permissions. Future role-based restrictions should be supported without rewriting task data.

## 9. Performance

- Server-side pagination.
- Server-side filtering/sorting for large lists.
- Avoid loading all tasks into the browser.
- Debounce search.
- Preserve filter state when returning from detail.
- Use stable task IDs and optimistic updates only where rollback is safe.

## 10. Acceptance criteria

- [ ] List, Kanban, Calendar and By Member views share the same task records.
- [ ] Filters can be combined.
- [ ] Status changes obey workflow transitions.
- [ ] Bulk actions are audited.
- [ ] Returning from task detail preserves the user's view and filters.
- [ ] Mobile does not render a cramped desktop table.
