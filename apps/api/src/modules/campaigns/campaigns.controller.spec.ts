import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { TasksService } from '../tasks/tasks.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CampaignStage, ContentPlatform, TaskPriority } from '@corviin-hub/shared';

describe('CampaignsController & CampaignsService', () => {
  let controller: CampaignsController;
  let service: CampaignsService;
  let tasksService: TasksService;

  const TECH_WS = 'ws-tech-0001-0000-000000000001';
  const REAL_WS = 'ws-real-0002-0000-000000000002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [
        CampaignsService,
        TasksService,
        WorkspacesService,
        ProfilesService,
      ],
    }).compile();

    controller = module.get<CampaignsController>(CampaignsController);
    service = module.get<CampaignsService>(CampaignsService);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(tasksService).toBeDefined();
  });

  describe('Campaigns CRUD & Workspace Boundaries', () => {
    it('returns campaigns isolated by workspace', () => {
      const techRes = controller.findAll(TECH_WS);
      expect(techRes.length).toBeGreaterThanOrEqual(1);
      techRes.forEach((c) => expect(c.workspaceId).toBe(TECH_WS));

      const realRes = controller.findAll(REAL_WS);
      expect(realRes.length).toBeGreaterThanOrEqual(1);
      realRes.forEach((c) => expect(c.workspaceId).toBe(REAL_WS));
    });

    it('enforces workspace boundary on findOne', () => {
      const techCampaign = controller.findOne('cmp-tech-001', TECH_WS);
      expect(techCampaign.id).toBe('cmp-tech-001');

      expect(() => controller.findOne('cmp-tech-001', REAL_WS)).toThrow(NotFoundException);
    });

    it('creates a new campaign in INITIAL_IDEA stage', () => {
      const created = controller.create(
        {
          workspaceId: TECH_WS,
          title: 'Antigravity Zero-Animation Deep Dive',
          description: 'Technical teardown of DOM paint timings and instant transitions.',
          ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          platform: ContentPlatform.YOUTUBE,
          startDate: '2026-11-10T09:00:00.000Z',
          targetPublishDate: '2026-11-25T17:00:00.000Z',
        },
        TECH_WS,
      );

      expect(created.id).toBeDefined();
      expect(created.stage).toBe(CampaignStage.INITIAL_IDEA);
      expect(created.title).toBe('Antigravity Zero-Animation Deep Dive');
      expect(created.stageHistory.length).toBe(1);
    });

    it('rejects campaign creation without title or description', () => {
      expect(() =>
        controller.create(
          {
            workspaceId: TECH_WS,
            title: '',
            description: '',
            ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            platform: ContentPlatform.YOUTUBE,
            startDate: '2026-11-10T09:00:00.000Z',
            targetPublishDate: '2026-11-25T17:00:00.000Z',
          },
          TECH_WS,
        ),
      ).toThrow(BadRequestException);
    });
  });

  describe('5-Stage Progression & Prerequisite Enforcement', () => {
    let testCampaignId: string;

    beforeEach(() => {
      const c = controller.create(
        {
          workspaceId: TECH_WS,
          title: 'Pipeline Progression Test Campaign',
          description: 'Testing strict transition prerequisites across all 5 stages.',
          ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          platform: ContentPlatform.LINKEDIN,
          startDate: '2026-11-06T09:00:00.000Z',
          targetPublishDate: '2026-11-20T17:00:00.000Z',
        },
        TECH_WS,
      );
      testCampaignId = c.id;
    });

    it('advances from INITIAL_IDEA to SCRIPTING_PLANNING', () => {
      const advanced = controller.advanceStage(
        testCampaignId,
        {
          toStage: CampaignStage.SCRIPTING_PLANNING,
          notes: 'Concept approved by marketing lead.',
        },
        TECH_WS,
      );

      expect(advanced.stage).toBe(CampaignStage.SCRIPTING_PLANNING);
      expect(advanced.stageHistory.length).toBe(2);
      expect(advanced.stageHistory[1].toStage).toBe(CampaignStage.SCRIPTING_PLANNING);
    });

    it('blocks advancing to RECORDING_UPLOAD without an approved script', () => {
      controller.advanceStage(
        testCampaignId,
        { toStage: CampaignStage.SCRIPTING_PLANNING },
        TECH_WS,
      );

      // Attempt to move to Recording without approving script
      expect(() =>
        controller.advanceStage(
          testCampaignId,
          { toStage: CampaignStage.RECORDING_UPLOAD },
          TECH_WS,
        ),
      ).toThrow(BadRequestException);
    });

    it('allows advancing to RECORDING_UPLOAD once script is approved', () => {
      controller.advanceStage(
        testCampaignId,
        { toStage: CampaignStage.SCRIPTING_PLANNING },
        TECH_WS,
      );

      // Add script version
      const script = controller.addScriptVersion(
        testCampaignId,
        {
          content: 'Full script with hooks and CTAs.',
          hook: 'Attention engineering leaders.',
        },
        TECH_WS,
      );

      // Approve script
      controller.updateScriptStatus(
        testCampaignId,
        script.id,
        { status: 'APPROVED', feedback: 'Great hook.' },
        TECH_WS,
      );

      // Now advancing to Recording should succeed
      const advanced = controller.advanceStage(
        testCampaignId,
        { toStage: CampaignStage.RECORDING_UPLOAD },
        TECH_WS,
      );
      expect(advanced.stage).toBe(CampaignStage.RECORDING_UPLOAD);
    });

    it('blocks advancing to EDITING_FINAL without footage or raw uploads', () => {
      // Setup approved script and move to recording
      controller.advanceStage(testCampaignId, { toStage: CampaignStage.SCRIPTING_PLANNING }, TECH_WS);
      const script = controller.addScriptVersion(testCampaignId, { content: 'Script' }, TECH_WS);
      controller.updateScriptStatus(testCampaignId, script.id, { status: 'APPROVED' }, TECH_WS);
      controller.advanceStage(testCampaignId, { toStage: CampaignStage.RECORDING_UPLOAD }, TECH_WS);

      // Attempt to move to Editing without footage checklist or raw upload
      expect(() =>
        controller.advanceStage(testCampaignId, { toStage: CampaignStage.EDITING_FINAL }, TECH_WS),
      ).toThrow(BadRequestException);

      // Link raw footage asset
      controller.linkAsset(
        testCampaignId,
        {
          title: 'Raw B-roll 4K',
          fileName: 'broll.mp4',
          fileSize: 500000000,
          mimeType: 'video/mp4',
          category: 'RAW_FOOTAGE',
          stage: CampaignStage.RECORDING_UPLOAD,
          url: 'https://cdn.corviin.com/broll.mp4',
        },
        TECH_WS,
      );

      // Advancing to Editing now succeeds
      const advanced = controller.advanceStage(
        testCampaignId,
        { toStage: CampaignStage.EDITING_FINAL },
        TECH_WS,
      );
      expect(advanced.stage).toBe(CampaignStage.EDITING_FINAL);
    });

    it('blocks advancing to POSTING_COMPLETION without approved final asset', () => {
      // Setup campaign in EDITING_FINAL
      controller.advanceStage(testCampaignId, { toStage: CampaignStage.SCRIPTING_PLANNING }, TECH_WS);
      const script = controller.addScriptVersion(testCampaignId, { content: 'Script' }, TECH_WS);
      controller.updateScriptStatus(testCampaignId, script.id, { status: 'APPROVED' }, TECH_WS);
      controller.advanceStage(testCampaignId, { toStage: CampaignStage.RECORDING_UPLOAD }, TECH_WS);
      controller.linkAsset(
        testCampaignId,
        {
          title: 'Raw footage',
          fileName: 'raw.mp4',
          fileSize: 1000,
          mimeType: 'video/mp4',
          category: 'RAW_FOOTAGE',
          stage: CampaignStage.RECORDING_UPLOAD,
          url: 'https://cdn.corviin.com/raw.mp4',
        },
        TECH_WS,
      );
      controller.advanceStage(testCampaignId, { toStage: CampaignStage.EDITING_FINAL }, TECH_WS);

      // Moving to posting without approved final asset fails
      expect(() =>
        controller.advanceStage(testCampaignId, { toStage: CampaignStage.POSTING_COMPLETION }, TECH_WS),
      ).toThrow(BadRequestException);

      // Link final approved asset
      controller.linkAsset(
        testCampaignId,
        {
          title: 'Final 4K Master Cut',
          fileName: 'master_cut.mp4',
          fileSize: 120000000,
          mimeType: 'video/mp4',
          category: 'FINAL_APPROVED',
          stage: CampaignStage.EDITING_FINAL,
          url: 'https://cdn.corviin.com/master.mp4',
          isFinalApproved: true,
        },
        TECH_WS,
      );

      // Now advancing to Posting succeeds
      const completedStage = controller.advanceStage(
        testCampaignId,
        { toStage: CampaignStage.POSTING_COMPLETION },
        TECH_WS,
      );
      expect(completedStage.stage).toBe(CampaignStage.POSTING_COMPLETION);
    });
  });

  describe('Campaign Assets Section & Isolation', () => {
    it('shows only assets linked to the current campaign by default', () => {
      const techAssets = controller.getCampaignAssets('cmp-tech-001', TECH_WS);
      expect(techAssets.length).toBeGreaterThanOrEqual(2);
      techAssets.forEach((a) => expect(a.campaignId).toBe('cmp-tech-001'));
    });

    it('unlinks an asset without deleting the global record', () => {
      const link = controller.linkAsset(
        'cmp-tech-001',
        {
          title: 'Temporary reference document',
          fileName: 'ref.pdf',
          fileSize: 2048,
          mimeType: 'application/pdf',
          category: 'REFERENCES',
          stage: CampaignStage.INITIAL_IDEA,
          url: 'https://cdn.corviin.com/ref.pdf',
        },
        TECH_WS,
      );

      const beforeCount = controller.getCampaignAssets('cmp-tech-001', TECH_WS).length;
      controller.unlinkAsset('cmp-tech-001', link.id, TECH_WS);
      const afterCount = controller.getCampaignAssets('cmp-tech-001', TECH_WS).length;

      expect(afterCount).toBe(beforeCount - 1);
    });
  });

  describe('Shared Task Engine Integration', () => {
    it('creates campaign tasks in shared TasksService and prevents duplicate creation on retry', () => {
      const task1 = controller.createCampaignTask(
        'cmp-tech-001',
        {
          title: 'Record 4K screencast demo',
          stage: CampaignStage.RECORDING_UPLOAD,
          priority: TaskPriority.HIGH,
        },
        TECH_WS,
      );

      expect(task1.id).toBeDefined();
      expect(task1.linkedRecord?.type).toBe('campaign');
      expect(task1.linkedRecord?.id).toBe('cmp-tech-001');

      // Retry: same task title should be idempotent and return existing task
      const task2 = controller.createCampaignTask(
        'cmp-tech-001',
        {
          title: 'Record 4K screencast demo',
          stage: CampaignStage.RECORDING_UPLOAD,
        },
        TECH_WS,
      );

      expect(task2.id).toBe(task1.id);

      // Verify task appears in getCampaignTasks
      const campaignTasks = controller.getCampaignTasks('cmp-tech-001', TECH_WS);
      expect(campaignTasks.some((t) => t.id === task1.id)).toBe(true);
    });
  });
});

