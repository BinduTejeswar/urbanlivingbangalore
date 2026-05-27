'use client'

import { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react'
import FriendlyErrorDialog from './FriendlyErrorDialog'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  error: Error | null
}

function reportClientError(error: unknown) {
  console.error('Application error:', error)
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportClientError({ error, errorInfo })
  }

  private retry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <FriendlyErrorDialog
          blocking
          message="We could not load this part of the page. Please contact admin if this keeps happening."
          onRetry={this.retry}
        />
      )
    }

    return this.props.children
  }
}

export function RecoverableErrorListener() {
  const [errorVisible, setErrorVisible] = useState(false)

  useEffect(() => {
    const showError = (event: ErrorEvent | PromiseRejectionEvent) => {
      reportClientError('reason' in event ? event.reason : event.error)
      setErrorVisible(true)
    }

    window.addEventListener('error', showError)
    window.addEventListener('unhandledrejection', showError)

    return () => {
      window.removeEventListener('error', showError)
      window.removeEventListener('unhandledrejection', showError)
    }
  }, [])

  return (
    <FriendlyErrorDialog
      open={errorVisible}
      title="We hit a small issue"
      message="You can continue browsing. Please contact admin if this happens again."
      onClose={() => setErrorVisible(false)}
    />
  )
}
