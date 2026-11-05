# CORVIIN HUB — Plans & Goals Feature Specification

**Document ID:** CH-FS-04 | **Version:** 1.0

## 1. Purpose and terminology

- **Goal:** the outcome to achieve.
- **Plan:** the approach or strategy used to achieve the goal.
- **Milestone:** a checkpoint within a plan.
- **Task:** an actionable unit of work.

Do not blur these concepts in labels or forms.

## 2. Landing page

Tabs:
- Overview
- Goals
- Plans
- At Risk
- Completed

Desktop:
- Summary strip for active goals, active plans, delayed items and milestones due.
- Goal/plan list with owner, target date, progress and status.
- Filters by owner, date, status and linked campaign.

Mobile:
- Summary cards followed by stacked goal/plan cards.
- Use clear tabs or segmented control.
- Show owner and target date prominently.

## 3. Goal card and detail

Card fields:
- Goal title/outcome.
- Owner.
- Target date.
- Progress.
- Status.

Detail sections:
1. Overview and expected outcome.
2. Measurement: metric, target and current value.
3. Owner and participants.
4. Start/target dates and priority.
5. Linked plans.
6. Linked tasks and campaigns.
7. Progress history.
8. Activity.

Goal create form:
- Title
- Expected outcome
- Owner
- Target date
- Priority
- Optional metric, target value and current value
- Optional participants and linked records

## 4. Plan card and detail

Card fields:
- Plan name.
- Strategic summary.
- Owner.
- Target date.
- Progress and status.

Detail sections:
1. Strategy and rationale.
2. Steps.
3. Milestones.
4. Owner and participants.
5. Dates.
6. Resources and attachments.
7. Risks/blockers.
8. Linked goals, campaigns and tasks.
9. Activity/history.

Plan create form:
- Title
- Strategy/description
- Owner
- Start and target date
- Participants
- Linked goal
- Optional resources and risks

## 5. Milestones

Milestone fields:
- Title
- Description
- Owner (optional)
- Due date
- Status
- Completion date
- Linked tasks

Milestones should be displayed as a chronological list or timeline. Overdue milestones must be visually distinct.

## 6. Progress calculation

Support:
- Task-derived progress.
- Milestone-derived progress.
- Manual progress.

The progress mode must be explicit. For task-derived progress, define the denominator (all linked tasks or selected tasks) and how cancelled tasks are treated. For milestone progress, define weighting (equal by default unless configured). Manual progress must be labelled “Manual”.

Do not silently mix manual and calculated progress.

## 7. At-risk logic

An item may be marked at risk when:
- Target date is approaching and progress is below configured expectation.
- A required milestone is overdue.
- Linked critical tasks are blocked or overdue.

The exact thresholds must be configurable or documented. Avoid inventing a percentage threshold in UI.

## 8. Interactions

- Add task from a plan/goal detail with relationship prefilled.
- Open linked campaign or task.
- Update milestone.
- Add progress note.
- Change owner/participants.
- Archive or complete with confirmation.

## 9. Mobile UX

- Cards show outcome, owner, progress and target.
- Long strategy and risk details are collapsible.
- Milestones use a vertical timeline.
- Forms use one column and optional fields under More Details.
- Sticky Save action.

## 10. Acceptance criteria

- [ ] Goal, plan, milestone and task are distinct records.
- [ ] Linked tasks can be opened and created in context.
- [ ] Progress mode is visible and calculation is reproducible.
- [ ] Manual progress is labelled.
- [ ] Delayed/at-risk states have explainable reasons.
- [ ] Mobile detail pages are stacked and readable.
