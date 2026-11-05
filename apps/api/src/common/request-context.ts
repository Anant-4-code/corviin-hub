import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Acting profile context — NOT authenticated identity.
 * This is a shared-device profile selector for the internal prototype.
 */
export interface ActingProfileContext {
  profileId: string;
}

/**
 * Active workspace context for scoping all data queries.
 */
export interface ActiveWorkspaceContext {
  workspaceId: string;
}

/** Extract acting profile ID from request headers */
export const ActingProfile = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ActingProfileContext => {
    const request = ctx.switchToHttp().getRequest();
    const profileId = request.headers['x-profile-id'] as string;
    return { profileId: profileId || '' };
  },
);

/** Extract active workspace ID from request headers */
export const ActiveWorkspace = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ActiveWorkspaceContext => {
    const request = ctx.switchToHttp().getRequest();
    const workspaceId = request.headers['x-workspace-id'] as string;
    return { workspaceId: workspaceId || '' };
  },
);
