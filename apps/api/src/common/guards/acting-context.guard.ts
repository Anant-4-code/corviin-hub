import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export interface ValidatedActingContext {
  profileId: string;
  profileName: string;
  role: string;
  workspaceId: string;
  workspaceName?: string;
  isPrototypeActingContext: true;
}

@Injectable()
export class ActingContextGuard implements CanActivate {
  private readonly logger = new Logger(ActingContextGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const profileId = request.headers['x-profile-id'] as string;
    const workspaceId = request.headers['x-workspace-id'] as string;

    // 1. If no profileId provided, allow for public or unauthenticated endpoints
    // (Actual endpoints needing acting profile will validate via @CurrentContext() or parameters)
    if (!profileId) {
      return true;
    }

    // 2. Database validation if Prisma is connected
    if (this.prisma.getConnectionStatus()) {
      // Validate profile
      const profile = await this.prisma.profile.findUnique({
        where: { id: profileId },
      });

      if (!profile) {
        throw new BadRequestException({
          statusCode: 400,
          code: 'UNKNOWN_ACTING_PROFILE',
          message: `The acting profile ID '${profileId}' does not exist in the database.`,
        });
      }

      if (profile.status !== 'ACTIVE') {
        throw new ForbiddenException({
          statusCode: 403,
          code: 'INACTIVE_ACTING_PROFILE',
          message: `The acting profile '${profile.displayName}' is currently ${profile.status} and cannot perform operations.`,
        });
      }

      // If workspaceId is also provided, validate workspace and membership
      let role = 'MEMBER';
      let wsName = '';

      if (workspaceId) {
        const workspace = await this.prisma.workspace.findUnique({
          where: { id: workspaceId },
        });

        if (!workspace) {
          throw new NotFoundException({
            statusCode: 404,
            code: 'WORKSPACE_NOT_FOUND',
            message: `Workspace '${workspaceId}' does not exist.`,
          });
        }
        wsName = workspace.name;

        const membership = await this.prisma.workspaceMembership.findUnique({
          where: {
            workspaceId_profileId: {
              workspaceId,
              profileId,
            },
          },
        });

        if (!membership || membership.status !== 'ACTIVE') {
          throw new ForbiddenException({
            statusCode: 403,
            code: 'WORKSPACE_ACCESS_DENIED',
            message: `The acting profile '${profile.displayName}' does not have active membership in workspace '${workspace.name}'.`,
          });
        }

        role = membership.role;
      }

      // Attach validated context to request
      request.actingContext = {
        profileId: profile.id,
        profileName: profile.displayName,
        role,
        workspaceId: workspaceId || '',
        workspaceName: wsName,
        isPrototypeActingContext: true,
      } as ValidatedActingContext;
    }

    return true;
  }
}

