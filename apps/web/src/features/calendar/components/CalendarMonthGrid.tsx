import React from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import {
  Megaphone,
  Film,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface CalendarMonthGridProps {
  currentDate: Date;
  items: CalendarItemDto[];
  onSelectItem: (item: CalendarItemDto) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarMonthGrid({
  currentDate,
  items,
  onSelectItem,
}: CalendarMonthGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month (0: Sun, 1: Mon, ..., 6: Sat)
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust so Monday is 0, Sunday is 6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  // Previous month padding days
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

  // 1. Fill previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    days.push({
      dayNumber: prevMonthDays - i,
      date: d,
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
    });
  }

  // 2. Fill current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      dayNumber: i,
      date: d,
      isCurrentMonth: true,
      isToday: isSameDay(d, today),
    });
  }

  // 3. Fill next month days to complete rows (multiples of 7)
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
  const itemsByDateStr: Record<string, CalendarItemDto[]> = {};
  for (const item of items) {
    const itemDate = new Date(item.plannedDate);
    const dateKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}`;
    if (!itemsByDateStr[dateKey]) itemsByDateStr[dateKey] = [];
    itemsByDateStr[dateKey].push(item);
  }

  return (
    <div className="border border-ch-border rounded-card bg-surface overflow-hidden">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-ch-border bg-canvas text-center text-xs font-semibold text-ch-text-secondary py-2">
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
                cell.isCurrentMonth ? 'bg-surface' : 'bg-surface-muted/50'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center text-xs font-semibold rounded-full w-6 h-6 ${
                    cell.isToday
                      ? 'bg-accent text-accent-foreground'
                      : cell.isCurrentMonth
                      ? 'text-ch-text-primary'
                      : 'text-ch-text-muted'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {cellItems.length > 0 && (
                  <span className="text-[10px] text-ch-text-muted font-mono font-medium">
                    {cellItems.length}
                  </span>
                )}
              </div>

              {/* Event Chips */}
              <div className="space-y-1 mt-1 flex-1">
                {visibleItems.map((item) => {
                  const isTask = item.sourceType === 'TASK';
                  const isCampaign = item.sourceType === 'CAMPAIGN';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectItem(item)}
                      title={`${item.title} (${item.status})`}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[11px] leading-tight border truncate flex items-center gap-1 transition-none ${
                        item.isOverdue
                          ? 'border-danger/30 bg-danger/10 text-danger font-medium'
                          : item.actualDate
                          ? 'border-success/30 bg-success/10 text-success font-medium'
                          : isCampaign
                          ? 'border-accent/40 bg-accent/10 text-accent font-semibold'
                          : isTask
                          ? 'border-info/30 bg-info/5 text-info font-medium'
                          : 'border-ch-border bg-canvas text-ch-text-primary hover:border-ch-border-strong'
                      }`}
                    >
                      {isCampaign ? (
                        <Megaphone size={10} className="shrink-0" />
                      ) : isTask ? (
                        <CheckSquare size={10} className="shrink-0" />
                      ) : (
                        <Film size={10} className="shrink-0" />
                      )}
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

