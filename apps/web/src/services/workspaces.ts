import { api } from '@/lib/api';
import type { Workspace, ApiResponse } from '@corviin-hub/shared';

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const r = await api.get<ApiResponse<Workspace[]>>('/workspaces');
  return r.data;
}

