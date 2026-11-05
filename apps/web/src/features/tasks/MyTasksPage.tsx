import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function MyTasksPage() {
  return (
    <ModulePlaceholder
      title="My Tasks"
      description="Personal operational task queue assigned to the active profile in this workspace."
      plannedSections={[
        {
          title: "In Progress & Active Work Sessions",
          description: "Tasks currently being worked on with active timer sessions, pause, resume, and completion notes.",
        },
        {
          title: "To Do & Upcoming Deadlines",
          description: "Prioritized list of assigned tasks scheduled for action with planned start dates.",
        },
        {
          title: "Blocked & On Hold",
          description: "Tasks waiting on prerequisites, client inputs, or internal reviews with recorded blocker reasons.",
        },
        {
          title: "Recently Completed",
          description: "History of completed tasks with completion timestamps, actual durations, and attached summaries.",
        },
      ]}
    />
  );
}

