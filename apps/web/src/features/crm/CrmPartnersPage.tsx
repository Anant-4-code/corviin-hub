import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function CrmPartnersPage() {
  return (
    <ModulePlaceholder
      title="Real Estate Partners CRM"
      description="Builder, developer, landowner, and channel partner pipelines for Corviin Real Estate."
      breadcrumbs={[
        { label: 'CRM', path: '/app/crm' },
        { label: 'RE Partners' },
      ]}
      plannedSections={[
        {
          title: "Partner Pipeline",
          description: "New Partner Lead → Initial Contact → Meeting Planned → Requirement Discussion → Proposal Shared → Follow-up/Negotiation → Partnership Confirmed → Active Partner.",
        },
        {
          title: "Multi-Project Relationships",
          description: "Linking one developer/builder to multiple active property developments and marketing campaigns.",
        },
        {
          title: "Commercial Terms & Documentation",
          description: "Service models, commission structures, mandate agreements, and point of contact records.",
        },
      ]}
    />
  );
}
