import { useParams } from 'react-router-dom';
import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();

  return (
    <ModulePlaceholder
      title={`Meeting: ${meetingId ?? 'Detail'}`}
      description="Full meeting workspace: Agenda, Preparation, Discussion Notes, Formal Decisions, and convertible Action Items."
      breadcrumbs={[
        { label: 'Meetings', path: '/app/meetings' },
        { label: meetingId ?? 'Detail' },
      ]}
      plannedSections={[
        {
          title: "Meeting Overview & Participants",
          description: "Date, time, location or conference link, organizer, and participant attendance status.",
        },
        {
          title: "Agenda & Objectives",
          description: "Clear list of topics to cover and target deliverables for the session.",
        },
        {
          title: "Discussion Notes & Decisions",
          description: "Structured minutes, key takeaways, and formally agreed-upon decisions.",
        },
        {
          title: "Action Items & Task Links",
          description: "Action assignments with due dates and bi-directional links to created tasks.",
        },
      ]}
    />
  );
}
