import React, { useState } from 'react';
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
} from 'lucide-react';
import type { AuditEventItem, AuditEntityType, AuditAction } from '@corviin-hub/shared';
import { AuditEventDetailDrawer } from './AuditEventDetailDrawer';

interface AuditTimelineFeedProps {
  events: AuditEventItem[];
  entityTypeFilter: string;
  onEntityTypeFilterChange: (type: string) => void;
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
      default:
        return 'bg-surface-muted text-secondary border-border';
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
      {/* Timeline Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-secondary">Filter Domain:</label>
          <select
            value={entityTypeFilter}
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

      {/* Feed list */}
      {events.length === 0 ? (
        <div className="p-8 text-center text-xs text-secondary bg-surface border border-border rounded-lg">
          No audit activity records found matching the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:border-brand-teal/30"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded bg-surface-muted border border-border shrink-0 mt-0.5">
                  {getEntityIcon(evt.entityType)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-primary">{evt.entityTitle}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getActionBadgeClass(
                        evt.action,
                      )}`}
                    >
                      {evt.action}
                    </span>
                    <span className="text-[10px] text-tertiary">
                      {new Date(evt.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(evt.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed">{evt.changeSummary}</p>

                  <div className="text-[10px] text-tertiary flex items-center gap-1.5 pt-0.5">
                    <User size={12} className="text-tertiary" />
                    <span>
                      Actor: <strong className="font-semibold text-primary">{evt.actorName}</strong>
                    </span>
                    {evt.reason && (
                      <span className="text-secondary italic">
                        • Reason: "{evt.reason}"
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(evt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover min-h-[38px]"
                >
                  <Eye size={13} className="text-brand-teal" />
                  <span>Inspect Diff</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      <AuditEventDetailDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

