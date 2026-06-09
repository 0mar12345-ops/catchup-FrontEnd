'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginScreen } from '@/components/screens/LoginScreen'
import { getGoogleOAuthURL, getUserRole, detectRole } from '@/http/auth.http'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const detectPortal = async () => {
      try {
        // First confirm there is an active session
        await getUserRole()

        // Re-detect role from live Google Classroom data so the stored role
        // is always up-to-date after OAuth completes.
        const { role } = await detectRole()

        if (!isMounted) return

        // Persist role in a client-readable cookie so the middleware can enforce
        // role-based routing on subsequent navigations without an API call.
        document.cookie = `catchup_role=${role}; path=/; max-age=86400; SameSite=Lax`

        if (role === 'admin') {
          router.replace('/admin')
        } else if (role === 'student') {
          router.replace('/student/dashboard')
        } else {
          router.replace('/dashboard')
        }
      } catch {
        // No authenticated session yet — stay on login.
      }
    }

    void detectPortal()

    return () => {
      isMounted = false
    }
  }, [router])

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
