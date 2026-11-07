import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Plus, RotateCw, Briefcase, User, Calendar, Layers } from 'lucide-react';

interface AllTasksHeaderProps {
  workspaceName?: string;
  profileName?: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onCreateTask: () => void;
}

export function AllTasksHeader({
  workspaceName = 'Corviin Workspace',
  profileName = 'Acting Profile',
  onRefresh,
  isRefreshing = false,
  onCreateTask,
}: AllTasksHeaderProps) {
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
          { label: 'All Tasks' },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ch-border pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-ch-text-primary">
              All Tasks
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-surface-muted text-ch-text-primary border border-ch-border">
              <Briefcase size={12} className="text-blue-500" />
              {workspaceName}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-ch-text-secondary bg-surface border border-ch-border">
              <User size={11} className="text-ch-text-muted" />
              Viewing as {profileName}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-ch-text-muted bg-surface border border-ch-border">
              <Calendar size={11} />
              {todayFormatted}
            </span>
          </div>
          <p className="text-xs text-ch-text-secondary">
            Monitor, prioritize, and coordinate tasks across your workspace.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh workspace tasks"
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
