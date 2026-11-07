import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SelectProfilePage } from '../features/profile/SelectProfilePage';
import { useAppStore } from '@/lib/store';
import * as profilesService from '@/services/profiles';
import * as workspacesService from '@/services/workspaces';

const mockProfiles = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    displayName: 'Anant',
    initials: 'A',
    email: 'anant@corviin.com',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    displayName: 'Rohit',
    initials: 'R',
    email: 'rohit@corviin.com',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    displayName: 'Utkarsh',
    initials: 'U',
    email: 'utkarsh@corviin.com',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const mockWorkspaces = [
  {
    id: 'ws-tech-0001-0000-000000000001',
    name: 'Corviin Tech',
    slug: 'corviin-tech',
    type: 'TECH',
    description: 'Tech operations',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

import { ThemeProvider } from '@/app/providers/ThemeProvider';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('PAGE 01: Profile Selection Component & Interaction Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      selectedProfileId: null,
      selectedWorkspaceId: null,
      theme: 'light',
    });

    vi.spyOn(profilesService, 'fetchProfiles').mockResolvedValue(mockProfiles as any);
    vi.spyOn(workspacesService, 'fetchWorkspaces').mockResolvedValue(mockWorkspaces as any);
  });

  it('renders header, brand logo, and title hierarchy', async () => {
    renderWithProviders(<SelectProfilePage />);

    expect(screen.getAllByText('CORVIIN HUB')[0]).toBeInTheDocument();
    expect(screen.getByText('Choose your profile')).toBeInTheDocument();
    expect(screen.getByText(/Select your profile to continue to CORVIIN HUB/i)).toBeInTheDocument();
  });

  it('displays dynamic profiles in accessible radiogroup cards', async () => {
    renderWithProviders(<SelectProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Anant')).toBeInTheDocument();
      expect(screen.getByText('Rohit')).toBeInTheDocument();
      expect(screen.getByText('Utkarsh')).toBeInTheDocument();
    });

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toBeInTheDocument();
  });

  it('initially disables the Continue button when no profile is selected', async () => {
    renderWithProviders(<SelectProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Anant')).toBeInTheDocument();
    });

    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).toBeDisabled();
  });

  it('enables Continue button when a card is selected and selects radio role', async () => {
    renderWithProviders(<SelectProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Rohit')).toBeInTheDocument();
    });

    const rohitCard = screen.getByRole('radio', { name: /rohit/i });
    expect(rohitCard).toHaveAttribute('aria-checked', 'false');

    // Click Rohit card
    fireEvent.click(rohitCard);

    expect(rohitCard).toHaveAttribute('aria-checked', 'true');
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).not.toBeDisabled();
  });

  it('allows keyboard selection via Enter or Space key', async () => {
    renderWithProviders(<SelectProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Utkarsh')).toBeInTheDocument();
    });

    const utkarshCard = screen.getByRole('radio', { name: /utkarsh/i });
    fireEvent.keyDown(utkarshCard, { key: 'Enter', code: 'Enter' });

    expect(utkarshCard).toHaveAttribute('aria-checked', 'true');
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).not.toBeDisabled();
  });

  it('saves selectedProfileId to appStore when Continue is clicked', async () => {
    renderWithProviders(<SelectProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Anant')).toBeInTheDocument();
    });

    const anantCard = screen.getByRole('radio', { name: /anant/i });
    fireEvent.click(anantCard);

    const continueBtn = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueBtn);

    expect(useAppStore.getState().selectedProfileId).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(useAppStore.getState().selectedWorkspaceId).toBe('ws-tech-0001-0000-000000000001');
  });

  it('displays the identity limitation notice clearly without misleading authentication labels', async () => {
    renderWithProviders(<SelectProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/Profile selection does not verify identity/i)).toBeInTheDocument();
    });
  });
});
