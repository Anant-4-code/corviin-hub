import {
  Controller,
  Get,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { GlobalSearchQuery, GlobalSearchResponse } from '@corviin-hub/shared';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') q: string,
    @Query('types') types?: string,
    @Query('limit') limit?: number,
    @Query('workspaceId') queryWorkspaceId?: string,
    @Headers('x-workspace-id') headerWorkspaceId?: string,
  ): Promise<GlobalSearchResponse> {
    const workspaceId = headerWorkspaceId || queryWorkspaceId;
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID must be provided via x-workspace-id header or workspaceId query parameter.');
    }

    const searchQuery: GlobalSearchQuery = {
      q: q || '',
      workspaceId,
      types,
      limit: limit ? Number(limit) : undefined,
    };

    return this.searchService.search(workspaceId, searchQuery);
  }
}

