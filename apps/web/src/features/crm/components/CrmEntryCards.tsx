import { Link } from 'react-router-dom';
import { CrmType } from '@corviin-hub/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Code,
  Users,
  Building2,
  Home,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface CrmEntryCardsProps {
  workspaceType: 'TECH' | 'REAL_ESTATE';
  onQuickCreate: (type: CrmType) => void;
}

export function CrmEntryCards({ workspaceType, onQuickCreate }: CrmEntryCardsProps) {
  if (workspaceType === 'TECH') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Tech Enquiries / Leads */}
        <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-text-secondary">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded bg-primary/10 text-primary border border-primary/20">
                <Code size={18} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickCreate(CrmType.TECH_LEAD)}
                className="text-xs text-primary gap-1"
                title="Add Tech Enquiry"
              >
                <Plus size={13} />
                <span>Add Lead</span>
              </Button>
            </div>
            <div>
              <h3 className="font-bold text-sm text-ch-text-primary">Enquiries & Tech Leads</h3>
              <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
                Software development, web apps, API architecture, and automation enquiries from initial touch to quotation.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-ch-border/50 flex items-center justify-between">
            <span className="text-[11px] text-ch-text-muted">10-stage pipeline</span>
            <Link
              to="/app/crm/tech"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Open Pipeline</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </Card>

        {/* 2. Tech Clients */}
        <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-text-secondary">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded bg-success/10 text-success border border-success/20">
                <ShieldCheck size={18} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickCreate(CrmType.TECH_CLIENT)}
                className="text-xs text-success gap-1"
                title="Add Client Account"
              >
                <Plus size={13} />
                <span>Add Client</span>
              </Button>
            </div>
            <div>
              <h3 className="font-bold text-sm text-ch-text-primary">Clients & Retainers</h3>
              <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
                Active commercial contracts, recurring monthly retainers, client stakeholder contacts, and ongoing deliveries.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-ch-border/50 flex items-center justify-between">
            <span className="text-[11px] text-ch-text-muted">Accounts & SLAs</span>
            <Link
              to="/app/crm/tech"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>View Accounts</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </Card>

        {/* 3. Tech Partners */}
        <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-text-secondary">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Users size={18} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickCreate(CrmType.TECH_PARTNER)}
                className="text-xs text-purple-500 gap-1"
                title="Add Tech Partner"
              >
                <Plus size={13} />
                <span>Add Partner</span>
              </Button>
            </div>
            <div>
              <h3 className="font-bold text-sm text-ch-text-primary">Technology Partners</h3>
              <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
                DevOps consultancies, cloud providers, specialized subcontract agencies, and referral alliance partners.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-ch-border/50 flex items-center justify-between">
            <span className="text-[11px] text-ch-text-muted">Alliance Directory</span>
            <Link
              to="/app/crm/tech"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>View Partners</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Real Estate Workspace
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* 1. Real Estate Developers & Partners */}
      <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-text-secondary">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-primary/10 text-primary border border-primary/20">
              <Building2 size={18} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onQuickCreate(CrmType.RE_PARTNER)}
              className="text-xs text-primary gap-1"
              title="Add Developer / Partner"
            >
              <Plus size={13} />
              <span>Add Partner / Developer</span>
            </Button>
          </div>
          <div>
            <h3 className="font-bold text-sm text-ch-text-primary">Developers & Partners CRM</h3>
            <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
              Real estate developers, land parcel owners, joint venture opportunities, master mandates, and channel broker networks.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-ch-border/50 flex items-center justify-between">
          <span className="text-[11px] text-ch-text-muted">Mandates & Land JVs</span>
          <Link
            to="/app/crm/real-estate/partners"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Open Partners Pipeline</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </Card>

      {/* 2. Buyers & Property Customers */}
      <Card className="p-4 border border-ch-border bg-surface flex flex-col justify-between group hover:border-ch-text-secondary">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-info/10 text-info border border-info/20">
              <Home size={18} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onQuickCreate(CrmType.RE_BUYER)}
              className="text-xs text-info gap-1"
              title="Add Buyer Lead"
            >
              <Plus size={13} />
              <span>Add Buyer Enquiry</span>
            </Button>
          </div>
          <div>
            <h3 className="font-bold text-sm text-ch-text-primary">Buyers & Property Customers CRM</h3>
            <p className="text-xs text-ch-text-secondary mt-1 leading-relaxed">
              HNI luxury buyers, flat enquiries, budget matching, chauffeur site walkthroughs, and unit booking conversion workflows.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-ch-border/50 flex items-center justify-between">
          <span className="text-[11px] text-ch-text-muted">Site Visits & Bookings</span>
          <Link
            to="/app/crm/real-estate/buyers"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Open Buyers Pipeline</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </Card>
    </div>
  );
}

