import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PlansGoalsModule } from './modules/plans-goals/plans-goals.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AssetsModule } from './modules/assets/assets.module';
import { CrmModule } from './modules/crm/crm.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { TeamModule } from './modules/team/team.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    HealthModule,
    ProfilesModule,
    WorkspacesModule,
    DashboardModule,
    TasksModule,
    PlansGoalsModule,
    CalendarModule,
    CampaignsModule,
    AssetsModule,
    CrmModule,
    MeetingsModule,
    TeamModule,
    NotificationsModule,
    SettingsModule,
  ],
})
export class AppModule {}
