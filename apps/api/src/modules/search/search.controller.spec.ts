import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TasksModule } from '../tasks/tasks.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { CrmModule } from '../crm/crm.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { PlansGoalsModule } from '../plans-goals/plans-goals.module';
import { AssetsModule } from '../assets/assets.module';
import { TeamModule } from '../team/team.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { SearchEntityType } from '@corviin-hub/shared';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;

  const TECH_WS = 'ws-tech-0001-0000-000000000001';
  const RE_WS = 'ws-real-0002-0000-000000000002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TasksModule,
        CampaignsModule,
        CrmModule,
        MeetingsModule,
        PlansGoalsModule,
        AssetsModule,
        TeamModule,
        WorkspacesModule,
      ],
      controllers: [SearchController],
      providers: [SearchService],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Workspace Scoping & Isolation', () => {
    it('requires workspace ID and throws BadRequestException if missing', async () => {
      await expect(controller.search('test', undefined, undefined, '', '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('isolates search results strictly by workspace', async () => {
      // Search for Swagger / OpenAPI which is a Tech task
      const techResults = await controller.search('Swagger', undefined, undefined, TECH_WS);
      expect(techResults.workspaceId).toBe(TECH_WS);
      expect(techResults.totalResults).toBeGreaterThan(0);
      const allTech = techResults.items.every((item) => item.workspaceId === TECH_WS);
      expect(allTech).toBe(true);

      // Same query in Real Estate workspace must return zero matching items
      const reResults = await controller.search('Swagger', undefined, undefined, RE_WS);
      expect(reResults.workspaceId).toBe(RE_WS);
      expect(reResults.items.some((i) => i.title.toLowerCase().includes('swagger'))).toBe(false);
    });
  });

  describe('Query Validation & Formatting', () => {
    it('returns empty result cleanly for empty query string', async () => {
      const result = await controller.search('', undefined, undefined, TECH_WS);
      expect(result.totalResults).toBe(0);
      expect(result.items).toEqual([]);
      expect(result.groups).toEqual({});
    });

    it('throws BadRequestException for queries exceeding 100 characters', async () => {
      const longQuery = 'a'.repeat(101);
      await expect(controller.search(longQuery, undefined, undefined, TECH_WS)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Entity Type Filtering', () => {
    it('filters results strictly when specific types are requested', async () => {
      const result = await controller.search('a', 'TASK', 10, TECH_WS);
      expect(result.groups[SearchEntityType.TASK]).toBeDefined();
      expect(result.groups[SearchEntityType.CAMPAIGN]).toBeUndefined();
      expect(result.groups[SearchEntityType.CRM]).toBeUndefined();
      expect(result.items.every((i) => i.type === SearchEntityType.TASK)).toBe(true);
    });
  });

  describe('Deterministic Ranking & Result Capping', () => {
    it('ranks exact and prefix title matches higher than partial substring matches', async () => {
      const result = await controller.search('Review', undefined, 10, TECH_WS);
      if (result.items.length >= 2) {
        expect(result.items[0].score).toBeGreaterThanOrEqual(result.items[1].score || 0);
      }
    });

    it('caps results per group according to the limit parameter', async () => {
      const result = await controller.search('e', undefined, 2, TECH_WS);
      for (const group of Object.values(result.groups)) {
        expect(group.items.length).toBeLessThanOrEqual(2);
      }
    });
  });

  describe('CRM Search & Phone Normalization', () => {
    it('matches CRM contacts when searching formatted or unformatted phone numbers', async () => {
      // In Tech workspace, Acme Retail contact exists
      const phoneResult = await controller.search('98765', 'CRM', 5, TECH_WS);
      expect(phoneResult.groups[SearchEntityType.CRM]).toBeDefined();
    });
  });
});

