import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function PlansGoalsPage() {
  return (
    <ModulePlaceholder
      title="Plans & Goals"
      description="Strategic outcomes (Goals), operational approaches (Plans), and target milestones."
      plannedSections={[
        {
          title: "Strategic Goals",
          description: "Measurable business outcomes with target metrics, current metrics, and automatic or manual progress tracking.",
        },
        {
          title: "Execution Plans",
          description: "Operational initiatives grouping milestones and linked actionable tasks.",
        },
        {
          title: "Milestone Tracking & Health",
          description: "Target deadlines, owner assignments, and deliverable dependencies.",
        },
      ]}
    />
  );
}
