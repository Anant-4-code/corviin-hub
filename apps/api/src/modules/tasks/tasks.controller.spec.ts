import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';
import { TaskStatus, TaskPriority } from '@corviin-hub/shared';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const techWsId = 'ws-tech-0001-0000-000000000001';
  const realWsId = 'ws-real-0002-0000-000000000002';
  const anantId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const rohitId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, WorkspacesService, ProfilesService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list tasks strictly isolated by active workspace', () => {
    const techRes = controller.findAll(techWsId, anantId);
    expect(techRes.data.every((t) => t.workspaceId === techWsId)).toBe(true);

    const reRes = controller.findAll(realWsId, rohitId);
    expect(reRes.data.every((t) => t.workspaceId === realWsId)).toBe(true);
  });

  it('should filter tasks by "mine=true" for the acting profile', () => {
    const res = controller.findAll(techWsId, anantId, 'true');
    expect(res.data.every((t) => t.assigneeId === anantId)).toBe(true);
  });

  it('should create a task with initial TODO status and activity audit', () => {
    const res = controller.create(
      {
        title: 'New API endpoint verification',
        workspaceId: techWsId,
        assigneeId: anantId,
        deadline: '2026-11-10T17:00:00.000Z',
        priority: TaskPriority.HIGH,
      },
      techWsId,
      anantId,
    );

    expect(res.data.id).toBeDefined();
    expect(res.data.title).toBe('New API endpoint verification');
    expect(res.data.status).toBe(TaskStatus.TODO);
    expect(res.data.activity.length).toBeGreaterThan(0);
    expect(res.data.activity[0].action).toBe('created task');
  });

  it('should start, pause, and resume work sessions creating immutable session intervals', () => {
    // 1. Start work session
    const startRes = controller.startWorkSession('tsk-tch-002', techWsId, anantId);
    expect(startRes.data.status).toBe(TaskStatus.IN_PROGRESS);
    expect(startRes.data.workSessions.length).toBe(1);
    expect(startRes.data.workSessions[0].startedAt).toBeDefined();

    // 2. Pause work session
    const pauseRes = controller.pauseWorkSession('tsk-tch-002', techWsId, anantId);
    expect(pauseRes.data.status).toBe(TaskStatus.ON_HOLD);
    expect(pauseRes.data.workSessions[0].endedAt).toBeDefined();

    // 3. Resume work session
    const resumeRes = controller.resumeWorkSession('tsk-tch-002', techWsId, anantId);
    expect(resumeRes.data.status).toBe(TaskStatus.IN_PROGRESS);
    // Prior session is preserved, new session interval is appended!
    expect(resumeRes.data.workSessions.length).toBe(2);
    expect(resumeRes.data.workSessions[1].startedAt).toBeDefined();
  });

  it('should complete a task and record completion metadata', () => {
    const res = controller.completeTask(
      'tsk-tch-002',
      { completionNote: 'Migration tests verified successfully.' },
      techWsId,
      anantId,
    );

    expect(res.data.status).toBe(TaskStatus.COMPLETED);
    expect(res.data.completedAt).toBeDefined();
    expect(res.data.completionNote).toBe('Migration tests verified successfully.');
  });

  it('should block a task with a clear blocker reason', () => {
    const res = controller.blockTask(
      'tsk-tch-001',
      { blockerReason: 'Waiting on client architecture review.' },
      techWsId,
      anantId,
    );

    expect(res.data.status).toBe(TaskStatus.BLOCKED);
    expect(res.data.blockerReason).toBe('Waiting on client architecture review.');
  });

  it('should reschedule a task, preserving original deadline in rescheduleHistory', () => {
    const originalTask = controller.findOne('tsk-tch-001', techWsId, anantId).data;
    const oldDeadline = originalTask.deadline;

    const res = controller.reschedule(
      'tsk-tch-001',
      {
        newDeadline: '2026-11-15T18:00:00.000Z',
        reason: 'Client requested postponement of documentation review.',
      },
      techWsId,
      anantId,
    );

    expect(res.data.deadline).toBe('2026-11-15T18:00:00.000Z');
    expect(res.data.rescheduleHistory.length).toBeGreaterThan(0);
    expect(res.data.rescheduleHistory[0].oldDeadline).toBe(oldDeadline);
    expect(res.data.rescheduleHistory[0].reason).toBe(
      'Client requested postponement of documentation review.',
    );
  });

  it('should add checklist item and toggle completion', () => {
    const addRes = controller.addChecklistItem('tsk-tch-001', 'Verify CORS headers', techWsId);
    const addedItem = addRes.data.checklist.find((c) => c.title === 'Verify CORS headers');
    expect(addedItem).toBeDefined();
    expect(addedItem?.completed).toBe(false);

    const toggleRes = controller.toggleChecklistItem('tsk-tch-001', addedItem!.id, techWsId);
    const toggledItem = toggleRes.data.checklist.find((c) => c.id === addedItem!.id);
    expect(toggledItem?.completed).toBe(true);
  });

  it('should add operational comment to task', () => {
    const res = controller.addComment('tsk-tch-001', 'Reviewed the Swagger JSON, looks clean.', techWsId, anantId);
    expect(res.data.comments.some((c) => c.content === 'Reviewed the Swagger JSON, looks clean.')).toBe(true);
  });

  it('should filter tasks by assigneeId in All Tasks', () => {
    const res = controller.findAll(techWsId, anantId, undefined, undefined, undefined, undefined, rohitId);
    expect(res.data.every((t) => t.assigneeId === rohitId)).toBe(true);
  });

  it('should execute bulk reassign across selected tasks with audit trail', () => {
    const bulkRes = controller.bulkAction(
      {
        taskIds: ['tsk-tch-001', 'tsk-tch-002'],
        action: 'reassign',
        assigneeId: rohitId,
      },
      techWsId,
      anantId,
    );

    expect(bulkRes.data.updatedCount).toBe(2);
    expect(bulkRes.data.tasks.every((t) => t.assigneeId === rohitId)).toBe(true);
    expect(bulkRes.data.tasks[0].activity[0].action).toContain('reassigned task');
  });

  it('should execute bulk set_priority across selected tasks', () => {
    const bulkRes = controller.bulkAction(
      {
        taskIds: ['tsk-tch-001'],
        action: 'set_priority',
        priority: TaskPriority.URGENT,
      },
      techWsId,
      anantId,
    );

    expect(bulkRes.data.tasks[0].priority).toBe(TaskPriority.URGENT);
  });

  it('should execute bulk complete across selected tasks', () => {
    const bulkRes = controller.bulkAction(
      {
        taskIds: ['tsk-tch-003'],
        action: 'complete',
        completionNote: 'Bulk closed after signoff',
      },
      techWsId,
      anantId,
    );

    expect(bulkRes.data.tasks[0].status).toBe(TaskStatus.COMPLETED);
    expect(bulkRes.data.tasks[0].completionNote).toBe('Bulk closed after signoff');
  });

  it('should enforce workspace scoping and throw NotFoundException for foreign workspace task', () => {
    expect(() => {
      // tsk-re-001 belongs to Real Estate, querying in Tech workspace should fail
      controller.findOne('tsk-re-001', techWsId, anantId);
    }).toThrow(NotFoundException);
  });
});
