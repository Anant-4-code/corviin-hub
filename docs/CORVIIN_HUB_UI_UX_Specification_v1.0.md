# CORVIIN HUB — UI/UX Design Specification
**Document ID:** CH-UIUX-001  
**Version:** 1.0  
**Status:** Detailed design and implementation specification  
**Date:** 5 November 2026  
**Platforms:** PC Web, Tablet, Mobile Web and Android APK  
**Product:** CORVIIN HUB  
**Related documents:** PRD, TRD, Updated Feature Scope, Web & Mobile Architecture and Flow, Build Phases

---

## 1. Document purpose

This document defines the user experience, responsive layouts, navigation, visual system, reusable interface patterns and interaction behaviour for CORVIIN HUB.

It is the primary UI/UX reference for designers and AI coding agents. Every screen must follow this specification alongside its feature-specific Markdown document.

The application must be:

- Easy to understand without formal user training.
- Clean, professional, restrained and practical.
- Consistent across all modules.
- Fully usable on desktop and mobile.
- Designed for both light and dark themes.
- Static, with no decorative animation or motion.
- Efficient for frequent operational work.
- Accessible, readable and predictable.

The intended visual direction is a professional CRM and business operations application, using the supplied Pinterest CRM design search as broad inspiration:

[ Pinterest — CRM design references ](https://in.pinterest.com/search/pins/?q=crm%20design&rs=ac&len=3&source_id=ac_yFpq0CUQ&eq=crm&etslf=5392)

Use this reference for general layout and information-hierarchy inspiration only. Do not copy a specific product, pin, logo, brand identity or proprietary interface. Create an original CORVIIN HUB design.

---

## 2. Product and user context

CORVIIN HUB is one internal operations application for Corviin Group with two separate workspaces:

1. **Corviin Tech**
2. **Corviin Real Estate**

The same application structure and design system serve both workspaces. Workspace-specific operational records, CRM pipelines, campaigns, assets, settings and reports must remain separated.

Initial selectable profiles:

- Anant
- Rohit
- Utkarsh

The initial application uses a no-login profile selector. This is an acting-profile convenience for a trusted internal prototype, not identity verification or authentication. The UI must not describe it as secure login.

All three initial profiles have equal operational access in the initial scope. The member directory and assignments must remain dynamic and support future members.

### 2.1 Primary user goals

The interface should help a member quickly:

- Understand what needs attention today.
- Find their own tasks and team tasks.
- Create, assign, update and complete work.
- Track plans, goals and milestones.
- Manage campaigns and content production.
- Find and organise files and campaign assets.
- Manage Tech enquiries, developer/partner leads and property buyers.
- Record meetings, decisions, visits and follow-ups.
- See activity and operational history.
- Switch between profiles and workspaces.
- Use the same records on PC and Android.

### 2.2 Experience principles

1. **Clarity before decoration:** prioritise meaning and action.
2. **One source of truth:** display linked records rather than duplicating them.
3. **Progressive disclosure:** show essential information first; expose advanced detail when needed.
4. **Predictability:** similar actions should look and behave the same across modules.
5. **Desktop efficiency:** support scanning, filtering, comparison and multi-record work.
6. **Mobile efficiency:** support quick updates, short forms, agenda views and comfortable touch.
7. **Self-explanatory:** page purpose, actions, fields and outcomes must be clear without training.
8. **Honest feedback:** never show success when a request failed or is still pending.
9. **History preservation:** important changes remain traceable.
10. **Responsive by design:** mobile is a deliberately designed experience, not a compressed desktop layout.

---

## 3. Non-negotiable visual direction

### 3.1 Overall appearance

CORVIIN HUB must look like a mature, carefully designed business product.

Use:

- Neutral backgrounds and clear surface hierarchy.
- Consistent typography and spacing.
- Subtle borders and separators.
- Carefully selected accent colours.
- Familiar, consistent icons.
- Practical data tables and readable lists.
- Clear status labels and action buttons.
- Consistent page structures and form patterns.

Avoid:

- Generic AI-generated SaaS dashboard styling.
- Purple/blue/pink gradient backgrounds as a default.
- Glassmorphism and translucent floating panels.
- Neon borders, glow, bloom or luminous effects.
- Decorative 3D blobs, orbs or floating illustrations.
- Excessive nested cards and rounded containers.
- Oversized hero headings or marketing-page layouts.
- Fake analytics, invented data or meaningless progress indicators.
- Emoji as the primary icon system.
- Unnecessary decorative charts.
- Inconsistent icon libraries or stroke weights.
- Large empty areas that reduce operational efficiency.
- Low-contrast labels or unnecessarily tiny text.

Every element must help the user understand, navigate, compare or complete work.

### 3.2 No animation

**The interface must contain no decorative animation or motion.**

Do not implement:

- Page or route transitions.
- Animated counters.
- Animated charts or progress bars.
- Shimmer or pulsing skeletons.
- Parallax or scroll-triggered effects.
- Animated backgrounds or gradients.
- Bouncing, floating, rotating or scaling icons.
- Hover transforms or card lifts.
- Spring, elastic or bounce effects.
- Animated modal, drawer, dropdown or sidebar transitions.
- Auto-scrolling carousels.
- Decorative spinners.

Use immediate static feedback:

- Static hover and selected states.
- Visible focus outlines.
- Static loading text or indicator.
- Static upload progress.
- Immediate success/error messages.
- Clear disabled states.

Do not add animation libraries for visual effects. Avoid CSS keyframes and transition utilities for decorative motion.

### 3.3 No fake content

- Never show invented business records as real records.
- If demonstration data is required, label it clearly as sample/demo data.
- Do not invent dashboard metrics.
- Do not show chart placeholders that imply real analytics.
- Empty states must remain honest and useful.

---

## 4. Information architecture

### 4.1 Main modules

The primary modules are:

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

### 4.2 Global utilities

Available from the application shell:

- Workspace switcher.
- Active profile menu and Switch Profile action.
- Global search.
- Notifications.
- Contextual Create action.
- Theme selector.
- Help or guidance entry only if supported by actual help content.

Do not add every sub-feature as a top-level navigation item.

### 4.3 Desktop navigation grouping

| Group | Items |
|---|---|
| Overview | Dashboard |
| Work | My Tasks, All Tasks, Plans & Goals, Calendar |
| Growth | Campaigns, CRM, Meetings |
| Resources | Assets & Storage, Team |
| Administration | Settings |

The sidebar must clearly show the selected module and support collapse/expand without changing the current route.

### 4.4 Mobile navigation

Use a five-item bottom navigation:

1. Home
2. Tasks
3. Calendar
4. CRM
5. More

The More screen contains:

- Campaigns
- Plans & Goals
- Meetings
- Assets & Storage
- Team
- Settings

Do not squeeze all eleven modules into the bottom navigation.

---

## 5. Responsive design system

### 5.1 Breakpoints

Use content-driven responsive behaviour. These are starting breakpoints, not device-specific assumptions.

| Range | Layout intent |
|---|---|
| Under 480 px | Compact mobile |
| 480–767 px | Large mobile |
| 768–1023 px | Tablet / compact layout |
| 1024–1439 px | Desktop |
| 1440 px and above | Wide desktop |

Use CSS media queries and responsive utility classes. Test intermediate widths, not only one phone and one desktop size.

### 5.2 Responsive behaviour rules

- The page must not create horizontal overflow at supported widths.
- Navigation must adapt without hiding access to any module.
- Tables must become mobile cards, compact rows or deliberate horizontal-scroll regions only when appropriate.
- Forms become single-column on mobile.
- Multi-column detail layouts stack in a meaningful order.
- Filters become a clearly labelled filter panel or bottom sheet on mobile.
- Dialogs become full-screen or near-full-screen forms when needed.
- Desktop side panels become full detail pages on mobile when content is complex.
- Charts, if genuinely needed, must resize and retain readable labels.
- Sticky actions must not cover content or the on-screen keyboard.
- Respect safe areas on Android.
- Use `min-width: 0` and appropriate wrapping in flex/grid layouts to prevent overflow.
- Long names, filenames and descriptions must wrap or truncate with a way to inspect the full value.

### 5.3 Responsive layout patterns

| Pattern | Desktop | Mobile |
|---|---|---|
| Main navigation | Persistent sidebar | Bottom nav + More |
| Page header | Title, description, actions in one row where possible | Stacked title and actions |
| Data list | Table with sorting and filters | Cards or compact list |
| Filters | Inline toolbar / filter row | Filter sheet or dedicated panel |
| Record detail | Two-column layout or tabs | Single column / sections |
| Create/edit form | Modal, side panel or page based on complexity | Full-screen form or bottom sheet |
| Calendar | Month/week/day views | Agenda-first view |
| Kanban | Multi-column board | Stage selector with one-column cards |
| Activity | Timeline column or panel | Full-width chronological list |
| Bulk actions | Selection toolbar | Limited, explicit multi-select actions |

### 5.4 Content width

- Use a consistent content container.
- Avoid stretching text-heavy forms and record details across very wide monitors.
- Tables may use the available width.
- Set sensible maximum widths for forms and reading content.
- Preserve enough horizontal room for operational columns on desktop.
- Do not create unnecessary nested containers.

---

## 6. Grid, spacing and sizing

Use a consistent spacing scale. Prefer a 4 px base unit.

| Token | Suggested value | Typical use |
|---|---:|---|
| `space-1` | 4 px | Icon/text separation |
| `space-2` | 8 px | Compact field spacing |
| `space-3` | 12 px | Control groups |
| `space-4` | 16 px | Standard spacing |
| `space-5` | 20 px | Section spacing |
| `space-6` | 24 px | Card/section padding |
| `space-8` | 32 px | Major section separation |
| `space-10` | 40 px | Page-level separation |
| `space-12` | 48 px | Large layout separation |

Guidelines:

- Use consistent 8/12/16/24 px rhythm for common layouts.
- Standard desktop page padding: approximately 24–32 px, adjusted by viewport.
- Mobile page padding: approximately 16 px.
- Standard control height: 40–44 px.
- Mobile primary touch targets: at least 44 × 44 CSS px; larger where practical.
- Do not make every card equally padded; use hierarchy and density appropriate to its content.

---

## 7. Typography

Use a readable, neutral sans-serif typeface. Prefer a system font stack or a well-supported font already approved for the product. Do not load multiple decorative font families.

Suggested hierarchy:

| Role | Desktop | Mobile | Weight |
|---|---:|---:|---|
| Page title | 24–28 px | 22–24 px | 600 |
| Section title | 18–20 px | 18 px | 600 |
| Card/record title | 15–17 px | 15–16 px | 600 |
| Body | 14–16 px | 14–16 px | 400 |
| Secondary text | 13–14 px | 13–14 px | 400 |
| Labels | 13–14 px | 13–14 px | 500 |
| Metadata | 12–13 px | 12–13 px | 400 |

Rules:

- Use sentence case for headings and buttons.
- Avoid all-caps labels except short, established status markers where appropriate.
- Maintain comfortable line height.
- Use tabular numerals for aligned metrics and dates where helpful.
- Do not use tiny grey text for important information.
- Ensure text remains legible in both themes.

---

## 8. Colour system and themes

Both light and dark themes are first-class product experiences. Do not create a polished light theme and an inverted dark theme.

### 8.1 Semantic tokens

Define semantic tokens instead of hard-coding colours in feature components.

Required token groups:

```text
background
surface
surface-elevated
surface-muted
surface-selected
text-primary
text-secondary
text-muted
border
border-strong
accent
accent-foreground
success
success-subtle
warning
warning-subtle
danger
danger-subtle
info
info-subtle
focus-ring
disabled
```

### 8.2 Light theme direction

- Soft neutral or warm-white application background.
- White or near-white main surfaces.
- Dark charcoal primary text.
- Muted but readable secondary text.
- Subtle neutral borders.
- One controlled brand accent for primary actions and selected navigation.
- Restrained semantic colours.

### 8.3 Dark theme direction

- Deep charcoal or graphite background, not pure black everywhere.
- Differentiated surfaces for sidebar, content, panels and overlays.
- Light neutral primary text.
- Secondary text with sufficient contrast.
- Subtle borders and separators.
- Same semantic meaning and brand accent as light mode, adjusted for contrast.
- No neon, glow or luminous outlines.

### 8.4 Theme behaviour

Theme options:

- Light
- Dark
- System (recommended if it can be implemented reliably)

Requirements:

- Persist the preference locally.
- Apply theme at the application root.
- Avoid a flash of the wrong theme during initial render where practical.
- Every component must use semantic tokens.
- Theme selection must be available from the profile/settings area.
- Theme changes must apply consistently across all modules and overlays.
- Test both themes at desktop and mobile sizes.
- Do not use CSS filter inversion.

### 8.5 Status colours

Use colour as a supporting signal, never the only signal.

Example semantic use:

- Success: completed, approved, converted.
- Warning: due soon, needs attention, pending review.
- Danger: overdue, blocked, failed, destructive action.
- Info: scheduled, in progress, informational.
- Neutral: draft, archived, not started.

The exact colour values should be chosen and contrast-tested during implementation.

---

## 9. Iconography and imagery

- Use one consistent icon library, preferably Lucide.
- Use icons with consistent stroke weight and sizing.
- Use familiar icons for navigation and common actions.
- Pair less familiar icons with text labels.
- Do not use emoji as the main icon language.
- Do not use decorative illustrations to fill empty space.
- Use avatars only when a real profile image exists; otherwise use initials.
- Use image thumbnails for actual uploaded assets, not generic decorative images.
- Provide fallback initials or file-type icons when no preview exists.
- Ensure icon-only buttons have accessible labels and tooltips where useful.

---

## 10. Application shell

### 10.1 Desktop shell

Structure:

```text
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar        │ Top bar: Workspace | Search | Theme | Profile  │
│                ├────────────────────────────────────────────────┤
│ Dashboard      │ Breadcrumb                                     │
│ My Tasks       │ Page title                    Primary action    │
│ All Tasks      │ Short description                               │
│ Plans & Goals  │ Filters / tabs                                  │
│ Calendar       │                                                │
│ Campaigns      │ Main page content                               │
│ CRM            │                                                │
│ Meetings       │                                                │
│ Assets         │                                                │
│ Team           │                                                │
│ Settings       │                                                │
└─────────────────────────────────────────────────────────────────┘
```

Requirements:

- Sidebar has clear group labels.
- Active navigation state is obvious.
- Collapse/expand does not alter the route.
- Top bar remains consistent across modules.
- Workspace and active profile are always identifiable.
- Search, notifications and theme controls have predictable locations.
- Page content begins with a clear title and purpose.
- Do not put every action in the global header; keep contextual actions on the relevant page.

### 10.2 Mobile shell

Structure:

```text
┌─────────────────────────────┐
│ Page title      Profile     │
│ Workspace selector          │
├─────────────────────────────┤
│                             │
│ Page description            │
│ Primary action              │
│                             │
│ Filters / tabs               │
│                             │
│ Main content                 │
│                             │
│                             │
├─────────────────────────────┤
│ Home Tasks Calendar CRM More │
└─────────────────────────────┘
```

Requirements:

- Keep top-level context visible without consuming excessive vertical space.
- Use a compact top bar.
- Bottom navigation must not overlap content.
- Respect Android safe areas.
- More opens a clear module list.
- Back behaviour must close the topmost sheet/dialog before leaving the current route.
- Avoid hover-only actions.
- Keep common actions reachable by thumb.

### 10.3 Profile selection screen

Initial route when no profile is selected:

- Clear CORVIIN HUB identity.
- Heading: “Who is using CORVIIN HUB?”
- Short explanation that this selects the active working profile on this device.
- Three initial profile choices: Anant, Rohit and Utkarsh.
- Use profile records returned by the API.
- Clear selection action.
- No password, OTP or login form in the initial scope.
- Clearly indicate shared-device profile selection is not identity verification.

After selection:

- Enter the application.
- Display the selected profile in the top bar.
- Provide a clear Switch Profile action.
- Switching profile must not change record ownership or rewrite activity history.

---

## 11. Workspace switcher

The workspace selector must make the current business context obvious.

Options:

- Corviin Tech
- Corviin Real Estate

Behaviour:

- Display current workspace name in the shell.
- Use a clear dropdown or selector.
- Changing workspace reloads workspace-scoped data.
- Clear stale data from the previous workspace while the new workspace loads.
- Do not show records from both workspaces mixed together.
- Preserve the selected profile when changing workspace.
- Use the backend as the authority for workspace scoping.

The selector should not use colour alone to distinguish workspaces. Show the full workspace name.

---

## 12. Global search and contextual create

### 12.1 Global search

Search should be easy to find and consistent.

Desktop:

- Search field in the top bar.
- Keyboard focus and clear search action.
- Results grouped by record type where useful.

Mobile:

- Search icon/button opens a dedicated search screen or full-width search panel.
- Search input remains visible while results are browsed.

Search results may include:

- Tasks
- Plans and goals
- Campaigns
- Assets
- CRM records
- Meetings
- Team members

Rules:

- Search only the active workspace's accessible records.
- Display record type, title/name and useful identifying metadata.
- Selecting a result opens the original record.
- Do not create duplicate search-result records.
- Show a useful no-results message and clear-search action.

### 12.2 Contextual Create

Provide a global Create action where it improves speed, but keep it contextual.

Possible create actions:

- Task
- Plan or goal
- Campaign
- Asset
- CRM record
- Meeting
- Content item, if separately supported by the feature specification

The create menu must:

- Use plain-language labels.
- Respect the active workspace.
- Open the correct form.
- Pre-fill context when launched from a campaign, meeting or CRM record.
- Avoid offering actions that are not available in the current context.
- Never show a button that does nothing.

---

## 13. Reusable page structures

### 13.1 List page

A standard list page should contain:

1. Breadcrumb, if nested.
2. Page title.
3. One-line description.
4. Primary action.
5. Search/filter controls.
6. Active filter indicators.
7. List/table/board.
8. Pagination or load-more behaviour where needed.
9. Empty/loading/error states.

Desktop lists should support relevant sorting and filters. Mobile lists should prioritise key information and quick actions.

### 13.2 Detail page

A detail page should contain:

- Record title and current status.
- Key metadata.
- Primary next action.
- Related tabs/sections.
- Linked records.
- Activity/history.
- Edit/archive actions in a predictable menu.

Do not show every possible field at once. Group information by user task.

### 13.3 Create/edit form

Form rules:

- Use clear labels above controls.
- Mark required fields.
- Provide field-level validation.
- Preserve user input when a recoverable request fails.
- Group related fields.
- Use sensible defaults where defined.
- Avoid very long forms on mobile; use clearly labelled sections.
- Do not use placeholder text as the only field label.
- Explain unusual fields with short helper text.
- Place Save/Cancel actions consistently.
- Confirm before discarding a form with unsaved changes when appropriate.

### 13.4 Destructive and consequential actions

For delete, archive, cancel, remove link or other consequential actions:

- State exactly what will happen.
- Distinguish unlinking from deleting.
- Use clear action labels.
- Require confirmation where data loss or workflow impact is possible.
- Provide cancellation.
- Record the action in history where required.
- Never use vague confirmation text such as “Are you sure?” without context.

---

## 14. Self-explanatory UX requirements

The product must be usable by someone who has never seen it before and has no trainer.

### 14.1 Page-level clarity

Every page must answer:

- Where am I?
- What is this section for?
- What information is shown?
- What should I do next?

Use a clear title and a concise description. Avoid long tutorial paragraphs.

### 14.2 Action clarity

Use direct labels:

Prefer:
- Create task
- Assign member
- Add buyer
- Schedule meeting
- Upload asset
- Link existing asset
- Move to next stage
- Mark as completed
- Reschedule meeting

Avoid:
- Go
- Process
- Manage
- Continue
- Do it
- More (when a specific action can be named)

### 14.3 Form clarity

- Use plain language.
- Explain uncommon fields.
- Mark required fields.
- Show accepted formats and limits for file uploads.
- Show date/time context clearly.
- Explain what happens after submission.
- Keep validation near the relevant field.
- Do not clear the entire form after an API error.

### 14.4 Empty states

Every empty state must explain:

1. What belongs in this section.
2. Why the section is currently empty, where useful.
3. What the user can do next.

Examples:

**Tasks**
> No tasks yet. Create a task to assign work and set a deadline.

Action: **Create task**

**Buyers**
> No buyer enquiries yet. Add a buyer enquiry to track requirements and follow-ups.

Action: **Add buyer**

**Campaign assets**
> No files are linked to this campaign. Upload a new file or link an existing asset.

Action: **Add asset**

Do not use a generic “Nothing here” message.

### 14.5 Error states

Errors must explain:

- What failed.
- Whether the user's changes were saved.
- What the user can do next.
- Whether retry is safe.

Examples:

- “Could not save the task. Your changes are still on this form. Check your connection and try again.”
- “This file is larger than the allowed upload limit. Choose a smaller file.”
- “This record is not available in the current workspace. Switch workspace or return to the list.”

Do not expose stack traces or internal server errors.

### 14.6 First-time usability test

Before release, ask a person unfamiliar with the application to complete ordinary tasks without coaching:

1. Select a profile.
2. Select a workspace.
3. Find My Tasks.
4. Create and assign a task.
5. Find a CRM record and add a follow-up.
6. Create a meeting.
7. Open a campaign and upload/link an asset.
8. Switch between light and dark themes.
9. Return to the dashboard.

Observe confusion, hesitation and misclicks. Fix the interface rather than compensating with a training manual.

---

## 15. Module-specific UI/UX specifications

The following sections define common layout and interaction expectations. The detailed feature Markdown documents remain the source for full field lists, business rules and acceptance criteria.

### 15.1 Dashboard

Purpose: show what needs attention in the active workspace.

Desktop layout:

- Page heading and workspace context.
- Compact summary metrics.
- Today's work.
- Overdue and upcoming items.
- Active campaign overview.
- Plans/goals needing attention.
- Upcoming meetings and visits.
- Recent activity.

Mobile layout:

- Summary cards in a compact grid or horizontal summary row.
- Today's tasks as a readable list.
- Upcoming meetings and follow-ups.
- Active campaigns as compact cards.
- Recent activity lower on the page.

Rules:

- Every metric must come from real data.
- Summary cards open the corresponding filtered module.
- Do not show meaningless charts.
- Prioritise actionable information over vanity metrics.

### 15.2 My Tasks

Desktop:

- Clear task list with status, priority, deadline and linked record.
- Filters for status, priority and date.
- Quick actions for status updates and opening detail.
- Optional grouped view by date or status.

Mobile:

- Task cards showing title, status, priority and deadline.
- Clear due/overdue information.
- Quick status action.
- Task detail opens as a dedicated screen.

The view filters shared task records by the active acting profile. Profile switching must not rewrite task ownership.

### 15.3 All Tasks

Desktop:

- Table as the primary view.
- Search, filters, sorting and grouping.
- Optional Kanban view.
- Bulk actions only when clearly supported and confirmed.

Mobile:

- Cards or grouped task list.
- Filter sheet.
- Clear assignee and deadline.
- Avoid squeezing all desktop columns into a small screen.

My Tasks and All Tasks must display the same task records.

### 15.4 Plans & Goals

Use a clear hierarchy:

- Goal: intended outcome.
- Plan: approach or work grouping.
- Milestones: checkpoints.
- Tasks: actionable work.

Desktop:

- List or grouped cards with goal, owner, target date and progress.
- Detail page showing milestones and linked tasks.

Mobile:

- Goal cards with concise progress and target date.
- Expandable milestone/task sections.
- Keep progress calculation mode clear if manual and calculated progress both exist.

### 15.5 Calendar

The Calendar module has three separate views:

1. Content & Campaigns.
2. Team Tasks.
3. Meetings & Visits.

Desktop:

- Month/week/day controls where relevant.
- Filters and visible event legend.
- Clear event labels and readable time ranges.
- Selecting an event opens the original record.

Mobile:

- Agenda-first layout.
- Date navigation.
- Day grouping.
- Event cards with time, title, type and linked record.
- Avoid forcing a dense month grid as the default.

Calendar entries must reference source records; do not duplicate tasks, campaigns or meetings.

### 15.6 Campaigns

Desktop:

- List and stage-board views.
- Clear stage, owner, target date and next deadline.
- Campaign detail page with Overview, Stage Workspace, Tasks, Assets and Activity.

Mobile:

- Compact campaign cards.
- Stage shown as a readable label and progress step.
- Detail sections stacked vertically.
- Stage actions easy to find.

Five stages:

1. Initial Idea.
2. Scripting & Planning.
3. Recording & Asset Upload.
4. Editing & Final Asset.
5. Posting & Completion.

Do not make stage progression depend on colour alone. Explain the next stage action.

### 15.7 Assets & Storage

Desktop:

- Searchable asset table or grid.
- File name, type, size, uploader, date and linked records.
- Filters by category and relationship.
- Preview/details panel where useful.

Mobile:

- File cards with file type, name, date and linked campaign.
- Clear upload action.
- Upload progress and error recovery.
- Avoid tiny file controls.

Important distinction:

- Removing an asset-to-campaign link must not delete the stored asset.
- Deleting a file is a separate consequential action.

### 15.8 CRM overview

Provide clear entry points for:

- Tech CRM.
- Real Estate Developers & Partners.
- Real Estate Buyers.

Do not merge different pipelines into one confusing board.

Desktop:

- Pipeline/board and list views as appropriate.
- Search and filters.
- Record detail with interaction timeline and next follow-up.

Mobile:

- Pipeline selection.
- Compact record cards.
- Quick call/contact/follow-up actions where supported.
- Full record detail with clear next action.

### 15.9 Tech CRM

Use the Tech-specific pipeline and fields from `11_CRM_TECH.md`.

Display:

- Organisation/contact.
- Enquiry category.
- Pipeline stage.
- Assigned member.
- Last interaction.
- Next follow-up.

Keep detailed requirements and interaction history inside the record detail page.

### 15.10 Real Estate Partners CRM

Use the partner-specific pipeline and fields from `12_CRM_REAL_ESTATE_PARTNERS.md`.

Display:

- Developer/partner name.
- Partner type.
- Relevant projects.
- Stage.
- Assigned member.
- Last interaction and next follow-up.

Allow one developer to be linked to multiple projects/campaigns where the data model supports it.

### 15.11 Real Estate Buyers CRM

Use the buyer-specific pipeline and fields from `13_CRM_REAL_ESTATE_BUYERS.md`.

Display:

- Buyer name and permitted contact details.
- Requirement summary.
- Budget range where supplied.
- Preferred locality/property configuration.
- Stage.
- Assigned member.
- Next follow-up/site visit.

Do not force users to open every record to see the next required action.

### 15.12 Meetings

Desktop:

- Meeting list with date, time, type, participants and linked record.
- Meeting detail with Overview, Agenda, Preparation, Notes, Decisions, Action Items, Attachments and Follow-up.

Mobile:

- Upcoming meetings list.
- Clear time/location/link.
- Meeting detail sections stacked.
- Action items easy to convert into tasks.

A converted action item must retain its meeting relationship and avoid duplicate task creation.

### 15.13 Team

Desktop:

- Member directory table or grid.
- Member detail page with workload and related operational records.

Mobile:

- Member cards with name, workspace and open task count.
- Detail page with assigned tasks, campaigns, meetings and activity.

Initial profiles are dynamic records. Do not hard-code exactly three people into reusable UI.

### 15.14 Settings

Separate:

- Personal settings.
- Workspace settings.

Personal:

- Profile display.
- Theme preference.
- Calendar preferences.
- Notification preferences.
- Other supported user preferences.

Workspace:

- Workspace configuration.
- Task defaults.
- Campaign categories.
- CRM pipeline settings.
- Asset categories.
- Other settings supported by the feature specification.

Do not expose settings that have no working backend behaviour.

---

## 16. Tables, lists and data density

### 16.1 Desktop tables

Use tables when users need to compare multiple records.

Requirements:

- Clear column headings.
- Consistent row height.
- Predictable sort indicators.
- Row hover/selected state without movement.
- Actions in a consistent column or menu.
- Adequate spacing for scanning.
- Sticky header only when it improves long-list usability.
- Pagination or load-more behaviour for large datasets.
- No horizontal overflow unless the table genuinely requires it and provides a clear scroll affordance.

### 16.2 Mobile lists

Use cards or compact rows.

Show only the most useful fields by default:

- Primary title.
- Status.
- Priority or type.
- Deadline/date.
- Assignee or owner.
- One relevant next action.

Put secondary metadata in the detail view. Do not show a desktop table with every column shrunk to unreadable widths.

### 16.3 Sorting and filtering

- Show active filters.
- Provide clear reset/clear action.
- Use familiar labels.
- Avoid filters that have no effect.
- Preserve filters when navigating back where useful.
- Ensure filters apply to the active workspace.
- On mobile, use a clearly labelled filter sheet with an Apply action.

---

## 17. Forms and input behaviour

### 17.1 Standard form layout

- Title and short purpose description.
- Group fields by task or information category.
- Labels above inputs.
- Required marker.
- Helper text only where useful.
- Inline validation.
- Primary Save action.
- Secondary Cancel action.
- Unsaved-change protection where appropriate.

### 17.2 Date and time

- Make date and time distinct and understandable.
- Display the applicable local timezone where ambiguity is possible.
- Preserve planned and actual dates separately.
- Show reschedule history where required.
- Avoid ambiguous date formats; prefer a clear localised format with month name in detail views.

### 17.3 Selectors

- Search long member, workspace or CRM lists.
- Display names and useful distinguishing context.
- Do not rely on colour-only selection.
- Ensure selectors work by keyboard and touch.

### 17.4 File upload

- Clearly show accepted file types and size limits.
- Show selected filename and size.
- Show progress as static text/progress state, not animation.
- Allow retry after failure.
- Preserve existing form values if upload fails.
- Explain whether the file will be linked to a campaign or stored globally.

---

## 18. Interaction states and feedback

Every interactive component must have the appropriate states:

- Default.
- Hover (desktop pointer).
- Focus.
- Selected.
- Pressed.
- Disabled.
- Loading.
- Error.
- Success, where relevant.

No state should depend solely on animation.

### 18.1 Buttons

- Primary: one main action per screen where practical.
- Secondary: useful alternative action.
- Tertiary/ghost: low-emphasis actions.
- Destructive: clearly marked and confirmed.
- Disabled: visibly disabled and not clickable.

Use precise labels. Avoid multiple competing primary buttons.

### 18.2 Toasts and alerts

- Use concise messages.
- Explain what happened.
- Do not disappear before a user can reasonably read them.
- Provide action/retry when appropriate.
- Do not use a toast as the only feedback for a critical or destructive operation.

### 18.3 Dialogs and drawers

- Use dialogs for short confirmations and focused decisions.
- Use drawers for quick inspection or short forms.
- Use full pages for complex records and long forms.
- On mobile, use full-screen presentation when a dialog would be cramped.
- No animated entrance/exit.

### 18.4 Loading

- Use static skeleton shapes or concise loading text.
- No shimmer or pulse.
- Avoid blank pages.
- Preserve the shell while content loads.
- Prevent stale workspace data from appearing under a newly selected workspace.

---

## 19. Accessibility requirements

Target WCAG 2.2 AA where practical.

Requirements:

- Sufficient text and control contrast in both themes.
- Keyboard navigation for all essential actions.
- Visible focus indicators.
- Semantic headings and landmarks.
- Labels for every input.
- Accessible names for icon-only controls.
- Do not use colour as the only status signal.
- Do not rely on hover for essential information.
- Touch targets around 44 × 44 CSS px or larger.
- Logical focus order.
- Dialog focus management.
- Escape closes dismissible dialogs where appropriate.
- Respect browser zoom and text scaling.
- Ensure error messages are associated with relevant fields.
- Ensure charts and complex visual summaries have text equivalents.

---

## 20. Responsive behaviour by feature type

| Feature type | Wide desktop | Laptop | Tablet | Phone |
|---|---|---|---|---|
| Sidebar | Expanded or collapsible | Collapsible | Hidden/collapsed navigation | Bottom nav + More |
| Dashboard | Multi-column widgets | Two-column or stacked | Two-column where space permits | Single-column |
| Task table | Full table | Reduced columns | Compact list/table | Cards |
| Kanban | Multi-column board | Scrollable board | Stage columns | One stage at a time |
| CRM pipeline | Board and list | Board/list | Compact board | Stage selector + cards |
| Calendar | Month/week/day | Week/agenda | Agenda or compact week | Agenda-first |
| Record detail | Two-column | Two-column/stacked | Stacked | Single-column |
| Form | One/two columns | One/two columns | Single-column | Single-column |
| Asset library | Table/grid | Table/grid | Compact grid/list | File cards |
| Team | Table/grid | Table/grid | Cards/list | Cards |
| Settings | Two-column sections | Two-column/stacked | Stacked | Single-column |

---

## 21. Performance and implementation considerations

- Keep route-level code split where useful.
- Avoid loading every module's data on initial app launch.
- Fetch data when the relevant route or widget needs it.
- Use pagination for large lists.
- Debounce search requests appropriately, without delaying visible user feedback unnecessarily.
- Avoid unnecessary rerenders.
- Use image thumbnails and lazy loading for large asset collections.
- Do not download full-resolution assets merely to render a list thumbnail.
- Preserve form state during recoverable network failures.
- Show network/API errors clearly.
- Do not display stale records from a previous workspace after a workspace switch.
- Use responsive CSS rather than separate duplicated desktop/mobile implementations where practical.
- Keep shared components accessible and theme-aware.

---

## 22. Design token and component implementation contract

The implementation should centralise design decisions.

Suggested frontend structure:

```text
apps/web/src/
├── app/
│   ├── router/
│   ├── providers/
│   └── layout/
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── data-display/
│   ├── forms/
│   ├── feedback/
│   └── overlays/
├── features/
│   ├── dashboard/
│   ├── tasks/
│   ├── plans-goals/
│   ├── calendar/
│   ├── campaigns/
│   ├── assets/
│   ├── crm/
│   ├── meetings/
│   ├── team/
│   └── settings/
├── hooks/
├── lib/
├── styles/
│   ├── tokens.css
│   ├── themes.css
│   └── globals.css
└── types/
```

This is a suggested organisation; align it with the actual repository and TRD.

### 22.1 Shared components

Build and reuse:

- AppShell
- DesktopSidebar
- MobileBottomNavigation
- TopBar
- WorkspaceSwitcher
- ProfileSwitcher
- ThemeSwitcher
- PageHeader
- Breadcrumbs
- PrimaryAction
- SearchInput
- FilterBar
- FilterSheet
- DataTable
- ResponsiveRecordList
- StatusBadge
- PriorityIndicator
- Avatar
- EmptyState
- ErrorState
- LoadingState
- FormField
- FormSection
- ConfirmDialog
- Drawer
- BottomSheet
- Tabs
- ActivityTimeline
- FileUploader
- Pagination
- Toast/Alert

Do not build a separate copy of the same component in each feature.

### 22.2 Component API principles

- Keep props typed.
- Prefer explicit variants over arbitrary style strings.
- Use semantic tokens.
- Support keyboard and touch.
- Keep business logic out of generic UI components.
- Do not create components with dozens of unrelated optional props.
- Avoid premature abstraction; extract components when patterns are genuinely shared.

---

## 23. UI/UX acceptance checklist

Every page must pass this checklist before it is marked complete.

### Visual quality

- [ ] Original professional CRM/business-app appearance.
- [ ] No generic AI-template styling.
- [ ] No decorative gradients, glow or glassmorphism.
- [ ] No decorative animation or motion.
- [ ] Consistent typography, spacing, borders and icons.
- [ ] No fake metrics or invented business records.
- [ ] No unnecessary cards or charts.

### Self-explanatory behaviour

- [ ] Page title makes the location clear.
- [ ] Page description explains the purpose.
- [ ] Primary action is obvious.
- [ ] Button labels explain the outcome.
- [ ] Required fields are marked.
- [ ] Unclear fields have short helper text.
- [ ] Empty states explain what belongs here and what to do next.
- [ ] Errors explain what failed and how to recover.
- [ ] Destructive actions explain their consequences.
- [ ] Essential controls do not depend on hover or hidden gestures.

### Responsive quality

- [ ] Tested below 480 px.
- [ ] Tested at 480–767 px.
- [ ] Tested at tablet widths.
- [ ] Tested at laptop widths.
- [ ] Tested at wide desktop widths.
- [ ] No unintended horizontal overflow.
- [ ] Mobile forms are single-column and usable.
- [ ] Tables adapt to mobile.
- [ ] Bottom navigation does not cover content.
- [ ] On-screen keyboard does not hide important controls.
- [ ] Android safe areas are respected.

### Theme quality

- [ ] Light theme complete.
- [ ] Dark theme complete.
- [ ] Theme preference persists.
- [ ] No unreadable text or controls.
- [ ] Dialogs, dropdowns and overlays match the selected theme.
- [ ] Charts and status indicators remain clear in both themes.

### Accessibility and reliability

- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Inputs have labels.
- [ ] Icon-only buttons have accessible names.
- [ ] Touch targets are practical.
- [ ] Loading, empty, error and success states exist.
- [ ] Actions provide honest feedback.
- [ ] No dead buttons or links.

---

## 24. Required usability review before release

Run a first-time usability test with a person who has not participated in building CORVIIN HUB.

Ask them to complete these tasks without coaching:

1. Select a profile.
2. Switch to the other workspace.
3. Find a task assigned to them.
4. Create a task and assign it to another member.
5. Find a buyer enquiry and add a follow-up.
6. Schedule a meeting.
7. Open a campaign and locate its assets.
8. Switch between light and dark themes.
9. Return to the dashboard.

Record:

- Where they hesitate.
- Labels they misunderstand.
- Actions they cannot find.
- Fields they do not understand.
- Mistakes they make.
- Whether they can recover without help.

Fix the interface and repeat the test. Do not solve usability problems by writing a longer training guide.

This test does not replace technical, accessibility or security testing.

---

## 25. Master UI/UX implementation prompt for AI coding agents

Use this prompt before building the shell or changing shared UI. For every feature, also read that feature's individual Markdown specification.

```text
You are the senior product designer and frontend engineer responsible for CORVIIN HUB.

MANDATORY REFERENCES:
- docs/PRD.md
- docs/TRD.md
- docs/UPDATED_FEATURE_SCOPE.md
- docs/WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
- docs/CORVIIN_HUB_UI_UX_SPECIFICATION.md
- docs/features/00_PRODUCT_UI_UX_DESIGN_SYSTEM.md
- the relevant individual feature specification under docs/features/
- docs/implementation/CORVIIN_HUB_BUILD_PHASES.md

PRODUCT:
CORVIIN HUB is one internal operations product for Corviin Tech and Corviin Real Estate. It must run on PC web, tablet, mobile web and Android APK using one shared React frontend.

DESIGN REFERENCE:
Use this Pinterest CRM search as broad visual inspiration:
https://in.pinterest.com/search/pins/?q=crm%20design&rs=ac&len=3&source_id=ac_yFpq0CUQ&eq=crm&etslf=5392

Do not copy a specific design. Create an original, consistent CORVIIN HUB interface.

ABSOLUTE VISUAL RULES:
- No animation or decorative motion.
- No page transitions, animated counters, shimmer, parallax, hover transforms, animated backgrounds or spring effects.
- No generic AI-generated SaaS template appearance.
- No default purple/blue/pink gradients, glow, glassmorphism, neon, decorative 3D blobs or floating elements.
- No fake analytics, fake metrics or meaningless charts.
- No emoji as the primary icon system.
- Use a consistent professional icon library.
- Use clean typography, consistent spacing, subtle borders and restrained semantic colour.

THEMES:
Implement both Light and Dark themes as complete visual systems. Do not invert one theme to create the other. Use semantic design tokens for backgrounds, surfaces, text, borders, accent and status. Persist the selected theme. Test every page, overlay, form, table, calendar and component in both themes.

RESPONSIVE TARGETS:
- Compact mobile: below 480 px.
- Large mobile: 480–767 px.
- Tablet: 768–1023 px.
- Desktop: 1024–1439 px.
- Wide desktop: 1440 px and above.

DESKTOP:
- Collapsible left sidebar.
- Consistent top bar.
- Efficient tables and filters.
- Useful multi-column detail pages.
- Clear primary action.
- Readable information density.

MOBILE:
- Bottom navigation: Home, Tasks, Calendar, CRM, More.
- More contains Campaigns, Plans & Goals, Meetings, Assets, Team and Settings.
- Cards and compact lists instead of squeezed desktop tables.
- Agenda-first calendar.
- Single-column forms.
- Touch targets around 44 CSS px or larger.
- Respect Android safe areas and keyboard behaviour.
- No essential horizontal scrolling.

SELF-EXPLANATORY UX:
Assume the user has never seen this application and will receive no training.
- Every page needs a clear title and short purpose description.
- Every action must have a precise label.
- Required fields must be marked.
- Unclear fields need short helper text.
- Empty states must explain what belongs here and provide the next action.
- Errors must explain what failed and how to recover.
- Confirmations must explain the consequence.
- Do not rely on hover-only actions, hidden gestures or undocumented shortcuts.
- Use familiar business language, not technical implementation terms.

IMPLEMENTATION:
1. Inspect the current code before editing.
2. Reuse the shared design system.
3. Do not rewrite unrelated features.
4. Build reusable responsive components.
5. Keep business rules out of generic UI components.
6. Use real API data where available. Clearly label any demo data.
7. Implement loading, empty, error, success and disabled states.
8. Ensure all controls work; do not create decorative fake buttons.
9. Test at mobile, tablet, laptop and wide desktop widths.
10. Test both themes.
11. Run lint, typecheck, tests and build.
12. Update the implementation status documentation.

Before calling the UI complete, provide a checklist of responsive, theme, accessibility and first-time-usability tests performed. Report any unmet requirement honestly.
```

---

## 26. Definition of UI/UX done

The CORVIIN HUB interface is ready for release only when:

- [ ] All modules follow one shared design system.
- [ ] PC, tablet and phone layouts are deliberately designed.
- [ ] The same React frontend supports web and Android.
- [ ] Light and dark themes are complete.
- [ ] No decorative animation or motion exists.
- [ ] The interface does not look like a generic AI-generated template.
- [ ] Navigation is predictable.
- [ ] Every page is self-explanatory.
- [ ] Forms, statuses and actions use clear language.
- [ ] Empty and error states guide the next action.
- [ ] Data tables adapt to small screens.
- [ ] Accessibility requirements are checked.
- [ ] First-time usability testing has been completed.
- [ ] No fake data or non-functional controls remain.
- [ ] The actual feature workflows work, not just their screens.

**Final design rule:** CORVIIN HUB should feel obvious to use. A member should not need to ask where to click, what a field means, where a record went or what happens next. The interface—not a training session—must answer those questions.
