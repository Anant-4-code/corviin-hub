import { SearchEntityType } from '../enums';

/** Individual search result item across all modules */
export interface SearchResultItem {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  summary?: string;
  workspaceId: string;
  badge?: string;
  status?: string;
  targetUrl: string;
  score?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

/** Grouped search results for a specific entity category */
export interface SearchGroupResult {
  type: SearchEntityType;
  label: string;
  total: number;
  items: SearchResultItem[];
}

/** Complete response for global search query */
export interface GlobalSearchResponse {
  query: string;
  workspaceId: string;
  totalResults: number;
  groups: Record<string, SearchGroupResult>;
  items: SearchResultItem[];
}

/** Global search query parameters */
export interface GlobalSearchQuery {
  q: string;
  workspaceId?: string;
  types?: string; // Comma-separated SearchEntityType values e.g. "TASK,CRM"
  limit?: number; // Maximum items per group
}

/** Contextual create action descriptor */
export interface ContextualCreateAction {
  id: string;
  label: string;
  description: string;
  iconName: string;
  entityType: SearchEntityType;
  applicableWorkspaces: ('tech' | 'real-estate')[];
  suggestedRoutes?: string[]; // Routes where this action is prioritized
}

