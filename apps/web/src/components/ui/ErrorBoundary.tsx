import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetState = () => {
    try {
      localStorage.removeItem('corviin-hub-state');
    } catch {
      // ignore
    }
    window.location.href = '/select-profile';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-ch-text-primary">
          <div className="w-full max-w-md bg-surface border border-danger/30 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-danger">
              <AlertTriangle size={24} />
              <h2 className="text-lg font-semibold">Application Encountered an Error</h2>
            </div>

            <p className="text-sm text-ch-text-secondary mb-4">
              CORVIIN HUB encountered an unexpected client error. You can try reloading the page or
              resetting your local session state.
            </p>

            {this.state.error && (
              <div className="p-3 mb-4 rounded bg-surface-muted border border-ch-border text-xs font-mono overflow-auto max-h-32 text-danger">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-control hover:opacity-90"
              >
                <RefreshCw size={14} />
                Reload Page
              </button>

              <button
                onClick={this.handleResetState}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-ch-border bg-surface text-ch-text-primary text-sm font-medium rounded-control hover:bg-surface-muted"
              >
                <Trash2 size={14} />
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

