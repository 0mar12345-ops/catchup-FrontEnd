'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'
import { getMe } from '@/http/auth.http'
import { getDashboardCourses, getCourse } from '@/http/courses.http'
import { getStudentCatchUpLessons, type StudentCatchUpLesson } from '@/http/catchup.http'

function statusLabel(status: string) {
  switch (status) {
    case 'completed':
      return 'completed'
    case 'generated':
    case 'delivered':
      return 'in progress'
    default:
      return 'not started'
  }
}

function statusVariant(status: string): keyof typeof import('@/lib/constants').statusConfig {
  if (status === 'completed') return 'completed'
  if (status === 'generated' || status === 'delivered') return 'generated'
  return 'pending'
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [lessons, setLessons] = useState<(StudentCatchUpLesson & { courseName: string; studentName: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoading(true)
        setError('')

        const me = await getMe()
        const { courses = [] } = await getDashboardCourses()

        if (!me.email) {
          setLessons([])
          return
        }

        const allLessons: (StudentCatchUpLesson & { courseName: string; studentName: string })[] = []

        for (const course of courses) {
          const courseDetails = await getCourse(course.id)
          const student = courseDetails.students.find((entry) => entry.email?.toLowerCase() === me.email?.toLowerCase())

          if (!student) continue

          const studentLessons = await getStudentCatchUpLessons(course.id, student.id)
          allLessons.push(
            ...studentLessons.map((lesson) => ({
              ...lesson,
              courseName: courseDetails.name,
              studentName: student.name,
            }))
          )
        }

        setLessons(allLessons)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load your catch-up lessons.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadLessons()
  }, [])

  const summary = useMemo(() => {
    const pending = lessons.filter((lesson) => statusLabel(lesson.status) === 'not started').length
    const inProgress = lessons.filter((lesson) => statusLabel(lesson.status) === 'in progress').length
    const completed = lessons.filter((lesson) => statusLabel(lesson.status) === 'completed').length

    return { pending, inProgress, completed }
  }, [lessons])

  if (isLoading) return <LoadingState message="Loading your lessons..." />

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Student Portal"
        subtitle="Review your catch-up lessons and pick up where you left off."
        onLogout={async () => {
          // Keep the existing logout flow consistent with the teacher app.
          const { logout } = await import('@/http/auth.http')
          try {
            await logout()
          } finally {
            router.push('/login')
            router.refresh()
          }
        }}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border border-border/70 bg-gradient-to-r from-primary/8 to-indigo-500/6">
          <CardContent className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Your catch-up work</p>
            <h2 className="heading-sm mt-2">Catch up on what you missed, one lesson at a time.</h2>
            <p className="mt-2 text-sm text-muted-foreground">This view only shows lessons linked to your student account.</p>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Not started</p><p className="mt-2 text-3xl font-semibold text-foreground">{summary.pending}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">In progress</p><p className="mt-2 text-3xl font-semibold text-foreground">{summary.inProgress}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Completed</p><p className="mt-2 text-3xl font-semibold text-foreground">{summary.completed}</p></CardContent></Card>
        </section>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">{error}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Pending Catch-Up Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!lessons.length ? (
              <EmptyState title="No lessons found" description="You do not have any catch-up lessons assigned yet." />
            ) : (
              lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => router.push(`/student/catchup/${lesson.id}`)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-4 text-left transition hover:border-primary/60 hover:bg-primary/5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-primary">{lesson.courseName}</p>
                      <h3 className="text-lg font-semibold text-foreground">{lesson.title || 'Catch-up lesson'}</h3>
                      <p className="text-sm text-muted-foreground">Absence date: {new Date(lesson.absence_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={statusVariant(lesson.status)} size="sm" />
                      <span className="text-sm text-muted-foreground capitalize">{statusLabel(lesson.status)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
