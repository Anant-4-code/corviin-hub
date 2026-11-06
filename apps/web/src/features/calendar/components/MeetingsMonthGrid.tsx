import React from 'react';
import { MeetingVisitCalendarItemDto } from '@corviin-hub/shared';
import { Video, Building2, Calendar, Phone, AlertCircle } from 'lucide-react';

interface MeetingsMonthGridProps {
  currentDate: Date;
  items: MeetingVisitCalendarItemDto[];
  onSelectItem: (item: MeetingVisitCalendarItemDto) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MeetingsMonthGrid({
  currentDate,
  items,
  onSelectItem,
}: MeetingsMonthGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const prevMonthDays = new Date(year, month, 0).getDate();
  const days: Array<{
    dayNumber: number;
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
  }> = [];

  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Previous month padding
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    days.push({
      dayNumber: prevMonthDays - i,
      date: d,
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      dayNumber: i,
      date: d,
      isCurrentMonth: true,
      isToday: isSameDay(d, today),
    });
  }

  // Next month padding
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        dayNumber: i,
        date: d,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
      });
    }
  }

  // Group items by date string YYYY-MM-DD
  const itemsByDateStr: Record<string, MeetingVisitCalendarItemDto[]> = {};
  for (const item of items) {
    const d = new Date(item.startTime);
    const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!itemsByDateStr[dateKey]) itemsByDateStr[dateKey] = [];
    itemsByDateStr[dateKey].push(item);
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
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-ch-border bg-surface-muted/60 text-center text-xs font-semibold text-ch-text-secondary py-2">
        {WEEKDAYS.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-ch-border">
        {days.map((cell, idx) => {
          const dateKey = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
          const cellItems = itemsByDateStr[dateKey] || [];
          const visibleItems = cellItems.slice(0, 3);
          const hiddenCount = cellItems.length - 3;

          return (
            <div
              key={idx}
              className={`min-h-[110px] p-1.5 flex flex-col justify-between select-none ${
                cell.isCurrentMonth ? 'bg-surface' : 'bg-surface-muted/30'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center text-xs font-semibold w-5 h-5 ${
                    cell.isToday
                      ? 'bg-primary text-white'
                      : cell.isCurrentMonth
                      ? 'text-ch-text-primary'
                      : 'text-ch-text-muted'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {cellItems.length > 0 && (
                  <span className="text-[10px] text-ch-text-muted font-mono">
                    {cellItems.length}
                  </span>
                )}
              </div>

              {/* Event Chips */}
              <div className="space-y-1 mt-1 flex-1">
                {visibleItems.map((item) => {
                  const isSiteVisit = item.sourceType === 'SITE_VISIT';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectItem(item)}
                      title={`${item.title} (${item.status})`}
                      className={`w-full text-left px-1.5 py-0.5 text-[11px] leading-tight border truncate flex items-center gap-1 transition-none ${
                        item.isOverdue
                          ? 'border-danger/40 bg-danger/10 text-danger font-medium'
                          : isSiteVisit
                          ? 'border-warning/40 bg-warning/10 text-warning font-semibold'
                          : item.meetingUrl
                          ? 'border-info/30 bg-info/10 text-info font-medium'
                          : 'border-ch-border bg-surface text-ch-text-primary hover:border-ch-border-hover'
                      }`}
                    >
                      {isSiteVisit ? (
                        <Building2 size={10} className="shrink-0 text-warning" />
                      ) : item.meetingUrl ? (
                        <Video size={10} className="shrink-0 text-info" />
                      ) : (
                        <Calendar size={10} className="shrink-0 text-ch-text-muted" />
                      )}
                      <span className="text-[10px] opacity-75 shrink-0">
                        {formatShortTime(item.startTime)}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}

                {hiddenCount > 0 && (
                  <div className="text-[10px] text-ch-text-muted font-medium text-center py-0.5">
                    +{hiddenCount} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

