# CORVIIN HUB — Dashboard Feature Specification

**Document ID:** CH-FS-01 | **Version:** 1.0

## 1. Purpose

The Dashboard is the operational home screen. It answers:
1. What needs my attention today?
2. What is happening next?
3. What is delayed, blocked or progressing?

It is not intended to be a BI dashboard or a wall of decorative charts.

## 2. Entry and page structure

### Desktop layout

1. Page header: greeting, active workspace, date range and Create action.
2. Summary metrics row.
3. Main two-column area:
   - My Work Today
   - Upcoming Calendar
4. Second two-column area:
   - Campaign Progress
   - Plans & Goals
5. Recent Activity timeline.

### Mobile layout

Single-column order:
1. Greeting, workspace and date.
2. Due Today / Overdue summary.
3. My Tasks Today.
4. Follow-ups Due.
5. Upcoming Meetings and Site Visits.
6. Campaign / Goal progress previews.
7. Recent Activity.

The first screen should show actionable items without requiring excessive scrolling.

## 3. Dashboard widgets

### 3.1 Summary cards

Required cards:
- Tasks due today
- Overdue tasks
- Tasks in progress
- Completed tasks in selected period
- Follow-ups due
- Upcoming meetings/visits
- Active campaigns
- Active goals/plans

Each card must:
- Display a count and concise label.
- Optionally show a comparison only when the comparison period is meaningful.
- Open the relevant module with the corresponding filter applied.
- Respect the active workspace and date range.
- Provide a zero state without implying an error.

### 3.2 My Work Today

Shows tasks assigned to the current user:
- Title
- Due time
- Priority
- Status
- Linked campaign/goal/CRM record
- Primary action such as Start, Resume or Open

Desktop may show a compact list. Mobile uses cards with one clear primary action.

### 3.3 Team tasks preview

Optional compact team view:
- Group tasks by member.
- Show member name, open task count and urgent task count.
- Clicking a member opens the Team Task Calendar or filtered All Tasks.

### 3.4 Follow-ups due

Show CRM follow-ups due today and overdue:
- Person/company
- CRM category
- Due time
- Assigned member
- Current stage
- Call/Open action where supported

Do not display full private CRM details in a crowded widget.

### 3.5 Upcoming calendar

Combine a short preview of meetings, visits and key campaign/task deadlines. Each item must indicate its type so the user can distinguish a buyer visit from a content deadline.

### 3.6 Campaign progress

Show active campaigns with:
- Name
- Stage
- Owner
- Next deadline
- Progress
- At-risk indicator when a deadline is missed or a required task is blocked

Progress calculation must follow campaign rules and must not be guessed from a stage label alone.

### 3.7 Plans and goals

Show active goals/plans with:
- Outcome/title
- Owner
- Target date
- Progress
- Status (on track, at risk, delayed, completed)

### 3.8 Recent activity

Chronological events such as:
- Task assigned/completed/rescheduled
- CRM stage updated
- Follow-up completed
- Meeting outcome recorded
- Campaign stage changed
- Asset uploaded/approved

Each activity item shows actor, action, record and timestamp. Clicking opens the source record.

## 4. Interactions

- Date range changes refresh all date-sensitive widgets.
- Workspace switch refreshes all dashboard data.
- Widget click navigates to a filtered destination.
- Quick Create opens the contextual create menu.
- Refresh must not duplicate records or create activity.
- Widget-level loading should not block the entire dashboard.

## 5. Data and calculations

- All counts are scoped by workspace and access.
- Due today uses the user's/workspace configured timezone.
- Overdue means open item with due timestamp before current time; define all-day due-date treatment consistently.
- Completed-in-period uses actual completion timestamp.
- Follow-up count uses follow-up due date and status, not CRM notes.
- Campaign progress uses configured stage/task/milestone logic.
- Avoid counting archived/cancelled items unless explicitly requested.

## 6. Filters

- Workspace (global shell)
- Date range
- Assigned member (for team widgets)
- Campaign status
- Goal/plan status

Keep advanced filters out of the initial dashboard view.

## 7. Permissions and privacy

Dashboard data must be derived only from records the member can access. If access rules later differ by role, summary counts must follow the same rules as list/detail endpoints.

## 8. States

- First-time empty workspace: explain how to create the first task/lead/campaign.
- No tasks today: show a calm empty state.
- No activity: show when activity will appear.
- Partial API failure: show available widgets and a retry affordance for failed widgets.
- Slow metric: use skeletons and avoid layout shift.

## 9. Acceptance criteria

- [ ] Dashboard is workspace-scoped.
- [ ] Each metric opens its corresponding filtered view.
- [ ] Due today and overdue calculations respect timezone.
- [ ] Follow-ups are sourced from follow-up records.
- [ ] Recent activity identifies the actor.
- [ ] Desktop uses multi-column layout; mobile uses a single-column action-first layout.
- [ ] A failed widget does not blank the whole dashboard.
