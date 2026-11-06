import { Module } from '@nestjs/common';
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

@Module({
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
  exports: [SearchService],
})
export class SearchModule {}

