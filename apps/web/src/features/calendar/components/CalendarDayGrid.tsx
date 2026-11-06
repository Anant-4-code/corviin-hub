import React from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import { CalendarItemBadge } from './CalendarItemBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useProfiles } from '@/hooks/useProfiles';
import { Clock, RotateCcw, CheckCircle2, ExternalLink } from 'lucide-react';

interface CalendarDayGridProps {
  currentDate: Date;
  items: CalendarItemDto[];
  onSelectItem: (item: CalendarItemDto) => void;
  onReschedule: (item: CalendarItemDto) => void;
  onMarkPublished: (item: CalendarItemDto) => void;
}

export function CalendarDayGrid({
  currentDate,
  items,
  onSelectItem,
  onReschedule,
  onMarkPublished,
}: CalendarDayGridProps) {
  const { data: profiles = [] } = useProfiles();

  const getProfileName = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    return prof?.displayName || 'Unassigned';
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const dayItems = items.filter((item) => isSameDay(new Date(item.plannedDate), currentDate));

  return (
    <div className="border border-ch-border rounded-card bg-surface p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-ch-border pb-3">
        <div>
          <h3 className="text-base font-bold text-ch-text-primary">
            {currentDate.toLocaleDateString([], {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <p className="text-xs text-ch-text-secondary mt-0.5">
            {dayItems.length} {dayItems.length === 1 ? 'production item' : 'production items'} scheduled for this day
          </p>
        </div>
      </div>

      {dayItems.length === 0 ? (
        <div className="text-center py-12 text-ch-text-muted text-xs">
          No items scheduled for this date.
        </div>
      ) : (
        <div className="space-y-3">
          {dayItems.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-ch-border rounded-card bg-canvas flex items-start justify-between gap-3"
            >
              <div
                onClick={() => onSelectItem(item)}
                className="cursor-pointer space-y-1.5 flex-1"
              >
                <CalendarItemBadge item={item} />
                <h4 className="text-sm font-bold text-ch-text-primary">{item.title}</h4>
                {item.campaignTitle && (
                  <div className="text-xs text-accent font-medium">
                    Campaign: {item.campaignTitle}
                  </div>
                )}
                {item.description && (
                  <p className="text-xs text-ch-text-secondary line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-ch-text-muted pt-1">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={getProfileName(item.ownerId)} size="xs" />
                    <span>{getProfileName(item.ownerId)}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>
                      {new Date(item.plannedDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.sourceType === 'CONTENT_MILESTONE' && item.status !== 'PUBLISHED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkPublished(item)}
                    className="text-xs h-7 text-success border-success/30 font-medium"
                  >
                    <CheckCircle2 size={12} className="mr-1" />
                    <span>Publish</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule(item)}
                  className="text-xs h-7 text-ch-text-secondary"
                >
                  <RotateCcw size={11} className="mr-1" />
                  <span>Reschedule</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

