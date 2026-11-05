import { ModulePlaceholder } from '@/components/ui/ModulePlaceholder';

export function CrmTechPage() {
  return (
    <ModulePlaceholder
      title="Tech CRM"
      description="Client relationships and enquiry pipeline for Corviin Tech software and automation services."
      breadcrumbs={[
        { label: 'CRM', path: '/app/crm' },
        { label: 'Tech' },
      ]}
      plannedSections={[
        {
          title: "10-Stage Pipeline",
          description: "New Enquiry → Contact Pending → Contacted → Requirement Discussion → Qualified → Proposal/Quotation → Negotiation → Won/Client / Lost / Follow Up Later.",
        },
        {
          title: "Client Accounts & Contacts",
          description: "Enquiry details, tech stack requirements, estimated budgets, and assigned account leads.",
        },
        {
          title: "Interaction Timelines & Mandatory Follow-Ups",
          description: "Chronological log of calls, WhatsApp notes, emails, and pending next follow-up dates.",
        },
      ]}
    />
  );
}

