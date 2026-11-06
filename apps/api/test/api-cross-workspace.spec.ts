import { PrismaService } from '../src/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('Cross-Workspace Isolation & Data Segregation (Phase 5)', () => {
  let prisma: PrismaService;
  const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
  const realEstateWorkspaceId = 'ws-real-0002-0000-000000000002';

  const testTechTaskId = 'tsk-isolated-tech-01';
  const testRealPartnerId = 'crm-isolated-partner-01';

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();

    // Seed test records for isolation verification
    await prisma.task.upsert({
      where: { id: testTechTaskId },
      update: {},
      create: {
        id: testTechTaskId,
        workspaceId: techWorkspaceId,
        title: 'Tech Workspace Private Task',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        creatorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        deadline: new Date('2026-11-20T18:00:00.000Z'),
      },
    });

    await prisma.crmPartnerRecord.upsert({
      where: { id: testRealPartnerId },
      update: {},
      create: {
        id: testRealPartnerId,
        workspaceId: realEstateWorkspaceId,
        companyName: 'Prestige Developers Private Ltd',
        partnerType: 'DEVELOPER',
        stage: 'NEW_LEAD',
        phone: '+91 98765 43210',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
      },
    });
  });

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { id: testTechTaskId } });
    await prisma.crmPartnerRecord.deleteMany({ where: { id: testRealPartnerId } });
    await prisma.onModuleDestroy();
  });

  it('should find Tech task in Tech workspace query', async () => {
    const task = await prisma.task.findFirst({
      where: { id: testTechTaskId, workspaceId: techWorkspaceId },
    });
    expect(task).toBeDefined();
    expect(task?.title).toBe('Tech Workspace Private Task');
  });

  it('should NEVER return Tech task when querying Real Estate workspace', async () => {
    const task = await prisma.task.findFirst({
      where: { id: testTechTaskId, workspaceId: realEstateWorkspaceId },
    });
    expect(task).toBeNull();
  });

  it('should find Partner record in Real Estate workspace query', async () => {
    const partner = await prisma.crmPartnerRecord.findFirst({
      where: { id: testRealPartnerId, workspaceId: realEstateWorkspaceId },
    });
    expect(partner).toBeDefined();
    expect(partner?.companyName).toBe('Prestige Developers Private Ltd');
  });

  it('should NEVER return Real Estate Partner record when querying Tech workspace', async () => {
    const partner = await prisma.crmPartnerRecord.findFirst({
      where: { id: testRealPartnerId, workspaceId: techWorkspaceId },
    });
    expect(partner).toBeNull();
  });

  it('should enforce workspace scoping in task updates', async () => {
    // Attempting to update a Tech task with Real Estate workspaceId filter returns 0 updated records
    const updateResult = await prisma.task.updateMany({
      where: { id: testTechTaskId, workspaceId: realEstateWorkspaceId },
      data: { status: 'COMPLETED' },
    });
    expect(updateResult.count).toBe(0);

    // Verify task status was NOT modified
    const verified = await prisma.task.findUnique({
      where: { id: testTechTaskId },
    });
    expect(verified?.status).toBe('IN_PROGRESS');
  });
});
