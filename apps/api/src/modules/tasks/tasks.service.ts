import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  TaskItem,
  TaskStatus,
  TaskPriority,
  CreateTaskDto,
  UpdateTaskDto,
  RescheduleTaskDto,
  BlockTaskDto,
  CompleteTaskDto,
  TaskFilterQuery,
  AttachmentItem,
  BulkTaskActionDto,
} from '@corviin-hub/shared';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly profilesService: ProfilesService,
  ) {}

  private tasks: TaskItem[] = [];

  findAll(workspaceId: string, profileId: string, query: TaskFilterQuery = {}): TaskItem[] {
    // Strictly isolate by workspace ID
    let items = this.tasks.filter((t) => t.workspaceId === workspaceId);

    // Filter by acting profile if personal view requested
    if (query.mine) {
      items = items.filter((t) => t.assigneeId === profileId);
    }

    // Tab-based quick filtering
    if (query.tab) {
      const now = new Date();
      const todayStr = '2026-11-05';

      switch (query.tab) {
        case 'today':
          items = items.filter(
            (t) =>
              t.status !== TaskStatus.COMPLETED &&
              t.status !== TaskStatus.CANCELLED &&
              t.deadline.startsWith(todayStr),
          );
          break;
        case 'in_progress':
          items = items.filter((t) => t.status === TaskStatus.IN_PROGRESS);
          break;
        case 'overdue':
          items = items.filter(
            (t) =>
              t.status !== TaskStatus.COMPLETED &&
              t.status !== TaskStatus.CANCELLED &&
              t.deadline < todayStr,
          );
          break;
        case 'upcoming':
          items = items.filter(
            (t) =>
              t.status !== TaskStatus.COMPLETED &&
              t.status !== TaskStatus.CANCELLED &&
              t.deadline > todayStr,
          );
          break;
        case 'completed':
          items = items.filter((t) => t.status === TaskStatus.COMPLETED);
          break;
      }
    }

    // Status filter
    if (query.status) {
      items = items.filter((t) => t.status === query.status);
    }

    // Priority filter
    if (query.priority) {
      items = items.filter((t) => t.priority === query.priority);
    }

    // Assignee filter
    if (query.assigneeId) {
      items = items.filter((t) => t.assigneeId === query.assigneeId);
    }

    // Creator filter
    if (query.creatorId) {
      items = items.filter((t) => t.creatorId === query.creatorId);
    }

    // Linked record type filter
    if (query.linkedRecordType) {
      items = items.filter((t) => t.linkedRecord && t.linkedRecord.type === query.linkedRecordType);
    }

    // Search query
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(s) ||
          (t.description && t.description.toLowerCase().includes(s)) ||
          (t.linkedRecord && t.linkedRecord.title.toLowerCase().includes(s)),
      );
    }

    // Sort
    if (query.sort) {
      switch (query.sort) {
        case 'due_soonest':
          items.sort((a, b) => a.deadline.localeCompare(b.deadline));
          break;
        case 'priority': {
          const priorityWeights: Record<TaskPriority, number> = {
            [TaskPriority.URGENT]: 4,
            [TaskPriority.HIGH]: 3,
            [TaskPriority.MEDIUM]: 2,
            [TaskPriority.LOW]: 1,
          };
          items.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
          break;
        }
        case 'recently_updated':
          items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
          break;
        case 'planned_start':
          items.sort((a, b) => (a.plannedStart || '').localeCompare(b.plannedStart || ''));
          break;
      }
    } else {
      // Default sort: soonest deadline first
      items.sort((a, b) => a.deadline.localeCompare(b.deadline));
    }

    return items;
  }

  findById(id: string, workspaceId: string): TaskItem {
    const task = this.tasks.find((t) => t.id === id && t.workspaceId === workspaceId);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found in this workspace`);
    }
    return task;
  }

  create(dto: CreateTaskDto, creatorId: string, creatorName: string): TaskItem {
    const workspace = this.workspacesService.findById(dto.workspaceId);
    if (!workspace) {
      throw new NotFoundException(`Workspace "${dto.workspaceId}" not found`);
    }

    const assignee = this.profilesService.findById(dto.assigneeId);
    const assigneeName = assignee ? assignee.displayName : 'Team Member';

    const now = new Date().toISOString();
    const newTask: TaskItem = {
      id: `tsk-${Math.random().toString(36).substring(2, 9)}`,
      workspaceId: dto.workspaceId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      status: TaskStatus.TODO,
      priority: dto.priority || TaskPriority.MEDIUM,
      assigneeId: dto.assigneeId,
      assigneeName,
      creatorId,
      creatorName,
      plannedStart: dto.plannedStart,
      deadline: dto.deadline,
      checklist: (dto.checklist || []).map((title, i) => ({
        id: `chk-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        completed: false,
      })),
      linkedRecord: dto.linkedRecord,
      workSessions: [],
      rescheduleHistory: [],
      comments: [],
      attachments: [],
      activity: [
        {
          id: `act-${Math.random().toString(36).substring(2, 8)}`,
          action: 'created task',
          actorName: creatorName,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.unshift(newTask);
    return newTask;
  }

  update(id: string, workspaceId: string, dto: UpdateTaskDto, actorName: string): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();

    if (dto.title !== undefined) task.title = dto.title.trim();
    if (dto.description !== undefined) task.description = dto.description.trim();
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.plannedStart !== undefined) task.plannedStart = dto.plannedStart;
    if (dto.deadline !== undefined) task.deadline = dto.deadline;

    if (dto.assigneeId && dto.assigneeId !== task.assigneeId) {
      const newAssignee = this.profilesService.findById(dto.assigneeId);
      task.assigneeId = dto.assigneeId;
      task.assigneeName = newAssignee ? newAssignee.displayName : 'Team Member';
      task.activity.unshift({
        id: `act-${Math.random().toString(36).substring(2, 8)}`,
        action: `reassigned task to ${task.assigneeName}`,
        actorName,
        timestamp: now,
      });
    }

    task.updatedAt = now;
    return task;
  }

  startWorkSession(id: string, workspaceId: string, actorId: string, actorName: string): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();

    if (task.status === TaskStatus.COMPLETED) {
      throw new BadRequestException('Task is completed. Please resume or reopen the task first.');
    }

    // Check if there is already an active running session
    const activeSession = task.workSessions.find((s) => !s.endedAt);
    if (!activeSession) {
      task.workSessions.push({
        id: `sess-${Math.random().toString(36).substring(2, 8)}`,
        startedAt: now,
        actorId,
        actorName,
      });
    }

    if (!task.actualStart) {
      task.actualStart = now;
    }

    task.status = TaskStatus.IN_PROGRESS;
    task.updatedAt = now;
    task.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'started work session',
      actorName,
      timestamp: now,
    });

    return task;
  }

  pauseWorkSession(id: string, workspaceId: string, actorName: string): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();

    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw new BadRequestException('Task is not in progress.');
    }

    // Close any active running session
    const activeSession = task.workSessions.find((s) => !s.endedAt);
    if (activeSession) {
      activeSession.endedAt = now;
      const startMs = new Date(activeSession.startedAt).getTime();
      const endMs = new Date(now).getTime();
      activeSession.durationSeconds = Math.max(0, Math.floor((endMs - startMs) / 1000));
    }

    task.status = TaskStatus.ON_HOLD;
    task.updatedAt = now;
    task.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'paused work session (set to On Hold)',
      actorName,
      timestamp: now,
    });

    return task;
  }

  resumeWorkSession(id: string, workspaceId: string, actorId: string, actorName: string): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();

    // Close any open sessions first
    task.workSessions.forEach((s) => {
      if (!s.endedAt) {
        s.endedAt = now;
        const startMs = new Date(s.startedAt).getTime();
        s.durationSeconds = Math.max(0, Math.floor((new Date(now).getTime() - startMs) / 1000));
      }
    });

    // Start a brand new immutable session interval
    task.workSessions.push({
      id: `sess-${Math.random().toString(36).substring(2, 8)}`,
      startedAt: now,
      actorId,
      actorName,
    });

    task.status = TaskStatus.IN_PROGRESS;
    task.updatedAt = now;
    task.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'resumed work session',
      actorName,
      timestamp: now,
    });

    return task;
  }

  completeTask(
    id: string,
    workspaceId: string,
    actorName: string,
    dto?: CompleteTaskDto,
  ): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();

    // Close any active work session
    const activeSession = task.workSessions.find((s) => !s.endedAt);
    if (activeSession) {
      activeSession.endedAt = now;
      const startMs = new Date(activeSession.startedAt).getTime();
      activeSession.durationSeconds = Math.max(0, Math.floor((new Date(now).getTime() - startMs) / 1000));
    }

    task.status = TaskStatus.COMPLETED;
    task.completedAt = now;
    task.completedBy = actorName;
    if (dto?.completionNote) {
      task.completionNote = dto.completionNote.trim();
    }
    task.updatedAt = now;

    task.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'completed task',
      actorName,
      timestamp: now,
      details: dto?.completionNote ? `Note: "${dto.completionNote}"` : undefined,
    });

    return task;
  }

  blockTask(id: string, workspaceId: string, actorName: string, dto: BlockTaskDto): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();

    if (!dto.blockerReason || !dto.blockerReason.trim()) {
      throw new BadRequestException('A clear blocker reason is required.');
    }

    // Close any running session
    const activeSession = task.workSessions.find((s) => !s.endedAt);
    if (activeSession) {
      activeSession.endedAt = now;
      activeSession.durationSeconds = Math.max(
        0,
        Math.floor((new Date(now).getTime() - new Date(activeSession.startedAt).getTime()) / 1000),
      );
    }

    task.status = TaskStatus.BLOCKED;
    task.blockerReason = dto.blockerReason.trim();
    task.expectedResolutionDate = dto.expectedResolutionDate;
    task.updatedAt = now;

    task.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'marked task as blocked',
      actorName,
      timestamp: now,
      details: `Blocker: ${dto.blockerReason}`,
    });

    return task;
  }

  reschedule(
    id: string,
    workspaceId: string,
    actorId: string,
    actorName: string,
    dto: RescheduleTaskDto,
  ): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();

    if (!dto.newDeadline) {
      throw new BadRequestException('New deadline is required.');
    }
    if (!dto.reason || !dto.reason.trim()) {
      throw new BadRequestException('A reason for rescheduling is required.');
    }

    const rescheduleEvent = {
      id: `resched-${Math.random().toString(36).substring(2, 8)}`,
      oldDeadline: task.deadline,
      newDeadline: dto.newDeadline,
      oldPlannedStart: task.plannedStart,
      newPlannedStart: dto.newPlannedStart,
      reason: dto.reason.trim(),
      actorId,
      actorName,
      timestamp: now,
    };

    task.rescheduleHistory.unshift(rescheduleEvent);
    task.deadline = dto.newDeadline;
    if (dto.newPlannedStart !== undefined) {
      task.plannedStart = dto.newPlannedStart;
    }
    task.updatedAt = now;

    task.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: `rescheduled deadline from ${rescheduleEvent.oldDeadline} to ${dto.newDeadline}`,
      actorName,
      timestamp: now,
      details: `Reason: "${dto.reason}"`,
    });

    return task;
  }

  addChecklistItem(id: string, workspaceId: string, title: string): TaskItem {
    const task = this.findById(id, workspaceId);
    task.checklist.push({
      id: `chk-${Math.random().toString(36).substring(2, 8)}`,
      title: title.trim(),
      completed: false,
    });
    task.updatedAt = new Date().toISOString();
    return task;
  }

  toggleChecklistItem(id: string, workspaceId: string, checklistId: string): TaskItem {
    const task = this.findById(id, workspaceId);
    const item = task.checklist.find((c) => c.id === checklistId);
    if (!item) {
      throw new NotFoundException(`Checklist item "${checklistId}" not found`);
    }
    item.completed = !item.completed;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  addComment(
    id: string,
    workspaceId: string,
    authorId: string,
    authorName: string,
    content: string,
  ): TaskItem {
    const task = this.findById(id, workspaceId);
    const now = new Date().toISOString();
    task.comments.push({
      id: `cmt-${Math.random().toString(36).substring(2, 8)}`,
      authorId,
      authorName,
      content: content.trim(),
      createdAt: now,
    });
    task.updatedAt = now;
    task.activity.unshift({
      id: `act-${Math.random().toString(36).substring(2, 8)}`,
      action: 'posted a comment',
      actorName: authorName,
      timestamp: now,
    });
    return task;
  }

  addAttachment(id: string, workspaceId: string, attachment: AttachmentItem): TaskItem {
    const task = this.findById(id, workspaceId);
    task.attachments.push(attachment);
    task.updatedAt = new Date().toISOString();
    return task;
  }

  bulkAction(
    workspaceId: string,
    actorName: string,
    dto: BulkTaskActionDto,
  ): { updatedCount: number; tasks: TaskItem[] } {
    if (!dto.taskIds || dto.taskIds.length === 0) {
      throw new BadRequestException('At least one task ID must be provided.');
    }

    const tasksToUpdate: TaskItem[] = [];
    for (const taskId of dto.taskIds) {
      const task = this.findById(taskId, workspaceId);
      tasksToUpdate.push(task);
    }

    const now = new Date().toISOString();

    if (dto.action === 'reassign') {
      if (!dto.assigneeId) {
        throw new BadRequestException('Target assigneeId is required for reassign action.');
      }
      const targetProfile = this.profilesService.findById(dto.assigneeId);
      const targetName = targetProfile ? targetProfile.displayName : 'Team Member';

      for (const task of tasksToUpdate) {
        const oldAssignee = task.assigneeName;
        task.assigneeId = dto.assigneeId;
        task.assigneeName = targetName;
        task.updatedAt = now;
        task.activity.unshift({
          id: `act-${Math.random().toString(36).substring(2, 8)}`,
          action: `reassigned task from ${oldAssignee} to ${targetName}`,
          actorName,
          timestamp: now,
        });
      }
    } else if (dto.action === 'set_priority') {
      if (!dto.priority) {
        throw new BadRequestException('Target priority is required for set_priority action.');
      }
      for (const task of tasksToUpdate) {
        const oldPriority = task.priority;
        task.priority = dto.priority;
        task.updatedAt = now;
        task.activity.unshift({
          id: `act-${Math.random().toString(36).substring(2, 8)}`,
          action: `changed priority from ${oldPriority} to ${dto.priority}`,
          actorName,
          timestamp: now,
        });
      }
    } else if (dto.action === 'complete') {
      for (const task of tasksToUpdate) {
        // Stop active session if any
        const activeSession = task.workSessions.find((s) => !s.endedAt);
        if (activeSession) {
          activeSession.endedAt = now;
          const start = new Date(activeSession.startedAt).getTime();
          const end = new Date(now).getTime();
          activeSession.durationSeconds = Math.max(0, Math.round((end - start) / 1000));
        }
        task.status = TaskStatus.COMPLETED;
        task.completedAt = now;
        task.completedBy = actorName;
        if (dto.completionNote) {
          task.completionNote = dto.completionNote;
        }
        task.updatedAt = now;
        task.activity.unshift({
          id: `act-${Math.random().toString(36).substring(2, 8)}`,
          action: 'completed task via bulk action',
          actorName,
          timestamp: now,
        });
      }
    } else {
      throw new BadRequestException(`Unsupported bulk action: ${dto.action}`);
    }

    return {
      updatedCount: tasksToUpdate.length,
      tasks: tasksToUpdate,
    };
  }
}
