import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/lib/store';

describe('Theme Preference Persistence', () => {
  beforeEach(() => {
    useAppStore.setState({ theme: 'light' });
  });

  it('defaults to light theme', () => {
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('updates theme to dark', () => {
    useAppStore.getState().setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('updates theme to system', () => {
    useAppStore.getState().setTheme('system');
    expect(useAppStore.getState().theme).toBe('system');
  });
});
