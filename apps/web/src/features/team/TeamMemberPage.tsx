import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import {
  fetchTeamMemberDetail,
  updateTeamMember,
  toggleTeamMemberStatus,
} from '@/services/team';
import { MemberStatus, TaskPriority } from '@corviin-hub/shared';
import type { UpdateTeamMemberDto } from '@corviin-hub/shared';
import { MEMBER_STATUS_CONFIG, formatTeamDate } from './components/team-constants';
import { EditMemberDialog } from './components/EditMemberDialog';

type MemberTab =
  | 'overview'
  | 'tasks'
  | 'completed_tasks'
  | 'goals'
  | 'campaigns'
  | 'meetings'
  | 'activity';

export const TeamMemberPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const selectedWorkspaceId =
    useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const setSelectedProfileId = useAppStore((s) => s.setSelectedProfileId);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<MemberTab>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch member detail with aggregated operational records in active workspace
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['team-member-detail', selectedWorkspaceId, memberId],
    queryFn: async () => {
      if (!selectedWorkspaceId || !memberId) throw new Error('Missing workspace or member ID');
      return fetchTeamMemberDetail(selectedWorkspaceId, memberId);
    },
    enabled: Boolean(selectedWorkspaceId && memberId),
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: async (dto: UpdateTeamMemberDto) => {
      if (!memberId) return;
      return updateTeamMember(memberId, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team-member-detail', selectedWorkspaceId, memberId],
      });
      queryClient.invalidateQueries({ queryKey: ['team-members', selectedWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (newStatus: MemberStatus) => {
      if (!memberId) return;
      return toggleTeamMemberStatus(memberId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['team-member-detail', selectedWorkspaceId, memberId],
      });
      queryClient.invalidateQueries({ queryKey: ['team-members', selectedWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-secondary">
        Loading member operational profile...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-base font-semibold text-primary">Member not found</h2>
        <p className="text-xs text-secondary mt-1">
          The requested member could not be found or does not belong to the active workspace.
        </p>
        <Link
          to="/app/team"
          className="inline-block mt-4 px-4 py-2 text-xs font-semibold rounded bg-brand-teal text-white"
        >
          Return to Team Directory
        </Link>
      </div>
    );
  }

  const { member, workload, workspaces, assignedTasks, completedTasks, plansAndGoals, campaigns, meetings, recentActivity } = detail;
  const isActing = selectedProfileId === member.id;
  const statusConfig = MEMBER_STATUS_CONFIG[member.status] || {
    label: member.status,
    badgeClass: 'bg-surface-muted text-secondary',
    dotClass: 'bg-stone-400',
  };

  const tabs: Array<{ id: MemberTab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview & Workspaces' },
    { id: 'tasks', label: 'Assigned Tasks', count: assignedTasks.length },
    { id: 'completed_tasks', label: 'Completed Deliverables', count: completedTasks.length },
    { id: 'goals', label: 'Plans & Goals', count: plansAndGoals.length },
    { id: 'campaigns', label: 'Campaigns Owned', count: campaigns.length },
    { id: 'meetings', label: 'Meetings & Visits', count: meetings.length },
    { id: 'activity', label: 'Operational Activity', count: recentActivity.length },
  ];

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-secondary gap-1.5">
        <Link to="/app/team" className="hover:text-primary">
          Team
        </Link>
        <span>/</span>
        <span className="text-primary font-medium">{member.displayName}</span>
      </nav>

      {/* Main Member Profile Header Banner */}
      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-teal/20 text-brand-teal font-bold text-xl flex items-center justify-center border border-brand-teal/30 flex-shrink-0">
              {member.initials || member.displayName.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-primary">{member.displayName}</h1>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusConfig.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotClass}`} />
                  {statusConfig.label}
                </span>
                {isActing && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-brand-teal/10 text-brand-teal border border-brand-teal/30">
                    Active Acting Profile
                  </span>
                )}
              </div>

              <div className="text-sm font-medium text-secondary">{member.role}</div>

              {/* Permitted Contact info */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-tertiary mt-2">
                {member.email && (
                  <div className="flex items-center gap-1.5 text-primary">
                    <svg className="w-3.5 h-3.5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-1.5 text-primary">
                    <svg className="w-3.5 h-3.5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{member.phone}</span>
                  </div>
                )}
                <div>Joined: {formatTeamDate(member.joinedAt)}</div>
              </div>
            </div>
          </div>

          {/* Member Actions */}
          <div className="flex items-center flex-wrap gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border">
            {!isActing && (
              <button
                type="button"
                onClick={() => setSelectedProfileId(member.id)}
                className="px-3.5 py-2 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 min-h-[38px]"
                title="Switch acting profile for UI testing"
              >
                Act as {member.displayName.split(' ')[0]}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded bg-surface-muted text-secondary hover:text-primary border border-border hover:bg-surface-hover min-h-[38px]"
            >
              Edit Profile
            </button>

            {/* Status toggle selector */}
            <div className="relative inline-block">
              <select
                value={member.status}
                onChange={(e) => toggleStatusMutation.mutate(e.target.value as MemberStatus)}
                className="text-xs font-semibold bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
              >
                {Object.values(MemberStatus).map((st) => (
                  <option key={st} value={st}>
                    Mark {MEMBER_STATUS_CONFIG[st]?.label || st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Concise Workload Summary (Section 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface border border-border rounded-md p-3 border-l-4 border-l-blue-500">
          <span className="text-[10px] text-tertiary uppercase font-semibold block">Open Tasks</span>
          <span className="text-xl font-bold text-primary mt-0.5 block">{workload.openTasksCount}</span>
          <span className="text-[10px] text-secondary">Active backlog</span>
        </div>
        <div className="bg-surface border border-border rounded-md p-3 border-l-4 border-l-rose-500">
          <span className="text-[10px] text-tertiary uppercase font-semibold block">Overdue Tasks</span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
            {workload.overdueTasksCount}
          </span>
          <span className="text-[10px] text-secondary">Passed deadline</span>
        </div>
        <div className="bg-surface border border-border rounded-md p-3 border-l-4 border-l-amber-500">
          <span className="text-[10px] text-tertiary uppercase font-semibold block">Due This Week</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
            {workload.tasksDueThisWeekCount}
          </span>
          <span className="text-[10px] text-secondary">Target deliveries</span>
        </div>
        <div className="bg-surface border border-border rounded-md p-3 border-l-4 border-l-purple-500">
          <span className="text-[10px] text-tertiary uppercase font-semibold block">Active Campaigns</span>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5 block">
            {workload.activeCampaignsCount}
          </span>
          <span className="text-[10px] text-secondary">Campaigns owned</span>
        </div>
        <div className="bg-surface border border-border rounded-md p-3 border-l-4 border-l-cyan-500">
          <span className="text-[10px] text-tertiary uppercase font-semibold block">Meetings / Visits</span>
          <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-0.5 block">
            {workload.upcomingMeetingsCount}
          </span>
          <span className="text-[10px] text-secondary">Scheduled sessions</span>
        </div>
        <div className="bg-surface border border-border rounded-md p-3 border-l-4 border-l-emerald-500">
          <span className="text-[10px] text-tertiary uppercase font-semibold block">Completed Tasks</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {workload.completedTasksCount}
          </span>
          <span className="text-[10px] text-secondary">Delivered items</span>
        </div>
      </div>

      {/* Tabs Navigation (Horizontal bar) */}
      <div className="border-b border-border flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap ${activeTab === tab.id
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-secondary hover:text-primary'
              }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-surface-muted text-secondary border border-border">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* TAB CONTENT SECTIONS (Section 4 Compliance)              */}
      {/* ======================================================== */}

      {/* 1. OVERVIEW & WORKSPACES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-2">
              Profile & Responsibilities
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-tertiary block text-[11px]">Primary Role</span>
                <span className="font-semibold text-primary">{member.role}</span>
              </div>
              {member.bio && (
                <div>
                  <span className="text-tertiary block text-[11px]">Responsibilities & Bio</span>
                  <p className="text-secondary mt-0.5 leading-relaxed">{member.bio}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-tertiary block text-[11px]">Email</span>
                  <span className="font-medium text-primary">{member.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-tertiary block text-[11px]">Phone</span>
                  <span className="font-medium text-primary">{member.phone || 'Not provided'}</span>
                </div>
              </div>
              <div>
                <span className="text-tertiary block text-[11px]">Member Since</span>
                <span className="font-medium text-primary">{formatTeamDate(member.joinedAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-2">
              Workspace Access & Memberships
            </h3>
            <div className="space-y-2.5">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="p-3 rounded-md bg-surface-muted border border-border flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-primary text-xs">{ws.name}</div>
                    <div className="text-[10px] text-tertiary">{ws.slug}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                    {ws.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ASSIGNED TASKS */}
      {activeTab === 'tasks' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Assigned Open Tasks</h3>
              <p className="text-xs text-secondary mt-0.5">
                Active tasks in {workspaces[0]?.name || 'the active workspace'}.
              </p>
            </div>
            <Link
              to="/app/tasks"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover"
            >
              Open in All Tasks
            </Link>
          </div>

          {assignedTasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary">
              No open tasks currently assigned to this member in this workspace.
            </div>
          ) : (
            <div className="space-y-2">
              {assignedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-md bg-surface-muted border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold text-primary text-xs">{task.title}</div>
                    <div className="text-[11px] text-tertiary mt-0.5">
                      Deadline: {formatTeamDate(task.deadline)} • Priority: {task.priority}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-surface text-secondary border border-border">
                      {task.status}
                    </span>
                    <Link
                      to="/app/tasks"
                      className="text-xs text-brand-teal underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. COMPLETED DELIVERABLES */}
      {activeTab === 'completed_tasks' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Completed Deliverables</h3>
              <p className="text-xs text-secondary mt-0.5">
                Historically finished tasks and deliverables.
              </p>
            </div>
          </div>

          {completedTasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary">
              No completed deliverables recorded yet for this member in this workspace.
            </div>
          ) : (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-md bg-surface-muted border border-border flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-primary text-xs line-through text-secondary">
                      {task.title}
                    </div>
                    <div className="text-[10px] text-tertiary mt-0.5">
                      Finished on {formatTeamDate(task.completedAt || task.updatedAt)}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PLANS & GOALS */}
      {activeTab === 'goals' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Strategic Plans & Goals</h3>
              <p className="text-xs text-secondary mt-0.5">
                Organizational goals spearheaded by this member.
              </p>
            </div>
            <Link
              to="/app/plans-goals"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover"
            >
              Open Plans & Goals
            </Link>
          </div>

          {plansAndGoals.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary">
              No goals currently spearheaded by this member in this workspace.
            </div>
          ) : (
            <div className="space-y-2.5">
              {plansAndGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3.5 rounded-md bg-surface-muted border border-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary text-xs">{goal.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                      {goal.status}
                    </span>
                  </div>
                  {goal.expectedOutcome && (
                    <p className="text-[11px] text-secondary mt-1">{goal.expectedOutcome}</p>
                  )}
                  <div className="text-[10px] text-tertiary mt-2">
                    Target: {formatTeamDate(goal.targetDate)} • Progress: {goal.progressPercent}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. CAMPAIGNS OWNED */}
      {activeTab === 'campaigns' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Marketing & Content Campaigns</h3>
              <p className="text-xs text-secondary mt-0.5">
                5-stage marketing initiatives owned by this member.
              </p>
            </div>
            <Link
              to="/app/campaigns"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover"
            >
              Open Campaigns
            </Link>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary">
              No campaigns currently owned by this member in this workspace.
            </div>
          ) : (
            <div className="space-y-2">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-3 rounded-md bg-surface-muted border border-border flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-primary text-xs">{camp.title}</div>
                    <div className="text-[10px] text-tertiary mt-0.5">
                      Platform: {camp.platform} • Planned Post: {formatTeamDate(camp.targetPublishDate)}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {camp.stage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. MEETINGS & VISITS */}
      {activeTab === 'meetings' && (
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Meetings & Sessions</h3>
              <p className="text-xs text-secondary mt-0.5">
                Sessions where this member is organiser or participant.
              </p>
            </div>
            <Link
              to="/app/meetings"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-surface-muted text-primary border border-border hover:bg-surface-hover"
            >
              Open Meetings
            </Link>
          </div>

          {meetings.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary">
              No meetings or visits found for this member in this workspace.
            </div>
          ) : (
            <div className="space-y-2">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-md bg-surface-muted border border-border flex items-center justify-between"
                >
                  <div>
                    <Link
                      to={`/app/meetings/${m.id}`}
                      className="font-semibold text-primary text-xs hover:underline text-brand-teal"
                    >
                      {m.title}
                    </Link>
                    <div className="text-[10px] text-tertiary mt-0.5">
                      {formatTeamDate(m.date)} • {m.category} • Role: {m.organiserId === member.id ? 'Organiser' : 'Participant'}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-surface text-secondary border border-border">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. OPERATIONAL ACTIVITY */}
      {activeTab === 'activity' && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-semibold text-primary border-b border-border pb-2">
            Recent Operational Activity
          </h3>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary">
              No recent operational events recorded for this member.
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-md bg-surface-muted border border-border text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold text-primary">{act.action}</span>
                    {act.details && (
                      <div className="text-secondary text-[11px] mt-0.5">{act.details}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-tertiary block">{formatTeamDate(act.timestamp)}</span>
                    <span className="text-[10px] text-secondary font-medium">{act.actorName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Member Modal */}
      <EditMemberDialog
        isOpen={isEditOpen}
        member={member}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async (id, dto) => {
          await updateMutation.mutateAsync(dto);
        }}
      />
    </div>
  );
};
export default TeamMemberPage;
