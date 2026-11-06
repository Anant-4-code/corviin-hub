import { TechCrmMetrics, RealEstateCrmMetrics } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import {
  Users,
  Target,
  FileSpreadsheet,
  Building2,
  CalendarCheck2,
  Clock,
  Sparkles,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface CrmMetricsCardsProps {
  workspaceType: 'TECH' | 'REAL_ESTATE';
  techMetrics?: TechCrmMetrics;
  realEstateMetrics?: RealEstateCrmMetrics;
}

export function CrmMetricsCards({
  workspaceType,
  techMetrics,
  realEstateMetrics,
}: CrmMetricsCardsProps) {
  if (workspaceType === 'TECH' && techMetrics) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Open Enquiries</span>
            <Users size={14} className="text-primary" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-ch-text-primary">{techMetrics.openEnquiriesCount}</span>
            <span className="text-[11px] text-ch-text-muted">leads</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Qualified Leads</span>
            <Target size={14} className="text-info" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-info">{techMetrics.qualifiedLeadsCount}</span>
            <span className="text-[11px] text-ch-text-muted">in discussion</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Proposals Out</span>
            <FileSpreadsheet size={14} className="text-warning" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-warning">{techMetrics.proposalsOutCount}</span>
            <span className="text-[11px] text-ch-text-muted">pending quote</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Active Clients</span>
            <CheckCircle2 size={14} className="text-success" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-success">{techMetrics.activeClientsCount}</span>
            <span className="text-[11px] text-ch-text-muted">retainers</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Follow-ups Due</span>
            <Clock size={14} className={techMetrics.overdueFollowUpsCount > 0 ? 'text-danger' : 'text-primary'} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-ch-text-primary">{techMetrics.pendingFollowUpsCount}</span>
            {techMetrics.overdueFollowUpsCount > 0 && (
              <span className="text-[11px] font-semibold text-danger">({techMetrics.overdueFollowUpsCount} overdue)</span>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (workspaceType === 'REAL_ESTATE' && realEstateMetrics) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Developers & Lands</span>
            <Building2 size={14} className="text-primary" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-ch-text-primary">{realEstateMetrics.activeDevelopersCount}</span>
            <span className="text-[11px] text-ch-text-muted">partners</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Active Buyers</span>
            <Home size={14} className="text-info" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-info">{realEstateMetrics.activeBuyersCount}</span>
            <span className="text-[11px] text-ch-text-muted">prospects</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Site Visits Pending</span>
            <CalendarCheck2 size={14} className="text-warning" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-warning">{realEstateMetrics.siteVisitsPendingCount}</span>
            <span className="text-[11px] text-ch-text-muted">walkthroughs</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Channel Partners</span>
            <Users size={14} className="text-success" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-success">{realEstateMetrics.channelPartnersCount}</span>
            <span className="text-[11px] text-ch-text-muted">brokers</span>
          </div>
        </Card>

        <Card className="p-3 border border-ch-border bg-surface col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ch-text-secondary">Follow-ups Due</span>
            <Clock size={14} className={realEstateMetrics.overdueFollowUpsCount > 0 ? 'text-danger' : 'text-primary'} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-ch-text-primary">{realEstateMetrics.pendingFollowUpsCount}</span>
            {realEstateMetrics.overdueFollowUpsCount > 0 && (
              <span className="text-[11px] font-semibold text-danger">({realEstateMetrics.overdueFollowUpsCount} overdue)</span>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return null;
}

