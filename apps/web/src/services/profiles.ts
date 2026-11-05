import { api } from '@/lib/api';
import type { Profile, ApiResponse } from '@corviin-hub/shared';

export async function fetchProfiles(): Promise<Profile[]> {
  const r = await api.get<ApiResponse<Profile[]>>('/profiles');
  return r.data;
}

