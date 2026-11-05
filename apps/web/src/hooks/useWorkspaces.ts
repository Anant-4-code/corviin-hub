import { useQuery } from '@tanstack/react-query';
import { fetchWorkspaces } from '@/services/workspaces';

export function useWorkspaces() {
  return useQuery({ queryKey: ['workspaces'], queryFn: fetchWorkspaces, staleTime: 5 * 60_000 });
}

