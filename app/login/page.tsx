'use client'

import { LoginScreen } from '@/components/screens/LoginScreen'
import { getGoogleOAuthURL } from '@/http/auth.http'

export default function LoginPage() {
  return (
    <LoginScreen
      onGoogleLogin={async () => {
        try {
          const data = await getGoogleOAuthURL()
          
          if (!data.auth_url) {
            throw new Error('Missing auth URL')
          }

          // Redirect to Google OAuth
          window.location.assign(data.auth_url)
        } catch (error) {
          throw error instanceof Error ? error : new Error('Failed to start Google authentication')
        }
      }}
    />
  )
}
