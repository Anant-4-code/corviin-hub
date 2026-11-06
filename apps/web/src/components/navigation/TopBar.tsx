import { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ProfileMenu } from './ProfileMenu';
import { NotificationPopover } from './NotificationPopover';
import { ContextualCreateMenu, CreateEntityType } from './ContextualCreateMenu';
import { GlobalSearchModal } from '@/features/search/GlobalSearchModal';
import { useAppStore } from '@/lib/store';
import { SearchEntityType } from '@corviin-hub/shared';

export function TopBar() {
  const { toggleSidebar } = useAppStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [externalCreateType, setExternalCreateType] = useState<CreateEntityType | null>(null);

  // Global keyboard shortcut for search (Ctrl+K, Cmd+K, or '/')
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && !isSearchOpen) {
        const activeElement = document.activeElement;
        const isInputField =
          activeElement &&
          (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            (activeElement as HTMLElement).isContentEditable);
        if (!isInputField) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleOpenCreateFromSearch = (type?: SearchEntityType) => {
    if (type === SearchEntityType.TASK) {
      setExternalCreateType('task');
    } else if (type === SearchEntityType.CRM) {
      setExternalCreateType('tech-crm');
    } else if (type === SearchEntityType.CAMPAIGN) {
      setExternalCreateType('campaign');
    } else if (type === SearchEntityType.MEETING) {
      setExternalCreateType('meeting');
    } else {
      setExternalCreateType('task');
    }
  };

  return (
    <>
      <header className="h-14 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 border-b border-ch-border bg-surface shrink-0 sticky top-0 z-20">
        {/* Sidebar toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-1.5 rounded-control hover:bg-surface-muted text-ch-text-secondary min-h-[36px] min-w-[36px] items-center justify-center"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Workspace switcher */}
        <WorkspaceSwitcher />

        {/* Desktop Search Trigger bar */}
        <div className="flex-1 max-w-80 hidden sm:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-control border border-ch-border bg-surface-muted/50 text-xs text-ch-text-muted hover:border-ch-border-hover hover:bg-surface-muted transition-none min-h-[36px]"
            aria-label="Open global search (Ctrl+K)"
          >
            <span className="flex items-center gap-2">
              <Search size={14} className="text-ch-text-secondary" />
              <span>Search records…</span>
            </span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono border border-ch-border rounded bg-surface text-ch-text-secondary">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 rounded-control text-ch-text-secondary hover:bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open mobile search"
        >
          <Search size={18} />
        </button>

        <div className="flex-1 lg:hidden" />

        {/* Right actions: Contextual Create, Theme, Notifications, Profile */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <ContextualCreateMenu
            externalOpenType={externalCreateType}
            onExternalClose={() => setExternalCreateType(null)}
          />
          <ThemeSwitcher />
          <NotificationPopover />
          <ProfileMenu />
        </div>
      </header>

      {/* Global Search Modal / Command Palette */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenCreate={handleOpenCreateFromSearch}
      />
    </>
  );
}
