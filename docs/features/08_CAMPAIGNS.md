# CORVIIN HUB — Campaign Management Feature Specification

**Document ID:** CH-FS-08 | **Version:** 1.0

## 1. Purpose

Manage the full lifecycle of Tech and Real Estate campaigns from initial concept through scripting, production, editing, publishing and completion.

Campaigns are operational records, not just cards on a board. They own stage information, tasks, assets, dates, approvals and publishing evidence.

## 2. Campaign landing page

Provide separate workspace-scoped campaign data for Corviin Tech and Corviin Real Estate.

Views:
- List
- Board by stage
- Optional calendar-linked view

Filters:
- Stage
- Status
- Owner
- Platform
- Date range
- Priority
- At risk

Campaign card:
- Title
- Short description/objective
- Current stage
- Owner
- Start/target publish date
- Progress
- Next deadline
- Asset indicator

Keep cards simple; production detail belongs on the campaign page.

## 3. Campaign detail page

Header:
- Campaign title and short description.
- Workspace/category.
- Owner.
- Status.
- Start and target publish dates.
- Primary action appropriate to current stage.
- More menu for archive/edit.

Stage stepper:
1. Initial Idea
2. Scripting & Planning
3. Recording & Asset Upload
4. Editing & Final Asset
5. Posting & Completion

Tabs/sections:
- Overview
- Stage workspace
- Tasks
- Assets
- Activity

On mobile, use a compact stage progress indicator and expandable sections.

## 4. Stage 1 — Initial Idea

Purpose: capture a concept without demanding full production details.

Fields:
- Campaign title (required)
- Short description (required)
- Objective
- Target audience
- Workspace/category
- Concept/idea
- Platform
- Owner
- Priority
- Tentative dates
- Reference links/files
- Notes

Actions:
- Save Draft
- Assign owner
- Add initial tasks
- Move to Scripting & Planning

Validation: title and short description are required to create a usable draft. Other requirements can be completed later.

## 5. Stage 2 — Scripting & Planning

Fields:
- Final topic
- Objective and audience
- Platform and content format
- Hook
- Script/copy
- Shot breakdown
- Voice-over
- On-screen text
- Caption
- Hashtags
- CTA
- Research and references
- Required assets
- Writer and reviewer
- Recording date
- Script deadline
- Target posting date

Interactions:
- Edit script.
- Add revision/version.
- Comment and review.
- Mark approved or changes requested.
- Create tasks for research, writing and review.
- Move to Recording when stage criteria are satisfied.

Script revision history must preserve author, timestamp and revision note. Do not overwrite approved versions without retaining prior versions.

## 6. Stage 3 — Recording & Asset Upload

Fields:
- Recording date/time
- Location
- Team/participants
- Shot list
- Footage checklist
- Raw video files
- Images
- Audio/voice-over
- Documents
- Missing footage notes
- Retake notes
- Upload status
- Recording completion date

Interactions:
- Upload files.
- Tag files by stage/category.
- Mark checklist items done/missing/retake.
- Assign retake task.
- Move to Editing.

Upload from this page automatically creates campaign asset links.

## 7. Stage 4 — Editing & Final Asset

Fields:
- Editor
- Editing start/deadline
- Editing instructions
- Aspect ratio/output format
- Draft edit files
- Revision requests
- Reviewer
- Final video/design/image
- Final caption/CTA
- Approval status/date
- Version

Interactions:
- Upload draft.
- Add timestamped or general feedback.
- Request changes.
- Upload revised version.
- Approve final.
- Move to Posting.

Approved final asset must be identifiable and protected from accidental replacement. A new revision should create a new version.

## 8. Stage 5 — Posting & Completion

Fields:
- Platform
- Scheduled date/time
- Actual publish date/time
- Publishing owner
- Final caption
- Public URL
- Published asset/proof
- Checklist
- Completion date
- Performance notes/metrics

Interactions:
- Schedule/reschedule.
- Verify approved asset.
- Mark Published.
- Add public URL.
- Record performance.
- Complete/archive campaign.

Do not mark a campaign published solely because a scheduled date has passed.

## 9. Campaign tasks

Stage-specific tasks use the shared task engine:
- Research
- Script writing
- Script review
- Recording
- Upload
- Editing
- Review
- Caption
- Scheduling
- Publishing

Each task has its own assignee, deadline, status and history. It appears in My Tasks, All Tasks and Team Task Calendar.

## 10. Campaign Assets section

This is a critical requirement.

Default view: assets linked to the current campaign only.

Categories:
- References/research
- Scripts/copy
- Raw footage
- Images
- Audio/VO
- Draft edits
- Final approved assets
- Published proof
- Other documents

Behaviours:
- Upload inside campaign auto-links the asset.
- Asset retains campaign and stage relationship.
- Global Assets & Storage can search the same file.
- Multi-campaign reuse must be an explicit relationship or controlled copy.
- Remove from campaign removes only the link.
- Permanent deletion is a separate confirmed and audited operation.

## 11. Progress and status

Show:
- Current stage.
- Stage checklist completion.
- Linked task progress.
- Next deadline.
- At-risk state if a required deadline is overdue or blocked.

Do not invent progress from stage count alone. Define calculation and label manual overrides.

## 12. Mobile UX

- Single-column campaign cards.
- Compact stage stepper.
- Stage sections expand/collapse.
- Upload from device files/camera where supported.
- Upload queue with progress, retry and failure detail.
- Sticky next-stage action.
- Avoid showing every script/production field on the overview.

## 13. Acceptance criteria

- [ ] Campaigns are isolated by workspace.
- [ ] Five stages are supported and transitions are audited.
- [ ] Stage-specific forms show relevant fields only.
- [ ] Stage tasks use the shared task engine.
- [ ] Campaign Assets shows only linked assets by default.
- [ ] Uploading from campaign automatically links asset.
- [ ] Asset removal does not silently delete the file.
- [ ] Planned and actual publish timestamps are separate.
- [ ] Approved assets and prior versions remain traceable.
