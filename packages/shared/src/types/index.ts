// ============================================================
// CORVIIN HUB — Shared Types
// ============================================================

/** Base entity with common fields */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** Profile record — not authenticated identity */
export interface Profile extends BaseEntity {
  displayName: string;
  initials: string;
  avatarUrl?: string;
  email?: string;
}

/** Workspace record */
export interface Workspace extends BaseEntity {
  name: string;
  slug: string;
  type: WorkspaceType;
  description: string;
}

/** Workspace type enum */
export type WorkspaceType = 'TECH' | 'REAL_ESTATE';

/** Standard API success response */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

/** Standard API error response */
export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  requestId?: string;
}

/** Pagination metadata */
export interface ApiMeta {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
}

/** Health check response */
export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  version: string;
  uptime: number;
}

/** Request context headers */
export interface RequestContext {
  profileId: string;
  workspaceId: string;
}
