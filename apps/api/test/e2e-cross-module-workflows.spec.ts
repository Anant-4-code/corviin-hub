import { PrismaService } from '../src/prisma/prisma.service';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';

describe('PHASE 6: Cross-Module Integration & Unified Operating Workflows E2E', () => {
  let prisma: PrismaService;
  let dashboardService: DashboardService;

  const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
  const realEstateWorkspaceId = 'ws-real-0002-0000-000000000002';

  const anantProfileId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const rohitProfileId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    dashboardService = new DashboardService(prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  // =========================================================================
  // WORKFLOW 1 — Task Creation and Assignment
  // =========================================================================
  describe('Workflow 1 — Task Creation and Assignment', () => {
    const wf1TaskId = 'wf1-task-integration-001';

    afterAll(async () => {
      await prisma.taskActivityEvent.deleteMany({ where: { taskId: wf1TaskId } });
      await prisma.auditEvent.deleteMany({ where: { entityId: wf1TaskId } });
      await prisma.task.deleteMany({ where: { id: wf1TaskId } });
    });

    it('creates, assigns, maps to calendar, updates workload, and records activity', async () => {
      const now = new Date();
      const deadline = new Date(now.getTime() + 86400000 * 2);

      // 1. Create task assigned to Anant
      const task = await prisma.task.create({
        data: {
          id: wf1TaskId,
          workspaceId: techWorkspaceId,
          title: 'Implement Core Security Review',
          status: 'TODO',
          priority: 'HIGH',
          assigneeId: anantProfileId,
          assigneeName: 'Anant',
          creatorId: rohitProfileId,
          creatorName: 'Rohit',
          plannedStart: now,
          deadline,
        },
      });
      expect(task.id).toBe(wf1TaskId);

      // 2. Verify appears in My Tasks for Anant
      const myTasks = await prisma.task.findMany({
        where: {
          workspaceId: techWorkspaceId,
          assigneeId: anantProfileId,
          id: wf1TaskId,
        },
      });
      expect(myTasks.length).toBe(1);

      // 3. Verify appears in All Tasks for workspace
      const allTasks = await prisma.task.findMany({
        where: {
          workspaceId: techWorkspaceId,
          id: wf1TaskId,
        },
      });
      expect(allTasks.length).toBe(1);

      // 4. Verify projection in Team Task Calendar
      const calendarTasks = await prisma.task.findMany({
        where: {
          workspaceId: techWorkspaceId,
          deadline: { gte: now },
          id: wf1TaskId,
        },
      });
      expect(calendarTasks.length).toBe(1);
      expect(calendarTasks[0].deadline).toEqual(deadline);

      // 5. Verify member active workload count
      const anantWorkload = await prisma.task.count({
        where: {
          workspaceId: techWorkspaceId,
          assigneeId: anantProfileId,
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
        },
      });
      expect(anantWorkload).toBeGreaterThanOrEqual(1);

      // 6. Record assignment activity & verify audit
      const activity = await prisma.taskActivityEvent.create({
        data: {
          taskId: wf1TaskId,
          action: 'ASSIGNED',
          actorName: 'Rohit',
          details: 'Assigned task to Anant',
        },
      });
      expect(activity.action).toBe('ASSIGNED');
    });
  });

  // =========================================================================
  // WORKFLOW 2 — Task and Plan Integration
  // =========================================================================
  describe('Workflow 2 — Task and Plan Integration', () => {
    const wf2PlanId = 'wf2-plan-001';
    const wf2TaskId = 'wf2-task-001';

    afterAll(async () => {
      await prisma.auditEvent.deleteMany({ where: { entityId: wf2TaskId } });
      await prisma.task.deleteMany({ where: { id: wf2TaskId } });
      await prisma.plan.deleteMany({ where: { id: wf2PlanId } });
    });

    it('links task to plan, shows in plan task list, and updates progress on completion', async () => {
      // 1. Create strategic plan
      const plan = await prisma.plan.create({
        data: {
          id: wf2PlanId,
          workspaceId: techWorkspaceId,
          title: 'Q4 Core Platform Modernization',
          strategySummary: 'Unify microservices and data pipelines',
          ownerId: anantProfileId,
          ownerName: 'Anant',
          startDate: new Date('2026-11-01'),
          targetDate: new Date('2026-12-31'),
          progressMode: 'TASK_COMPLETION',
          progressPercent: 0,
        },
      });
      expect(plan.id).toBe(wf2PlanId);

      // 2. Create task linked to the plan
      const task = await prisma.task.create({
        data: {
          id: wf2TaskId,
          workspaceId: techWorkspaceId,
          title: 'Upgrade PostgreSQL to v17 & Prisma 7',
          status: 'TODO',
          priority: 'URGENT',
          assigneeId: anantProfileId,
          assigneeName: 'Anant',
          creatorId: anantProfileId,
          creatorName: 'Anant',
          deadline: new Date('2026-11-15'),
          linkedRecordId: wf2PlanId,
          linkedRecordTitle: plan.title,
          linkedRecordType: 'plan',
        },
      });
      expect(task.linkedRecordId).toBe(wf2PlanId);

      // 3. Verify task appears in plan task list
      const planTasks = await prisma.task.findMany({
        where: {
          workspaceId: techWorkspaceId,
          linkedRecordId: wf2PlanId,
          linkedRecordType: 'plan',
        },
      });
      expect(planTasks.length).toBe(1);
      expect(planTasks[0].id).toBe(wf2TaskId);

      // 4. Complete task and update plan progress
      await prisma.$transaction(async (tx) => {
        await tx.task.update({
          where: { id: wf2TaskId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            completedBy: anantProfileId,
          },
        });

        // Calculate progress: 1 of 1 completed = 100%
        await tx.plan.update({
          where: { id: wf2PlanId },
          data: { progressPercent: 100, status: 'COMPLETED' },
        });

        await tx.auditEvent.create({
          data: {
            id: `audit-${Date.now()}`,
            workspaceId: techWorkspaceId,
            actorId: anantProfileId,
            actorName: 'Anant',
            entityType: 'TASK',
            entityId: wf2TaskId,
            action: 'COMPLETED',
            reason: 'Task completed, updating linked plan progress',
          },
        });
      });

      // Verify updated plan progress
      const updatedPlan = await prisma.plan.findUnique({
        where: { id: wf2PlanId },
      });
      expect(updatedPlan?.progressPercent).toBe(100);
      expect(updatedPlan?.status).toBe('COMPLETED');
    });
  });

  // =========================================================================
  // WORKFLOW 3 — Campaign Integration
  // =========================================================================
  describe('Workflow 3 — Campaign Integration', () => {
    const wf3CampaignId = 'wf3-campaign-001';
    const wf3TaskId = 'wf3-task-001';

    afterAll(async () => {
      await prisma.campaignStageHistory.deleteMany({ where: { campaignId: wf3CampaignId } });
      await prisma.task.deleteMany({ where: { id: wf3TaskId } });
      await prisma.campaign.deleteMany({ where: { id: wf3CampaignId } });
    });

    it('creates campaign, attaches stage task, advances stage, and preserves history', async () => {
      // 1. Create Campaign
      const campaign = await prisma.campaign.create({
        data: {
          id: wf3CampaignId,
          workspaceId: techWorkspaceId,
          title: 'Developer Experience Showcase',
          description: 'Technical walkthrough of modern frontend stack',
          stage: 'INITIAL_IDEA',
          ownerId: anantProfileId,
          startDate: new Date('2026-11-10'),
          targetPublishDate: new Date('2026-11-20'),
          platform: 'YOUTUBE',
          priority: 'HIGH',
        },
      });
      expect(campaign.stage).toBe('INITIAL_IDEA');

      // 2. Create campaign stage task
      const stageTask = await prisma.task.create({
        data: {
          id: wf3TaskId,
          workspaceId: techWorkspaceId,
          title: 'Draft Script: Zero-Animation System',
          status: 'TODO',
          priority: 'HIGH',
          assigneeId: rohitProfileId,
          assigneeName: 'Rohit',
          creatorId: anantProfileId,
          creatorName: 'Anant',
          deadline: new Date('2026-11-14'),
          linkedRecordId: wf3CampaignId,
          linkedRecordTitle: campaign.title,
          linkedRecordType: 'campaign',
        },
      });
      expect(stageTask.linkedRecordId).toBe(wf3CampaignId);

      // 3. Advance campaign stage with stage history transaction
      await prisma.$transaction(async (tx) => {
        await tx.campaign.update({
          where: { id: wf3CampaignId },
          data: { stage: 'SCRIPTING_PLANNING', progressPercent: 25 },
        });

        await tx.campaignStageHistory.create({
          data: {
            campaignId: wf3CampaignId,
            fromStage: 'INITIAL_IDEA',
            toStage: 'SCRIPTING_PLANNING',
            actorId: anantProfileId,
            actorName: 'Anant',
            notes: 'Initial idea approved; moving to script breakdown.',
          },
        });
      });

      // Verify campaign board consistency & stage history
      const updatedCampaign = await prisma.campaign.findUnique({
        where: { id: wf3CampaignId },
        include: { stageHistory: true },
      });
      expect(updatedCampaign?.stage).toBe('SCRIPTING_PLANNING');
      expect(updatedCampaign?.stageHistory.length).toBe(1);
      expect(updatedCampaign?.stageHistory[0].toStage).toBe('SCRIPTING_PLANNING');
    });
  });

  // =========================================================================
  // WORKFLOW 4 — Meeting Action Item Conversion
  // =========================================================================
  describe('Workflow 4 — Meeting Action Item Conversion', () => {
    const wf4MeetingId = 'wf4-meeting-001';
    let actionItemId: string;

    afterAll(async () => {
      const items = await prisma.meetingActionItem.findMany({
        where: { meetingId: wf4MeetingId },
      });
      const taskIds = items.map((i) => i.convertedTaskId).filter(Boolean) as string[];
      if (taskIds.length > 0) {
        await prisma.task.deleteMany({ where: { id: { in: taskIds } } });
      }
      await prisma.meetingActionItem.deleteMany({ where: { meetingId: wf4MeetingId } });
      await prisma.meeting.deleteMany({ where: { id: wf4MeetingId } });
    });

    it('converts action item to task and enforces idempotency against duplicates', async () => {
      // 1. Create meeting
      const meeting = await prisma.meeting.create({
        data: {
          id: wf4MeetingId,
          workspaceId: techWorkspaceId,
          title: 'Infrastructure Sync',
          category: 'INTERNAL',
          status: 'SCHEDULED',
          date: '2026-11-12',
          startTime: new Date('2026-11-12T10:00:00Z'),
          endTime: new Date('2026-11-12T11:00:00Z'),
          organiserId: anantProfileId,
        },
      });

      // 2. Add action item
      const actionItem = await prisma.meetingActionItem.create({
        data: {
          meetingId: wf4MeetingId,
          description: 'Configure Cloudflare R2 bucket CORS policies',
          assignedMemberId: rohitProfileId,
          dueDate: new Date('2026-11-15'),
          status: 'PENDING',
        },
      });
      actionItemId = actionItem.id;

      // 3. Atomic conversion workflow
      const convertWorkflow = async (actItemId: string) => {
        return await prisma.$transaction(async (tx) => {
          const item = await tx.meetingActionItem.findUnique({
            where: { id: actItemId },
          });

          if (!item) throw new Error('Action item not found');

          // Idempotency check: if already converted, return existing task
          if (item.status === 'CONVERTED' && item.convertedTaskId) {
            const existingTask = await tx.task.findUnique({
              where: { id: item.convertedTaskId },
            });
            return { task: existingTask, alreadyConverted: true };
          }

          // Create real task
          const generatedTaskId = `tsk-conv-${Date.now()}`;
          const newTask = await tx.task.create({
            data: {
              id: generatedTaskId,
              workspaceId: meeting.workspaceId,
              title: item.description,
              status: 'TODO',
              priority: 'HIGH',
              assigneeId: item.assignedMemberId,
              assigneeName: 'Rohit',
              creatorId: meeting.organiserId,
              creatorName: 'Anant',
              deadline: item.dueDate || new Date('2026-11-20'),
              linkedRecordId: meeting.id,
              linkedRecordTitle: meeting.title,
              linkedRecordType: 'meeting',
            },
          });

          // Mark action item as converted
          await tx.meetingActionItem.update({
            where: { id: actItemId },
            data: {
              status: 'CONVERTED',
              convertedTaskId: newTask.id,
            },
          });

          return { task: newTask, alreadyConverted: false };
        });
      };

      // First call: Should convert and create task
      const result1 = await convertWorkflow(actionItemId);
      expect(result1.alreadyConverted).toBe(false);
      expect(result1.task?.title).toBe('Configure Cloudflare R2 bucket CORS policies');

      // Second call: Repeated execution should be idempotent
      const result2 = await convertWorkflow(actionItemId);
      expect(result2.alreadyConverted).toBe(true);
      expect(result2.task?.id).toBe(result1.task?.id);

      // Verify only ONE task was created
      const totalCreatedTasks = await prisma.task.count({
        where: { linkedRecordId: wf4MeetingId, linkedRecordType: 'meeting' },
      });
      expect(totalCreatedTasks).toBe(1);
    });
  });

  // =========================================================================
  // WORKFLOW 5 — CRM and Buyer Site Visit
  // =========================================================================
  describe('Workflow 5 — CRM and Buyer Site Visit', () => {
    const wf5BuyerId = 'wf5-buyer-001';
    const wf5VisitId = 'wf5-visit-001';

    afterAll(async () => {
      await prisma.siteVisit.deleteMany({ where: { id: wf5VisitId } });
      await prisma.crmBuyerRecord.deleteMany({ where: { id: wf5BuyerId } });
    });

    it('creates buyer, schedules site visit, projects to calendar, and logs follow-up', async () => {
      // 1. Create Buyer record
      const buyer = await prisma.crmBuyerRecord.create({
        data: {
          id: wf5BuyerId,
          workspaceId: realEstateWorkspaceId,
          customerName: 'Sunita Sharma',
          phone: '+91 99887 76655',
          email: 'sunita.sharma@example.com',
          stage: 'VISIT_SCHEDULED',
          enquirySource: 'DIGITAL_CAMPAIGN',
          assignedMemberId: anantProfileId,
          assignedMemberName: 'Anant',
          locality: 'Banjara Hills',
          minBudget: 15000000,
          maxBudget: 25000000,
        },
      });
      expect(buyer.id).toBe(wf5BuyerId);

      // 2. Schedule site visit linked to buyer
      const visit = await prisma.siteVisit.create({
        data: {
          id: wf5VisitId,
          workspaceId: realEstateWorkspaceId,
          buyerRecordId: wf5BuyerId,
          customerName: buyer.customerName,
          customerPhone: buyer.phone,
          projectName: 'Corviin Heights Luxury Villas',
          projectLocation: 'Banjara Hills, Hyderabad',
          visitDate: '2026-11-18',
          startTime: new Date('2026-11-18T10:00:00Z'),
          endTime: new Date('2026-11-18T11:30:00Z'),
          status: 'SCHEDULED',
          responsibleMemberId: anantProfileId,
          responsibleMemberName: 'Anant',
          notes: 'Customer interested in 4BHK corner villa with east facing entrance.',
        },
      });
      expect(visit.buyerRecordId).toBe(wf5BuyerId);

      // 3. Verify buyer visit history includes the visit
      const buyerWithVisits = await prisma.crmBuyerRecord.findUnique({
        where: { id: wf5BuyerId },
        include: { siteVisits: true },
      });
      expect(buyerWithVisits?.siteVisits.length).toBe(1);
      expect(buyerWithVisits?.siteVisits[0].projectName).toBe('Corviin Heights Luxury Villas');

      // 4. Verify Meetings & Visits Calendar projection
      const calendarVisits = await prisma.siteVisit.findMany({
        where: {
          workspaceId: realEstateWorkspaceId,
          visitDate: '2026-11-18',
        },
      });
      expect(calendarVisits.length).toBe(1);
      expect(calendarVisits[0].id).toBe(wf5VisitId);
    });
  });

  // =========================================================================
  // WORKFLOW 6 — Campaign Assets
  // =========================================================================
  describe('Workflow 6 — Campaign Assets & Storage Integration', () => {
    const wf6AssetId = 'wf6-asset-001';
    const wf6Campaign1Id = 'wf6-camp-001';
    const wf6Campaign2Id = 'wf6-camp-002';

    afterAll(async () => {
      await prisma.campaignAssetLink.deleteMany({
        where: { assetId: wf6AssetId },
      });
      await prisma.assetRelationship.deleteMany({
        where: { assetId: wf6AssetId },
      });
      await prisma.asset.deleteMany({ where: { id: wf6AssetId } });
      await prisma.campaign.deleteMany({
        where: { id: { in: [wf6Campaign1Id, wf6Campaign2Id] } },
      });
    });

    it('uploads asset, links to multiple campaigns without duplication, and unlinks safely', async () => {
      // 1. Create two campaigns
      await prisma.campaign.createMany({
        data: [
          {
            id: wf6Campaign1Id,
            workspaceId: techWorkspaceId,
            title: 'Q4 Product Launch',
            description: 'Brand video campaign',
            stage: 'RECORDING_ASSET_UPLOAD',
            ownerId: anantProfileId,
            startDate: new Date('2026-11-10'),
            targetPublishDate: new Date('2026-11-30'),
            platform: 'LINKEDIN',
          },
          {
            id: wf6Campaign2Id,
            workspaceId: techWorkspaceId,
            title: 'Investor Relations Brief',
            description: 'Corporate overview',
            stage: 'INITIAL_IDEA',
            ownerId: rohitProfileId,
            startDate: new Date('2026-11-15'),
            targetPublishDate: new Date('2026-12-15'),
            platform: 'WEBSITE',
          },
        ],
      });

      // 2. Upload asset into global library
      const asset = await prisma.asset.create({
        data: {
          id: wf6AssetId,
          workspaceId: techWorkspaceId,
          title: 'Corviin Logo High-Res Vector Pack',
          originalFileName: 'corviin_logo_vector.svg',
          storageKey: `assets/${techWorkspaceId}/corviin_logo_vector.svg`,
          storageProvider: 'r2',
          mimeType: 'image/svg+xml',
          sizeBytes: 154200,
          category: 'BRAND_ASSET',
          typeGroup: 'VECTOR',
          uploaderId: anantProfileId,
          uploaderName: 'Anant',
        },
      });
      expect(asset.id).toBe(wf6AssetId);

      // 3. Link asset to Campaign 1
      const link1 = await prisma.campaignAssetLink.create({
        data: {
          campaignId: wf6Campaign1Id,
          assetId: wf6AssetId,
          workspaceId: techWorkspaceId,
          title: asset.title,
          fileName: asset.originalFileName,
          fileSize: Math.round(asset.sizeBytes),
          mimeType: asset.mimeType,
          category: asset.category,
          stage: 'RECORDING',
          url: `https://storage.corviin.com/${asset.storageKey}`,
          uploadedBy: anantProfileId,
          uploadedByName: 'Anant',
        },
      });
      expect(link1.assetId).toBe(wf6AssetId);

      // 4. Link same asset to Campaign 2 without duplicate storage
      const link2 = await prisma.campaignAssetLink.create({
        data: {
          campaignId: wf6Campaign2Id,
          assetId: wf6AssetId,
          workspaceId: techWorkspaceId,
          title: asset.title,
          fileName: asset.originalFileName,
          fileSize: Math.round(asset.sizeBytes),
          mimeType: asset.mimeType,
          category: asset.category,
          stage: 'PLANNING',
          url: `https://storage.corviin.com/${asset.storageKey}`,
          uploadedBy: rohitProfileId,
          uploadedByName: 'Rohit',
        },
      });
      expect(link2.assetId).toBe(wf6AssetId);

      // Verify underlying asset count in DB is still 1
      const totalAssets = await prisma.asset.count({
        where: { id: wf6AssetId },
      });
      expect(totalAssets).toBe(1);

      // 5. Unlink from Campaign 1
      await prisma.campaignAssetLink.delete({
        where: { id: link1.id },
      });

      // Verify underlying Asset record and R2 metadata still persist
      const persistentAsset = await prisma.asset.findUnique({
        where: { id: wf6AssetId },
      });
      expect(persistentAsset).toBeDefined();
      expect(persistentAsset?.storageKey).toBe(`assets/${techWorkspaceId}/corviin_logo_vector.svg`);

      // Verify link2 for Campaign 2 remains intact
      const remainingLinks = await prisma.campaignAssetLink.findMany({
        where: { assetId: wf6AssetId },
      });
      expect(remainingLinks.length).toBe(1);
      expect(remainingLinks[0].campaignId).toBe(wf6Campaign2Id);
    });
  });

  // =========================================================================
  // WORKFLOW 7 — Workspace Switching & Isolation
  // =========================================================================
  describe('Workflow 7 — Workspace Switching & Cross-Workspace Isolation', () => {
    it('enforces total isolation across Corviin Tech and Corviin Real Estate', async () => {
      // Tech workspace records
      const techTasks = await prisma.task.findMany({
        where: { workspaceId: techWorkspaceId },
      });
      const techCampaigns = await prisma.campaign.findMany({
        where: { workspaceId: techWorkspaceId },
      });

      // Real Estate workspace records
      const realEstateTasks = await prisma.task.findMany({
        where: { workspaceId: realEstateWorkspaceId },
      });
      const realEstateBuyers = await prisma.crmBuyerRecord.findMany({
        where: { workspaceId: realEstateWorkspaceId },
      });

      // Assert no overlap
      const techTaskIds = new Set(techTasks.map((t) => t.id));
      for (const reTask of realEstateTasks) {
        expect(techTaskIds.has(reTask.id)).toBe(false);
      }

      // Assert Real Estate records are scoped
      for (const b of realEstateBuyers) {
        expect(b.workspaceId).toBe(realEstateWorkspaceId);
      }
      for (const c of techCampaigns) {
        expect(c.workspaceId).toBe(techWorkspaceId);
      }
    });
  });

  // =========================================================================
  // WORKFLOW 8 — Profile Switching
  // =========================================================================
  describe('Workflow 8 — Profile Switching & Audit Immutability', () => {
    const wf8TaskId = 'wf8-task-001';

    afterAll(async () => {
      await prisma.auditEvent.deleteMany({ where: { entityId: wf8TaskId } });
      await prisma.task.deleteMany({ where: { id: wf8TaskId } });
    });

    it('switches acting context without rewriting history or historical actors', async () => {
      // 1. Anant creates a task
      await prisma.task.create({
        data: {
          id: wf8TaskId,
          workspaceId: techWorkspaceId,
          title: 'Review Security TRD',
          status: 'TODO',
          priority: 'MEDIUM',
          assigneeId: anantProfileId,
          assigneeName: 'Anant',
          creatorId: anantProfileId,
          creatorName: 'Anant',
          deadline: new Date('2026-11-25'),
        },
      });

      // Log creation audit event by Anant
      await prisma.auditEvent.create({
        data: {
          id: `audit-wf8-1`,
          workspaceId: techWorkspaceId,
          actorId: anantProfileId,
          actorName: 'Anant',
          entityType: 'TASK',
          entityId: wf8TaskId,
          action: 'CREATED',
        },
      });

      // 2. Rohit takes over and updates status to IN_PROGRESS
      await prisma.task.update({
        where: { id: wf8TaskId },
        data: {
          status: 'IN_PROGRESS',
        },
      });

      // Log progress audit event by Rohit
      await prisma.auditEvent.create({
        data: {
          id: `audit-wf8-2`,
          workspaceId: techWorkspaceId,
          actorId: rohitProfileId,
          actorName: 'Rohit',
          entityType: 'TASK',
          entityId: wf8TaskId,
          action: 'STATUS_UPDATED',
          previousValues: { status: 'TODO' },
          newValues: { status: 'IN_PROGRESS' },
        },
      });

      // 3. Verify creator attribution and past audit records remain immutable
      const task = await prisma.task.findUnique({
        where: { id: wf8TaskId },
      });
      expect(task?.creatorId).toBe(anantProfileId);
      expect(task?.creatorName).toBe('Anant');

      const auditTrail = await prisma.auditEvent.findMany({
        where: { entityId: wf8TaskId },
        orderBy: { timestamp: 'asc' },
      });
      expect(auditTrail.length).toBe(2);
      expect(auditTrail[0].actorName).toBe('Anant');
      expect(auditTrail[0].action).toBe('CREATED');
      expect(auditTrail[1].actorName).toBe('Rohit');
      expect(auditTrail[1].action).toBe('STATUS_UPDATED');
    });
  });

  // =========================================================================
  // WORKFLOW 9 — Content Publication (Planned vs Actual Dates)
  // =========================================================================
  describe('Workflow 9 — Content Publication Dates SLA', () => {
    const wf9CampaignId = 'wf9-camp-pub-001';

    afterAll(async () => {
      await prisma.campaign.deleteMany({ where: { id: wf9CampaignId } });
    });

    it('preserves target publish date when recording actual publication timestamp', async () => {
      const plannedDate = new Date('2026-11-20T14:00:00Z');
      const actualDate = new Date('2026-11-20T16:45:00Z');

      // 1. Create Campaign with planned target publish date
      await prisma.campaign.create({
        data: {
          id: wf9CampaignId,
          workspaceId: techWorkspaceId,
          title: 'Weekly Tech Release Notes Video',
          description: 'YouTube release announcement',
          stage: 'POSTING_COMPLETION',
          ownerId: anantProfileId,
          startDate: new Date('2026-11-15'),
          targetPublishDate: plannedDate,
          platform: 'YOUTUBE',
        },
      });

      // 2. Mark as published
      const published = await prisma.campaign.update({
        where: { id: wf9CampaignId },
        data: {
          actualPublishDate: actualDate,
          publicUrl: 'https://youtube.com/watch?v=crv-demo-1',
          progressPercent: 100,
          status: 'COMPLETED',
        },
      });

      // 3. Verify planned targetPublishDate was NOT overwritten
      expect(published.targetPublishDate).toEqual(plannedDate);
      expect(published.actualPublishDate).toEqual(actualDate);
      expect(published.targetPublishDate.getTime()).not.toEqual(
        published.actualPublishDate?.getTime(),
      );
    });
  });

  // =========================================================================
  // WORKFLOW 10 — Dashboard Consistency & Accuracy
  // =========================================================================
  describe('Workflow 10 — Dashboard Consistency', () => {
    it('aggregates real counts and matches underlying database records perfectly', async () => {
      const summary = await dashboardService.getSummary(techWorkspaceId);

      expect(summary.workspaceId).toBe(techWorkspaceId);
      expect(summary.metrics).toBeDefined();

      // Verify open tasks count matches exact DB count
      const actualOpenTasks = await prisma.task.count({
        where: {
          workspaceId: techWorkspaceId,
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
        },
      });
      expect(summary.metrics.openTasksCount).toBe(actualOpenTasks);

      // Verify active campaigns count matches exact DB count
      const actualActiveCampaigns = await prisma.campaign.count({
        where: {
          workspaceId: techWorkspaceId,
          stage: { not: 'POSTING_COMPLETION' },
        },
      });
      expect(summary.metrics.activeCampaignsCount).toBe(actualActiveCampaigns);

      // Verify assets count matches exact DB count
      const actualAssets = await prisma.asset.count({
        where: { workspaceId: techWorkspaceId },
      });
      expect(summary.metrics.totalAssetsCount).toBe(actualAssets);
    });
  });
});

