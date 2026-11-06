import React from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import { CalendarItemBadge } from './CalendarItemBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useProfiles } from '@/hooks/useProfiles';
import {
  Calendar,
  Clock,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Film,
  Megaphone,
  CheckSquare,
} from 'lucide-react';

interface CalendarAgendaViewProps {
  items: CalendarItemDto[];
  onSelectItem: (item: CalendarItemDto) => void;
  onReschedule: (item: CalendarItemDto) => void;
  onMarkPublished: (item: CalendarItemDto) => void;
}

export function CalendarAgendaView({
  items,
  onSelectItem,
  onReschedule,
  onMarkPublished,
}: CalendarAgendaViewProps) {
  const { data: profiles = [] } = useProfiles();

  const getProfileName = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    return prof?.displayName || 'Unassigned';
  };

  if (items.length === 0) {
    return (
      <div className="border border-ch-border rounded-card bg-surface p-12 text-center">
        <Calendar size={24} className="mx-auto text-ch-text-muted mb-3" />
        <h3 className="text-sm font-semibold text-ch-text-primary">No Scheduled Calendar Items</h3>
        <p className="text-xs text-ch-text-secondary mt-1 max-w-sm mx-auto">
          No campaign milestones or content tasks match your current filters. Add a new milestone or adjust filter selections.
        </p>
      </div>
    );
  }

  // Group items by date header (e.g., "Thursday, 5 November 2026")
  const groups: Array<{ dateLabel: string; isToday: boolean; items: CalendarItemDto[] }> = [];
  const today = new Date();
  const todayStr = today.toDateString();

  const dateMap = new Map<string, CalendarItemDto[]>();
  for (const item of items) {
    const d = new Date(item.plannedDate);
    const dateKey = d.toDateString();
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }
    dateMap.get(dateKey)!.push(item);
  }

  dateMap.forEach((dayItems, dateKey) => {
    const d = new Date(dateKey);
    const isToday = dateKey === todayStr;
    const dateLabel = isToday
      ? `Today — ${d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}`
      : d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

    groups.push({ dateLabel, isToday, items: dayItems });
  });

  return (
    <div className="space-y-6">
      {groups.map((group, gIdx) => (
        <div key={gIdx} className="space-y-2">
          {/* Date Group Header */}
          <div className="flex items-center gap-2 px-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                group.isToday ? 'text-accent' : 'text-ch-text-secondary'
              }`}
            >
              {group.dateLabel}
            </span>
            <div className="h-px bg-ch-border flex-1" />
            <span className="text-[11px] font-mono text-ch-text-muted">
              {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Stacked Cards for Date */}
          <div className="space-y-2">
            {group.items.map((item) => {
              const isTask = item.sourceType === 'TASK';
              const isCampaign = item.sourceType === 'CAMPAIGN';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-card border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-ch-border-strong transition-none ${
                    item.isOverdue
                      ? 'border-danger/40 bg-danger/5'
                      : 'border-ch-border'
                  }`}
                >
                  {/* Left Column: Metadata & Badges */}
                  <div
                    onClick={() => onSelectItem(item)}
                    className="flex-1 cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <CalendarItemBadge item={item} />
                      {item.campaignTitle && (
                        <span className="text-[11px] text-ch-text-secondary font-medium truncate max-w-[200px]">
                          • {item.campaignTitle}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-ch-text-primary leading-snug">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-ch-text-secondary line-clamp-1">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-ch-text-muted pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={getProfileName(item.ownerId)} size="xs" />
                        <span className="text-ch-text-primary font-medium">
                          {getProfileName(item.ownerId)}
                        </span>
                      </div>

                      {item.hasRescheduleHistory && (
                        <span className="text-[11px] text-warning flex items-center gap-1">
                          <RotateCcw size={10} />
                          <span>Rescheduled ({item.rescheduleCount}x)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Next Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-ch-border shrink-0">
                    {/* Mark Published if Scheduled Post or not published yet */}
                    {item.sourceType === 'CONTENT_MILESTONE' &&
                      item.status !== 'PUBLISHED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkPublished(item)}
                          className="text-xs h-8 text-success hover:bg-success/10 border-success/30 font-medium"
                        >
                          <CheckCircle2 size={13} className="mr-1" />
                          <span>Mark Published</span>
                        </Button>
                      )}

                    {/* Reschedule Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReschedule(item)}
                      className="text-xs h-8 text-ch-text-secondary font-medium"
                    >
                      <RotateCcw size={12} className="mr-1" />
                      <span>Reschedule</span>
                    </Button>

                    {/* Live link if publicUrl exists */}
                    {item.publicUrl && (
                      <a
                        href={item.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-accent hover:text-accent/80 border border-ch-border rounded-md hover:bg-surface-muted inline-flex items-center justify-center h-8 w-8"
                        title="View Published Post"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

