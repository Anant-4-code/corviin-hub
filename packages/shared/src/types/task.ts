import { TaskPriority, TaskStatus } from '../enums/index';
import { AttachmentItem } from './index';

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface WorkSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  actorId: string;
  actorName: string;
}

export interface RescheduleEvent {
  id: string;
  oldDeadline: string;
  newDeadline: string;
  oldPlannedStart?: string;
  newPlannedStart?: string;
  reason: string;
  actorId: string;
  actorName: string;
  timestamp: string;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TaskActivityEvent {
  id: string;
  action: string;
  actorName: string;
  timestamp: string;
  details?: string;
}

export interface TaskLinkedRecord {
  id: string;
  title: string;
  type: 'campaign' | 'meeting' | 'crm' | 'goal' | 'task';
}

export interface TaskItem {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  creatorId: string;
  creatorName: string;
  plannedStart?: string;
  deadline: string;
  actualStart?: string;
  completedAt?: string;
  completedBy?: string;
  completionNote?: string;
  blockerReason?: string;
  expectedResolutionDate?: string;
  checklist: ChecklistItem[];
  linkedRecord?: TaskLinkedRecord;
  workSessions: WorkSession[];
  rescheduleHistory: RescheduleEvent[];
  comments: TaskComment[];
  attachments: AttachmentItem[];
  activity: TaskActivityEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  workspaceId: string;
  assigneeId: string;
  deadline: string;
  description?: string;
  plannedStart?: string;
  priority?: TaskPriority;
  checklist?: string[];
  linkedRecord?: TaskLinkedRecord;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  plannedStart?: string;
  deadline?: string;
}

export interface RescheduleTaskDto {
  newDeadline: string;
  newPlannedStart?: string;
  reason: string;
}

export interface BlockTaskDto {
  blockerReason: string;
  expectedResolutionDate?: string;
}

export interface CompleteTaskDto {
  completionNote?: string;
}

export interface BulkTaskActionDto {
  taskIds: string[];
  action: 'reassign' | 'set_priority' | 'complete';
  assigneeId?: string;
  priority?: TaskPriority;
  completionNote?: string;
}

export interface TaskFilterQuery {
  mine?: boolean;
  tab?: 'today' | 'upcoming' | 'overdue' | 'in_progress' | 'completed' | 'all';
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  creatorId?: string;
  linkedRecordType?: string;
  search?: string;
  sort?: 'due_soonest' | 'priority' | 'recently_updated' | 'planned_start';
}

