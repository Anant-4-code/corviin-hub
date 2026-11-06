import React from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { CalendarItemBadge } from './CalendarItemBadge';
import { useProfiles } from '@/hooks/useProfiles';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Plus,
  Megaphone,
  Film,
  CheckSquare,
} from 'lucide-react';

interface CalendarEventDrawerProps {
  item: CalendarItemDto | null;
  open: boolean;
  onClose: () => void;
  onOpenReschedule: (item: CalendarItemDto) => void;
  onOpenMarkPublished: (item: CalendarItemDto) => void;
  onOpenCreateTask: (item: CalendarItemDto) => void;
}

export function CalendarEventDrawer({
  item,
  open,
  onClose,
  onOpenReschedule,
  onOpenMarkPublished,
  onOpenCreateTask,
}: CalendarEventDrawerProps) {
  const { data: profiles = [] } = useProfiles();

  if (!item) return null;

  const getProfileName = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    return prof?.displayName || 'Unassigned';
  };

  return (
    <Drawer open={open} onClose={onClose} title="Production Event Details">
      <div className="space-y-6">
        {/* Header Badges */}
        <div className="space-y-2 border-b border-ch-border pb-4">
          <CalendarItemBadge item={item} />
          <h2 className="text-lg font-bold text-ch-text-primary leading-tight">
            {item.title}
          </h2>
          {item.campaignTitle && (
            <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
              <Megaphone size={13} />
              <span>Campaign: {item.campaignTitle}</span>
            </div>
          )}
        </div>

        {/* Section 1: Planned vs Actual Timestamps */}
        <div className="bg-canvas border border-ch-border rounded-card p-3.5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ch-text-secondary">
            Schedule & Execution Timestamps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-ch-text-muted flex items-center gap-1">
                <Clock size={12} />
                <span>Planned Production Date:</span>
              </span>
              <div className="font-semibold text-ch-text-primary">
                {new Date(item.plannedDate).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-ch-text-muted flex items-center gap-1">
                <CheckCircle2 size={12} className={item.actualDate ? 'text-success' : 'text-ch-text-muted'} />
                <span>Actual Execution / Publication:</span>
              </span>
              <div
                className={`font-semibold ${item.actualDate ? 'text-success' : 'text-ch-text-muted italic'
                  }`}
              >
                {item.actualDate
                  ? new Date(item.actualDate).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                  : 'Pending completion'}
              </div>
            </div>
          </div>

          {item.isOverdue && (
            <div className="mt-2 p-2 bg-danger/10 border border-danger/30 rounded text-xs text-danger flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                This scheduled milestone is past its target date and has not been marked completed.
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Metadata Breakdown */}
        <div className="grid grid-cols-2 gap-4 text-xs border-b border-ch-border pb-4">
          <div>
            <span className="text-ch-text-secondary font-medium">Assigned Owner:</span>
            <div className="flex items-center gap-2 mt-1">
              <Avatar name={getProfileName(item.ownerId)} size="xs" />
              <span className="font-semibold text-ch-text-primary">
                {getProfileName(item.ownerId)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-ch-text-secondary font-medium">Status & Platform:</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border border-ch-border bg-surface">
                {item.status}
              </span>
              {item.platform && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-canvas border border-ch-border">
                  {item.platform}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Live Public URL */}
        {item.publicUrl && (
          <div className="p-3 bg-surface border border-success/30 rounded-card space-y-1.5">
            <span className="text-xs font-semibold text-success flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Live Content Link</span>
            </span>
            <div className="flex items-center justify-between gap-2">
              <a
                href={item.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent underline break-all hover:text-accent/80 font-mono"
              >
                {item.publicUrl}
              </a>
              <a
                href={item.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded border border-ch-border hover:bg-surface-muted text-ch-text-secondary hover:text-ch-text-primary shrink-0"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}

        {/* Section 4: Notes / Description */}
        {item.description && (
          <div className="space-y-1.5 border-b border-ch-border pb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ch-text-secondary">
              Production Notes & Brief
            </h4>
            <p className="text-xs text-ch-text-secondary leading-relaxed bg-canvas p-3 rounded border border-ch-border">
              {item.description}
            </p>
          </div>
        )}

        {/* Section 5: Reschedule History */}
        {item.hasRescheduleHistory && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-warning flex items-center gap-1">
              <RotateCcw size={12} />
              <span>Reschedule Audit Trail ({item.rescheduleCount} changes)</span>
            </h4>
            <div className="text-xs text-ch-text-secondary bg-canvas p-2.5 rounded border border-ch-border space-y-1">
              <div>Schedule changes are permanently recorded with timestamp and reason.</div>
            </div>
          </div>
        )}

        {/* Drawer Actions */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-ch-border">
          <div className="flex items-center gap-2">
            {item.sourceType === 'CONTENT_MILESTONE' && item.status !== 'PUBLISHED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenMarkPublished(item)}
                className="text-xs h-9 bg-success hover:bg-success/90 text-white font-medium gap-1"
              >
                <CheckCircle2 size={13} />
                <span>Mark Published</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenReschedule(item)}
              className="text-xs h-9 gap-1 font-medium"
            >
              <RotateCcw size={12} />
              <span>Reschedule</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenCreateTask(item)}
              className="text-xs h-9 gap-1 font-medium"
            >
              <CheckSquare size={13} />
              <span>Create Linked Task</span>
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-9">
            Close
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
