import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  CampaignItem,
  ContentEventItem,
  CreateCampaignDto,
  UpdateCampaignDto,
  AdvanceCampaignStageDto,
  CreateScriptVersionDto,
  UpdateScriptStatusDto,
  UpdateFootageChecklistDto,
  LinkCampaignAssetDto,
  CreateCampaignTaskDto,
  CreateContentEventDto,
  RescheduleContentEventDto,
  MarkContentPublishedDto,
  CampaignAssetLink,
  ScriptVersion,
  FootageChecklistItem,
  CampaignStageHistoryItem,
  CampaignStage,
  ContentEventType,
  ContentStatus,
  ContentPlatform,
  TaskPriority,
  TaskStatus,
  RescheduleEvent,
  TaskItem,
} from '@corviin-hub/shared';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class CampaignsService {
  constructor(private readonly tasksService: TasksService) {}

  private campaigns: CampaignItem[] = [
    {
      id: 'cmp-tech-001',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Corviin CRM v2.0 Launch Video & Demo Sprint',
      description: 'Comprehensive product walkthrough highlighting zero-animation speed, dual-workspace architecture, and enterprise APIs.',
      stage: CampaignStage.RECORDING_UPLOAD,
      ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      startDate: '2026-11-01T09:00:00.000Z',
      targetPublishDate: '2026-11-20T17:00:00.000Z',
      platform: ContentPlatform.YOUTUBE,
      priority: TaskPriority.URGENT,
      status: ContentStatus.IN_PROGRESS,
      progressPercent: 55,

      // Stage 1
      objective: 'Demonstrate sub-second response times and zero visual clutter to CTOs and operations leaders.',
      targetAudience: 'Engineering Leaders, Founders, Real Estate Brokers',
      conceptNotes: 'Focus on no animation delay vs laggy competitor CRMs. Side-by-side terminal & UI performance.',
      referenceLinks: ['https://linear.app/method', 'https://stripe.com/design'],

      // Stage 2
      finalTopic: 'Why Zero Animation is the Future of High-Velocity Business Software',
      scriptApproved: true,
      scriptReviewerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      scripts: [
        {
          id: 'scr-1',
          versionNumber: 1,
          content: 'Intro: Stop waiting for slow spring animations. Every millisecond wasted on modal fading is attention lost...',
          hook: 'Most CRMs waste 12 minutes of your day just animating modal drawers. Here is how we fixed that.',
          shotBreakdown: '0:00-0:15 Hook screencast. 0:15-1:00 Live performance profiler. 1:00-2:30 Workspace switching.',
          cta: 'Check out the live sandbox at corviin.dev/preview',
          caption: 'Building enterprise operations tools without animated bloat. #DevTools #Productivity',
          hashtags: ['#CRM', '#DevTools', '#TypeScript', '#ZeroAnimation'],
          authorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          authorName: 'Anant',
          status: 'APPROVED',
          feedback: 'Strong hook and clean pacing. Approved for production.',
          timestamp: '2026-11-04T12:00:00.000Z',
        },
      ],

      // Stage 3
      recordingDate: '2026-11-08T10:00:00.000Z',
      recordingLocation: 'Corviin Tech Studio 1',
      footageChecklist: [
        { id: 'ftg-1', label: 'Screen recording of Task Kanban drag-and-drop', category: 'SCREEN_RECORDING', status: 'DONE' },
        { id: 'ftg-2', label: '4K A-roll facecam introduction by Anant', category: 'SCENE', status: 'DONE' },
        { id: 'ftg-3', label: 'Audio podcast mic voice-over track', category: 'VOICEOVER', status: 'DONE' },
        { id: 'ftg-4', label: 'Mobile Capacitor screen demo on Android emulator', category: 'SCREEN_RECORDING', status: 'RETAKE', notes: 'Need higher DPI render' },
      ],
      retakeNotes: 'Re-record Android screencast at 1080x2400 60fps.',

      // Stage 4
      editorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', // Utkarsh
      editingInstructions: 'Fast-paced cuts. Maintain high contrast. Add monospace terminal typography for benchmarks.',
      aspectRatio: '16:9',
      finalAssetApproved: false,
      revisionRequests: [],

      // Stage 5
      scheduledDate: '2026-11-20T17:00:00.000Z',

      // Assets
      assetLinks: [
        {
          id: 'link-1',
          assetId: 'ast-raw-01',
          campaignId: 'cmp-tech-001',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          title: '4K Studio Camera Feed — Anant A-Roll',
          fileName: 'studio_cam_a_roll_4k.mp4',
          fileSize: 1048576000, // 1GB
          mimeType: 'video/mp4',
          category: 'RAW_FOOTAGE',
          stage: CampaignStage.RECORDING_UPLOAD,
          url: 'https://storage.corviin.internal/assets/raw_footage_4k.mp4',
          uploadedBy: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          uploadedByName: 'Anant',
          createdAt: '2026-11-05T09:00:00.000Z',
        },
        {
          id: 'link-2',
          assetId: 'ast-scr-01',
          campaignId: 'cmp-tech-001',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          title: 'Approved Launch Script v1.0',
          fileName: 'launch_script_v1_approved.md',
          fileSize: 14200,
          mimeType: 'text/markdown',
          category: 'SCRIPTS',
          stage: CampaignStage.SCRIPTING_PLANNING,
          url: 'https://storage.corviin.internal/assets/launch_script.md',
          uploadedBy: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          uploadedByName: 'Rohit',
          createdAt: '2026-11-04T12:00:00.000Z',
        },
      ],

      // Stage History
      stageHistory: [
        {
          id: 'sth-1',
          fromStage: CampaignStage.INITIAL_IDEA,
          toStage: CampaignStage.SCRIPTING_PLANNING,
          actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          actorName: 'Anant',
          timestamp: '2026-11-02T10:00:00.000Z',
          notes: 'Concept approved by core leadership. Proceeding to script drafting.',
        },
        {
          id: 'sth-2',
          fromStage: CampaignStage.SCRIPTING_PLANNING,
          toStage: CampaignStage.RECORDING_UPLOAD,
          actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          actorName: 'Rohit',
          timestamp: '2026-11-04T15:30:00.000Z',
          notes: 'Script version 1 approved with hook sign-off.',
        },
      ],

      contentItems: [
        {
          id: 'ev-tech-101',
          campaignId: 'cmp-tech-001',
          campaignTitle: 'Corviin CRM v2.0 Launch Video & Demo Sprint',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          title: 'Final Script Review & Hook Sign-off',
          eventType: ContentEventType.SCRIPT_REVIEW,
          plannedDate: '2026-11-04T14:00:00.000Z',
          actualDate: '2026-11-04T15:30:00.000Z',
          ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          status: ContentStatus.APPROVED,
          platform: ContentPlatform.YOUTUBE,
          notes: 'Hook focuses on instant operations without animations.',
          rescheduleHistory: [],
          createdAt: '2026-11-01T10:00:00.000Z',
          updatedAt: '2026-11-04T15:30:00.000Z',
        },
        {
          id: 'ev-tech-102',
          campaignId: 'cmp-tech-001',
          campaignTitle: 'Corviin CRM v2.0 Launch Video & Demo Sprint',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          title: 'Studio Screen Recording & Voiceover',
          eventType: ContentEventType.RECORDING,
          plannedDate: '2026-11-08T10:00:00.000Z',
          ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          status: ContentStatus.IN_PROGRESS,
          platform: ContentPlatform.YOUTUBE,
          notes: 'Record high-res 4K screencasts of Task Kanban and Goal Tree.',
          rescheduleHistory: [],
          createdAt: '2026-11-01T10:00:00.000Z',
          updatedAt: '2026-11-01T10:00:00.000Z',
        },
        {
          id: 'ev-tech-103',
          campaignId: 'cmp-tech-001',
          campaignTitle: 'Corviin CRM v2.0 Launch Video & Demo Sprint',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          title: 'Rough Cut Video Editing & Audio Mastering',
          eventType: ContentEventType.EDITING,
          plannedDate: '2026-11-13T18:00:00.000Z',
          ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
          status: ContentStatus.PLANNED,
          platform: ContentPlatform.YOUTUBE,
          notes: 'Ensure all UI captions have exact timestamp matches.',
          rescheduleHistory: [],
          createdAt: '2026-11-01T10:00:00.000Z',
          updatedAt: '2026-11-01T10:00:00.000Z',
        },
        {
          id: 'ev-tech-104',
          campaignId: 'cmp-tech-001',
          campaignTitle: 'Corviin CRM v2.0 Launch Video & Demo Sprint',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          title: 'YouTube Premier Publishing & Community Blast',
          eventType: ContentEventType.SCHEDULED_POST,
          plannedDate: '2026-11-20T17:00:00.000Z',
          ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          status: ContentStatus.PLANNED,
          platform: ContentPlatform.YOUTUBE,
          rescheduleHistory: [],
          createdAt: '2026-11-01T10:00:00.000Z',
          updatedAt: '2026-11-01T10:00:00.000Z',
        },
      ],
      rescheduleHistory: [],
      activity: [
        {
          id: 'act-1',
          action: 'Moved to Recording & Asset Upload',
          actorName: 'Rohit',
          timestamp: '2026-11-04T15:30:00.000Z',
          details: 'Script approved; production started.',
        },
      ],
      createdAt: '2026-11-01T09:00:00.000Z',
      updatedAt: '2026-11-05T09:00:00.000Z',
    },

    // Real Estate Campaign
    {
      id: 'cmp-re-001',
      workspaceId: 'ws-real-0002-0000-000000000002',
      title: 'Sobha Dream Acres 3BHK Drone Tour & Virtual Open House',
      description: 'Cinematic walkthrough of luxury 4BHK and 3BHK clubhouse residences with lake views.',
      stage: CampaignStage.SCRIPTING_PLANNING,
      ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      startDate: '2026-10-28T09:00:00.000Z',
      targetPublishDate: '2026-11-12T16:00:00.000Z',
      platform: ContentPlatform.YOUTUBE,
      priority: TaskPriority.HIGH,
      status: ContentStatus.IN_PROGRESS,
      progressPercent: 30,

      objective: 'Generate qualified NRI buyer leads for luxury lakeside villas.',
      targetAudience: 'High-Net-Worth Buyers & Tech Expats',
      conceptNotes: 'Cinematic sunrise drone shots, master suite walkthrough, private garden terrace view.',
      referenceLinks: ['https://sobha.com/dream-acres'],

      finalTopic: 'Sobha Dream Acres 3BHK: Bangalore Luxury Living Tour',
      scriptApproved: false,
      scripts: [
        {
          id: 'scr-re-1',
          versionNumber: 1,
          content: 'Opening shot: Drone flying over sunrise lake. Voiceover: "Imagine waking up to 81 acres of lush greenery..."',
          hook: 'Is this Bangalore most scenic 4BHK penthouse? Take a private walkthrough with us.',
          cta: 'Book an exclusive site visit at +91-98450-12345',
          caption: 'Inside Sobha Dream Acres luxury villa residences. Tour now open. #BangaloreRealEstate',
          hashtags: ['#BangaloreVillas', '#LuxuryLiving', '#Sobha', '#RealEstateIndia'],
          authorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          authorName: 'Rohit',
          status: 'DRAFT',
          timestamp: '2026-11-03T11:00:00.000Z',
        },
      ],

      footageChecklist: [
        { id: 'ftg-re-1', label: 'Sunrise lakefront drone flyover', category: 'SCENE', status: 'DONE' },
        { id: 'ftg-re-2', label: 'Clubhouse swimming pool and tennis courts', category: 'B_ROLL', status: 'DONE' },
        { id: 'ftg-re-3', label: 'Master bedroom panoramic window shot', category: 'SCENE', status: 'DONE' },
        { id: 'ftg-re-4', label: 'Kitchen modular fittings inspection', category: 'SCENE', status: 'DONE' },
      ],

      assetLinks: [
        {
          id: 'link-re-1',
          assetId: 'ast-re-drone',
          campaignId: 'cmp-re-001',
          workspaceId: 'ws-real-0002-0000-000000000002',
          title: 'DJI Mavic 3 5.1K Raw Drone Footage',
          fileName: 'sobha_drone_lake_sunrise.mov',
          fileSize: 3221225472, // 3GB
          mimeType: 'video/quicktime',
          category: 'RAW_FOOTAGE',
          stage: CampaignStage.RECORDING_UPLOAD,
          url: 'https://storage.corviin.internal/re/drone_lake.mov',
          uploadedBy: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          uploadedByName: 'Rohit',
          createdAt: '2026-11-04T10:00:00.000Z',
        },
      ],

      stageHistory: [
        {
          id: 'sth-re-1',
          fromStage: CampaignStage.INITIAL_IDEA,
          toStage: CampaignStage.SCRIPTING_PLANNING,
          actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          actorName: 'Rohit',
          timestamp: '2026-11-02T11:00:00.000Z',
          notes: 'Builder approval received for aerial filming.',
        },
      ],

      contentItems: [
        {
          id: 'ev-re-101',
          campaignId: 'cmp-re-001',
          campaignTitle: 'Sobha Dream Acres 3BHK Drone Tour & Virtual Open House',
          workspaceId: 'ws-real-0002-0000-000000000002',
          title: 'Villa Interior Photography & Virtual 3D Tour',
          eventType: ContentEventType.RECORDING,
          plannedDate: '2026-11-04T10:00:00.000Z',
          actualDate: '2026-11-04T16:00:00.000Z',
          ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          status: ContentStatus.PUBLISHED,
          platform: ContentPlatform.YOUTUBE,
          rescheduleHistory: [],
          createdAt: '2026-10-28T10:00:00.000Z',
          updatedAt: '2026-11-04T16:00:00.000Z',
        },
      ],
      rescheduleHistory: [],
      activity: [],
      createdAt: '2026-10-28T09:00:00.000Z',
      updatedAt: '2026-11-04T16:00:00.000Z',
    },
  ];

  findAll(
    workspaceId: string,
    filter?: {
      stage?: string;
      status?: string;
      ownerId?: string;
      priority?: string;
      platform?: string;
      search?: string;
    },
  ): CampaignItem[] {
    let result = this.campaigns.filter((c) => c.workspaceId === workspaceId);

    if (filter?.stage) {
      result = result.filter((c) => c.stage === filter.stage);
    }
    if (filter?.status) {
      result = result.filter((c) => c.status === filter.status);
    }
    if (filter?.ownerId) {
      result = result.filter((c) => c.ownerId === filter.ownerId);
    }
    if (filter?.priority) {
      result = result.filter((c) => c.priority === filter.priority);
    }
    if (filter?.platform) {
      result = result.filter((c) => c.platform === filter.platform);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.objective && c.objective.toLowerCase().includes(q)),
      );
    }

    return result;
  }

  findOne(workspaceId: string, id: string): CampaignItem {
    const campaign = this.campaigns.find((c) => c.workspaceId === workspaceId && c.id === id);
    if (!campaign) {
      throw new NotFoundException(`Campaign ${id} not found in workspace ${workspaceId}`);
    }
    return campaign;
  }

  create(dto: CreateCampaignDto): CampaignItem {
    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Campaign title is required.');
    }
    if (!dto.description || !dto.description.trim()) {
      throw new BadRequestException('Campaign description is required.');
    }

    const newId = `cmp-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const campaign: CampaignItem = {
      id: newId,
      workspaceId: dto.workspaceId,
      title: dto.title.trim(),
      description: dto.description.trim(),
      stage: dto.stage || CampaignStage.INITIAL_IDEA,
      ownerId: dto.ownerId,
      startDate: dto.startDate || now,
      targetPublishDate: dto.targetPublishDate || new Date(Date.now() + 86400000 * 14).toISOString(),
      platform: dto.platform || ContentPlatform.YOUTUBE,
      priority: dto.priority || TaskPriority.MEDIUM,
      status: ContentStatus.PLANNED,
      progressPercent: 0,

      objective: dto.objective,
      targetAudience: dto.targetAudience,
      conceptNotes: dto.conceptNotes,
      referenceLinks: dto.referenceLinks || [],

      scripts: [],
      footageChecklist: [],
      assetLinks: [],
      stageHistory: [
        {
          id: `sth-${Date.now()}`,
          fromStage: CampaignStage.INITIAL_IDEA,
          toStage: CampaignStage.INITIAL_IDEA,
          actorId: dto.ownerId,
          actorName: 'Acting Profile',
          timestamp: now,
          notes: 'Campaign created in Initial Idea stage.',
        },
      ],
      contentItems: [],
      rescheduleHistory: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          action: 'Campaign created',
          actorName: 'Acting Profile',
          timestamp: now,
          details: `Created campaign "${dto.title}"`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.campaigns.unshift(campaign);
    return campaign;
  }

  update(workspaceId: string, id: string, dto: UpdateCampaignDto): CampaignItem {
    const campaign = this.findOne(workspaceId, id);
    Object.assign(campaign, dto);
    campaign.updatedAt = new Date().toISOString();
    return campaign;
  }

  advanceStage(
    workspaceId: string,
    id: string,
    dto: AdvanceCampaignStageDto,
  ): CampaignItem {
    const campaign = this.findOne(workspaceId, id);

    // Enforce stage prerequisites
    if (dto.toStage === CampaignStage.SCRIPTING_PLANNING) {
      if (!campaign.title || !campaign.description) {
        throw new BadRequestException('Campaign title and description are required to enter Scripting & Planning.');
      }
    } else if (dto.toStage === CampaignStage.RECORDING_UPLOAD) {
      const hasApprovedScript =
        campaign.scriptApproved ||
        (campaign.scripts && campaign.scripts.some((s) => s.status === 'APPROVED'));
      if (!hasApprovedScript) {
        throw new BadRequestException(
          'Cannot advance to Recording & Asset Upload until the script is officially approved.',
        );
      }
    } else if (dto.toStage === CampaignStage.EDITING_FINAL) {
      const hasFootage =
        (campaign.assetLinks && campaign.assetLinks.some((a) => a.category === 'RAW_FOOTAGE' || a.category === 'AUDIO_VO')) ||
        (campaign.footageChecklist && campaign.footageChecklist.some((f) => f.status === 'DONE'));
      if (!hasFootage) {
        throw new BadRequestException(
          'Cannot advance to Editing & Final Asset without recorded footage checklist items or raw asset uploads.',
        );
      }
    } else if (dto.toStage === CampaignStage.POSTING_COMPLETION) {
      const hasApprovedAsset =
        campaign.finalAssetApproved ||
        (campaign.assetLinks && campaign.assetLinks.some((a) => a.isFinalApproved || a.category === 'FINAL_APPROVED'));
      if (!hasApprovedAsset) {
        throw new BadRequestException(
          'Cannot advance to Posting & Completion until the final edited asset is approved.',
        );
      }
    }

    const now = new Date().toISOString();
    const fromStage = campaign.stage;
    campaign.stage = dto.toStage;
    campaign.updatedAt = now;

    // Calculate stage progress percent
    const stageWeights: Record<CampaignStage, number> = {
      [CampaignStage.INITIAL_IDEA]: 15,
      [CampaignStage.SCRIPTING_PLANNING]: 35,
      [CampaignStage.RECORDING_UPLOAD]: 60,
      [CampaignStage.EDITING_FINAL]: 85,
      [CampaignStage.POSTING_COMPLETION]: 100,
    };
    campaign.progressPercent = stageWeights[dto.toStage] || campaign.progressPercent;

    if (dto.toStage === CampaignStage.POSTING_COMPLETION && !campaign.status) {
      campaign.status = ContentStatus.PUBLISHED;
    }

    const historyRecord: CampaignStageHistoryItem = {
      id: `sth-${Date.now()}`,
      fromStage,
      toStage: dto.toStage,
      actorId: dto.actorId || 'acting-profile',
      actorName: dto.actorName || 'Acting Profile',
      timestamp: now,
      notes: dto.notes || `Advanced stage from ${fromStage} to ${dto.toStage}`,
    };

    if (!campaign.stageHistory) campaign.stageHistory = [];
    campaign.stageHistory.push(historyRecord);

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: `Stage transitioned to ${dto.toStage}`,
      actorName: dto.actorName || 'Acting Profile',
      timestamp: now,
      details: dto.notes || `Moved from ${fromStage} to ${dto.toStage}`,
    });

    return campaign;
  }

  // ==========================================
  // SCRIPT VERSIONING (Stage 2)
  // ==========================================

  addScriptVersion(
    workspaceId: string,
    id: string,
    dto: CreateScriptVersionDto,
  ): ScriptVersion {
    const campaign = this.findOne(workspaceId, id);
    if (!campaign.scripts) campaign.scripts = [];

    const now = new Date().toISOString();
    const nextVer = campaign.scripts.length + 1;

    const version: ScriptVersion = {
      id: `scr-${Date.now()}`,
      versionNumber: nextVer,
      content: dto.content,
      hook: dto.hook,
      shotBreakdown: dto.shotBreakdown,
      cta: dto.cta,
      caption: dto.caption,
      hashtags: dto.hashtags,
      authorId: dto.authorId || 'acting-profile',
      authorName: dto.authorName || 'Acting Profile',
      status: 'DRAFT',
      timestamp: now,
    };

    campaign.scripts.push(version);
    campaign.updatedAt = now;

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: `Created script revision v${nextVer}`,
      actorName: dto.authorName || 'Acting Profile',
      timestamp: now,
      details: dto.revisionNote || `Added script version ${nextVer}`,
    });

    return version;
  }

  updateScriptStatus(
    workspaceId: string,
    id: string,
    scriptId: string,
    dto: UpdateScriptStatusDto,
  ): ScriptVersion {
    const campaign = this.findOne(workspaceId, id);
    if (!campaign.scripts) {
      throw new NotFoundException(`No scripts found for campaign ${id}`);
    }

    const script = campaign.scripts.find((s) => s.id === scriptId);
    if (!script) {
      throw new NotFoundException(`Script version ${scriptId} not found`);
    }

    script.status = dto.status;
    script.feedback = dto.feedback;
    campaign.updatedAt = new Date().toISOString();

    if (dto.status === 'APPROVED') {
      campaign.scriptApproved = true;
      campaign.scriptReviewerId = dto.actorId;
    } else {
      campaign.scriptApproved = false;
    }

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: `Script v${script.versionNumber} marked ${dto.status}`,
      actorName: dto.actorName || 'Acting Profile',
      timestamp: new Date().toISOString(),
      details: dto.feedback || `Script status updated to ${dto.status}`,
    });

    return script;
  }

  // ==========================================
  // FOOTAGE CHECKLIST (Stage 3)
  // ==========================================

  updateFootageChecklist(
    workspaceId: string,
    id: string,
    dto: UpdateFootageChecklistDto,
  ): FootageChecklistItem[] {
    const campaign = this.findOne(workspaceId, id);
    campaign.footageChecklist = dto.items;
    campaign.updatedAt = new Date().toISOString();

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: 'Updated footage checklist',
      actorName: 'Acting Profile',
      timestamp: new Date().toISOString(),
      details: `Updated ${dto.items.length} shot checklist items`,
    });

    return campaign.footageChecklist;
  }

  // ==========================================
  // ASSET LINKING & ISOLATION (Section 10)
  // ==========================================

  getCampaignAssets(workspaceId: string, id: string): CampaignAssetLink[] {
    const campaign = this.findOne(workspaceId, id);
    return campaign.assetLinks || [];
  }

  linkAsset(
    workspaceId: string,
    id: string,
    dto: LinkCampaignAssetDto,
  ): CampaignAssetLink {
    const campaign = this.findOne(workspaceId, id);
    if (!campaign.assetLinks) campaign.assetLinks = [];

    const now = new Date().toISOString();
    const linkId = `link-${Date.now()}`;
    const assetId = dto.assetId || `ast-${Date.now().toString(36)}`;

    const link: CampaignAssetLink = {
      id: linkId,
      assetId,
      campaignId: campaign.id,
      workspaceId,
      title: dto.title,
      fileName: dto.fileName,
      fileSize: dto.fileSize,
      mimeType: dto.mimeType,
      category: dto.category,
      stage: dto.stage,
      url: dto.url,
      uploadedBy: dto.uploadedBy || 'acting-profile',
      uploadedByName: dto.uploadedByName || 'Acting Profile',
      isFinalApproved: dto.isFinalApproved,
      createdAt: now,
    };

    campaign.assetLinks.unshift(link);
    if (dto.isFinalApproved || dto.category === 'FINAL_APPROVED') {
      campaign.finalAssetApproved = true;
      campaign.finalAssetUrl = dto.url;
    }
    campaign.updatedAt = now;

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: 'Linked asset to campaign',
      actorName: dto.uploadedByName || 'Acting Profile',
      timestamp: now,
      details: `Linked "${dto.title}" (${dto.category}) to stage ${dto.stage}`,
    });

    return link;
  }

  unlinkAsset(workspaceId: string, id: string, linkId: string): void {
    const campaign = this.findOne(workspaceId, id);
    if (!campaign.assetLinks) return;

    const index = campaign.assetLinks.findIndex((l) => l.id === linkId);
    if (index === -1) {
      throw new NotFoundException(`Asset link ${linkId} not found on campaign ${id}`);
    }

    const removed = campaign.assetLinks.splice(index, 1)[0];
    campaign.updatedAt = new Date().toISOString();

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: 'Unlinked asset from campaign',
      actorName: 'Acting Profile',
      timestamp: new Date().toISOString(),
      details: `Unlinked "${removed.title}". (File remains in global library)`,
    });
  }

  // ==========================================
  // SHARED TASK ENGINE INTEGRATION (Section 9)
  // ==========================================

  createCampaignTask(
    workspaceId: string,
    id: string,
    dto: CreateCampaignTaskDto,
  ): TaskItem {
    const campaign = this.findOne(workspaceId, id);

    // Prevent duplicate task creation with exact title in this campaign
    const existingTasks = this.getCampaignTasks(workspaceId, id);
    const existing = existingTasks.find(
      (t) => t.title.trim().toLowerCase() === dto.title.trim().toLowerCase(),
    );
    if (existing) {
      return existing; // idempotent retry prevention
    }

    const created = this.tasksService.create(
      {
        workspaceId,
        title: dto.title.trim(),
        assigneeId: dto.assigneeId || campaign.ownerId,
        priority: dto.priority || campaign.priority || TaskPriority.HIGH,
        deadline: dto.deadline || campaign.targetPublishDate,
        linkedRecord: {
          id: campaign.id,
          title: campaign.title,
          type: 'campaign',
        },
      },
      dto.assigneeId || campaign.ownerId,
      'Campaign Manager',
    );

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: 'Created stage task',
      actorName: 'Campaign Manager',
      timestamp: new Date().toISOString(),
      details: `Generated task "${dto.title}" for stage ${dto.stage}`,
    });

    return created;
  }

  getCampaignTasks(workspaceId: string, id: string): TaskItem[] {
    const allTasks = this.tasksService.findAll(workspaceId, '', { mine: false });
    return allTasks.filter(
      (t) => t.linkedRecord && t.linkedRecord.type === 'campaign' && t.linkedRecord.id === id,
    );
  }

  archiveCampaign(workspaceId: string, id: string): CampaignItem {
    const campaign = this.findOne(workspaceId, id);
    campaign.status = ContentStatus.CANCELLED;
    campaign.updatedAt = new Date().toISOString();

    campaign.activity.push({
      id: `act-${Date.now()}`,
      action: 'Campaign archived',
      actorName: 'Acting Profile',
      timestamp: new Date().toISOString(),
      details: 'Campaign archived and closed.',
    });

    return campaign;
  }

  // ==========================================
  // MILESTONE / CONTENT EVENTS (Calendar integration)
  // ==========================================

  createContentEvent(dto: CreateContentEventDto): ContentEventItem {
    const campaign = this.findOne(dto.workspaceId, dto.campaignId);
    const now = new Date().toISOString();
    const eventId = `ev-${Date.now().toString(36)}`;

    const event: ContentEventItem = {
      id: eventId,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      workspaceId: dto.workspaceId,
      title: dto.title,
      eventType: dto.eventType,
      plannedDate: dto.plannedDate,
      ownerId: dto.ownerId,
      status: ContentStatus.PLANNED,
      platform: dto.platform,
      notes: dto.notes,
      rescheduleHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    campaign.contentItems.push(event);
    campaign.updatedAt = now;
    return event;
  }

  rescheduleContentEvent(
    workspaceId: string,
    eventId: string,
    dto: RescheduleContentEventDto,
  ): ContentEventItem {
    for (const campaign of this.campaigns) {
      if (campaign.workspaceId !== workspaceId) continue;
      const event = campaign.contentItems.find((e) => e.id === eventId);
      if (event) {
        const now = new Date().toISOString();
        const historyRecord: RescheduleEvent = {
          id: `resch-${Date.now()}`,
          oldDeadline: event.plannedDate,
          newDeadline: dto.newDate,
          reason: dto.reason,
          actorId: dto.actorId || 'system',
          actorName: 'Acting Profile',
          timestamp: now,
        };

        event.rescheduleHistory.push(historyRecord);
        event.plannedDate = dto.newDate;
        event.updatedAt = now;

        campaign.activity.push({
          id: `act-${Date.now()}`,
          action: 'Milestone rescheduled',
          actorName: 'Acting Profile',
          timestamp: now,
          details: `Rescheduled "${event.title}" to ${dto.newDate}. Reason: ${dto.reason}`,
        });
        campaign.updatedAt = now;

        return event;
      }
    }
    throw new NotFoundException(`Content event ${eventId} not found in workspace ${workspaceId}`);
  }

  markContentPublished(
    workspaceId: string,
    eventId: string,
    dto: MarkContentPublishedDto,
  ): ContentEventItem {
    for (const campaign of this.campaigns) {
      if (campaign.workspaceId !== workspaceId) continue;
      const event = campaign.contentItems.find((e) => e.id === eventId);
      if (event) {
        const now = new Date().toISOString();
        event.status = ContentStatus.PUBLISHED;
        event.actualDate = dto.actualPublishDate || now;
        event.publicUrl = dto.publicUrl;
        event.updatedAt = now;

        const total = campaign.contentItems.length;
        const publishedCount = campaign.contentItems.filter((e) => e.status === ContentStatus.PUBLISHED).length;
        campaign.progressPercent = total > 0 ? Math.round((publishedCount / total) * 100) : 100;
        if (publishedCount === total) {
          campaign.stage = CampaignStage.POSTING_COMPLETION;
          campaign.status = ContentStatus.PUBLISHED;
          campaign.actualPublishDate = event.actualDate;
        }

        campaign.activity.push({
          id: `act-${Date.now()}`,
          action: 'Content published',
          actorName: 'Acting Profile',
          timestamp: now,
          details: `Published "${event.title}". URL: ${dto.publicUrl}`,
        });
        campaign.updatedAt = now;

        return event;
      }
    }
    throw new NotFoundException(`Content event ${eventId} not found in workspace ${workspaceId}`);
  }

  getAllContentEvents(workspaceId: string): ContentEventItem[] {
    const list: ContentEventItem[] = [];
    for (const campaign of this.campaigns) {
      if (campaign.workspaceId === workspaceId) {
        list.push(...campaign.contentItems);
      }
    }
    return list;
  }
}
