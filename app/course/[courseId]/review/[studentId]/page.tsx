'use client'

import { useParams, useRouter } from 'next/navigation'
import { TeacherReviewScreen } from '@/components/screens/TeacherReviewScreen'
import { logout } from '@/http/auth.http'

export default function TeacherReviewPage() {
  const router = useRouter()
  const params = useParams<{ courseId: string; studentId: string }>()
  const courseId = params.courseId
  const studentId = params.studentId

  return (
    <TeacherReviewScreen
      studentId={studentId}
      courseId={courseId}
      onBack={() => router.push(`/course/${courseId}`)}
      onShare={(id) => router.push(`/student/${id}?name=Student`)}
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
