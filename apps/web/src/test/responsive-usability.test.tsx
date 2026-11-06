import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MobileBottomNavigation } from '../components/navigation/MobileBottomNavigation';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('Phase 9: Responsive Quality & Touch Usability Verification', () => {
  describe('Touch Targets & Mobile Ergonomics', () => {
    it('primary button satisfies minimum touch target height of 40px (standard) / 44px (large)', () => {
      const { container } = render(
        <Button variant="primary" size="md">
          Action Target
        </Button>
      );
      const btn = container.querySelector('button');
      expect(btn).toBeInTheDocument();
      // Verifies minimum height classes applied for touch target sizing
      expect(btn?.className).toContain('min-h-[40px]');
    });

    it('large button satisfies >= 44px touch targets for mobile single-handed operations', () => {
      const { container } = render(
        <Button variant="primary" size="lg">
          Primary Call to Action
        </Button>
      );
      const btn = container.querySelector('button');
      expect(btn?.className).toContain('min-h-[44px]');
    });

    it('enforces strict zero-animation rule across UI controls', () => {
      const { container } = render(
        <Button variant="primary">No Motion Button</Button>
      );
      const btn = container.querySelector('button');
      // Must not contain transition or animate classes
      expect(btn?.className).not.toContain('transition-all');
      expect(btn?.className).not.toContain('animate-');
    });
  });

  describe('Mobile Navigation Shell', () => {
    it('renders bottom navigation bar with essential mobile tabs', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <MobileBottomNavigation />
          </BrowserRouter>
        </QueryClientProvider>
      );

      // Verify mobile bottom nav items exist for quick thumb navigation
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Calendar')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();
    });
  });

  describe('Card and Layout Responsiveness', () => {
    it('renders responsive Card container with border and surface background', () => {
      const { container } = render(
        <Card className="p-4">
          <p>Card Content</p>
        </Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-surface');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-ch-border');
    });

    it('renders Badge with high contrast semantic colors without motion effects', () => {
      const { container } = render(
        <Badge variant="success">Completed</Badge>
      );
      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
      expect(badge?.className).toContain('text-success');
      expect(badge?.className).not.toContain('animate-');
    });
  });
});
