import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActingContextGuard } from '../src/common/guards/acting-context.guard';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ActingContextGuard & Workspace Isolation (Phase 5)', () => {
  let guard: ActingContextGuard;
  let prisma: PrismaService;
  let reflector: Reflector;

  const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
  const realEstateWorkspaceId = 'ws-real-0002-0000-000000000002';
  const activeProfileId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // Anant
  const inactiveProfileId = 'd4e5f6a7-b8c9-0123-def0-123456789013'; // Vikramaditya Rao (Inactive)
  const unknownProfileId = 'f9e8d7c6-b5a4-3210-9876-543210fedcba';

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    reflector = new Reflector();
    guard = new ActingContextGuard(reflector, prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  function createMockExecutionContext(headers: Record<string, string>, isPublic = false): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
          url: '/api/v1/test',
        }),
        getResponse: () => ({}),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
  }

  it('should allow public endpoints without headers', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const context = createMockExecutionContext({});
    const canActivate = await guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  describe('Acting Profile Validation', () => {
    beforeEach(() => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    });

    it('should approve active profile with valid workspace membership', async () => {
      const mockReq: any = {
        headers: {
          'x-profile-id': activeProfileId,
          'x-workspace-id': techWorkspaceId,
        },
      };
      const context = {
        switchToHttp: () => ({
          getRequest: () => mockReq,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(mockReq.actingContext).toBeDefined();
      expect(mockReq.actingContext.profileName).toBe('Anant');
      expect(mockReq.actingContext.workspaceName).toBe('Corviin Tech');
      expect(mockReq.actingContext.isPrototypeActingContext).toBe(true);
    });

    it('should reject unknown profile ID with UNKNOWN_ACTING_PROFILE', async () => {
      const context = createMockExecutionContext({
        'x-profile-id': unknownProfileId,
        'x-workspace-id': techWorkspaceId,
      });

      await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    });

    it('should reject inactive profile with INACTIVE_ACTING_PROFILE', async () => {
      const context = createMockExecutionContext({
        'x-profile-id': inactiveProfileId,
        'x-workspace-id': techWorkspaceId,
      });

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });

    it('should reject non-existent workspace ID with WORKSPACE_NOT_FOUND', async () => {
      const context = createMockExecutionContext({
        'x-profile-id': activeProfileId,
        'x-workspace-id': 'ws-non-existent-9999',
      });

      await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
    });
  });
});

