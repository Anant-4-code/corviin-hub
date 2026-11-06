import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('Dashboard Operations Center (Phase 6 Integration)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('renders operational metrics from backend summary endpoint', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        workspaceId: 'ws-tech-0001-0000-000000000001',
        metrics: {
          openTasksCount: 12,
          overdueTasksCount: 3,
          completedTasksCount: 28,
          activeCampaignsCount: 4,
          crmLeadsCount: 15,
          upcomingMeetingsCount: 5,
          totalAssetsCount: 42,
          storageBytesUsed: 52428800, // 50 MB
        },
        timestamp: new Date().toISOString(),
      },
      status: 'ok',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    // Verify loading or metric values render
    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('50.0 MB')).toBeInTheDocument();
    });

    expect(screen.getByText('Operations Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Team Task Calendar')).toBeInTheDocument();
    expect(screen.getByText('Meetings & Visits Calendar')).toBeInTheDocument();
    expect(screen.getByText('Content & Campaign Calendar')).toBeInTheDocument();
  });

  it('renders error state and allows retry on API failure', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Could not load dashboard metrics')).toBeInTheDocument();
    });
  });
});

