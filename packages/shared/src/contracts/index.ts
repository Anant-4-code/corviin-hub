// ============================================================
// CORVIIN HUB — API Contracts
// ============================================================

/** API endpoint paths */
export const API_PATHS = {
  health: '/health',
  profiles: '/profiles',
  workspaces: '/workspaces',
  dashboard: '/dashboard',
  myTasks: '/my-tasks',
  tasks: '/tasks',
  plansGoals: '/plans-goals',
  calendar: '/calendar',
  campaigns: '/campaigns',
  assets: '/assets',
  crm: '/crm',
  meetings: '/meetings',
  team: '/team',
  notifications: '/notifications',
  settings: '/settings',
  search: '/search',
} as const;

/** Request header names */
export const REQUEST_HEADERS = {
  profileId: 'x-profile-id',
  workspaceId: 'x-workspace-id',
} as const;

/** Local storage keys */
export const STORAGE_KEYS = {
  selectedProfileId: 'corviin_hub_profile_id',
  selectedWorkspaceId: 'corviin_hub_workspace_id',
  themePreference: 'corviin_hub_theme',
  sidebarCollapsed: 'corviin_hub_sidebar_collapsed',
} as const;
