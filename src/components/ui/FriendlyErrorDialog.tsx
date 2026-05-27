'use client'

import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw, X } from 'lucide-react'

interface FriendlyErrorDialogProps {
  open?: boolean
  title?: string
  message?: string
  adminEmail?: string
  onClose?: () => void
  onRetry?: () => void
  blocking?: boolean
}

const defaultMessage = 'Something went wrong. Please contact admin if this keeps happening.'
const defaultAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''

export default function FriendlyErrorDialog({
  open = true,
  title = 'Something went wrong',
  message = defaultMessage,
  adminEmail = defaultAdminEmail,
  onClose,
  onRetry,
  blocking = false,
}: FriendlyErrorDialogProps) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal={blocking}
      aria-labelledby="friendly-error-title"
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-3xl border border-[#DDE8DD] bg-white p-5 text-[#1C1008] shadow-2xl shadow-slate-950/20">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 id="friendly-error-title" className="text-xl font-black tracking-tight">
                {title}
              </h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                {message}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close error message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DDE8DD] text-slate-500 transition-colors hover:bg-[#EEF4EE] hover:text-[#1C1008]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {adminEmail && (
          <div className="rounded-2xl border border-[#DDE8DD] bg-[#F6F8F4] px-4 py-3 text-sm font-bold text-slate-600">
            Admin: <a className="text-primary hover:underline" href={`mailto:${adminEmail}`}>{adminEmail}</a>
          </div>
        )}

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-900/15 transition-all hover:bg-orange-600 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          )}
          <Link
            href="/flats"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DDE8DD] bg-white px-4 py-3 text-sm font-black text-[#1C1008] transition-colors hover:bg-[#EEF4EE]"
          >
            <Home className="h-4 w-4" />
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}
