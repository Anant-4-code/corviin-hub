# CORVIIN HUB — Team Task Calendar Specification

**Document ID:** CH-FS-06 | **Version:** 1.0

## 1. Purpose

Give the team a date-based view of assigned work, workload and deadlines. The calendar is a view over the shared Task records.

## 2. Layout

Desktop:
- Date navigation: previous, next, Today and date picker.
- Filters: member, status, priority, campaign, plan/goal.
- Member sections for each active workspace member.
- Each member section expands to show tasks for the selected date.

Mobile:
- Date strip/date picker.
- Accordion section per member.
- Task cards within expanded section.
- Add Task action.

Do not hard-code the initial three members. Display active workspace members dynamically.

## 3. Member section

Collapsed state:
- Member avatar/name.
- Number of tasks for selected date.
- Overdue/urgent indicator if relevant.

Expanded state:
- Task title.
- Planned start.
- Deadline.
- Status and priority.
- Linked campaign/plan/goal/CRM record.
- Actual start/completion indicators.
- Overdue state.

## 4. Interactions

- Tap member header to expand/collapse.
- Open task detail.
- Create task preassigned to selected member.
- Start, pause, resume and complete task.
- Reschedule with reason/history.
- Add note or blocker.
- View work-session and activity history.

Actions must call the same task services as My Tasks and All Tasks.

## 5. Date logic

- Display tasks based on planned start/deadline rules.
- A rescheduled task appears on its current planned date.
- Original dates remain in schedule history.
- Actual start/completion timestamps are shown as actual events, not substituted into planned schedule.
- Define how tasks spanning multiple days appear; use a consistent bar or daily occurrence indicator.

## 6. Filters and navigation

- Previous/next date.
- Today.
- Date picker.
- Member.
- Status.
- Priority.
- Campaign/plan/goal.
- Overdue only.

Preserve selected date and filters when opening and returning from task detail.

## 7. Acceptance criteria

- [ ] Member list is dynamic.
- [ ] Each member section expands and collapses.
- [ ] Task actions update the shared task record.
- [ ] Planned and actual dates remain separate.
- [ ] Rescheduled tasks appear on current schedule and retain history.
- [ ] Mobile uses accordion sections and readable cards.
