'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getOAuthStatus, type OAuthStatus } from '@/http/oauth.http'
import { NotificationBanner } from '@/components/shared/NotificationBanner'

interface OAuthStatusContextValue {
  oauthStatus: OAuthStatus | null
  isLoading: boolean
  refetch: () => Promise<void>
}

const OAuthStatusContext = createContext<OAuthStatusContextValue | null>(null)

export function useOAuthStatus() {
  const context = useContext(OAuthStatusContext)
  if (!context) {
    throw new Error('useOAuthStatus must be used within OAuthStatusProvider')
  }
  return context
}

interface OAuthStatusProviderProps {
  children: ReactNode
  showBanner?: boolean
}

export function OAuthStatusProvider({ children, showBanner = true }: OAuthStatusProviderProps) {
  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const fetchOAuthStatus = async () => {
    try {
      const status = await getOAuthStatus()
      setOAuthStatus(status)
      // Reset banner dismissal if status changed
      if (status.status === 'valid') {
        setBannerDismissed(false)
      }
    } catch (error) {
      console.error('Failed to fetch OAuth status:', error)
      setOAuthStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOAuthStatus()
    
    // Poll for status changes every 30 seconds
    const interval = setInterval(fetchOAuthStatus, 30000)
    
    // Also refetch when window regains focus (user comes back to tab)
    const handleFocus = () => fetchOAuthStatus()
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const shouldShowBanner = showBanner && 
    oauthStatus?.needs_reauth && 
    !bannerDismissed

  return (
    <OAuthStatusContext.Provider 
      value={{ 
        oauthStatus, 
        isLoading, 
        refetch: fetchOAuthStatus 
      }}
    >
      {shouldShowBanner && (
        <NotificationBanner
          message={
            oauthStatus?.status === 'invalid'
              ? 'Your Google Classroom connection has expired. Please reconnect to continue using the app.'
              : 'Please connect your Google Classroom account to use this app.'
          }
          actionText="Go to Settings"
          actionHref="/accounts"
          onDismiss={() => setBannerDismissed(true)}
        />
      )}
      {children}
    </OAuthStatusContext.Provider>
  )
}
