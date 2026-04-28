'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent } from '@/components/shared/Card'
import { LoadingState } from '@/components/shared/LoadingState'
import { useAuthMe } from '@/providers/auth-me-provider'
import { getOAuthStatus, getReauthorizeURL, type OAuthStatus } from '@/http/oauth.http'
import { logout } from '@/http/auth.http'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

function AccountsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { me } = useAuthMe()
  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReauthorizing, setIsReauthorizing] = useState(false)
  const [showExpiredBanner, setShowExpiredBanner] = useState(false)

  useEffect(() => {
    // Check if redirected here due to OAuth expiration
    if (searchParams.get('oauth_expired') === 'true') {
      setShowExpiredBanner(true)
    }
    fetchOAuthStatus()
  }, [searchParams])

  const fetchOAuthStatus = async () => {
    try {
      setIsLoading(true)
      const status = await getOAuthStatus()
      setOAuthStatus(status)
    } catch (error) {
      console.error('Failed to fetch OAuth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReauthorize = async () => {
    try {
      setIsReauthorizing(true)
      const { auth_url } = await getReauthorizeURL()
      // Redirect to Google OAuth
      window.location.href = auth_url
    } catch (error) {
      console.error('Failed to get reauthorization URL:', error)
      alert('Failed to start reauthorization. Please try again.')
      setIsReauthorizing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      router.push('/login')
      router.refresh()
    }
  }

  const getStatusIcon = () => {
    if (!oauthStatus) return null
    
    switch (oauthStatus.status) {
      case 'valid':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'invalid':
        return <XCircle className="h-8 w-8 text-red-500" />
      case 'not_found':
        return <AlertCircle className="h-8 w-8 text-amber-500" />
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusText = () => {
    if (!oauthStatus) return ''
    
    switch (oauthStatus.status) {
      case 'valid':
        return 'Google Classroom connection is active and working properly.'
      case 'invalid':
        return 'Your Google Classroom connection has expired or been revoked. Please reconnect to continue using the app.'
      case 'not_found':
        return 'No Google Classroom connection found. Please connect your account.'
      default:
        return 'Unknown status'
    }
  }

  const getStatusColor = () => {
    if (!oauthStatus) return 'gray'
    
    switch (oauthStatus.status) {
      case 'valid':
        return 'green'
      case 'invalid':
        return 'red'
      case 'not_found':
        return 'amber'
      default:
        return 'gray'
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading account information..." />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Account Settings"
        userName={me?.username || ''}
        onBack={() => router.push('/dashboard')}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Account Settings' },
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* OAuth Expired Banner */}
        {showExpiredBanner && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  Google Classroom Authorization Expired
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Your Google Classroom connection has expired. Please reconnect your account to continue generating and delivering catch-up lessons.
                </p>
                <Button
                  onClick={() => {
                    setShowExpiredBanner(false)
                    handleReauthorize()
                  }}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnect Now
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Account Info */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Name</span>
                    <span className="text-sm text-foreground">{me?.username}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Role</span>
                    <span className="text-sm text-foreground capitalize">{me?.role}</span>
                  </div>
                </div>
              </div>

              {/* OAuth Connection Status */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Google Classroom Connection</h2>
                
                {oauthStatus && (
                  <div className="bg-muted/50 rounded-lg p-6 border border-border">
                    <div className="flex items-start space-x-4">
                      <div className="shrink-0 mt-1">
                        {getStatusIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground mb-1">
                          {oauthStatus.status === 'valid' && 'Connected'}
                          {oauthStatus.status === 'invalid' && 'Connection Expired'}
                          {oauthStatus.status === 'not_found' && 'Not Connected'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {getStatusText()}
                        </p>
                        
                        {oauthStatus.has_oauth && oauthStatus.status === 'valid' && (
                          <div className="space-y-2 text-xs text-muted-foreground">
                            {oauthStatus.granted_at && (
                              <p>
                                Connected since: {new Date(oauthStatus.granted_at).toLocaleDateString()}
                              </p>
                            )}
                            {oauthStatus.scopes_count && (
                              <p>Permissions granted: {oauthStatus.scopes_count} scopes</p>
                            )}
                          </div>
                        )}
                        
                        {oauthStatus.needs_reauth && (
                          <Button
                            onClick={handleReauthorize}
                            isLoading={isReauthorizing}
                            className="mt-4"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {oauthStatus.status === 'not_found' ? 'Connect Google Classroom' : 'Reconnect Google Classroom'}
                          </Button>
                        )}
                        
                        {oauthStatus.status === 'valid' && (
                          <Button
                            onClick={handleReauthorize}
                            variant="secondary"
                            isLoading={isReauthorizing}
                            className="mt-4"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Connection
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Text */}
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-foreground">
                  <strong>Note:</strong> A valid Google Classroom connection is required to generate and deliver catch-up lessons. 
                  If your connection expires, you&apos;ll need to reconnect to continue using the app.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading account information..." />}>
      <AccountsPageContent />
    </Suspense>
  )
}
