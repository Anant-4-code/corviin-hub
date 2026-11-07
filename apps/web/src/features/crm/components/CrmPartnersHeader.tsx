import React from 'react';
import { Button } from '@/components/ui/Button';

interface CrmPartnersHeaderProps {
  onOpenCreate: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const CrmPartnersHeader: React.FC<CrmPartnersHeaderProps> = ({
  onOpenCreate,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-ch-border">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ch-text-primary tracking-tight">
          Real Estate Partners CRM
        </h1>
        <p className="text-xs sm:text-sm text-ch-text-secondary mt-1">
          Manage developers, builders, channel partners, brokers, and business relationships.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-xs h-9"
        >
          {isRefreshing ? 'Refreshing...' : '🔄 Refresh Data'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreate}
          className="text-xs h-9 font-semibold"
        >
          + Add New Partner
        </Button>
      </div>
    </div>
  );
};

