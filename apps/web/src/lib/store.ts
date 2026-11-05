import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  selectedProfileId: string | null;
  setSelectedProfileId: (id: string | null) => void;
  selectedWorkspaceId: string | null;
  setSelectedWorkspaceId: (id: string | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (c: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedProfileId: null,
      setSelectedProfileId: (id) => set({ selectedProfileId: id }),
      selectedWorkspaceId: null,
      setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
      theme: 'light' as Theme,
      setTheme: (theme) => set({ theme }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'corviin-hub-state',
      partialize: (state) => ({
        selectedProfileId: state.selectedProfileId,
        selectedWorkspaceId: state.selectedWorkspaceId,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

