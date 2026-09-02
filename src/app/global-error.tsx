'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F6F8F4',
            padding: 16,
            color: '#1C1008',
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-error-title"
            style={{
              width: '100%',
              maxWidth: 440,
              border: '1px solid #DDE8DD',
              borderRadius: 28,
              background: '#FFFFFF',
              boxShadow: '0 24px 80px rgba(15, 23, 42, 0.18)',
              padding: 24,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFF7ED',
                color: '#C2410C',
                fontWeight: 900,
                fontSize: 24,
              }}
            >
              !
            </div>
            <h1 id="global-error-title" style={{ margin: '16px 0 8px', fontSize: 24, lineHeight: 1.15 }}>
              Something went wrong
            </h1>
            <p style={{ margin: 0, color: '#475569', fontWeight: 600, lineHeight: 1.65 }}>
              We could not load the site properly. Please contact admin if this keeps happening.
            </p>
            {adminEmail && (
              <p
                style={{
                  margin: '16px 0 0',
                  border: '1px solid #DDE8DD',
                  borderRadius: 16,
                  background: '#F6F8F4',
                  padding: '12px 14px',
                  color: '#475569',
                  fontWeight: 700,
                }}
              >
                Admin: <a href={`mailto:${adminEmail}`} style={{ color: '#C2410C' }}>{adminEmail}</a>
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 20 }}>
              <button
                type="button"
                onClick={unstable_retry}
                style={{
                  border: 0,
                  borderRadius: 16,
                  background: '#C2410C',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: 900,
                  padding: '13px 16px',
                }}
              >
                Try again
              </button>
              <Link
                href="/flats"
                style={{
                  border: '1px solid #DDE8DD',
                  borderRadius: 16,
                  background: '#FFFFFF',
                  color: '#1C1008',
                  fontWeight: 900,
                  padding: '13px 16px',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                Continue
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}
