import { PrismaService } from '../src/prisma/prisma.service';

describe('PostgreSQL & Prisma Persistence Integration', () => {
  let prisma: PrismaService;
  const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
  const realEstateWorkspaceId = 'ws-real-0002-0000-000000000002';

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('should be healthy and connected to PostgreSQL database', async () => {
    const isHealthy = await prisma.isHealthy();
    expect(isHealthy).toBe(true);
  });

  describe('1. Workspaces & Scoping', () => {
    it('should find both seeded workspaces by ID', async () => {
      const techWs = await prisma.workspace.findUnique({
        where: { id: techWorkspaceId },
      });
      const realWs = await prisma.workspace.findUnique({
        where: { id: realEstateWorkspaceId },
      });

      expect(techWs).toBeDefined();
      expect(techWs?.name).toBe('Corviin Tech');
      expect(techWs?.type).toBe('TECH');

      expect(realWs).toBeDefined();
      expect(realWs?.name).toBe('Corviin Real Estate');
      expect(realWs?.type).toBe('REAL_ESTATE');
    });

    it('should enforce unique workspace slugs', async () => {
      const techWs = await prisma.workspace.findUnique({
        where: { slug: 'corviin-tech' },
      });
      expect(techWs?.id).toBe(techWorkspaceId);
    });
  });

  describe('2. Profiles & Dynamic Memberships', () => {
    it('should retrieve seeded profiles', async () => {
      const anant = await prisma.profile.findUnique({
        where: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      });
      const rohit = await prisma.profile.findUnique({
        where: { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
      });
      const utkarsh = await prisma.profile.findUnique({
        where: { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012' },
      });
      const vikram = await prisma.profile.findUnique({
        where: { id: 'd4e5f6a7-b8c9-0123-def0-123456789013' },
      });

      expect(anant?.displayName).toBe('Anant');
      expect(anant?.status).toBe('ACTIVE');

      expect(rohit?.displayName).toBe('Rohit');
      expect(rohit?.status).toBe('ACTIVE');

      expect(utkarsh?.displayName).toBe('Utkarsh');
      expect(utkarsh?.status).toBe('ACTIVE');

      expect(vikram?.displayName).toBe('Vikramaditya Rao');
      expect(vikram?.status).toBe('INACTIVE');
    });

    it('should correctly scope memberships per workspace', async () => {
      const techMemberships = await prisma.workspaceMembership.findMany({
        where: { workspaceId: techWorkspaceId },
        include: { profile: true },
      });

      expect(techMemberships.length).toBe(4);
      const memberNames = techMemberships.map((m) => m.profile.displayName);
      expect(memberNames).toContain('Anant');
      expect(memberNames).toContain('Rohit');
      expect(memberNames).toContain('Utkarsh');
      expect(memberNames).toContain('Vikramaditya Rao');

      const realEstateMemberships = await prisma.workspaceMembership.findMany({
        where: { workspaceId: realEstateWorkspaceId },
        include: { profile: true },
      });

      expect(realEstateMemberships.length).toBe(3);
      const reMemberNames = realEstateMemberships.map((m) => m.profile.displayName);
      expect(reMemberNames).toContain('Anant');
      expect(reMemberNames).toContain('Rohit');
      expect(reMemberNames).toContain('Utkarsh');
      expect(reMemberNames).not.toContain('Vikramaditya Rao');
    });
  });

  describe('3. Workspace & Personal Settings Persistence', () => {
    it('should persist and retrieve workspace settings', async () => {
      const techSettings = await prisma.workspaceSettings.findUnique({
        where: { workspaceId: techWorkspaceId },
      });

      expect(techSettings).toBeDefined();
      expect(techSettings?.primaryCurrency).toBe('INR');
      expect(techSettings?.defaultTaskPriority).toBe('MEDIUM');
      expect(techSettings?.allowedCategories).toContain('BUSINESS_CLIENT');
      expect(techSettings?.allowedStages).toContain('NEW_ENQUIRY');
    });

    it('should persist and retrieve personal settings', async () => {
      const anantSettings = await prisma.personalSettings.findUnique({
        where: { profileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      });

      expect(anantSettings).toBeDefined();
      expect(anantSettings?.displayName).toBe('Anant');
      expect(anantSettings?.timezone).toBe('Asia/Kolkata');
      expect(anantSettings?.theme).toBe('light');
    });
  });

  describe('4. Operational Task & Audit Persistence with Workspace Isolation', () => {
    const testTaskId = 'task-integration-test-01';

    afterAll(async () => {
      // Clean up test data
      await prisma.auditEvent.deleteMany({
        where: { entityId: testTaskId },
      });
      await prisma.taskWorkSession.deleteMany({
        where: { taskId: testTaskId },
      });
      await prisma.task.deleteMany({
        where: { id: testTaskId },
      });
    });

    it('should create an operational task in Tech workspace and verify isolation', async () => {
      const task = await prisma.task.create({
        data: {
          id: testTaskId,
          workspaceId: techWorkspaceId,
          title: 'Implement Core Persistence Layer',
          description: 'Deploy PostgreSQL & Prisma persistence layer for Phase 4',
          status: 'IN_PROGRESS',
          priority: 'URGENT',
          assigneeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          assigneeName: 'Anant',
          creatorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          creatorName: 'Rohit',
          deadline: new Date('2026-11-15T18:00:00.000Z'),
        },
      });

      expect(task.id).toBe(testTaskId);
      expect(task.priority).toBe('URGENT');

      // Verify Tech workspace query finds it
      const techTasks = await prisma.task.findMany({
        where: { workspaceId: techWorkspaceId, id: testTaskId },
      });
      expect(techTasks.length).toBe(1);

      // Verify Real Estate query NEVER leaks it
      const realTasks = await prisma.task.findMany({
        where: { workspaceId: realEstateWorkspaceId, id: testTaskId },
      });
      expect(realTasks.length).toBe(0);
    });

    it('should persist task work session linked to the task', async () => {
      const session = await prisma.taskWorkSession.create({
        data: {
          id: 'sess-test-01',
          taskId: testTaskId,
          actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          actorName: 'Anant',
          startedAt: new Date('2026-11-06T09:00:00.000Z'),
          endedAt: new Date('2026-11-06T11:30:00.000Z'),
          durationSeconds: 9000,
        },
      });

      expect(session.durationSeconds).toBe(9000);

      const taskWithSessions = await prisma.task.findUnique({
        where: { id: testTaskId },
        include: { workSessions: true },
      });

      expect(taskWithSessions?.workSessions.length).toBe(1);
      expect(taskWithSessions?.workSessions[0].actorName).toBe('Anant');
    });

    it('should persist append-only structured audit event', async () => {
      const auditEvent = await prisma.auditEvent.create({
        data: {
          id: 'audit-test-01',
          workspaceId: techWorkspaceId,
          entityType: 'TASK',
          entityId: testTaskId,
          action: 'STATUS_UPDATED',
          actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          actorName: 'Anant',
          previousValues: { status: 'TODO' },
          newValues: { status: 'IN_PROGRESS' },
          reason: 'Task status changed from TODO to IN_PROGRESS',
        },
      });

      expect(auditEvent.action).toBe('STATUS_UPDATED');
      expect(auditEvent.workspaceId).toBe(techWorkspaceId);

      // Audit trail isolation
      const eventsInRealEstate = await prisma.auditEvent.findMany({
        where: { workspaceId: realEstateWorkspaceId, entityId: testTaskId },
      });
      expect(eventsInRealEstate.length).toBe(0);
    });

    it('should support atomic transactions and rollback on failure', async () => {
      const failTransaction = async () => {
        await prisma.$transaction(async (tx) => {
          await tx.task.update({
            where: { id: testTaskId },
            data: { title: 'Updated within transaction' },
          });
          // Intentionally throw error to force rollback
          throw new Error('Forced transaction rollback');
        });
      };

      await expect(failTransaction()).rejects.toThrow('Forced transaction rollback');

      // Verify the task title was NOT mutated due to atomic rollback
      const currentTask = await prisma.task.findUnique({
        where: { id: testTaskId },
      });
      expect(currentTask?.title).toBe('Implement Core Persistence Layer');
    });
  });
});
