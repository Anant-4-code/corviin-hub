import { api } from '@/lib/api';
import type { GlobalSearchResponse, GlobalSearchQuery } from '@corviin-hub/shared';

export async function fetchGlobalSearch(
  query: GlobalSearchQuery,
  signal?: AbortSignal,
): Promise<GlobalSearchResponse> {
  const params = new URLSearchParams();
  params.set('q', query.q);
  if (query.workspaceId) params.set('workspaceId', query.workspaceId);
  if (query.types) params.set('types', query.types);
  if (query.limit) params.set('limit', String(query.limit));

  return api.get<GlobalSearchResponse>(`/search?${params.toString()}`, { signal });
}

