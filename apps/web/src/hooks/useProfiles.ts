import { useQuery } from '@tanstack/react-query';
import { fetchProfiles } from '@/services/profiles';

export function useProfiles() {
  return useQuery({ queryKey: ['profiles'], queryFn: fetchProfiles, staleTime: 5 * 60_000 });
}

