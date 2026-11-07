import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Code, Building2, Home, ArrowRight, Plus } from 'lucide-react';
import { CrmType } from '@corviin-hub/shared';

interface CrmModuleNavigationCardsProps {
  techMetrics?: {
    totalEnquiries: number;
    activeOpportunities: number;
    qualifiedLeads: number;
    convertedClients: number;
  };
  partnerMetrics?: {
    totalPartnerLeads: number;
    activePartnerships: number;
    meetingsPlanned: number;
    followUpsDue: number;
  };
  buyerMetrics?: {
    totalBuyers: number;
    newEnquiries: number;
    upcomingSiteVisits: number;
    convertedBuyers: number;
  };
  onQuickCreate?: (type: CrmType) => void;
}

export function CrmModuleNavigationCards({
  techMetrics = { totalEnquiries: 3, activeOpportunities: 2, qualifiedLeads: 1, convertedClients: 1 },
  partnerMetrics = { totalPartnerLeads: 4, activePartnerships: 2, meetingsPlanned: 1, followUpsDue: 1 },
  buyerMetrics = { totalBuyers: 5, newEnquiries: 2, upcomingSiteVisits: 2, convertedBuyers: 1 },
  onQuickCreate,
}: CrmModuleNavigationCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {/* 1. Tech CRM */}
      <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-border-strong rounded-card shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Code size={18} />
            </div>

            {onQuickCreate && (
              <button
                type="button"
                onClick={() => onQuickCreate(CrmType.TECH_LEAD)}
                className="text-xs font-semibold text-accent hover:opacity-80 flex items-center gap-1 transition-none"
              >
                <Plus size={13} />
                <span>Add Lead</span>
              </button>
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm text-ch-text-primary">Tech CRM</h3>
            <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
              Manage technology enquiries, software development opportunities, and client relationships.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ch-border text-center">
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Enquiries</div>
              <div className="text-xs font-bold text-ch-text-primary">{techMetrics.totalEnquiries}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Active Opps</div>
              <div className="text-xs font-bold text-blue-500">{techMetrics.activeOpportunities}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Qualified</div>
              <div className="text-xs font-bold text-indigo-500">{techMetrics.qualifiedLeads}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Clients Won</div>
              <div className="text-xs font-bold text-emerald-500">{techMetrics.convertedClients}</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-ch-border mt-3 flex items-center justify-between text-xs">
          <span className="text-[11px] text-ch-text-muted font-mono">10-stage pipeline</span>
          <Link
            to="/app/crm/tech"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            <span>Open Tech CRM</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </Card>

      {/* 2. Real Estate Partners CRM */}
      <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-border-strong rounded-card shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Building2 size={18} />
            </div>

            {onQuickCreate && (
              <button
                type="button"
                onClick={() => onQuickCreate(CrmType.RE_PARTNER)}
                className="text-xs font-semibold text-accent hover:opacity-80 flex items-center gap-1 transition-none"
              >
                <Plus size={13} />
                <span>Add Partner</span>
              </button>
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm text-ch-text-primary">Real Estate Partners CRM</h3>
            <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
              Manage developers, builders, landowners, brokers, and channel partner relationships.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ch-border text-center">
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Partner Leads</div>
              <div className="text-xs font-bold text-ch-text-primary">{partnerMetrics.totalPartnerLeads}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Active Partners</div>
              <div className="text-xs font-bold text-amber-500">{partnerMetrics.activePartnerships}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Meetings Planned</div>
              <div className="text-xs font-bold text-purple-500">{partnerMetrics.meetingsPlanned}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Follow-ups Due</div>
              <div className="text-xs font-bold text-danger">{partnerMetrics.followUpsDue}</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-ch-border mt-3 flex items-center justify-between text-xs">
          <span className="text-[11px] text-ch-text-muted font-mono">10-stage pipeline</span>
          <Link
            to="/app/crm/real-estate/partners"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            <span>Open Partners CRM</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </Card>

      {/* 3. Real Estate Buyers CRM */}
      <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-border-strong rounded-card shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Home size={18} />
            </div>

            {onQuickCreate && (
              <button
                type="button"
                onClick={() => onQuickCreate(CrmType.RE_BUYER)}
                className="text-xs font-semibold text-accent hover:opacity-80 flex items-center gap-1 transition-none"
              >
                <Plus size={13} />
                <span>Add Buyer</span>
              </button>
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm text-ch-text-primary">Real Estate Buyers CRM</h3>
            <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
              Manage property enquiries, buyer preferences, site visits, and buyer conversions.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ch-border text-center">
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Total Buyers</div>
              <div className="text-xs font-bold text-ch-text-primary">{buyerMetrics.totalBuyers}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">New Enquiries</div>
              <div className="text-xs font-bold text-blue-500">{buyerMetrics.newEnquiries}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Site Visits</div>
              <div className="text-xs font-bold text-emerald-500">{buyerMetrics.upcomingSiteVisits}</div>
            </div>
            <div className="p-1.5 rounded bg-surface-muted/50 border border-ch-border">
              <div className="text-[10px] text-ch-text-muted">Converted</div>
              <div className="text-xs font-bold text-indigo-500">{buyerMetrics.convertedBuyers}</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-ch-border mt-3 flex items-center justify-between text-xs">
          <span className="text-[11px] text-ch-text-muted font-mono">Site visits & bookings</span>
          <Link
            to="/app/crm/real-estate/buyers"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            <span>Open Buyers CRM</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </Card>
    </div>
  );
}

