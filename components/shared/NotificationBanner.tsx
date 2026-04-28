'use client'

import { useState } from 'react'
import { AlertCircle, X } from 'lucide-react'
import Link from 'next/link'

interface NotificationBannerProps {
  message: string
  actionText?: string
  actionHref?: string
  onDismiss?: () => void
}

export function NotificationBanner({ message, actionText, actionHref, onDismiss }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center flex-1 min-w-0">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="ml-3 text-sm font-medium text-amber-800 truncate">
              {message}
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0 ml-3">
            {actionText && actionHref && (
              <Link
                href={actionHref}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                {actionText}
              </Link>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center p-1 border border-transparent rounded-md text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
