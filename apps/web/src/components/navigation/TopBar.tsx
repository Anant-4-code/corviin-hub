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
      <header className="h-14 flex items-center justify-between gap-1 sm:gap-2 px-2 sm:px-4 border-b border-ch-border bg-surface shrink-0 sticky top-0 z-40 w-full max-w-full">
        {/* Left section: Sidebar toggle + Workspace Switcher + Search */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink overflow-hidden">
          {/* Sidebar toggle (desktop only) */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-control hover:bg-surface-muted text-ch-text-secondary min-h-[36px] min-w-[36px] items-center justify-center shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Workspace switcher */}
          <WorkspaceSwitcher />

          {/* Mobile & Small Screen Search Icon Button (< md) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-1.5 rounded-control text-ch-text-secondary hover:bg-surface-muted min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0"
            aria-label="Open search"
          >
            <Search size={16} />
          </button>

          {/* Desktop Search Trigger bar (>= md) */}
          <div className="w-48 lg:w-72 hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-control border border-ch-border bg-surface-muted/50 text-xs text-ch-text-muted hover:border-ch-border-hover hover:bg-surface-muted transition-none min-h-[36px]"
              aria-label="Open global search (Ctrl+K)"
            >
              <span className="flex items-center gap-2">
                <Search size={14} className="text-ch-text-secondary" />
                <span>Search records…</span>
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono border border-ch-border rounded bg-surface text-ch-text-secondary">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>

        {/* Right actions: Contextual Create, Theme, Notifications, Profile */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1">
          <ContextualCreateMenu
            externalOpenType={externalCreateType}
            onExternalClose={() => setExternalCreateType(null)}
          />
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
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
