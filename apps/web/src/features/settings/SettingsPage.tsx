import { Link } from 'react-router-dom';
import { Palette, Sun, Moon, Laptop, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import { useTheme } from '@/app/providers/ThemeProvider';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ch-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-ch-text-secondary">
          Personal profile preferences, theme configuration, and workspace operations.
        </p>
      </div>

      {/* Theme Preference */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-sm font-semibold text-ch-text-primary">Appearance & Theme</h2>
            <p className="text-xs text-ch-text-secondary mt-0.5">
              Select your interface theme. Preferences persist locally on this device.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-card border text-left flex flex-col justify-between h-24 ${
                theme === 'light'
                  ? 'border-accent bg-surface-selected ring-1 ring-accent'
                  : 'border-ch-border bg-surface hover:bg-surface-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sun size={20} className={theme === 'light' ? 'text-accent' : 'text-ch-text-secondary'} />
                {theme === 'light' && <span className="text-xs font-semibold text-accent">Active</span>}
              </div>
              <div>
                <p className="text-sm font-semibold text-ch-text-primary">Light Theme</p>
                <p className="text-xs text-ch-text-secondary">Clean warm neutral palette</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-card border text-left flex flex-col justify-between h-24 ${
                theme === 'dark'
                  ? 'border-accent bg-surface-selected ring-1 ring-accent'
                  : 'border-ch-border bg-surface hover:bg-surface-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon size={20} className={theme === 'dark' ? 'text-accent' : 'text-ch-text-secondary'} />
                {theme === 'dark' && <span className="text-xs font-semibold text-accent">Active</span>}
              </div>
              <div>
                <p className="text-sm font-semibold text-ch-text-primary">Dark Theme</p>
                <p className="text-xs text-ch-text-secondary">Graphite background with high contrast</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-card border text-left flex flex-col justify-between h-24 ${
                theme === 'system'
                  ? 'border-accent bg-surface-selected ring-1 ring-accent'
                  : 'border-ch-border bg-surface hover:bg-surface-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <Laptop size={20} className={theme === 'system' ? 'text-accent' : 'text-ch-text-secondary'} />
                {theme === 'system' && <span className="text-xs font-semibold text-accent">Active</span>}
              </div>
              <div>
                <p className="text-sm font-semibold text-ch-text-primary">System Theme</p>
                <p className="text-xs text-ch-text-secondary">Follows OS display preference</p>
              </div>
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Design System Preview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-ch-text-primary">
              UI/UX Design System Catalog
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          <p className="text-sm text-ch-text-secondary">
            Inspect all shared CORVIIN HUB interface primitives, color token swatches, typography scale,
            buttons, form controls, responsive record lists, drawers, modals, file uploaders, and system
            states across both Light and Dark themes.
          </p>
          <Link to="/app/design-system">
            <Button variant="primary" size="md" className="gap-2">
              Open Design System Preview <ArrowRight size={15} />
            </Button>
          </Link>
        </CardBody>
      </Card>

      {/* Workspace Information */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-ch-text-primary">Workspace Configuration</h2>
        </CardHeader>
        <CardBody className="space-y-2 text-sm text-ch-text-secondary">
          <p>
            CORVIIN HUB operates two isolated business workspaces: <strong>Corviin Tech</strong> and{' '}
            <strong>Corviin Real Estate</strong>.
          </p>
          <p className="text-xs text-ch-text-muted">
            Workspace data, task pipelines, and assets are completely scoped. Use the top bar switcher to toggle active business context.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
