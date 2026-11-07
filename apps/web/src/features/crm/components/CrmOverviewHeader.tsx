import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  RotateCw,
  Briefcase,
  UserCheck,
  ChevronDown,
  Building2,
  Code,
  Home,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useProfiles } from '@/hooks/useProfiles';
import { CrmType } from '@corviin-hub/shared';
import { cn } from '@/lib/cn';

export type CrmDateRangePreset =
  | 'TODAY'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_QUARTER';

interface CrmOverviewHeaderProps {
  dateRange: CrmDateRangePreset;
  onDateRangeChange: (preset: CrmDateRangePreset) => void;
  onAddNewLead: (type: CrmType) => void;
  onCreateFollowUp: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function CrmOverviewHeader({
  dateRange,
  onDateRangeChange,
  onAddNewLead,
  onCreateFollowUp,
  onRefresh,
  isRefreshing = false,
}: CrmOverviewHeaderProps) {
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const { data: workspaces = [] } = useWorkspaces();
  const { data: profiles = [] } = useProfiles();

  const currentWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);
  const currentProfile = profiles.find((p) => p.id === selectedProfileId);
  const isRealEstate = currentWorkspace?.type === 'REAL_ESTATE' || selectedWorkspaceId?.includes('real');

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ch-border">
      {/* Title & Context Indicators */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-ch-text-primary tracking-tight">
            CRM Overview
          </h1>

          {currentWorkspace && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20">
              <Briefcase size={11} />
              {currentWorkspace.name}
            </span>
          )}

          {currentProfile && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-muted text-ch-text-secondary border border-ch-border">
              <UserCheck size={11} className="text-emerald-500" />
              Acting: {currentProfile.displayName}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-ch-text-secondary mt-1">
          Monitor enquiries, opportunities, customers, partners, and follow-up activities across your workspace.
        </p>
      </div>

      {/* Actions: Date Range, Follow-up, Add Lead, Refresh */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date Range Selector */}
        <div className="flex items-center border border-ch-border rounded-md bg-canvas">
          <span className="pl-2 pr-1 text-ch-text-muted">
            <Calendar size={13} />
          </span>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as CrmDateRangePreset)}
            aria-label="Date Range"
            className="text-xs h-8 py-1 pr-2 bg-transparent text-ch-text-primary font-medium focus:outline-none cursor-pointer border-none"
          >
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_MONTH">Last Month</option>
            <option value="THIS_QUARTER">This Quarter</option>
          </select>
        </div>

        {/* Refresh Data */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="text-xs h-8 px-2.5 font-semibold text-ch-text-secondary hover:text-ch-text-primary"
          title="Refresh CRM Data"
        >
          <RotateCw size={13} className={cn(isRefreshing && 'animate-spin')} />
        </Button>

        {/* Create Follow-up Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateFollowUp}
          className="text-xs h-8 px-2.5 font-semibold flex items-center gap-1.5"
        >
          <Clock size={13} />
          <span className="hidden sm:inline">Create Follow-up</span>
        </Button>

        {/* Add New Lead Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
            className="text-xs h-8 px-3 font-semibold bg-accent text-accent-foreground hover:opacity-90 flex items-center gap-1.5"
          >
            <UserPlus size={14} />
            <span>Add New Lead</span>
            <ChevronDown size={12} className="ml-0.5" />
          </Button>

          {isTypeDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-56 bg-surface border border-ch-border rounded-card shadow-lg z-30 p-1.5 space-y-1 text-xs"
              onClick={() => setIsTypeDropdownOpen(false)}
            >
              {!isRealEstate ? (
                <>
                  <button
                    type="button"
                    onClick={() => onAddNewLead(CrmType.TECH_LEAD)}
                    className="w-full text-left px-2.5 py-2 rounded hover:bg-surface-muted flex items-center gap-2 transition-none"
                  >
                    <Code size={14} className="text-accent" />
                    <div>
                      <div className="font-semibold text-ch-text-primary">Tech Enquiry / Lead</div>
                      <div className="text-[10px] text-ch-text-muted">Software, web, API prospect</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddNewLead(CrmType.TECH_PARTNER)}
                    className="w-full text-left px-2.5 py-2 rounded hover:bg-surface-muted flex items-center gap-2 transition-none"
                  >
                    <Briefcase size={14} className="text-info" />
                    <div>
                      <div className="font-semibold text-ch-text-primary">Technology Partner</div>
                      <div className="text-[10px] text-ch-text-muted">Agency, cloud, or ISV partner</div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onAddNewLead(CrmType.RE_PARTNER)}
                    className="w-full text-left px-2.5 py-2 rounded hover:bg-surface-muted flex items-center gap-2 transition-none"
                  >
                    <Building2 size={14} className="text-accent" />
                    <div>
                      <div className="font-semibold text-ch-text-primary">Developer / Land Partner</div>
                      <div className="text-[10px] text-ch-text-muted">Builder, broker, landowner</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddNewLead(CrmType.RE_BUYER)}
                    className="w-full text-left px-2.5 py-2 rounded hover:bg-surface-muted flex items-center gap-2 transition-none"
                  >
                    <Home size={14} className="text-emerald-500" />
                    <div>
                      <div className="font-semibold text-ch-text-primary">Property Buyer Lead</div>
                      <div className="text-[10px] text-ch-text-muted">Home seeker, investor</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

