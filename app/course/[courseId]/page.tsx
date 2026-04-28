'use client'

import { useParams, useRouter } from 'next/navigation'
import { CourseOverviewScreen } from '@/components/screens/CourseOverviewScreen'
import { OAuthStatusProvider } from '@/providers/oauth-status-provider'
import { logout } from '@/http/auth.http'

export default function CoursePage() {
  const router = useRouter()
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId

  return (
    <OAuthStatusProvider>
      <CourseOverviewScreen
        courseId={courseId}
        onMarkAbsence={() => router.push(`/course/${courseId}/marking`)}
        onReviewStudent={(studentId) => router.push(`/course/${courseId}/student/${studentId}`)}
        onLogout={async () => {
          try {
            await logout()
          } finally {
            router.push('/login')
            router.refresh()
          }
        }}
      />
    </OAuthStatusProvider>
  )
}
