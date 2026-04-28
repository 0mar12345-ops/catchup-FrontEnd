'use client'

import { useParams, useRouter } from 'next/navigation'
import { TeacherReviewScreen } from '@/components/screens/TeacherReviewScreen'
import { logout } from '@/http/auth.http'

export default function LessonReviewPage() {
  const router = useRouter()
  const params = useParams<{ courseId: string; studentId: string; lessonId: string }>()
  const courseId = params.courseId
  const studentId = params.studentId
  const lessonId = params.lessonId

  return (
    <TeacherReviewScreen
      studentId={studentId}
      courseId={courseId}
      lessonId={lessonId}
      onBack={() => router.push(`/course/${courseId}/student/${studentId}`)}
      onShare={(studentId) => {
        // After delivery, go back to the student's catch-up list
        router.push(`/course/${courseId}/student/${studentId}`)
      }}
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
