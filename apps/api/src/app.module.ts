import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './modules/storage/storage.module';
import { HealthModule } from './modules/health/health.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PlansGoalsModule } from './modules/plans-goals/plans-goals.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AssetsModule } from './modules/assets/assets.module';
import { FoldersModule } from './modules/folders/folders.module';
import { CrmModule } from './modules/crm/crm.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { TeamModule } from './modules/team/team.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    StorageModule,
    HealthModule,
    ProfilesModule,
    WorkspacesModule,
    DashboardModule,
    TasksModule,
    PlansGoalsModule,
    CalendarModule,
    CampaignsModule,
    AssetsModule,
    FoldersModule,
    CrmModule,
    MeetingsModule,
    TeamModule,
    NotificationsModule,
    SettingsModule,
    SearchModule,
  ],
})
export class AppModule {}
