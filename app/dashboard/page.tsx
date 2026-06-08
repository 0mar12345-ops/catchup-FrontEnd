'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { OAuthStatusProvider } from '@/providers/oauth-status-provider'
import { logout } from '@/http/auth.http'
import { generateCatchUp, getCourseStats, type CourseStats } from '@/http/catchup.http'
import { getDashboardCourses, type DashboardCourse } from '@/http/courses.http'
import { uploadAbsences } from '@/http/settings.http'

interface AbsentStudentRecord {
  id?: string
  student_id?: string
  studentId?: string
  student_name?: string
  studentName?: string
  student_email?: string
  studentEmail?: string
  course_id?: string
  courseId?: string
  course_name?: string
  courseName?: string
  reason?: string
  excused?: boolean
  topic?: string
  status?: string
  absence_date?: string
  absenceDate?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [courses, setCourses] = useState<DashboardCourse[]>([])
  const [courseStats, setCourseStats] = useState<Record<string, CourseStats>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [absentStudents, setAbsentStudents] = useState<AbsentStudentRecord[]>([])
  const [generatingCourseId, setGeneratingCourseId] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setIsLoading(true)
      const data = await getDashboardCourses()
      const courseList = data.courses || []
      setCourses(courseList)

      const stats = await Promise.all(
        courseList.map(async (course) => {
          try {
            const result = await getCourseStats(course.id)
            return [course.id, result] as const
          } catch {
            return [course.id, { total_students: 0, total_absences: 0, ready_to_deliver: 0, total_delivered: 0 }] as const
          }
        })
      )

      setCourseStats(Object.fromEntries(stats))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchDashboard()
  }, [])

  const handleAbsenceUpload = async (file?: File | null) => {
    if (!file) return

    try {
      setUploadMessage('')
      setUploadError('')
      const response = await uploadAbsences(file)
      const results = Array.isArray((response as { results?: unknown[] }).results)
        ? ((response as { results: unknown[] }).results as AbsentStudentRecord[])
        : []
      setAbsentStudents(results)
      setUploadMessage((response as { message?: string }).message || 'Absence file uploaded successfully.')
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload absence file.')
    }
  }

  const handleGenerateCatchUp = async (courseId: string, studentIds: string[], date: string) => {
    try {
      setGeneratingCourseId(courseId)
      await generateCatchUp({
        course_id: courseId,
        student_ids: studentIds,
        absence_date: date,
      })
      await fetchDashboard()
      setUploadMessage('Catch-up generation started for the selected students.')
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to generate catch-up lessons.')
    } finally {
      setGeneratingCourseId(null)
    }
  }

  const missingToday = useMemo(
    () => absentStudents.filter((student) => student.absence_date === selectedDate || !student.absence_date),
    [absentStudents, selectedDate]
  )

  return (
    <OAuthStatusProvider>
      <div className="min-h-screen bg-background">
        <Header
          title="Teacher Dashboard"
          subtitle="Review today’s classes, upload absences, and generate catch-up lessons from one place."
          onLogout={async () => {
            try {
              await logout()
            } finally {
              router.push('/login')
              router.refresh()
            }
          }}
        />

        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="grid gap-6 xl:grid-cols-4">
            <Card className="border border-border/70 bg-gradient-to-r from-primary/8 to-indigo-500/6 xl:col-span-4">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Daily overview</p>
                <h2 className="heading-sm mt-2">Keep your morning planning and catch-up work in sync.</h2>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Today’s classes are anchored to your course list, while absence uploads and catch-up generation stay close to the same dashboard.</p>
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Today’s Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="space-y-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Class date</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((course) => (
                    <Card key={course.id} className="border border-border/70 bg-muted/30">
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-primary">{course.section || 'Class period'}</p>
                            <h3 className="text-lg font-semibold text-foreground">{course.name}</h3>
                          </div>
                          <StatusBadge status="generated" size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground">{course.subject || 'Course overview'} • {course.total_students} students</p>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/course/${course.id}`)}>Open course</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {courses.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground">No courses are available yet. Sync new courses to populate this section.</p>
                )}
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Absent Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Upload today’s CSV to populate the absence list and feed the catch-up workflow.
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => {
                    void handleAbsenceUpload(event.target.files?.[0])
                    event.target.value = ''
                  }}
                />
                <Button variant="primary" onClick={() => fileInputRef.current?.click()}>Upload today’s absence CSV</Button>
                {uploadMessage && <p className="text-sm text-emerald-700 dark:text-emerald-300">{uploadMessage}</p>}
                {uploadError && <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>}

                <div className="space-y-3">
                  {missingToday.length === 0 && <p className="text-sm text-muted-foreground">No absence records for {selectedDate} yet.</p>}
                  {missingToday.map((student, index) => (
                    <div key={`${student.student_email || student.studentId || student.id || 'student'}-${index}`} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{student.student_name || student.studentName || student.student_email || 'Student'}</p>
                          <p className="text-sm text-muted-foreground">{student.course_name || student.courseName || 'Course'} • {student.reason || 'No reason provided'}</p>
                        </div>
                        <StatusBadge status={student.excused ? 'completed' : 'pending'} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>What They Missed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {missingToday.length === 0 && <p className="text-sm text-muted-foreground">Upload an absence file to see what each student missed for today.</p>}
                {missingToday.map((student, index) => {
                  const course = courses.find((item) => item.id === (student.course_id || student.courseId))
                  const topic = student.topic || `Topic for ${selectedDate}: ${course?.name || 'today’s lesson'} review` 
                  return (
                    <div key={`${student.student_email || student.studentId || student.id || 'topic'}-${index}`} className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{student.student_name || student.studentName || 'Student'}</p>
                          <p className="text-sm text-muted-foreground">{course?.name || 'Course'} • {selectedDate}</p>
                          <p className="mt-2 text-sm text-foreground">{topic}</p>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGenerateCatchUp(course?.id || '', [student.id || student.student_id || student.studentId || ''], selectedDate)}
                          disabled={!course || generatingCourseId === course.id}
                        >
                          {generatingCourseId === course?.id ? 'Generating…' : 'Generate catch-up'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catch-Up Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => {
                  const stats = courseStats[course.id] || { total_students: 0, total_absences: 0, ready_to_deliver: 0, total_delivered: 0 }
                  const pending = Math.max(stats.total_absences - stats.total_delivered, 0)
                  const inProgress = Math.max(stats.ready_to_deliver, 0)
                  const completed = stats.total_delivered
                  return (
                    <div key={course.id} className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-primary">{course.section || 'Class period'}</p>
                          <h3 className="text-base font-semibold text-foreground">{course.name}</h3>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/course/${course.id}`)}>View course</Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge status="pending" size="sm" />
                        <span className="text-sm text-muted-foreground">{pending} pending</span>
                        <StatusBadge status="generated" size="sm" />
                        <span className="text-sm text-muted-foreground">{inProgress} in progress</span>
                        <StatusBadge status="completed" size="sm" />
                        <span className="text-sm text-muted-foreground">{completed} completed</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </OAuthStatusProvider>
  )
}
