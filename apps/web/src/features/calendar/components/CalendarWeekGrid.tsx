import React from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import { CalendarItemBadge } from './CalendarItemBadge';
import { Avatar } from '@/components/ui/Avatar';
import { useProfiles } from '@/hooks/useProfiles';

interface CalendarWeekGridProps {
  currentDate: Date;
  items: CalendarItemDto[];
  onSelectItem: (item: CalendarItemDto) => void;
}

export function CalendarWeekGrid({
  currentDate,
  items,
  onSelectItem,
}: CalendarWeekGridProps) {
  const { data: profiles = [] } = useProfiles();

  const getProfileName = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    return prof?.displayName || 'Unassigned';
  };

  // Get Monday of current week
  const curr = new Date(currentDate);
  const day = curr.getDay();
  const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(curr.setDate(diffToMonday));

  const weekDays: Array<{ date: Date; dateLabel: string; isToday: boolean; items: CalendarItemDto[] }> = [];
  const today = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const dayItems = items.filter((item) => isSameDay(new Date(item.plannedDate), d));

    weekDays.push({
      date: d,
      dateLabel: d.toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
      isToday: isSameDay(d, today),
      items: dayItems,
    });
  }

  return (
    <div className="border border-ch-border rounded-card bg-surface overflow-hidden">
      <div className="grid grid-cols-7 divide-x divide-ch-border">
        {weekDays.map((col, idx) => (
          <div key={idx} className="min-h-[350px] flex flex-col bg-surface">
            {/* Day Header */}
            <div
              className={`p-2 border-b border-ch-border text-center select-none ${
                col.isToday ? 'bg-accent/10 text-accent font-bold' : 'bg-canvas text-ch-text-secondary font-semibold'
              }`}
            >
              <div className="text-xs uppercase">{col.dateLabel}</div>
              <div className="text-[10px] text-ch-text-muted mt-0.5">{col.items.length} items</div>
            </div>

            {/* Event Items */}
            <div className="p-2 space-y-2 flex-1 overflow-y-auto">
              {col.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`p-2 rounded border bg-surface cursor-pointer hover:border-ch-border-strong text-xs space-y-1 ${
                    item.isOverdue
                      ? 'border-danger/40 bg-danger/5'
                      : 'border-ch-border'
                  }`}
                >
                  <CalendarItemBadge item={item} compact />
                  <div className="font-semibold text-ch-text-primary line-clamp-2 leading-tight">
                    {item.title}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-ch-text-muted pt-1">
                    <span className="truncate max-w-[80px]">{getProfileName(item.ownerId)}</span>
                    <span>
                      {new Date(item.plannedDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {col.items.length === 0 && (
                <div className="text-[11px] text-ch-text-muted text-center pt-8">
                  No items
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

