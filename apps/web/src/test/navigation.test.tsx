import { describe, it, expect } from 'vitest';
import { desktopNavGroups, mobileBottomNav, mobileMoreItems } from '@/components/navigation/navigation-config';

describe('Navigation Configurations', () => {
  it('defines 5 groups in desktop sidebar', () => {
    expect(desktopNavGroups).toHaveLength(5);
    const labels = desktopNavGroups.map((g) => g.label);
    expect(labels).toEqual(['Overview', 'Work', 'Growth', 'Resources', 'Administration']);
  });

  it('covers all 11 core modules across desktop navigation', () => {
    const allPaths: string[] = [];
    desktopNavGroups.forEach((group) => {
      group.items.forEach((item) => {
        allPaths.push(item.path);
        if (item.children) {
          item.children.forEach((child) => allPaths.push(child.path));
        }
      });
    });

    expect(allPaths).toContain('/app/dashboard');
    expect(allPaths).toContain('/app/my-tasks');
    expect(allPaths).toContain('/app/tasks');
    expect(allPaths).toContain('/app/plans-goals');
    expect(allPaths).toContain('/app/calendar');
    expect(allPaths).toContain('/app/campaigns');
    expect(allPaths).toContain('/app/crm');
    expect(allPaths).toContain('/app/meetings');
    expect(allPaths).toContain('/app/assets');
    expect(allPaths).toContain('/app/team');
    expect(allPaths).toContain('/app/settings');
  });

  it('has exactly 4 primary bottom navigation tabs + More trigger for mobile', () => {
    expect(mobileBottomNav).toHaveLength(4);
    const labels = mobileBottomNav.map((i) => i.label);
    expect(labels).toEqual(['Home', 'Tasks', 'Calendar', 'CRM']);
  });

  it('includes remaining modules inside mobile More menu', () => {
    const moreLabels = mobileMoreItems.map((i) => i.label);
    expect(moreLabels).toContain('Campaigns');
    expect(moreLabels).toContain('Plans & Goals');
    expect(moreLabels).toContain('Meetings');
    expect(moreLabels).toContain('Assets & Storage');
    expect(moreLabels).toContain('Team');
    expect(moreLabels).toContain('Settings');
  });
});

