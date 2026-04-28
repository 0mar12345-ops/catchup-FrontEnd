'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { StudentCatchUpView } from '@/components/screens/StudentCatchUpView'

export default function StudentViewPage() {
  const router = useRouter()
  const params = useParams<{ studentId: string }>()
  const searchParams = useSearchParams()

  const studentId = params.studentId
  const studentName = searchParams.get('name') || 'Student'

  return (
    <StudentCatchUpView
      lessonId={studentId}
      studentName={studentName}
      onComplete={() => router.push('/dashboard')}
    />
  )
}
