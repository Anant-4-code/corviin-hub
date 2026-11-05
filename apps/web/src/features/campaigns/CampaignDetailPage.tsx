import { useParams } from 'react-router-dom';
import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  return (
    <ModulePlaceholder
      title={`Campaign: ${campaignId ?? 'Detail'}`}
      description="Deep-dive campaign workspace covering script, stage-specific tasks, linked media assets, and activity history."
      breadcrumbs={[
        { label: 'Campaigns', path: '/app/campaigns' },
        { label: campaignId ?? 'Detail' },
      ]}
      plannedSections={[
        {
          title: "Stage Progress Bar & Overview",
          description: "Active stage indicator with validated forward/backward transitions and audit note requirements.",
        },
        {
          title: "Stage Workspace & Script Editor",
          description: "Content drafting, target platforms, hook notes, and script revisions.",
        },
        {
          title: "Linked Campaign Tasks",
          description: "Actionable tasks created specifically for this campaign in the shared task engine.",
        },
        {
          title: "Campaign Media Assets",
          description: "Raw footage, audio, draft cuts, and approved assets linked to this campaign.",
        },
        {
          title: "Activity & Approval History",
          description: "Immutable log of stage transitions, reviewer comments, and publish timestamps.",
        },
      ]}
    />
  );
}

