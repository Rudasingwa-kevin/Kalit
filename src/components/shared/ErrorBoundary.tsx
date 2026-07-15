import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <PageErrorFallback error={this.state.error} onRetry={() => this.setState({ hasError: false, error: null })} />
    }
    return this.props.children
  }
}

export function PageErrorFallback({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-[18px] bg-danger/8 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-primary mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-400 mb-6">
          {error?.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-[12px] text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-[12px] text-sm font-semibold text-primary hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export function SidebarErrorFallback() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-[16px] bg-danger/8 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-danger" />
        </div>
        <h2 className="text-lg font-bold text-primary mb-2">App failed to load</h2>
        <p className="text-sm text-gray-400 mb-5">
          The application encountered a critical error.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-[12px] text-sm font-semibold hover:bg-accent-dark transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Reload Page
        </button>
      </div>
    </div>
  )
}
