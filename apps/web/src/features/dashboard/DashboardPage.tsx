import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Megaphone,
  Users2,
  Calendar,
  FolderOpen,
  HardDrive,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingState, ErrorState } from '@/components/ui/States';

interface DashboardSummaryResponse {
  data: {
    workspaceId: string;
    metrics: {
      openTasksCount: number;
      overdueTasksCount: number;
      completedTasksCount: number;
      activeCampaignsCount: number;
      crmLeadsCount: number;
      upcomingMeetingsCount: number;
      totalAssetsCount: number;
      storageBytesUsed: number;
    };
    timestamp: string;
  };
  status: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { selectedWorkspaceId } = useAppStore();
  const wsId = selectedWorkspaceId || 'ws-tech-0001-0000-000000000001';

  const { data, isLoading, isError, error, refetch } = useQuery<DashboardSummaryResponse>({
    queryKey: queryKeys.dashboard(wsId),
    queryFn: () => api.get<DashboardSummaryResponse>('/dashboard/summary'),
    staleTime: 15_000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Dashboard" description="Operational summary and live metrics" />
        <LoadingState message="Loading workspace dashboard..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <PageHeader title="Dashboard" description="Operational summary and live metrics" />
        <ErrorState
          title="Could not load dashboard metrics"
          message={(error as Error)?.message || 'Failed to connect to API'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const metrics = data?.data?.metrics || {
    openTasksCount: 0,
    overdueTasksCount: 0,
    completedTasksCount: 0,
    activeCampaignsCount: 0,
    crmLeadsCount: 0,
    upcomingMeetingsCount: 0,
    totalAssetsCount: 0,
    storageBytesUsed: 0,
  };

  const formatStorage = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Operations Dashboard"
        description="Live operational command center connecting tasks, campaigns, meetings, CRM, and storage."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/tasks/my')}
            >
              My Tasks
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/tasks/all')}
            >
              All Tasks
            </Button>
          </div>
        }
      />

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Tasks */}
        <Card
          className="cursor-pointer hover:border-ch-primary/50"
          onClick={() => navigate('/tasks/all')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">
                Open Tasks
              </span>
              <div className="text-3xl font-semibold text-text-primary">
                {metrics.openTasksCount}
              </div>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Active in workspace
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        {/* Overdue Tasks */}
        <Card
          className={`cursor-pointer hover:border-ch-primary/50 ${
            metrics.overdueTasksCount > 0 ? 'border-red-200 dark:border-red-900/50' : ''
          }`}
          onClick={() => navigate('/tasks/all')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">
                Overdue Tasks
              </span>
              <div className="text-3xl font-semibold text-red-600 dark:text-red-400">
                {metrics.overdueTasksCount}
              </div>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                Requires attention
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        {/* Completed Tasks */}
        <Card
          className="cursor-pointer hover:border-ch-primary/50"
          onClick={() => navigate('/tasks/all')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">
                Completed Tasks
              </span>
              <div className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                {metrics.completedTasksCount}
              </div>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Successfully finished
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        {/* Active Campaigns */}
        <Card
          className="cursor-pointer hover:border-ch-primary/50"
          onClick={() => navigate('/campaigns')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">
                Active Campaigns
              </span>
              <div className="text-3xl font-semibold text-text-primary">
                {metrics.activeCampaignsCount}
              </div>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                Pipeline tracking
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Megaphone className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Secondary Metrics & Quick Hubs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CRM Leads */}
        <Card
          className="cursor-pointer hover:border-ch-primary/50"
          onClick={() => navigate('/crm')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">CRM Leads</span>
              <div className="text-2xl font-semibold text-text-primary">
                {metrics.crmLeadsCount}
              </div>
              <span className="text-xs text-text-secondary">Enquiries & partners</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users2 className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        {/* Upcoming Meetings & Visits */}
        <Card
          className="cursor-pointer hover:border-ch-primary/50"
          onClick={() => navigate('/meetings')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">
                Upcoming Meetings
              </span>
              <div className="text-2xl font-semibold text-text-primary">
                {metrics.upcomingMeetingsCount}
              </div>
              <span className="text-xs text-text-secondary">Syncs & site visits</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        {/* Stored Assets */}
        <Card
          className="cursor-pointer hover:border-ch-primary/50"
          onClick={() => navigate('/assets')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">
                Library Assets
              </span>
              <div className="text-2xl font-semibold text-text-primary">
                {metrics.totalAssetsCount}
              </div>
              <span className="text-xs text-text-secondary">Media & documentation</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FolderOpen className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        {/* R2 Storage Used */}
        <Card
          className="cursor-pointer hover:border-ch-primary/50"
          onClick={() => navigate('/assets')}
        >
          <CardBody className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-medium text-text-muted">
                R2 Storage Used
              </span>
              <div className="text-2xl font-semibold text-text-primary">
                {formatStorage(metrics.storageBytesUsed)}
              </div>
              <span className="text-xs text-text-secondary">Cloudflare bucket</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <HardDrive className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Cross-Module Navigation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendars & Scheduling */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ch-primary" />
              <h3 className="text-sm font-semibold text-text-primary">
                Unified Calendars & Schedules
              </h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <div
              className="p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/calendar/team-tasks')}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">Team Task Calendar</p>
                <p className="text-xs text-text-muted">
                  Operational deadlines mapped by member workload
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </div>

            <div
              className="p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/calendar/meetings')}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Meetings & Visits Calendar
                </p>
                <p className="text-xs text-text-muted">
                  Internal reviews, partner discussions & buyer walkthroughs
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </div>

            <div
              className="p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/calendar/content')}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Content & Campaign Calendar
                </p>
                <p className="text-xs text-text-muted">
                  Planned and actual publish schedules across platforms
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </div>
          </CardBody>
        </Card>

        {/* Operating Strategic Alignment */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-semibold text-text-primary">
                Strategic Workflows & Integration
              </h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <div
              className="p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/plans-goals')}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">Plans & Goals</p>
                <p className="text-xs text-text-muted">
                  Strategic milestones rolled up from linked tasks
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </div>

            <div
              className="p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/team')}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">Team Directory</p>
                <p className="text-xs text-text-muted">
                  Member capacity, assigned tasks, and operational profiles
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </div>

            <div
              className="p-3 rounded-lg border border-ch-border hover:bg-surface-muted cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/notifications')}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">Activity & Audit Trail</p>
                <p className="text-xs text-text-muted">
                  Chronological event stream across all workspace updates
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
