import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function AllTasksPage() {
  return (
    <ModulePlaceholder
      title="All Tasks"
      description="Central workspace task registry with list, Kanban, and member workload views."
      plannedSections={[
        {
          title: "Multi-View Task Board (List, Table, Kanban)",
          description: "Full task register across all assignees with sorting, priority filtering, and status grouping.",
        },
        {
          title: "Team Workload & Distribution",
          description: "Collapsible member sections showing active task allocations across Anant, Rohit, and Utkarsh.",
        },
        {
          title: "Schedule History & Audit Log",
          description: "Immutable record of deadline adjustments, reschedule reasons, and original vs actual completion dates.",
        },
      ]}
    />
  );
}
