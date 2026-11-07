import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  User,
  CheckSquare,
  Users2,
  Video,
  Megaphone,
  Target,
  FolderOpen,
  Settings,
  Eye,
  ArrowRight,
} from 'lucide-react';
import type { AuditEventItem, AuditEntityType, AuditAction } from '@corviin-hub/shared';
import { AuditEventDetailDrawer } from './AuditEventDetailDrawer';
import { formatRelativeTime, formatExactDateTime } from './notification-constants';

interface AuditTimelineFeedProps {
  events: AuditEventItem[];
  entityTypeFilter?: string;
  onEntityTypeFilterChange?: (type: string) => void;
  isLoading?: boolean;
}

export const AuditTimelineFeed: React.FC<AuditTimelineFeedProps> = ({
  events,
  entityTypeFilter,
  onEntityTypeFilterChange,
  isLoading,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<AuditEventItem | null>(null);

  const getEntityIcon = (type: AuditEntityType) => {
    switch (type) {
      case 'TASK':
        return <CheckSquare size={15} className="text-blue-500" />;
      case 'CRM':
        return <Users2 size={15} className="text-emerald-500" />;
      case 'MEETING':
        return <Video size={15} className="text-purple-500" />;
      case 'CAMPAIGN':
        return <Megaphone size={15} className="text-amber-500" />;
      case 'GOAL':
        return <Target size={15} className="text-rose-500" />;
      case 'ASSET':
        return <FolderOpen size={15} className="text-cyan-500" />;
      case 'SETTINGS':
        return <Settings size={15} className="text-stone-500" />;
      default:
        return <Clock size={15} className="text-brand-teal" />;
    }
  };

  const getActionBadgeClass = (action: AuditAction) => {
    switch (action) {
      case 'CREATED':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'BLOCKED':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'STAGE_CHANGED':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'RESCHEDULED':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'CONVERTED':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-surface-muted text-secondary border-border';
    }
  };

  const getEntityDestination = (evt: AuditEventItem): string | null => {
    switch (evt.entityType) {
      case 'TASK':
        return '/app/tasks';
      case 'CAMPAIGN':
        return `/app/campaigns/${evt.entityId}`;
      case 'MEETING':
        return `/app/meetings/${evt.entityId}`;
      case 'CRM':
        return evt.workspaceId === 'ws-real-0002-0000-000000000002'
          ? '/app/crm/real-estate/partners'
          : '/app/crm/tech';
      case 'GOAL':
        return '/app/goals';
      case 'ASSET':
        return '/app/assets';
      default:
        return null;
    }
  };

  const filterOptions = [
    { id: 'ALL', label: 'All Entities' },
    { id: 'TASK', label: 'Tasks' },
    { id: 'CRM', label: 'CRM Leads & Partners' },
    { id: 'MEETING', label: 'Meetings & Site Visits' },
    { id: 'CAMPAIGN', label: 'Campaigns' },
    { id: 'GOAL', label: 'Plans & Goals' },
    { id: 'SETTINGS', label: 'Settings' },
  ];

  return (
    <div className="space-y-4">
      {/* Optional standalone domain selector for backward compatibility with isolated tests */}
      {onEntityTypeFilterChange && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface border border-border rounded-lg">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-secondary">Filter Domain:</label>
            <select
              value={entityTypeFilter || 'ALL'}
              onChange={(e) => onEntityTypeFilterChange(e.target.value)}
              className="text-xs bg-surface border border-border rounded px-3 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[36px]"
            >
              {filterOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-tertiary">
            Showing {events.length} chronological audit entries
          </div>
        </div>
      )}

      {/* Feed list */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
          Loading workspace activity timeline...
        </div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
          No audit activity records found matching the selected filter.
        </div>
      ) : (
        <div className="relative pl-3 sm:pl-4 space-y-4 before:absolute before:left-1 sm:before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
          {events.map((evt) => {
            const destination = getEntityDestination(evt);
            const relativeTime = formatRelativeTime(evt.timestamp);
            const exactTime = formatExactDateTime(evt.timestamp);

            return (
              <div key={evt.id} className="relative flex items-start gap-3 text-xs">
                {/* Timeline bullet / actor avatar */}
                <div className="w-6 h-6 rounded-full bg-surface border-2 border-brand-teal flex items-center justify-center text-[10px] font-bold text-brand-teal shrink-0 mt-2 z-10">
                  {evt.actorName ? evt.actorName.charAt(0).toUpperCase() : 'S'}
                </div>

                {/* Timeline Card */}
                <div className="flex-1 min-w-0 p-4 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:border-brand-teal/40 transition-none">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="p-2 rounded bg-surface-muted border border-border shrink-0 mt-0.5">
                      {getEntityIcon(evt.entityType)}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-primary break-words">
                          {evt.entityTitle}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${getActionBadgeClass(
                            evt.action,
                          )}`}
                        >
                          {evt.action}
                        </span>

                        <span className="text-[11px] text-tertiary ml-auto sm:ml-0" title={exactTime}>
                          {relativeTime}
                        </span>
                      </div>

                      <p className="text-xs text-secondary leading-relaxed break-words">
                        {evt.changeSummary}
                      </p>

                      <div className="text-[11px] text-tertiary flex items-center gap-2 pt-0.5 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <User size={12} className="text-tertiary" />
                          <span>
                            Actor:{' '}
                            <strong className="font-semibold text-primary">{evt.actorName}</strong>
                          </span>
                        </span>

                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-surface-muted text-secondary border border-border">
                          {evt.entityType}
                        </span>

                        {evt.reason && (
                          <>
                            <span>•</span>
                            <span className="text-secondary italic bg-surface-muted/60 px-1.5 py-0.5 rounded border border-border">
                              Justification: "{evt.reason}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Inspect Diff & Deep Link */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(evt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover min-h-[38px] transition-none cursor-pointer"
                    >
                      <Eye size={13} className="text-brand-teal" />
                      <span>Inspect Diff</span>
                    </button>

                    {destination && (
                      <a
                        href={destination}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded text-secondary hover:text-primary hover:bg-surface-muted min-h-[38px] transition-none"
                        title={`Open in ${evt.entityType}`}
                      >
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Drawer */}
      <AuditEventDetailDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
export default AuditTimelineFeed;
