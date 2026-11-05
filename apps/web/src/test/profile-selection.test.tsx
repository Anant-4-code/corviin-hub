import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/lib/store';

describe('Profile Selection & Switching Store', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedProfileId: null,
      selectedWorkspaceId: null,
      theme: 'light',
    });
  });

  it('initially has no profile selected', () => {
    const state = useAppStore.getState();
    expect(state.selectedProfileId).toBeNull();
  });

  it('selects an acting profile correctly', () => {
    const mockId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // Anant
    useAppStore.getState().setSelectedProfileId(mockId);
    expect(useAppStore.getState().selectedProfileId).toBe(mockId);
  });

  it('switches acting profile without deleting other state', () => {
    const profile1 = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // Anant
    const profile2 = 'b2c3d4e5-f6a7-8901-bcde-f12345678901'; // Rohit
    const workspaceId = 'ws-tech-0001-0000-000000000001';

    useAppStore.getState().setSelectedProfileId(profile1);
    useAppStore.getState().setSelectedWorkspaceId(workspaceId);

    // Switch to Rohit
    useAppStore.getState().setSelectedProfileId(profile2);

    expect(useAppStore.getState().selectedProfileId).toBe(profile2);
    // Workspace remains intact
    expect(useAppStore.getState().selectedWorkspaceId).toBe(workspaceId);
  });

  it('clears acting profile when switching profile is triggered', () => {
    const profile1 = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    useAppStore.getState().setSelectedProfileId(profile1);
    expect(useAppStore.getState().selectedProfileId).toBe(profile1);

    useAppStore.getState().setSelectedProfileId(null);
    expect(useAppStore.getState().selectedProfileId).toBeNull();
  });
});

