'use client'

import { Avatar } from './Avatar'
import { useState } from 'react'
import { useAuthMe } from '@/providers/auth-me-provider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export interface Breadcrumb {
  label: string
  href?: string
}

interface HeaderProps {
  title: string
  subtitle?: string
  userInitials?: string
  userName?: string
  onLogout?: () => void
  breadcrumbs?: Breadcrumb[]
  showBack?: boolean
  onBack?: () => void
}

export function Header({
  title,
  subtitle,
  userInitials,
  userName,
  onLogout,
  breadcrumbs,
  showBack,
  onBack,
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { me } = useAuthMe()
  const router = useRouter()

  const displayName = me?.username || userName || 'Teacher'
  const displayInitials = (me?.username || userName)
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || userInitials || 'T'

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm mb-3">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-muted-foreground">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {showBack && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div>
              <h1 className="heading-md">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar initials={displayInitials} name={displayName} size="md" />
                <span className="text-sm font-medium hidden sm:inline text-foreground">{displayName}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/accounts"
                    onClick={() => setShowMenu(false)}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-foreground"
                  >
                    Accounts
                  </Link>
                  <button
                    onClick={() => {
                      onLogout?.()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors text-destructive"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
