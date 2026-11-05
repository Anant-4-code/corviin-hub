import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function CampaignsPage() {
  return (
    <ModulePlaceholder
      title="Campaigns"
      description="Linear 5-stage content creation workflow: Initial Idea → Scripting & Planning → Recording & Upload → Editing & Final Asset → Posting & Completion."
      plannedSections={[
        {
          title: "5-Stage Campaign Pipeline",
          description: "Visual stage progression board for active campaigns in this workspace.",
        },
        {
          title: "Scripting & Creative Briefs",
          description: "Hook development, scene breakdowns, voiceover drafts, and versioned script review histories.",
        },
        {
          title: "Production & Asset Uploads",
          description: "Shot lists, raw media uploads linked to campaigns, editor assignments, and final asset approvals.",
        },
        {
          title: "Publishing Checklist & Live Links",
          description: "Scheduled vs actual publish tracking, public post URLs, and baseline reach metrics.",
        },
      ]}
    />
  );
}

