import { z } from 'zod';

// ============================================================
// CORVIIN HUB — Shared Zod Schemas
// ============================================================

export const profileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(100),
  initials: z.string().min(1).max(3),
  avatarUrl: z.string().url().optional(),
  email: z.string().email().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const workspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(50),
  type: z.enum(['TECH', 'REAL_ESTATE']),
  description: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const healthCheckSchema = z.object({
  status: z.enum(['ok', 'degraded', 'down']),
  timestamp: z.string().datetime(),
  version: z.string(),
  uptime: z.number(),
});

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: z
      .object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        hasNextPage: z.boolean(),
      })
      .optional(),
  });

export const requestContextSchema = z.object({
  profileId: z.string().uuid(),
  workspaceId: z.string().uuid(),
});
