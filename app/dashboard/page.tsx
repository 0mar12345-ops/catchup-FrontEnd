'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CourseSelectionScreen } from '@/components/screens/CourseSelectionScreen'
import { OAuthStatusProvider } from '@/providers/oauth-status-provider'
import { logout } from '@/http/auth.http'
import { getDashboardCourses, type DashboardCourse } from '@/http/courses.http'

export default function DashboardPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<DashboardCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const data = await getDashboardCourses()
      setCourses(data.courses || [])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchCourses()
  }, [])

  return (
    <OAuthStatusProvider>
      <CourseSelectionScreen
        courses={courses}
        isLoading={isLoading}
        onSelectCourse={(courseId) => router.push(`/course/${courseId}`)}
        onCoursesRefresh={fetchCourses}
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
