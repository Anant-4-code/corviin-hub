import { Bell, Menu } from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ProfileMenu } from './ProfileMenu';
import { SearchInput } from '@/components/ui/SearchInput';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';
import { cn } from '@/lib/cn';

export function TopBar() {
  const { toggleSidebar } = useAppStore();
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-ch-border bg-surface shrink-0 sticky top-0 z-20">
      {/* Sidebar toggle (desktop only) */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex p-1.5 rounded-control hover:bg-surface-muted text-ch-text-secondary"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Workspace switcher */}
      <WorkspaceSwitcher />

      {/* Search — takes available space */}
      <div className="flex-1 max-w-80 hidden sm:block">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search…"
          aria-label="Global search"
        />
      </div>

      <div className="flex-1 lg:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <button
          className="p-2 rounded-control hover:bg-surface-muted text-ch-text-secondary relative"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={16} />
        </button>
        <ProfileMenu />
      </div>
    </header>
  );
}

