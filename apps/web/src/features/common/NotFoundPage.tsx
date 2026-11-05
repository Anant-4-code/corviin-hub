import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-lg bg-surface-muted border border-ch-border flex items-center justify-center text-lg font-bold text-ch-text-secondary mb-4">
        404
      </div>
      <h1 className="text-xl font-semibold text-ch-text-primary mb-1">Page not found</h1>
      <p className="text-sm text-ch-text-secondary max-w-sm mb-6">
        The route you requested does not exist or has been moved. Check the URL or return to the main dashboard.
      </p>
      <Link
        to="/app/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-control hover:opacity-90"
      >
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
}

