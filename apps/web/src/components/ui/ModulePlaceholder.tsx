import { Construction } from 'lucide-react';
import { type ReactNode } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/cn';

interface PlannedSection { title: string; description: string; }

interface ModulePlaceholderProps {
  title: string;
  description: string;
  plannedSections: PlannedSection[];
  action?: ReactNode;
  breadcrumbs?: { label: string; path?: string }[];
}

export function ModulePlaceholder({
  title,
  description,
  plannedSections,
  action,
  breadcrumbs,
}: ModulePlaceholderProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} action={action} />

      <div className="mt-6 flex items-center gap-2 px-3 py-2.5 bg-surface border border-ch-border rounded-lg text-sm text-ch-text-secondary">
        <Construction size={15} className="text-warning shrink-0" />
        <span>This module is planned and will be implemented in Phase 3. The structure below reflects the planned feature scope.</span>
      </div>

      <div className="mt-6 grid gap-4">
        {plannedSections.map((section) => (
          <div key={section.title} className="bg-surface border border-ch-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-ch-text-primary mb-1">{section.title}</h3>
            <p className="text-sm text-ch-text-secondary">{section.description}</p>
            <div className="mt-3 h-20 rounded bg-surface-muted border border-ch-border flex items-center justify-center">
              <span className="text-xs text-ch-text-muted font-medium">Not implemented yet</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

