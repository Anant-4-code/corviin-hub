import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/lib/store';

describe('Workspace Selection & Switching Store', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      selectedWorkspaceId: null,
      theme: 'light',
    });
  });

  it('selects active workspace correctly', () => {
    const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
    useAppStore.getState().setSelectedWorkspaceId(techWorkspaceId);
    expect(useAppStore.getState().selectedWorkspaceId).toBe(techWorkspaceId);
  });

  it('switches between Tech and Real Estate workspaces cleanly', () => {
    const techWorkspaceId = 'ws-tech-0001-0000-000000000001';
    const reWorkspaceId = 'ws-real-0002-0000-000000000002';

    useAppStore.getState().setSelectedWorkspaceId(techWorkspaceId);
    expect(useAppStore.getState().selectedWorkspaceId).toBe(techWorkspaceId);

    // Switch to Real Estate
    useAppStore.getState().setSelectedWorkspaceId(reWorkspaceId);
    expect(useAppStore.getState().selectedWorkspaceId).toBe(reWorkspaceId);

    // Profile remains unchanged
    expect(useAppStore.getState().selectedProfileId).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
  });
});
