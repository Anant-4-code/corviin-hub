import React from 'react';
import { CalendarItemDto } from '@corviin-hub/shared';
import {
  Megaphone,
  Film,
  FileText,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface CalendarItemBadgeProps {
  item: CalendarItemDto;
  compact?: boolean;
}

export function CalendarItemBadge({ item, compact = false }: CalendarItemBadgeProps) {
  // Source icon and label
  const getSourceDetails = () => {
    switch (item.sourceType) {
      case 'CAMPAIGN':
        return {
          icon: <Megaphone size={11} className="text-accent shrink-0" />,
          label: 'Campaign Target',
          chipClass: 'border-accent/40 bg-accent/10 text-accent font-semibold',
        };
      case 'TASK':
        return {
          icon: <CheckSquare size={11} className="text-info shrink-0" />,
          label: 'Task',
          chipClass: 'border-info/40 bg-info/10 text-info font-medium',
        };
      case 'CONTENT_MILESTONE':
      default:
        return {
          icon: <Film size={11} className="text-success shrink-0" />,
          label: formatEventType(item.eventType),
          chipClass: 'border-ch-border bg-surface-muted text-ch-text-secondary font-medium',
        };
    }
  };

  const { icon, label, chipClass } = getSourceDetails();

  // Timestamp display: Planned vs Actual
  const plannedTimeStr = new Date(item.plannedDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
      {/* Source Type / Stage Chip */}
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] leading-tight ${chipClass}`}
      >
        {icon}
        <span>{label}</span>
      </span>

      {/* Actual vs Planned explicit distinction */}
      {item.actualDate ? (
        <span className="inline-flex items-center gap-1 text-[10px] text-success font-medium">
          <CheckCircle2 size={11} />
          <span>Actual: {new Date(item.actualDate).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] text-ch-text-muted">
          <Clock size={11} />
          <span>Planned: {plannedTimeStr}</span>
        </span>
      )}

      {/* Overdue Alert */}
      {item.isOverdue && (
        <span className="inline-flex items-center gap-0.5 text-[10px] text-danger font-semibold bg-danger/10 px-1 py-0.2 rounded border border-danger/20">
          <AlertTriangle size={10} />
          <span>Overdue</span>
        </span>
      )}

      {/* Platform Badge if defined */}
      {item.platform && !compact && (
        <span className="text-[9px] uppercase tracking-wider text-ch-text-muted px-1 rounded bg-canvas border border-ch-border font-mono">
          {item.platform}
        </span>
      )}
    </div>
  );
}

export function formatEventType(type: string): string {
  switch (type) {
    case 'TOPIC_RESEARCH':
      return 'Topic Research';
    case 'SCRIPT_WRITING':
      return 'Script Writing';
    case 'SCRIPT_REVIEW':
      return 'Script Review';
    case 'RECORDING':
      return 'Recording';
    case 'EDITING':
      return 'Editing';
    case 'FINAL_APPROVAL':
      return 'Final Approval';
    case 'SCHEDULED_POST':
      return 'Scheduled Post';
    case 'ACTUAL_PUBLISHED_POST':
      return 'Published Post';
    case 'CAMPAIGN_MILESTONE':
      return 'Milestone';
    case 'CAMPAIGN_TASK':
      return 'Campaign Task';
    default:
      return type.replace(/_/g, ' ');
  }
}

