import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function TeamPage() {
  return (
    <ModulePlaceholder
      title="Team"
      description="Dynamic member directory for Corviin Group, active assignments, and operational workload distribution."
      plannedSections={[
        {
          title: "Member Directory",
          description: "Profiles for Anant, Rohit, Utkarsh, and future team members with active workspace access.",
        },
        {
          title: "Workload Overview",
          description: "Active task counts, upcoming deadlines, owned campaigns, and assigned follow-ups per member.",
        },
        {
          title: "Operational Attribution",
          description: "Clear attribution for Created by, Assigned by, Started by, Rescheduled by, and Completed by.",
        },
      ]}
    />
  );
}
