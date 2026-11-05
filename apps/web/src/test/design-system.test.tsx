import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  Button,
  StatusBadge,
  PriorityIndicator,
  EmptyState,
  ErrorState,
  PermissionDeniedState,
  OfflineState,
  Breadcrumbs,
  FormSection,
} from '@/components/ui';
import { DesignSystemPreviewPage } from '@/features/design-system/DesignSystemPreviewPage';
import { ThemeProvider } from '@/app/providers/ThemeProvider';

describe('Design System Primitives', () => {
  it('renders button with accessible labels and handles click', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Create Task
      </Button>,
    );

    const button = screen.getByRole('button', { name: /create task/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders button loading state with static indicator', () => {
    render(
      <Button variant="primary" loading>
        Save Changes
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  it('renders StatusBadge with semantic label and styles', () => {
    render(<StatusBadge type="success" label="Completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders PriorityIndicator with semantic text label', () => {
    render(<PriorityIndicator priority="URGENT" />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByTitle('Priority: Urgent')).toBeInTheDocument();
  });

  it('renders EmptyState with actionable button', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No tasks found"
        description="Create your first task to get started."
        action={{ label: 'Create task', onClick: handleAction }}
      />,
    );

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('Create your first task to get started.')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders ErrorState with retry guidance', () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        title="Failed to fetch records"
        message="Please check your connection and retry."
        onRetry={handleRetry}
      />,
    );

    expect(screen.getByText('Failed to fetch records')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /retry request/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders PermissionDeniedState explaining workspace scoping', () => {
    render(<PermissionDeniedState workspaceName="Corviin Tech" />);
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.getByText(/Corviin Tech/i)).toBeInTheDocument();
  });

  it('renders OfflineState with network instructions', () => {
    render(<OfflineState />);
    expect(screen.getByText('No Network Connection')).toBeInTheDocument();
    expect(screen.getByText(/Unable to reach the CORVIIN HUB API/i)).toBeInTheDocument();
  });

  it('renders Breadcrumbs navigation trail', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs
          items={[
            { label: 'Workspaces', href: '/app/workspaces' },
            { label: 'Corviin Tech' },
          ]}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Corviin Tech')).toBeInTheDocument();
  });

  it('renders FormSection with header and children', () => {
    render(
      <FormSection title="Account Details" description="Update your personal details">
        <div>Form field content</div>
      </FormSection>,
    );

    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByText('Update your personal details')).toBeInTheDocument();
    expect(screen.getByText('Form field content')).toBeInTheDocument();
  });

  it('renders the complete DesignSystemPreviewPage without crashing', () => {
    render(
      <ThemeProvider>
        <BrowserRouter>
          <DesignSystemPreviewPage />
        </BrowserRouter>
      </ThemeProvider>,
    );

    expect(screen.getByText('Shared UI/UX Design System Preview')).toBeInTheDocument();
    expect(screen.getByText('Zero Animation Guarantee')).toBeInTheDocument();
    expect(screen.getByText('First-Class Theme Parity')).toBeInTheDocument();
  });
});
