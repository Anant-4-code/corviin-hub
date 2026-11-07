import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Plus, RotateCw, Briefcase, User, Calendar } from 'lucide-react';

interface MyTasksHeaderProps {
  workspaceName?: string;
  profileName?: string;
  profileInitials?: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onCreateTask: () => void;
}

export function MyTasksHeader({
  workspaceName = 'Corviin Workspace',
  profileName = 'Acting Profile',
  profileInitials = 'AP',
  onRefresh,
  isRefreshing = false,
  onCreateTask,
}: MyTasksHeaderProps) {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-3">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/app/dashboard' },
          { label: 'Tasks', href: '/app/tasks' },
          { label: 'My Tasks' },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ch-border pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-ch-text-primary">
              My Tasks
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              <User size={12} />
              {profileName}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-surface-muted text-ch-text-secondary border border-ch-border">
              <Briefcase size={11} className="text-ch-text-muted" />
              {workspaceName}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-ch-text-muted bg-surface border border-ch-border">
              <Calendar size={11} />
              {todayFormatted}
            </span>
          </div>
          <p className="text-xs text-ch-text-secondary">
            Manage your assigned work, priorities, and deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh tasks"
            className="h-9 px-3 text-xs flex items-center gap-1.5 text-ch-text-secondary hover:text-ch-text-primary border-ch-border"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onCreateTask}
            className="h-9 px-3.5 text-xs font-medium flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} />
            <span>Create Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
