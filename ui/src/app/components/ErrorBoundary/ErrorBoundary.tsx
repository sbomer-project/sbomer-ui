import { Button, Stack, Tile } from '@carbon/react';
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    // In production, you might want to log to an error reporting service
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <Tile style={{ margin: '2rem' }}>
          <Stack gap={5}>
            <h2>Something went wrong</h2>
            <p>
              An unexpected error occurred. Please try refreshing the page or contact support if the
              problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary>Error details (development only)</summary>
                <code>
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </code>
              </details>
            )}
            <div>
              <Button onClick={this.resetError} kind="primary">
                Try again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                kind="secondary"
                style={{ marginLeft: '1rem' }}
              >
                Reload page
              </Button>
            </div>
          </Stack>
        </Tile>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
