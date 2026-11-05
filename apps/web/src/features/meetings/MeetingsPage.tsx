import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function MeetingsPage() {
  return (
    <ModulePlaceholder
      title="Meetings"
      description="Record meetings, capture preparation, document formal decisions, and convert action items into shared tasks."
      plannedSections={[
        {
          title: "Upcoming & Scheduled Meetings",
          description: "Internal team syncs, client briefings, partner negotiations, and buyer consultations.",
        },
        {
          title: "Structured Documentation Engine",
          description: "Meeting records contain Agenda, Objective, Preparation Checklist, Discussion Notes, and Formal Decisions.",
        },
        {
          title: "Action Item to Task Conversion",
          description: "One-click conversion of meeting action items into formal tasks in the shared task engine without duplicating records.",
        },
      ]}
    />
  );
}

