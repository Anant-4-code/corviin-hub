/**
 * Centralized TanStack Query Key Factory for CORVIIN HUB
 * Ensures consistent query-key formatting across all modules,
 * scoped by workspaceId and acting profileId.
 */

export const queryKeys = {
  profiles: () => ['profiles'] as const,
  profile: (id: string) => ['profiles', id] as const,

  workspaces: () => ['workspaces'] as const,
  workspace: (id: string) => ['workspaces', id] as const,

  dashboard: (workspaceId: string) => ['dashboard', workspaceId] as const,

  tasks: {
    all: (workspaceId: string) => ['tasks', workspaceId] as const,
    list: (workspaceId: string, filter?: Record<string, unknown>) =>
      ['tasks', workspaceId, 'list', filter] as const,
    my: (workspaceId: string, profileId: string) =>
      ['tasks', workspaceId, 'my', profileId] as const,
    detail: (workspaceId: string, taskId: string) =>
      ['tasks', workspaceId, 'detail', taskId] as const,
  },

  calendar: {
    team: (workspaceId: string) => ['calendar', 'team', workspaceId] as const,
    meetingsVisits: (workspaceId: string) => ['calendar', 'meetings-visits', workspaceId] as const,
    content: (workspaceId: string) => ['calendar', 'content', workspaceId] as const,
  },

  plans: {
    all: (workspaceId: string) => ['plans', workspaceId] as const,
    detail: (workspaceId: string, planId: string) => ['plans', workspaceId, planId] as const,
  },

  goals: {
    all: (workspaceId: string) => ['goals', workspaceId] as const,
    detail: (workspaceId: string, goalId: string) => ['goals', workspaceId, goalId] as const,
  },

  campaigns: {
    all: (workspaceId: string) => ['campaigns', workspaceId] as const,
    detail: (workspaceId: string, campaignId: string) =>
      ['campaigns', workspaceId, campaignId] as const,
  },

  assets: {
    all: (workspaceId: string) => ['assets', workspaceId] as const,
    detail: (workspaceId: string, assetId: string) => ['assets', workspaceId, assetId] as const,
  },

  meetings: {
    all: (workspaceId: string) => ['meetings', workspaceId] as const,
    detail: (workspaceId: string, meetingId: string) => ['meetings', workspaceId, meetingId] as const,
    siteVisits: (workspaceId: string) => ['meetings', 'site-visits', workspaceId] as const,
  },

  crm: {
    tech: (workspaceId: string) => ['crm', 'tech', workspaceId] as const,
    partners: (workspaceId: string) => ['crm', 'partners', workspaceId] as const,
    buyers: (workspaceId: string) => ['crm', 'buyers', workspaceId] as const,
    followUps: (workspaceId: string) => ['crm', 'follow-ups', workspaceId] as const,
  },

  team: {
    members: (workspaceId: string) => ['team', workspaceId] as const,
    workload: (workspaceId: string) => ['team', 'workload', workspaceId] as const,
  },

  notifications: (workspaceId: string, profileId: string) =>
    ['notifications', workspaceId, profileId] as const,

  search: (workspaceId: string, query: string) => ['search', workspaceId, query] as const,
};

