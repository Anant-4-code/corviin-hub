import { api } from '@/lib/api';
import type { HealthCheckResponse } from '@corviin-hub/shared';

export async function fetchHealthCheck(): Promise<HealthCheckResponse> {
  return api.get<HealthCheckResponse>('/health');
}

