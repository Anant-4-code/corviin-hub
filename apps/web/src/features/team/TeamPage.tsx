import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { fetchTeamMembers, createTeamMember } from '@/services/team';
import type { TeamMemberSummaryDto, CreateTeamMemberDto } from '@corviin-hub/shared';
import { TeamSummaryStrip } from './components/TeamSummaryStrip';
import { TeamFilterToolbar } from './components/TeamFilterToolbar';
import { MemberCard } from './components/MemberCard';
import { MemberTableView } from './components/MemberTableView';
import { AddMemberDialog } from './components/AddMemberDialog';

export const TeamPage: React.FC = () => {
  const selectedWorkspaceId =
    useAppStore((s) => s.selectedWorkspaceId) || 'ws-tech-0001-0000-000000000001';
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const setSelectedProfileId = useAppStore((s) => s.setSelectedProfileId);
  const queryClient = useQueryClient();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Fetch team members for the active workspace
  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['team-members', selectedWorkspaceId],
    queryFn: async () => {
      if (!selectedWorkspaceId) return [];
      return fetchTeamMembers(selectedWorkspaceId);
    },
    enabled: Boolean(selectedWorkspaceId),
  });

  // Create member mutation
  const createMutation = useMutation({
    mutationFn: async (dto: CreateTeamMemberDto) => {
      return createTeamMember(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', selectedWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      if (statusFilter !== 'ALL' && member.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const nameMatch = member.displayName.toLowerCase().includes(q);
        const roleMatch = member.role.toLowerCase().includes(q);
        const emailMatch = Boolean(member.email && member.email.toLowerCase().includes(q));
        if (!nameMatch && !roleMatch && !emailMatch) {
          return false;
        }
      }
      return true;
    });
  }, [members, statusFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
  };

  const handleSelectActingProfile = (id: string) => {
    setSelectedProfileId(id);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Team Directory & Workload</h1>
          <p className="text-xs text-secondary mt-0.5">
            Dynamic team directory, active workspace assignments, workload figures, and operational attribution.
          </p>
        </div>
      </div>

      {/* Summary Strip */}
      <TeamSummaryStrip members={members} />

      {/* Filter Toolbar */}
      <TeamFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        onAddMemberClick={() => setIsAddMemberOpen(true)}
      />

      {/* Main Directory Display */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-secondary bg-surface border border-border rounded-md">
          Loading team directory...
        </div>
      ) : error ? (
        <div className="p-12 text-center text-sm text-rose-600 bg-surface border border-border rounded-md">
          Failed to load team members. Please check connection.
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-surface border border-border rounded-md p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-muted flex items-center justify-center text-tertiary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-primary">No team members found</h3>
          <p className="text-sm text-secondary mt-1 max-w-sm mx-auto">
            No member records match the active search or status criteria in this workspace.
          </p>
        </div>
      ) : viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isActingProfile={selectedProfileId === member.id}
              onSelectActingProfile={handleSelectActingProfile}
            />
          ))}
        </div>
      ) : (
        <MemberTableView
          members={filteredMembers}
          actingProfileId={selectedProfileId}
          onSelectActingProfile={handleSelectActingProfile}
        />
      )}

      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        defaultWorkspaceId={selectedWorkspaceId}
        onClose={() => setIsAddMemberOpen(false)}
        onSubmit={async (dto) => {
          await createMutation.mutateAsync(dto);
        }}
      />
    </div>
  );
};
export default TeamPage;
