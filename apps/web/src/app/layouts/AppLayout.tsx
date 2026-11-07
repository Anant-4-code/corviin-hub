import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { TopBar } from '@/components/navigation/TopBar';
import { MobileBottomNavigation } from '@/components/navigation/MobileBottomNavigation';
import { ToastContainer } from '@/components/ui/Toast';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop sidebar — fixed height, sticky */}
      <DesktopSidebar />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto relative z-0"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Add bottom padding on mobile for the bottom nav */}
          <div className="pb-16 lg:pb-0 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation — only visible on mobile */}
      <MobileBottomNavigation />

      {/* Global Toast notifications */}
      <ToastContainer />
    </div>
  );
}

