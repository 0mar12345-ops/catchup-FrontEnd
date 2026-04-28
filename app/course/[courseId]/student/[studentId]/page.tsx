'use client'

import { useParams, useRouter } from 'next/navigation'
import { StudentCatchUpListScreen } from '@/components/screens/StudentCatchUpListScreen'
import { logout } from '@/http/auth.http'

export default function StudentCatchUpPage() {
  const router = useRouter()
  const params = useParams<{ courseId: string; studentId: string }>()
  const courseId = params.courseId
  const studentId = params.studentId

  return (
    <StudentCatchUpListScreen
      studentId={studentId}
      courseId={courseId}
      onBack={() => router.push(`/course/${courseId}`)}
      onReviewLesson={(lessonId) => router.push(`/course/${courseId}/student/${studentId}/lesson/${lessonId}`)}
      onLogout={async () => {
        try {
          await logout()
        } finally {
          router.push('/login')
          router.refresh()
        }
      }}
    />
  )
}
