import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { desktopNavGroups, type NavItem } from './navigation-config';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/cn';

function NavItemRow({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const isActive = hasChildren
    ? location.pathname.startsWith(item.path)
    : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setExpanded((p) => !p)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-control text-sm',
            isActive
              ? 'bg-surface-selected text-accent font-medium'
              : 'text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted',
          )}
        >
          <Icon size={16} className="shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {expanded && (
          <div className="ml-5 border-l border-ch-border pl-2 mt-0.5 flex flex-col gap-0.5">
            {item.children!.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-control text-sm',
                    isActive
                      ? 'text-accent font-medium'
                      : 'text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted',
                  )
                }
              >
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive: active }) =>
        cn(
          'flex items-center rounded-control text-sm',
          collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2',
          active || isActive
            ? 'bg-surface-selected text-accent font-medium'
            : 'text-ch-text-secondary hover:text-ch-text-primary hover:bg-surface-muted',
        )
      }
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

export function DesktopSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-surface border-r border-ch-border h-screen sticky top-0 shrink-0 overflow-hidden',
        sidebarCollapsed ? 'w-14' : 'w-sidebar',
      )}
    >
      {/* Logo area */}
      <div className={cn('flex items-center border-b border-ch-border h-14 shrink-0', sidebarCollapsed ? 'justify-center px-2' : 'px-4')}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface border border-ch-border p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img src="/logo-square.png" alt="CORVIIN Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-sm tracking-tight text-ch-text-primary truncate">CORVIIN HUB</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-surface border border-ch-border p-1 flex items-center justify-center shadow-xs">
            <img src="/logo-square.png" alt="CORVIIN Logo" className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-4" aria-label="Main navigation">
        {desktopNavGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider text-ch-text-muted select-none">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItemRow key={item.path} item={item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-ch-border p-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-control text-ch-text-muted hover:text-ch-text-primary hover:bg-surface-muted"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          {!sidebarCollapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

