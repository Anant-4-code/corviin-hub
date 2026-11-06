import { api } from '@/lib/api';
import type {
  ApiResponse,
  TaskItem,
  CreateTaskDto,
  UpdateTaskDto,
  RescheduleTaskDto,
  BlockTaskDto,
  CompleteTaskDto,
  TaskFilterQuery,
  AttachmentItem,
  BulkTaskActionDto,
} from '@corviin-hub/shared';

function buildQueryString(params?: TaskFilterQuery): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.mine !== undefined) searchParams.append('mine', String(params.mine));
  if (params.tab) searchParams.append('tab', params.tab);
  if (params.status) searchParams.append('status', params.status);
  if (params.priority) searchParams.append('priority', params.priority);
  if (params.assigneeId) searchParams.append('assigneeId', params.assigneeId);
  if (params.creatorId) searchParams.append('creatorId', params.creatorId);
  if (params.linkedRecordType) searchParams.append('linkedRecordType', params.linkedRecordType);
  if (params.search) searchParams.append('search', params.search);
  if (params.sort) searchParams.append('sort', params.sort);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchTasks(filters?: TaskFilterQuery): Promise<TaskItem[]> {
  const qs = buildQueryString(filters);
  const res = await api.get<ApiResponse<TaskItem[]>>(`/tasks${qs}`);
  return res.data;
}

export async function fetchTaskById(id: string): Promise<TaskItem> {
  const res = await api.get<ApiResponse<TaskItem>>(`/tasks/${id}`);
  return res.data;
}

export async function createTask(dto: CreateTaskDto): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>('/tasks', dto);
  return res.data;
}

export async function updateTask(id: string, dto: UpdateTaskDto): Promise<TaskItem> {
  const res = await api.patch<ApiResponse<TaskItem>>(`/tasks/${id}`, dto);
  return res.data;
}

export async function startWorkSession(id: string): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/work-sessions/start`);
  return res.data;
}

export async function pauseWorkSession(id: string): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/work-sessions/pause`);
  return res.data;
}

export async function resumeWorkSession(id: string): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/work-sessions/resume`);
  return res.data;
}

export async function completeTask(id: string, dto?: CompleteTaskDto): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/complete`, dto || {});
  return res.data;
}

export async function blockTask(id: string, dto: BlockTaskDto): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/block`, dto);
  return res.data;
}

export async function rescheduleTask(id: string, dto: RescheduleTaskDto): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/reschedule`, dto);
  return res.data;
}

export async function addChecklistItem(id: string, title: string): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/checklist`, { title });
  return res.data;
}

export async function toggleChecklistItem(id: string, checklistId: string): Promise<TaskItem> {
  const res = await api.patch<ApiResponse<TaskItem>>(`/tasks/${id}/checklist/${checklistId}/toggle`);
  return res.data;
}

export async function addTaskComment(id: string, content: string): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/comments`, { content });
  return res.data;
}

export async function addTaskAttachment(id: string, attachment: AttachmentItem): Promise<TaskItem> {
  const res = await api.post<ApiResponse<TaskItem>>(`/tasks/${id}/attachments`, attachment);
  return res.data;
}

export async function bulkTaskAction(
  dto: BulkTaskActionDto,
): Promise<{ updatedCount: number; tasks: TaskItem[] }> {
  const res = await api.post<ApiResponse<{ updatedCount: number; tasks: TaskItem[] }>>('/tasks/bulk', dto);
  return res.data;
}

