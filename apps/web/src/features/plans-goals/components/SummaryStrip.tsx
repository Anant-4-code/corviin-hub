import React from 'react';
import { Card } from '@/components/ui/Card';
import { Target, Compass, AlertTriangle, CalendarClock } from 'lucide-react';

interface SummaryStripProps {
  activeGoals: number;
  activePlans: number;
  atRiskCount: number;
  milestonesDueSoon: number;
}

export function SummaryStrip({
  activeGoals,
  activePlans,
  atRiskCount,
  milestonesDueSoon,
}: SummaryStripProps) {
  const items = [
    {
      title: 'Active Goals',
      count: activeGoals,
      description: 'Strategic outcomes in flight',
      icon: Target,
      color: 'text-accent',
      bgColor: 'bg-accent/10 border-accent/20',
    },
    {
      title: 'Active Plans',
      count: activePlans,
      description: 'Execution strategies underway',
      icon: Compass,
      color: 'text-info',
      bgColor: 'bg-info/10 border-info/20',
    },
    {
      title: 'Items At Risk',
      count: atRiskCount,
      description: 'Requiring immediate intervention',
      icon: AlertTriangle,
      color: 'text-danger',
      bgColor: 'bg-danger/10 border-danger/20',
    },
    {
      title: 'Milestones Due Soon',
      count: milestonesDueSoon,
      description: 'Upcoming checkpoint deadlines',
      icon: CalendarClock,
      color: 'text-warning',
      bgColor: 'bg-warning/10 border-warning/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="p-3.5 border-ch-border flex items-start justify-between gap-3 select-none">
            <div>
              <div className="text-xs font-semibold text-ch-text-secondary uppercase tracking-wider">
                {item.title}
              </div>
              <div className="text-2xl font-bold text-ch-text-primary mt-1">
                {item.count}
              </div>
              <div className="text-[11px] text-ch-text-secondary mt-0.5">
                {item.description}
              </div>
            </div>
            <div className={`p-2 rounded-lg border shrink-0 ${item.bgColor}`}>
              <Icon size={18} className={item.color} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

