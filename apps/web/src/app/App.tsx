import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRouter } from './router/AppRouter';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

