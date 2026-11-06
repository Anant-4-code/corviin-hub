import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  PersonalSettings,
  UpdatePersonalSettingsDto,
  AccountSecuritySummary,
  WorkspaceSettings,
  UpdateWorkspaceSettingsDto,
} from '@corviin-hub/shared';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('personal')
  @ApiOperation({ summary: 'Get personal settings and user preferences' })
  @ApiQuery({ name: 'profileId', required: false })
  getPersonalSettings(
    @Query('profileId') profileId?: string,
    @Headers('x-profile-id') headerProfileId?: string,
  ): PersonalSettings {
    const targetId = profileId || headerProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    return this.settingsService.getPersonalSettings(targetId);
  }

  @Patch('personal')
  @ApiOperation({ summary: 'Update personal settings and user preferences' })
  @ApiQuery({ name: 'profileId', required: false })
  updatePersonalSettings(
    @Body() dto: UpdatePersonalSettingsDto,
    @Query('profileId') profileId?: string,
    @Headers('x-profile-id') headerProfileId?: string,
  ): PersonalSettings {
    const targetId = profileId || headerProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    return this.settingsService.updatePersonalSettings(targetId, dto);
  }

  @Get('security')
  @ApiOperation({ summary: 'Get account security and session summary' })
  @ApiQuery({ name: 'profileId', required: false })
  getAccountSecurity(
    @Query('profileId') profileId?: string,
    @Headers('x-profile-id') headerProfileId?: string,
  ): AccountSecuritySummary {
    const targetId = profileId || headerProfileId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    return this.settingsService.getAccountSecurity(targetId);
  }

  @Get('workspace')
  @ApiOperation({ summary: 'Get workspace settings and configuration' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getWorkspaceSettings(
    @Query('workspaceId') workspaceId: string,
  ): WorkspaceSettings {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }
    return this.settingsService.getWorkspaceSettings(workspaceId);
  }

  @Patch('workspace')
  @ApiOperation({ summary: 'Update workspace settings and operational defaults' })
  @ApiQuery({ name: 'workspaceId', required: true })
  updateWorkspaceSettings(
    @Query('workspaceId') workspaceId: string,
    @Body() dto: UpdateWorkspaceSettingsDto,
    @Headers('x-profile-id') headerProfileId?: string,
  ): WorkspaceSettings {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }
    const actorId = headerProfileId || 'Anant';
    return this.settingsService.updateWorkspaceSettings(workspaceId, actorId, dto);
  }

  @Post('workspace/reset')
  @ApiOperation({ summary: 'Reset workspace settings to default values' })
  @ApiQuery({ name: 'workspaceId', required: true })
  resetWorkspaceDefaults(
    @Query('workspaceId') workspaceId: string,
    @Headers('x-profile-id') headerProfileId?: string,
  ): WorkspaceSettings {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }
    const actorId = headerProfileId || 'Anant';
    return this.settingsService.resetWorkspaceDefaults(workspaceId, actorId);
  }

  @Get('impact')
  @ApiOperation({ summary: 'Check consequential impact of removing a CRM stage or category' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'type', required: true })
  @ApiQuery({ name: 'value', required: true })
  checkImpact(
    @Query('workspaceId') workspaceId: string,
    @Query('type') type: 'CRM_STAGE' | 'CRM_CATEGORY' | 'CRM_SOURCE' | 'PARTNER_TYPE',
    @Query('value') value: string,
  ): { affectedCount: number; message: string; safeToRemove: boolean } {
    if (!workspaceId || !type || !value) {
      throw new BadRequestException('workspaceId, type, and value are required.');
    }
    return this.settingsService.checkImpact(workspaceId, type, value);
  }
}
