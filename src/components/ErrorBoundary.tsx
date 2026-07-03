import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg-page)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '40px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>⚠️</span>
            <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Application Exception</h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
              An unexpected error occurred while rendering this page. Session progress remains saved.
            </p>
            <div style={{
              background: 'var(--border-soft)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-tertiary)',
              textAlign: 'left',
              overflowX: 'auto',
              marginBottom: '24px',
              border: '1px solid var(--border)'
            }}>
              {this.state.error?.message || 'Unknown render error'}
            </div>
            <button
              onClick={this.handleReset}
              className="btn-solve-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
