import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { ApiSuccessResponse } from '../../common';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({
    summary: 'List available profiles',
    description:
      'Returns selectable acting profiles. This is NOT authentication — it is a shared-device profile selector for the internal prototype.',
  })
  findAll() {
    const profiles = this.profilesService.findAll();
    return new ApiSuccessResponse(profiles);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiParam({ name: 'id', description: 'Profile UUID' })
  findOne(@Param('id') id: string) {
    const profile = this.profilesService.findById(id);
    if (!profile) {
      throw new NotFoundException(`Profile ${id} not found`);
    }
    return new ApiSuccessResponse(profile);
  }
}
