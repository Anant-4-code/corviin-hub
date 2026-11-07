import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  CheckSquare,
  Megaphone,
  Users2,
  Video,
  Target,
  FolderOpen,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useProfiles } from '@/hooks/useProfiles';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/cn';

// Domain dialogs
import { CreateTaskDialog } from '@/features/tasks/components/CreateTaskDialog';
import { CreateTechRecordDialog } from '@/features/crm/components/CreateTechRecordDialog';
import { CreatePartnerDialog } from '@/features/crm/components/CreatePartnerDialog';
import { CreateBuyerDialog } from '@/features/crm/components/CreateBuyerDialog';
import { CreateCampaignDialog } from '@/features/campaigns/components/CreateCampaignDialog';
import { ScheduleMeetingDialog } from '@/features/meetings/components/ScheduleMeetingDialog';
import { CreateGoalDialog } from '@/features/plans-goals/components/CreateGoalDialog';
import { UploadAssetDialog } from '@/features/assets/components/UploadAssetDialog';

// API services
import { createTask } from '@/services/tasks';
import { createCampaign } from '@/services/campaigns';
import { createTechRecord, createPartnerRecord, createBuyerRecord } from '@/services/crm';
import { createMeeting } from '@/services/meetings';
import { createGoal } from '@/services/plans-goals';

import type {
  CreateTaskDto,
  CreateCampaignDto,
  CreateTechRecordDto,
  CreatePartnerRecordDto,
  CreateBuyerRecordDto,
  CreateMeetingDto,
  CreateGoalDto,
} from '@corviin-hub/shared';

export type CreateEntityType =
  | 'task'
  | 'tech-crm'
  | 're-partner'
  | 're-buyer'
  | 'campaign'
  | 'meeting'
  | 'goal'
  | 'asset';

interface ContextualCreateMenuProps {
  externalOpenType?: CreateEntityType | null;
  onExternalClose?: () => void;
}

export function ContextualCreateMenu({ externalOpenType, onExternalClose }: ContextualCreateMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: workspaces } = useWorkspaces();
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const currentWorkspace = workspaces?.find((w) => w.id === selectedWorkspaceId);

  const { data: profiles = [] } = useProfiles();
  const selectedProfileId = useAppStore((s) => s.selectedProfileId);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<CreateEntityType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync external open request (e.g. from GlobalSearchModal quick action)
  useEffect(() => {
    if (externalOpenType) {
      setActiveModal(externalOpenType);
    }
  }, [externalOpenType]);

  // Click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const isTech = currentWorkspace?.slug === 'tech' || currentWorkspace?.type === 'TECH';
  const isRealEstate =
    currentWorkspace?.slug === 'real-estate' || currentWorkspace?.type === 'REAL_ESTATE';

  const crmMemberOptions = profiles.map((p) => ({
    id: p.id,
    name: p.displayName,
  }));

  const campaignMemberOptions = profiles.map((p) => ({
    id: p.id,
    displayName: p.displayName,
  }));

  // Contextual action detection based on route
  const getContextualPrimaryType = (): CreateEntityType => {
    const path = location.pathname;
    if (path.includes('/tasks')) return 'task';
    if (path.includes('/crm/real-estate/partners')) return 're-partner';
    if (path.includes('/crm/real-estate/buyers')) return 're-buyer';
    if (path.includes('/crm')) return isTech ? 'tech-crm' : 're-partner';
    if (path.includes('/campaigns')) return 'campaign';
    if (path.includes('/meetings')) return 'meeting';
    if (path.includes('/plans-goals')) return 'goal';
    if (path.includes('/assets')) return 'asset';
    return 'task';
  };

  const primaryContextualType = getContextualPrimaryType();

  const handleOpenAction = (type: CreateEntityType) => {
    setMenuOpen(false);
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    if (onExternalClose) onExternalClose();
  };

  // Submission handlers with duplicate-prevention
  const handleCreateTask = async (dto: CreateTaskDto) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const task = await createTask(dto);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleCloseModal();
      navigate(`/app/tasks?id=${task.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTechRecord = async (dto: CreateTechRecordDto) => {
    if (isSubmitting || !currentWorkspace) return;
    setIsSubmitting(true);
    try {
      const record = await createTechRecord(currentWorkspace.id, dto);
      queryClient.invalidateQueries({ queryKey: ['crm'] });
      handleCloseModal();
      navigate(`/app/crm/tech?id=${record.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePartner = async (dto: CreatePartnerRecordDto) => {
    if (isSubmitting || !currentWorkspace) return;
    setIsSubmitting(true);
    try {
      const record = await createPartnerRecord(currentWorkspace.id, dto);
      queryClient.invalidateQueries({ queryKey: ['crm-partners'] });
      handleCloseModal();
      navigate(`/app/crm/real-estate/partners?id=${record.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBuyer = async (dto: CreateBuyerRecordDto) => {
    if (isSubmitting || !currentWorkspace) return;
    setIsSubmitting(true);
    try {
      const record = await createBuyerRecord(currentWorkspace.id, dto);
      queryClient.invalidateQueries({ queryKey: ['crm-buyers'] });
      handleCloseModal();
      navigate(`/app/crm/real-estate/buyers?id=${record.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCampaign = async (dto: CreateCampaignDto) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const campaign = await createCampaign(dto);
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      handleCloseModal();
      navigate(`/app/campaigns/${campaign.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMeeting = async (dto: CreateMeetingDto) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const meeting = await createMeeting(dto);
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      handleCloseModal();
      navigate(`/app/meetings?id=${meeting.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGoal = async (dto: CreateGoalDto) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const goal = await createGoal(dto);
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      handleCloseModal();
      navigate(`/app/plans-goals?id=${goal.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['assets'] });
    handleCloseModal();
  };

  // Available actions based strictly on workspace permissions
  const allWorkspaceActions: {
    type: CreateEntityType;
    label: string;
    description: string;
    icon: any;
    isPrimary?: boolean;
  }[] = [
    {
      type: 'task',
      label: 'New Task',
      description: 'Create an actionable task in workspace register',
      icon: CheckSquare,
      isPrimary: primaryContextualType === 'task',
    },
    ...(isTech
      ? [
          {
            type: 'tech-crm' as CreateEntityType,
            label: 'New Tech Enquiry',
            description: 'Register business lead or client project',
            icon: Users2,
            isPrimary: primaryContextualType === 'tech-crm',
          },
        ]
      : []),
    ...(isRealEstate
      ? [
          {
            type: 're-partner' as CreateEntityType,
            label: 'New Partner Lead',
            description: 'Add developer, builder, or broker partner',
            icon: Users2,
            isPrimary: primaryContextualType === 're-partner',
          },
          {
            type: 're-buyer' as CreateEntityType,
            label: 'New Buyer Enquiry',
            description: 'Capture property requirements and site visit',
            icon: Users2,
            isPrimary: primaryContextualType === 're-buyer',
          },
        ]
      : []),
    {
      type: 'campaign',
      label: 'New Campaign',
      description: 'Start multi-stage content or marketing campaign',
      icon: Megaphone,
      isPrimary: primaryContextualType === 'campaign',
    },
    {
      type: 'meeting',
      label: 'Schedule Meeting',
      description: 'Book team discussion, client call, or site visit',
      icon: Video,
      isPrimary: primaryContextualType === 'meeting',
    },
    {
      type: 'goal',
      label: 'New Strategic Goal',
      description: 'Define target outcome, horizon, and progress metrics',
      icon: Target,
      isPrimary: primaryContextualType === 'goal',
    },
    {
      type: 'asset',
      label: 'Upload Asset',
      description: 'Store verified file in workspace storage library',
      icon: FolderOpen,
      isPrimary: primaryContextualType === 'asset',
    },
  ];

  return (
    <>
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={cn(
            'inline-flex items-center justify-center gap-1 sm:gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-control text-xs font-semibold shrink-0',
            'bg-accent text-accent-foreground border border-accent hover:opacity-90 shadow-sm min-h-[32px] min-w-[32px] sm:min-h-[36px]',
          )}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          aria-label="Contextual Create Menu"
        >
          <Plus size={16} className="shrink-0" />
          <span className="hidden sm:inline font-semibold">Create</span>
          <ChevronDown size={14} className="hidden sm:inline opacity-80 shrink-0" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-80 rounded-lg bg-surface border border-ch-border shadow-xl z-50 overflow-hidden"
            role="menu"
            aria-label="Create options"
          >
            {/* Header: Context indication */}
            <div className="px-3.5 py-2.5 bg-surface-muted/60 border-b border-ch-border flex items-center justify-between">
              <span className="text-[11px] font-semibold text-ch-text-secondary uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-accent" /> Contextual Actions
              </span>
              <span className="text-[10px] text-ch-text-muted">
                {currentWorkspace?.slug || 'workspace'}
              </span>
            </div>

            {/* Recommended action list */}
            <div className="p-1.5 space-y-1">
              {allWorkspaceActions
                .filter((action) => action.isPrimary || showAllActions)
                .map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.type}
                      onClick={() => handleOpenAction(action.type)}
                      className={cn(
                        'w-full text-left p-2.5 rounded-control flex items-start gap-2.5 text-xs hover:bg-surface-muted min-h-[44px]',
                        action.isPrimary && 'bg-accent/10 border border-accent/30',
                      )}
                      role="menuitem"
                    >
                      <div
                        className={cn(
                          'p-1.5 rounded-control mt-0.5 shrink-0',
                          action.isPrimary
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-surface-muted text-ch-text-secondary',
                        )}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ch-text-primary flex items-center justify-between">
                          <span>{action.label}</span>
                          {action.isPrimary && (
                            <span className="text-[10px] text-accent font-medium">
                              Suggested
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ch-text-secondary line-clamp-1 mt-0.5">
                          {action.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Toggle show all actions */}
            <div className="p-1.5 border-t border-ch-border bg-surface-muted/30">
              <button
                onClick={() => setShowAllActions((prev) => !prev)}
                className="w-full text-center py-1.5 text-[11px] font-medium text-accent hover:underline"
              >
                {showAllActions ? 'Show Suggested Only' : 'View All Workspace Actions'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render Active Domain Modal */}
      {activeModal === 'task' && (
        <CreateTaskDialog
          open={true}
          onClose={handleCloseModal}
          onCreate={handleCreateTask}
          initialAssigneeId={selectedProfileId || undefined}
        />
      )}

      {activeModal === 'tech-crm' && isTech && currentWorkspace && (
        <CreateTechRecordDialog
          isOpen={true}
          onClose={handleCloseModal}
          onSubmit={handleCreateTechRecord}
          workspaceId={currentWorkspace.id}
          members={crmMemberOptions}
        />
      )}

      {activeModal === 're-partner' && isRealEstate && currentWorkspace && (
        <CreatePartnerDialog
          isOpen={true}
          onClose={handleCloseModal}
          onSubmit={handleCreatePartner}
          workspaceId={currentWorkspace.id}
          members={crmMemberOptions}
        />
      )}

      {activeModal === 're-buyer' && isRealEstate && currentWorkspace && (
        <CreateBuyerDialog
          isOpen={true}
          onClose={handleCloseModal}
          onSubmit={handleCreateBuyer}
          workspaceId={currentWorkspace.id}
          members={crmMemberOptions}
        />
      )}

      {activeModal === 'campaign' && currentWorkspace && (
        <CreateCampaignDialog
          open={true}
          onClose={handleCloseModal}
          workspaceId={currentWorkspace.id}
          members={campaignMemberOptions}
          onCreate={handleCreateCampaign}
        />
      )}

      {activeModal === 'meeting' && currentWorkspace && (
        <ScheduleMeetingDialog
          isOpen={true}
          workspaceId={currentWorkspace.id}
          onClose={handleCloseModal}
          onSubmit={handleCreateMeeting}
        />
      )}

      {activeModal === 'goal' && (
        <CreateGoalDialog
          open={true}
          onClose={handleCloseModal}
          onCreate={handleCreateGoal}
        />
      )}

      {activeModal === 'asset' && currentWorkspace && (
        <UploadAssetDialog
          isOpen={true}
          onClose={handleCloseModal}
          workspaceId={currentWorkspace.id}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
}
