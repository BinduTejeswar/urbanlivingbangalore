'use client'

import FriendlyErrorDialog from '@/components/ui/FriendlyErrorDialog'
import { useEffect } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <FriendlyErrorDialog
      blocking
      message="We could not load this page properly. Please contact admin if this keeps happening."
      onRetry={unstable_retry}
    />
  )
}
