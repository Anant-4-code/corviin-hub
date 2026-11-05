import {
  LayoutDashboard,
  CheckSquare,
  ClipboardList,
  Target,
  CalendarDays,
  Megaphone,
  FolderOpen,
  Users2,
  Video,
  Settings,
  Home,
  Palette,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  group?: string;
  children?: NavItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const desktopNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Work',
    items: [
      { label: 'My Tasks', path: '/app/my-tasks', icon: CheckSquare },
      { label: 'All Tasks', path: '/app/tasks', icon: ClipboardList },
      { label: 'Plans & Goals', path: '/app/plans-goals', icon: Target },
      {
        label: 'Calendar',
        path: '/app/calendar',
        icon: CalendarDays,
        children: [
          { label: 'Content & Campaigns', path: '/app/calendar/content-campaigns', icon: CalendarDays },
          { label: 'Team Tasks', path: '/app/calendar/team-tasks', icon: CalendarDays },
          { label: 'Meetings & Visits', path: '/app/calendar/meetings-visits', icon: CalendarDays },
        ],
      },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Campaigns', path: '/app/campaigns', icon: Megaphone },
      {
        label: 'CRM',
        path: '/app/crm',
        icon: Users2,
        children: [
          { label: 'Tech CRM', path: '/app/crm/tech', icon: Users2 },
          { label: 'RE Partners', path: '/app/crm/real-estate/partners', icon: Users2 },
          { label: 'RE Buyers', path: '/app/crm/real-estate/buyers', icon: Users2 },
        ],
      },
      { label: 'Meetings', path: '/app/meetings', icon: Video },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Assets & Storage', path: '/app/assets', icon: FolderOpen },
      { label: 'Team', path: '/app/team', icon: Users2 },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Settings', path: '/app/settings', icon: Settings },
      { label: 'Design System', path: '/app/design-system', icon: Palette },
    ],
  },
];

export const mobileBottomNav: NavItem[] = [
  { label: 'Home', path: '/app/dashboard', icon: Home },
  { label: 'Tasks', path: '/app/my-tasks', icon: CheckSquare },
  { label: 'Calendar', path: '/app/calendar', icon: CalendarDays },
  { label: 'CRM', path: '/app/crm', icon: Users2 },
];

export const mobileMoreItems: NavItem[] = [
  { label: 'Campaigns', path: '/app/campaigns', icon: Megaphone },
  { label: 'Plans & Goals', path: '/app/plans-goals', icon: Target },
  { label: 'Meetings', path: '/app/meetings', icon: Video },
  { label: 'Assets & Storage', path: '/app/assets', icon: FolderOpen },
  { label: 'Team', path: '/app/team', icon: Users2 },
  { label: 'Settings', path: '/app/settings', icon: Settings },
  { label: 'Design System', path: '/app/design-system', icon: Palette },
];
