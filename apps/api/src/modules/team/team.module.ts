import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TasksModule } from '../tasks/tasks.module';
import { PlansGoalsModule } from '../plans-goals/plans-goals.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    TasksModule,
    PlansGoalsModule,
    CampaignsModule,
    MeetingsModule,
    WorkspacesModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
