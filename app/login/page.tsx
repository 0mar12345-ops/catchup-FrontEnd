'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginScreen } from '@/components/screens/LoginScreen'
import { getGoogleOAuthURL, getMe } from '@/http/auth.http'
import { getDashboardCourses } from '@/http/courses.http'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const detectPortal = async () => {
      try {
        const me = await getMe()
        const { courses = [] } = await getDashboardCourses()

        if (!isMounted) return

        if (me.role === 'teacher' || courses.length > 0) {
          router.replace('/dashboard')
          return
        }

        router.replace('/student/dashboard')
      } catch {
        // No authenticated session yet, so stay on login.
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
