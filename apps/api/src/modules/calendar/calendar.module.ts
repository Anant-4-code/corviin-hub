import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { TasksModule } from '../tasks/tasks.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { MeetingsModule } from '../meetings/meetings.module';

@Module({
  imports: [CampaignsModule, TasksModule, ProfilesModule, MeetingsModule],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
