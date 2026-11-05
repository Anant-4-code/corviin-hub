import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function DashboardPage() {
  return (
    <ModulePlaceholder
      title="Dashboard"
      description="Real-time operational summary of tasks, campaigns, meetings, and key metrics for the active workspace."
      plannedSections={[
        {
          title: "Today's Work & Deadlines",
          description: "Tasks scheduled for today, items due soon, and overdue work grouped by assignee.",
        },
        {
          title: "Active Campaigns & Content Pipeline",
          description: "High-level stage tracking for active campaigns in this workspace across Idea, Script, Record, Edit, and Post.",
        },
        {
          title: "Upcoming Meetings & Site Visits",
          description: "Scheduled client interactions, internal syncs, and real estate site visits.",
        },
        {
          title: "Active Plans & Key Goals",
          description: "Progress rollups towards quarterly objectives, strategic plans, and milestone health.",
        },
        {
          title: "Recent Operational Activity",
          description: "Chronological audit feed of recent updates, task completions, and pipeline stage changes.",
        },
      ]}
    />
  );
}
