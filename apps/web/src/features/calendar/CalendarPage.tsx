import { NavLink, Outlet } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/cn';

const calendarTabs = [
  { path: 'content-campaigns', label: 'Content & Campaigns' },
  { path: 'team-tasks', label: 'Team Tasks' },
  { path: 'meetings-visits', label: 'Meetings & Visits' },
];

export function CalendarPage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <PageHeader
        title="Calendar"
        description="Workspace schedules across content production, team task assignments, and meetings/site visits."
      />

      <div className="mt-4 border-b border-ch-border flex gap-2">
        {calendarTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px',
                isActive
                  ? 'border-accent text-accent font-semibold'
                  : 'border-transparent text-ch-text-secondary hover:text-ch-text-primary hover:border-ch-border-strong',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

