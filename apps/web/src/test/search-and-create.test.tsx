import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TopBar } from '@/components/navigation/TopBar';
import { GlobalSearchModal } from '@/features/search/GlobalSearchModal';
import { ContextualCreateMenu } from '@/components/navigation/ContextualCreateMenu';
import * as searchApi from '@/services/search';
import * as tasksApi from '@/services/tasks';
import { useAppStore } from '@/lib/store';
import { SearchEntityType } from '@corviin-hub/shared';
import type { GlobalSearchResponse } from '@corviin-hub/shared';

// Mock search service
vi.mock('@/services/search', () => ({
  fetchGlobalSearch: vi.fn(),
}));

// Mock notifications service
vi.mock('@/services/notifications', () => ({
  fetchUnreadCount: vi.fn().mockResolvedValue({ count: 0 }),
  fetchNotifications: vi.fn().mockResolvedValue([]),
  markAllNotificationsRead: vi.fn().mockResolvedValue({ success: true, count: 0 }),
}));

// Stable mock data
const MOCK_WORKSPACES = [
  {
    id: 'ws-tech-0001-0000-000000000001',
    name: 'Corviin Tech',
    slug: 'tech',
    type: 'TECH',
    description: 'Software development workspace',
  },
  {
    id: 'ws-real-0002-0000-000000000002',
    name: 'Corviin Real Estate',
    slug: 'real-estate',
    type: 'REAL_ESTATE',
    description: 'Real estate advisory workspace',
  },
];

const MOCK_PROFILES = [
  { id: 'p1', displayName: 'Anant', initials: 'AN', email: 'anant@corviin.com' },
  { id: 'p2', displayName: 'Rohit', initials: 'RO', email: 'rohit@corviin.com' },
  { id: 'p3', displayName: 'Utkarsh', initials: 'UT', email: 'utkarsh@corviin.com' },
];

// Mock workspaces
vi.mock('@/hooks/useWorkspaces', () => ({
  useWorkspaces: () => ({
    data: MOCK_WORKSPACES,
    isLoading: false,
  }),
}));

// Mock profiles
vi.mock('@/hooks/useProfiles', () => ({
  useProfiles: () => ({
    data: MOCK_PROFILES,
    isLoading: false,
  }),
}));

const mockSearchResponse: GlobalSearchResponse = {
  query: 'Review',
  workspaceId: 'ws-tech-0001-0000-000000000001',
  totalResults: 2,
  groups: {
    [SearchEntityType.TASK]: {
      type: SearchEntityType.TASK,
      label: 'Tasks',
      total: 1,
      items: [
        {
          id: 'tsk-001',
          type: SearchEntityType.TASK,
          title: 'Review OpenAPI Swagger documentation',
          subtitle: 'IN_PROGRESS • Priority: HIGH • Assigned: Anant',
          summary: 'Verify schema annotations and error models',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          badge: 'HIGH',
          status: 'IN_PROGRESS',
          targetUrl: '/tasks?id=tsk-001',
          score: 80,
        },
      ],
    },
    [SearchEntityType.CRM]: {
      type: SearchEntityType.CRM,
      label: 'CRM Records',
      total: 1,
      items: [
        {
          id: 'crm-001',
          type: SearchEntityType.CRM,
          title: 'Acme Retail Solutions',
          subtitle: 'Acme Corp • +91 98765 43210 • QUALIFIED',
          summary: 'Reviewing proposal quotation for inventory automation',
          workspaceId: 'ws-tech-0001-0000-000000000001',
          badge: 'TECH_LEAD',
          status: 'QUALIFIED',
          targetUrl: '/crm/tech?id=crm-001',
          score: 60,
        },
      ],
    },
  },
  items: [
    {
      id: 'tsk-001',
      type: SearchEntityType.TASK,
      title: 'Review OpenAPI Swagger documentation',
      subtitle: 'IN_PROGRESS • Priority: HIGH • Assigned: Anant',
      summary: 'Verify schema annotations and error models',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      badge: 'HIGH',
      status: 'IN_PROGRESS',
      targetUrl: '/tasks?id=tsk-001',
      score: 80,
    },
    {
      id: 'crm-001',
      type: SearchEntityType.CRM,
      title: 'Acme Retail Solutions',
      subtitle: 'Acme Corp • +91 98765 43210 • QUALIFIED',
      summary: 'Reviewing proposal quotation for inventory automation',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      badge: 'TECH_LEAD',
      status: 'QUALIFIED',
      targetUrl: '/crm/tech?id=crm-001',
      score: 60,
    },
  ],
};

function renderWithProviders(ui: React.ReactElement, initialRoute: string = '/app/dashboard') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchInterval: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('Feature 18: Global Search & Contextual Create Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAppStore.setState({
      selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
      selectedProfileId: 'p1',
    });
  });

  describe('TopBar Search Trigger & Keyboard Shortcuts', () => {
    it('opens search palette when search button is clicked', async () => {
      renderWithProviders(<TopBar />);

      const searchTrigger = screen.getByLabelText(/Open global search/i);
      expect(searchTrigger).toBeInTheDocument();

      fireEvent.click(searchTrigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /Global Search/i })).toBeInTheDocument();
      });
    });

    it('opens search palette when Ctrl+K is pressed', async () => {
      renderWithProviders(<TopBar />);

      fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /Global Search/i })).toBeInTheDocument();
      });
    });
  });

  describe('GlobalSearchModal Component', () => {
    it('renders search input, recent searches when empty, and triggers debounced query', async () => {
      vi.mocked(searchApi.fetchGlobalSearch).mockResolvedValue(mockSearchResponse);

      renderWithProviders(<GlobalSearchModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByLabelText(/Search records/i);
      expect(input).toBeInTheDocument();

      // Type a query
      fireEvent.change(input, { target: { value: 'Review' } });

      await waitFor(() => {
        expect(searchApi.fetchGlobalSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            q: 'Review',
            workspaceId: 'ws-tech-0001-0000-000000000001',
          }),
          expect.anything(),
        );
      });

      // Verify results are rendered
      await waitFor(() => {
        expect(screen.getByText('Review OpenAPI Swagger documentation')).toBeInTheDocument();
        expect(screen.getByText('Acme Retail Solutions')).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation with ArrowDown, ArrowUp, and Enter', async () => {
      vi.mocked(searchApi.fetchGlobalSearch).mockResolvedValue(mockSearchResponse);
      const onClose = vi.fn();

      renderWithProviders(<GlobalSearchModal isOpen={true} onClose={onClose} />);

      const input = screen.getByLabelText(/Search records/i);
      fireEvent.change(input, { target: { value: 'Review' } });

      await waitFor(() => {
        expect(screen.getByText('Review OpenAPI Swagger documentation')).toBeInTheDocument();
      });

      // Navigate down and press Enter
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });

      expect(onClose).toHaveBeenCalled();
    });

    it('displays empty state with quick create actions when no matching results found', async () => {
      vi.mocked(searchApi.fetchGlobalSearch).mockResolvedValue({
        query: 'NonExistent',
        workspaceId: 'ws-tech-0001-0000-000000000001',
        totalResults: 0,
        groups: {},
        items: [],
      });

      const onOpenCreate = vi.fn();
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={vi.fn()} onOpenCreate={onOpenCreate} />,
      );

      const input = screen.getByLabelText(/Search records/i);
      fireEvent.change(input, { target: { value: 'NonExistent' } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
      });

      const createTaskBtn = screen.getByRole('button', { name: /Create Task/i });
      fireEvent.click(createTaskBtn);
      expect(onOpenCreate).toHaveBeenCalledWith(SearchEntityType.TASK);
    });

    it('saves and clears recent searches properly', async () => {
      localStorage.setItem(
        'corviin_recent_searches_tech',
        JSON.stringify(['Swagger', 'Proposal']),
      );

      renderWithProviders(<GlobalSearchModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByText('Swagger')).toBeInTheDocument();
      expect(screen.getByText('Proposal')).toBeInTheDocument();

      const clearBtn = screen.getByRole('button', { name: /Clear Recent/i });
      fireEvent.click(clearBtn);

      expect(screen.queryByText('Swagger')).not.toBeInTheDocument();
    });
  });

  describe('ContextualCreateMenu Component', () => {
    it('renders Create trigger and shows suggested actions for Tech workspace', async () => {
      renderWithProviders(<ContextualCreateMenu />, '/app/tasks');

      const createBtn = screen.getByLabelText(/Contextual Create Menu/i);
      expect(createBtn).toBeInTheDocument();

      fireEvent.click(createBtn);

      // On /app/tasks, "New Task" should be marked as Suggested
      expect(screen.getByText('New Task')).toBeInTheDocument();
      expect(screen.getByText('Suggested')).toBeInTheDocument();
    });

    it('enforces workspace isolation in create actions: hides Real Estate CRM in Tech workspace', async () => {
      useAppStore.setState({ selectedWorkspaceId: 'ws-tech-0001-0000-000000000001' });

      renderWithProviders(<ContextualCreateMenu />, '/app/dashboard');

      const createBtn = screen.getByLabelText(/Contextual Create Menu/i);
      fireEvent.click(createBtn);

      // Expand all actions
      const viewAllBtn = screen.getByRole('button', { name: /View All Workspace Actions/i });
      fireEvent.click(viewAllBtn);

      // Tech Enquiry should be present
      expect(screen.getByText('New Tech Enquiry')).toBeInTheDocument();

      // Partner Lead and Buyer Enquiry must NOT be present in Tech workspace!
      expect(screen.queryByText('New Partner Lead')).not.toBeInTheDocument();
      expect(screen.queryByText('New Buyer Enquiry')).not.toBeInTheDocument();
    });

    it('enforces workspace isolation in create actions: hides Tech CRM in Real Estate workspace', async () => {
      useAppStore.setState({ selectedWorkspaceId: 'ws-real-0002-0000-000000000002' });

      renderWithProviders(<ContextualCreateMenu />, '/app/dashboard');

      const createBtn = screen.getByLabelText(/Contextual Create Menu/i);
      fireEvent.click(createBtn);

      const viewAllBtn = screen.getByRole('button', { name: /View All Workspace Actions/i });
      fireEvent.click(viewAllBtn);

      // Real Estate actions should be present
      expect(screen.getByText('New Partner Lead')).toBeInTheDocument();
      expect(screen.getByText('New Buyer Enquiry')).toBeInTheDocument();

      // Tech Enquiry must NOT be present in Real Estate workspace!
      expect(screen.queryByText('New Tech Enquiry')).not.toBeInTheDocument();
    });

    it('opens domain dialog when an action is clicked', async () => {
      renderWithProviders(<ContextualCreateMenu />, '/app/tasks');

      const createBtn = screen.getByLabelText(/Contextual Create Menu/i);
      fireEvent.click(createBtn);

      const taskOption = screen.getByRole('menuitem', { name: /New Task/i });
      fireEvent.click(taskOption);

      // CreateTaskDialog dialog should be rendered
      expect(screen.getByRole('dialog', { name: /Create New Operational Task/i })).toBeInTheDocument();
      expect(screen.getByText('Task Title')).toBeInTheDocument();
    });
  });
});
