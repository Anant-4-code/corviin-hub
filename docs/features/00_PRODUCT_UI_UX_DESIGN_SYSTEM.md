# CORVIIN HUB — Product UI/UX Design System & Application Shell

**Document ID:** CH-FS-00 | **Version:** 1.0 | **Status:** Detailed design specification

## 1. Purpose

Define the shared visual language, application shell, navigation, responsive rules and interaction standards used by every CORVIIN HUB feature. Feature-specific documents must follow these rules unless a documented exception is approved.

## 2. Experience goals

- Clean, calm, professional and uncluttered.
- Fast to understand for a member who opens the app several times a day.
- Optimised for frequent operations rather than decorative dashboards.
- Desktop is information-efficient; mobile is action-efficient.
- The same records and business rules are used on web and Android. Only the presentation adapts.

## 3. Information architecture

Primary modules:
1. Dashboard
2. My Tasks
3. All Tasks
4. Plans & Goals
5. Calendar
6. Campaigns
7. Assets & Storage
8. CRM
9. Meetings
10. Team
11. Settings

Global utilities:
- Workspace switcher
- Global search
- Notifications
- Profile menu
- Contextual Create action
- Help/support entry (optional, if operationally supported)

Do not promote every sub-feature to a top-level navigation item.

## 4. Desktop shell

### 4.1 Layout

- Left sidebar: collapsible, persistent.
- Top bar: workspace selector, search, notifications and profile.
- Main content: page title, supporting description, primary action, filters and content.
- Nested pages: breadcrumbs.
- Complex record pages: tabs or a two-column layout.
- Detail previews: right-side panel only when the content is short enough to inspect without losing context.

### 4.2 Sidebar grouping

- Overview: Dashboard
- Work: My Tasks, All Tasks, Plans & Goals, Calendar
- Growth: Campaigns, CRM, Meetings
- Resources: Assets & Storage, Team
- Administration: Settings

The exact grouping may be adjusted after usability testing, but preserve the eleven-module scope.

### 4.3 Desktop interaction

- Sidebar collapse state must not change the selected route.
- Tables may expose column sorting, filters and row actions.
- Row click opens the record; action menus must not accidentally trigger row navigation.
- Hover can reveal secondary affordances but must not be the only way to access a critical action.
- Bulk actions require explicit row selection and confirmation for destructive operations.

## 5. Mobile shell

### 5.1 Bottom navigation

Primary tabs:
- Home
- Tasks
- Calendar
- CRM
- More

More contains Campaigns, Plans & Goals, Meetings, Assets, Team and Settings.

### 5.2 Mobile interaction

- Use single-column cards.
- Use agenda views instead of dense month grids as the default calendar view.
- Use full-screen forms or bottom sheets.
- Use sticky bottom actions for Save, Update, Complete or Submit when appropriate.
- Keep common actions within comfortable thumb reach.
- Respect Android safe areas and on-screen keyboard.
- Back action closes the topmost modal/drawer before navigating back.

## 6. Responsive rules

Starting breakpoints:
- <480 px: compact mobile
- 480–767 px: large mobile
- 768–1023 px: tablet
- >=1024 px: desktop
- >=1440 px: wide desktop

Do not use breakpoints as fixed-device assumptions. Layout must respond to available width.

| Pattern | Desktop | Mobile |
|---|---|---|
| Navigation | Sidebar | Bottom tabs + More |
| Records | Table/list/Kanban | Cards |
| Filters | Inline toolbar/popover | Filter drawer |
| Details | Tabs/two columns | Stacked sections |
| Calendar | Month/week/day/agenda | Agenda-first |
| Forms | Logical two-column groups | One column |
| Actions | Toolbar/context menu | Visible buttons/action sheet |

## 7. Visual design tokens

The final colour values, typeface and spacing scale should be selected in the implementation design file. Required semantic tokens:
- `color.surface`, `color.surface-muted`, `color.canvas`
- `color.text-primary`, `color.text-secondary`, `color.border`
- `color.primary`, `color.focus`
- `color.success`, `color.warning`, `color.danger`, `color.info`
- `space.1...space.n`
- `radius.control`, `radius.card`, `radius.modal`
- `shadow.overlay`, `shadow.popover`

Use neutral surfaces and one restrained brand accent. Avoid excessive gradients, glows, nested cards and heavy shadows.

### Status treatment

| Meaning | Treatment |
|---|---|
| To Do / Draft / Scheduled | Neutral |
| In Progress | Blue/info |
| Due Soon / Needs Attention | Amber/warning |
| Overdue / Blocked / Failed | Red/danger |
| Completed / Approved / Won | Green/success |
| Cancelled / Archived | Muted grey |

Always show a text label alongside colour.

## 8. Component standards

Shared components:
- `PageHeader`
- `WorkspaceSwitcher`
- `GlobalSearch`
- `PrimaryAction`
- `FilterBar`
- `FilterDrawer`
- `StatusBadge`
- `PriorityIndicator`
- `MemberAvatar`
- `RecordCard`
- `DataTable`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `ConfirmDialog`
- `ActivityTimeline`
- `CommentComposer`
- `AttachmentList`
- `DateTimeField`
- `MemberPicker`
- `RelatedRecordPicker`
- `ResponsiveDetailLayout`

Components must support keyboard use, accessible names, focus state and loading/disabled state.

## 9. Forms

- Required fields first.
- Optional fields grouped under “More details”.
- Use sensible defaults: active workspace, current user as creator, default date/time where safe.
- Inline validation next to the field.
- Preserve entered values after validation failure.
- Distinguish Save Draft from Submit/Publish/Complete.
- Warn before leaving a form with unsaved changes.
- Never make optional data appear mandatory without a business reason.

## 10. System states

Every feature must design:
- Initial loading
- Empty state
- Search returns no results
- Filter returns no results
- Permission denied
- Network failure
- Validation error
- Save in progress
- Save success
- Partial upload/failure
- Archived/deleted record
- Offline or retry state where supported

Empty states should explain what is absent and offer one relevant next action.

## 11. Accessibility and usability

- Target WCAG 2.2 AA.
- Aim for 44 × 44 CSS px mobile touch targets.
- Visible keyboard focus.
- Labels associated with fields.
- Text contrast adequate for normal and small text.
- Do not communicate state by colour alone.
- Support zoom and dynamic text where practical.
- Do not hide critical actions in hover-only menus.

## 12. Global create behaviour

A contextual Create menu is available in the shell. It should show only relevant record types for the active module and workspace. For example:
- Dashboard: task, CRM record, campaign, meeting.
- CRM record: note, follow-up, meeting, site visit, task.
- Campaign: stage task, asset, milestone.
- Meeting: action item.
- Plan: milestone or linked task.

## 13. Workspace behaviour

- Workspace must be visible in the shell.
- Switching workspace refreshes all workspace-scoped data and filters.
- Clear stale selected record IDs and cached lists when switching.
- Never display mixed-workspace data accidentally.
- The backend remains the authority for access checks.

## 14. Acceptance checklist

- [ ] Main navigation is consistent across modules.
- [ ] Desktop sidebar can collapse and expand.
- [ ] Mobile bottom navigation has no more than five primary destinations.
- [ ] All feature pages have loading, empty and error states.
- [ ] Forms work with mobile keyboard open.
- [ ] No important mobile workflow requires desktop-style horizontal scrolling.
- [ ] Workspace context is always clear.
- [ ] Status is conveyed by text and not colour alone.
