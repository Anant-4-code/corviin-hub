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
    <Drawer
      open={open}
      onClose={onClose}
      title="Production Event Details"
      subtitle={
        item.campaignTitle ? (
          <span className="flex items-center gap-1.5 text-accent font-medium">
            <Megaphone size={12} />
            <span>Campaign: {item.campaignTitle}</span>
          </span>
        ) : (
          'Production Milestone Record'
        )
      }
      size="lg"
      footer={
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {item.sourceType === 'CONTENT_MILESTONE' && item.status !== 'PUBLISHED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenMarkPublished(item)}
                className="bg-success hover:bg-success/90 text-white font-medium gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Mark Published</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenReschedule(item)}
              className="gap-1.5 font-medium"
            >
              <RotateCcw size={13} />
              <span>Reschedule</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenCreateTask(item)}
              className="gap-1.5 font-medium"
            >
              <CheckSquare size={13} />
              <span>Create Linked Task</span>
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onClose} className="self-end sm:self-auto">
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Title and Badge Strip */}
        <div className="border-b border-ch-border pb-4">
          <h2 className="text-lg font-bold text-ch-text-primary leading-tight">
            {item.title}
          </h2>
        </div>

        {/* Status & Category Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-surface-muted/50 rounded-lg border border-ch-border">
          <div className="flex items-center gap-2 flex-wrap">
            <CalendarItemBadge item={item} />
            {item.platform && (
              <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded bg-surface border border-ch-border text-ch-text-secondary font-medium">
                {item.platform}
              </span>
            )}
          </div>
          <div className="text-xs text-ch-text-muted flex items-center gap-1">
            <Clock size={12} />
            <span>Milestone Type: {item.sourceType}</span>
          </div>
        </div>

        {/* Section 1: Planned vs Actual Timestamps */}
        <div className="bg-surface rounded-lg border border-ch-border p-4 sm:p-5 space-y-3.5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ch-text-secondary flex items-center gap-1.5">
            <Calendar size={13} className="text-accent" />
            <span>Schedule & Execution Timestamps</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-surface-muted/40 rounded border border-ch-border/60 space-y-1">
              <span className="text-ch-text-muted flex items-center gap-1 font-medium">
                <Clock size={12} />
                <span>Planned Production Date:</span>
              </span>
              <div className="font-semibold text-sm text-ch-text-primary pt-0.5">
                {new Date(item.plannedDate).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
            </div>

            <div className="p-3 bg-surface-muted/40 rounded border border-ch-border/60 space-y-1">
              <span className="text-ch-text-muted flex items-center gap-1 font-medium">
                <CheckCircle2 size={12} className={item.actualDate ? 'text-success' : 'text-ch-text-muted'} />
                <span>Actual Execution / Publication:</span>
              </span>
              <div
                className={`font-semibold text-sm pt-0.5 ${
                  item.actualDate ? 'text-success' : 'text-ch-text-muted italic'
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
            <div className="p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span className="font-medium">
                This scheduled milestone is past its target date and has not been marked completed.
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Metadata Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-surface p-4 sm:p-5 rounded-lg border border-ch-border">
          <div>
            <span className="text-ch-text-muted font-medium">Assigned Production Owner:</span>
            <div className="flex items-center gap-2.5 mt-2">
              <Avatar name={getProfileName(item.ownerId)} size="sm" />
              <div>
                <span className="font-semibold text-ch-text-primary block text-sm">
                  {getProfileName(item.ownerId)}
                </span>
                <span className="text-[11px] text-ch-text-muted">Primary Operator</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-ch-text-muted font-medium">Execution Status:</span>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex px-2.5 py-1 rounded text-xs font-semibold border border-ch-border bg-surface">
                {item.status}
              </span>
              {item.platform && (
                <span className="text-xs uppercase font-mono px-2 py-1 rounded bg-surface-muted border border-ch-border font-medium">
                  {item.platform}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Live Public URL */}
        {item.publicUrl && (
          <div className="p-4 bg-surface border border-success/30 rounded-lg space-y-2">
            <span className="text-xs font-semibold text-success flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>Live Content Link</span>
            </span>
            <div className="flex items-center justify-between gap-3 p-2.5 bg-surface-muted/50 rounded border border-ch-border">
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
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Section 4: Notes / Description */}
        {item.description && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ch-text-secondary">
              Production Notes & Brief
            </h4>
            <div className="text-xs text-ch-text-primary leading-relaxed bg-surface p-4 rounded-lg border border-ch-border">
              {item.description}
            </div>
          </div>
        )}

        {/* Section 5: Reschedule History */}
        {item.hasRescheduleHistory && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-warning flex items-center gap-1.5">
              <RotateCcw size={13} />
              <span>Reschedule Audit Trail ({item.rescheduleCount} changes)</span>
            </h4>
            <div className="text-xs text-ch-text-secondary bg-surface p-3.5 rounded-lg border border-ch-border space-y-1">
              <div>Schedule changes are permanently recorded in workspace audit logs.</div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
