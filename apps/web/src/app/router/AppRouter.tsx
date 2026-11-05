import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { AppLayout } from '@/app/layouts/AppLayout';

// Profile selection
import { SelectProfilePage } from '@/features/profile/SelectProfilePage';

// Feature pages
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MyTasksPage } from '@/features/tasks/MyTasksPage';
import { AllTasksPage } from '@/features/tasks/AllTasksPage';
import { PlansGoalsPage } from '@/features/plans-goals/PlansGoalsPage';
import { CalendarPage } from '@/features/calendar/CalendarPage';
import { CalendarContentPage } from '@/features/calendar/CalendarContentPage';
import { CalendarTeamTasksPage } from '@/features/calendar/CalendarTeamTasksPage';
import { CalendarMeetingsPage } from '@/features/calendar/CalendarMeetingsPage';
import { CampaignsPage } from '@/features/campaigns/CampaignsPage';
import { CampaignDetailPage } from '@/features/campaigns/CampaignDetailPage';
import { AssetsPage } from '@/features/assets/AssetsPage';
import { CrmPage } from '@/features/crm/CrmPage';
import { CrmTechPage } from '@/features/crm/CrmTechPage';
import { CrmPartnersPage } from '@/features/crm/CrmPartnersPage';
import { CrmBuyersPage } from '@/features/crm/CrmBuyersPage';
import { MeetingsPage } from '@/features/meetings/MeetingsPage';
import { MeetingDetailPage } from '@/features/meetings/MeetingDetailPage';
import { TeamPage } from '@/features/team/TeamPage';
import { TeamMemberPage } from '@/features/team/TeamMemberPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { DesignSystemPreviewPage } from '@/features/design-system/DesignSystemPreviewPage';
import { NotFoundPage } from '@/features/common/NotFoundPage';

function RequireProfile({ children }: { children: React.ReactNode }) {
  const { selectedProfileId } = useAppStore();
  if (!selectedProfileId) return <Navigate to="/select-profile" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  const { selectedProfileId } = useAppStore();

  return (
    <Routes>
      <Route
        path="/"
        element={
          selectedProfileId ? <Navigate to="/app/dashboard" replace /> : <Navigate to="/select-profile" replace />
        }
      />
      <Route path="/select-profile" element={<SelectProfilePage />} />

      <Route
        path="/app"
        element={
          <RequireProfile>
            <AppLayout />
          </RequireProfile>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="my-tasks" element={<MyTasksPage />} />
        <Route path="tasks" element={<AllTasksPage />} />
        <Route path="plans-goals" element={<PlansGoalsPage />} />
        <Route path="calendar" element={<CalendarPage />}>
          <Route index element={<Navigate to="content-campaigns" replace />} />
          <Route path="content-campaigns" element={<CalendarContentPage />} />
          <Route path="team-tasks" element={<CalendarTeamTasksPage />} />
          <Route path="meetings-visits" element={<CalendarMeetingsPage />} />
        </Route>
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/:campaignId" element={<CampaignDetailPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="crm" element={<CrmPage />} />
        <Route path="crm/tech" element={<CrmTechPage />} />
        <Route path="crm/real-estate/partners" element={<CrmPartnersPage />} />
        <Route path="crm/real-estate/buyers" element={<CrmBuyersPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="meetings/:meetingId" element={<MeetingDetailPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="team/:memberId" element={<TeamMemberPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="design-system" element={<DesignSystemPreviewPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
