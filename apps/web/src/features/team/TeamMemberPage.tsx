import { useParams } from 'react-router-dom';
import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function TeamMemberPage() {
  const { memberId } = useParams<{ memberId: string }>();

  return (
    <ModulePlaceholder
      title={`Team Member: ${memberId ?? 'Profile'}`}
      description="Member responsibilities, assigned tasks, active campaign ownership, and recent operational activity."
      breadcrumbs={[
        { label: 'Team', path: '/app/team' },
        { label: memberId ?? 'Profile' },
      ]}
      plannedSections={[
        {
          title: "Member Profile & Workspaces",
          description: "Role, contact info, and active workspace permissions across Tech and Real Estate.",
        },
        {
          title: "Assigned Tasks & Deadlines",
          description: "Current task backlog, in-progress items, and overdue work for this member.",
        },
        {
          title: "Owned Campaigns & Initiatives",
          description: "Campaigns and strategic plans spearheaded by this member.",
        },
      ]}
    />
  );
}
