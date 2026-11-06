import React from 'react';
import { MeetingVisitCalendarItemDto } from '@corviin-hub/shared';
import { Video, Building2, Calendar, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface MeetingsWeekGridProps {
  currentDate: Date;
  items: MeetingVisitCalendarItemDto[];
  onSelectItem: (item: MeetingVisitCalendarItemDto) => void;
}

export function MeetingsWeekGrid({
  currentDate,
  items,
  onSelectItem,
}: MeetingsWeekGridProps) {
  // Get Monday of current week
  const curr = new Date(currentDate);
  const day = curr.getDay();
  const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(curr.setDate(diffToMonday));

  const weekDays: Array<{
    date: Date;
    dateLabel: string;
    isToday: boolean;
    items: MeetingVisitCalendarItemDto[];
  }> = [];
  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const dayItems = items.filter((item) => isSameDay(new Date(item.startTime), d));

    weekDays.push({
      date: d,
      dateLabel: d.toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
      isToday: isSameDay(d, today),
      items: dayItems,
    });
  }

  const formatShortTime = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="border border-ch-border bg-surface overflow-hidden">
      <div className="grid grid-cols-7 divide-x divide-ch-border">
        {weekDays.map((col, idx) => (
          <div key={idx} className="min-h-[380px] flex flex-col bg-surface">
            {/* Day Header */}
            <div
              className={`p-2 border-b border-ch-border text-center select-none ${
                col.isToday
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'bg-surface-muted/60 text-ch-text-secondary font-semibold'
              }`}
            >
              <div className="text-xs uppercase">{col.dateLabel}</div>
              <div className="text-[10px] text-ch-text-muted mt-0.5">
                {col.items.length} {col.items.length === 1 ? 'event' : 'events'}
              </div>
            </div>

            {/* Event Items */}
            <div className="p-2 space-y-2 flex-1 overflow-y-auto">
              {col.items.map((item) => {
                const isSiteVisit = item.sourceType === 'SITE_VISIT';

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`p-2 border bg-surface cursor-pointer text-xs space-y-1.5 transition-none hover:border-ch-border-hover ${
                      item.isOverdue
                        ? 'border-danger/40 bg-danger/5'
                        : isSiteVisit
                        ? 'border-warning/40 bg-warning/5'
                        : 'border-ch-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-ch-text-muted">
                        {formatShortTime(item.startTime)}
                      </span>
                      {isSiteVisit ? (
                        <span className="text-[10px] text-warning font-semibold flex items-center gap-0.5">
                          <Building2 size={10} /> Visit
                        </span>
                      ) : (
                        <span className="text-[10px] text-info font-medium flex items-center gap-0.5">
                          <Video size={10} /> Meet
                        </span>
                      )}
                    </div>

                    <div className="font-semibold text-ch-text-primary line-clamp-2 leading-tight">
                      {item.title}
                    </div>

                    {isSiteVisit && item.propertyUnit && (
                      <div className="text-[10px] text-ch-text-secondary truncate">
                        {item.propertyUnit}
                      </div>
                    )}

                    {item.location && !isSiteVisit && (
                      <div className="text-[10px] text-ch-text-muted truncate flex items-center gap-1">
                        <MapPin size={9} />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {col.items.length === 0 && (
                <div className="text-[11px] text-ch-text-muted text-center pt-8">
                  No events
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

