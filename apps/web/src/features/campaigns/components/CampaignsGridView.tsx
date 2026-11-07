import React from 'react';
import { CampaignItem } from '@corviin-hub/shared';
import { CampaignCard } from './CampaignCard';

interface CampaignsGridViewProps {
  campaigns: CampaignItem[];
  getMemberName: (id: string) => string;
}

export function CampaignsGridView({ campaigns, getMemberName }: CampaignsGridViewProps) {
  if (campaigns.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c} getMemberName={getMemberName} />
      ))}
    </div>
  );
}

