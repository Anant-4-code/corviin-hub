import { PrismaService } from '../src/prisma/prisma.service';

describe('Prisma Multi-Record Atomic Transactions (Phase 5)', () => {
  let prisma: PrismaService;
  const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
  const meetingId = 'mtg-tx-test-01';
  const actionItemId = 'act-tx-item-01';
  let createdTaskId: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();

    // Seed test meeting with action item
    await prisma.meeting.upsert({
      where: { id: meetingId },
      update: {},
      create: {
        id: meetingId,
        workspaceId: techWorkspaceId,
        title: 'Q4 Architectural Strategy Review',
        category: 'INTERNAL_STRATEGY',
        date: '2026-11-10',
        startTime: new Date('2026-11-10T10:00:00.000Z'),
        endTime: new Date('2026-11-10T11:00:00.000Z'),
        organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        status: 'SCHEDULED',
        actionItems: {
          create: {
            id: actionItemId,
            description: 'Implement atomic Prisma transaction for action items',
            assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            priority: 'HIGH',
            status: 'PENDING',
          },
        },
      },
    });
  });

  afterAll(async () => {
    if (createdTaskId) {
      await prisma.task.deleteMany({ where: { id: createdTaskId } });
    }
    await prisma.meetingActionItem.deleteMany({ where: { id: actionItemId } });
    await prisma.meeting.deleteMany({ where: { id: meetingId } });
    await prisma.onModuleDestroy();
  });

  it('should atomically convert meeting action item to operational task within transaction', async () => {
    const taskTitle = 'Implement atomic Prisma transaction for action items';
    const taskId = `tsk-conv-${Date.now()}`;
    createdTaskId = taskId;

    // Execute atomic conversion transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the task with meeting reference
      const task = await tx.task.create({
        data: {
          id: taskId,
          workspaceId: techWorkspaceId,
          title: taskTitle,
          status: 'TODO',
          priority: 'HIGH',
          assigneeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          assigneeName: 'Anant',
          creatorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          creatorName: 'Anant',
          deadline: new Date(Date.now() + 86400000 * 3),
        },
      });

      // 2. Mark the action item as converted with reference to task
      const updatedActionItem = await tx.meetingActionItem.update({
        where: { id: actionItemId },
        data: {
          status: 'CONVERTED',
          convertedTaskId: task.id,
        },
      });

      // 3. Record audit event
      await tx.auditEvent.create({
        data: {
          id: `aud-conv-${Date.now()}`,
          workspaceId: techWorkspaceId,
          entityType: 'MEETING_ACTION_ITEM',
          entityId: actionItemId,
          action: 'CONVERTED_TO_TASK',
          actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          actorName: 'Anant',
          reason: `Converted to task ${task.id}`,
        },
      });

      return { task, updatedActionItem };
    });

    expect(result.task.id).toBe(taskId);
    expect(result.updatedActionItem.status).toBe('CONVERTED');
    expect(result.updatedActionItem.convertedTaskId).toBe(taskId);

    // Verify task exists in database
    const savedTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    expect(savedTask).toBeDefined();
    expect(savedTask?.title).toBe(taskTitle);
  });

  it('should rollback all modifications if transaction fails mid-flight', async () => {
    const failTaskId = `tsk-fail-${Date.now()}`;

    const failTransaction = async () => {
      await prisma.$transaction(async (tx) => {
        // 1. Create task
        await tx.task.create({
          data: {
            id: failTaskId,
            workspaceId: techWorkspaceId,
            title: 'Transient Task That Must Rollback',
            status: 'TODO',
            priority: 'LOW',
            assigneeId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            creatorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            deadline: new Date(),
          },
        });

        // 2. Force failure by referencing non-existent action item
        await tx.meetingActionItem.update({
          where: { id: 'non-existent-action-item-id' },
          data: { status: 'CONVERTED' },
        });
      });
    };

    await expect(failTransaction()).rejects.toThrow();

    // Verify the transient task was NOT created in database due to atomic rollback
    const nonExistentTask = await prisma.task.findUnique({
      where: { id: failTaskId },
    });
    expect(nonExistentTask).toBeNull();
  });
});
