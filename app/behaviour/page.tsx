'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card'
import { Modal } from '@/components/shared/Modal'
import { logout } from '@/http/auth.http'
import { getDashboardCourses, getCourse, type DashboardCourse, type CourseStudent } from '@/http/courses.http'
import { getBehaviourLogs, createBehaviourLog, type BehaviourLog } from '@/http/behaviour.http'

type BehaviourType = 'positive' | 'negative'
type FilterType = 'all' | 'positive' | 'negative'

const POSITIVE_CATEGORIES = ['Participation', 'Leadership', 'Improvement', 'Other'] as const
const NEGATIVE_CATEGORIES = ['Disruption', 'Incomplete Work', 'Disrespect', 'Other'] as const

interface LogForm {
  courseId: string
  studentId: string
  studentName: string
  studentEmail: string
  type: BehaviourType
  category: string
  notes: string
  date: string
}

const EMPTY_FORM: LogForm = {
  courseId: '',
  studentId: '',
  studentName: '',
  studentEmail: '',
  type: 'positive',
  category: '',
  notes: '',
  date: new Date().toISOString().slice(0, 10),
}

function TypeBadge({ type }: { type: BehaviourType }) {
  if (type === 'positive') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Positive
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Negative
    </span>
  )
}

function FilterButton({
  label,
  active,
  onClick,
  count,
}: {
  label: string
  active: boolean
  onClick: () => void
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
          active ? 'bg-white/20 text-white' : 'bg-border text-muted-foreground'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

export default function BehaviourPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<BehaviourLog[]>([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [logsError, setLogsError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [modalOpen, setModalOpen] = useState(false)

  // Modal form state
  const [form, setForm] = useState<LogForm>(EMPTY_FORM)
  const [courses, setCourses] = useState<DashboardCourse[]>([])
  const [students, setStudents] = useState<CourseStudent[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchLogs = async () => {
    setLogsLoading(true)
    setLogsError(null)
    try {
      const data = await getBehaviourLogs()
      setLogs(data)
    } catch {
      setLogsError('Failed to load behaviour logs.')
    } finally {
      setLogsLoading(false)
    }
  }

  useEffect(() => {
    void fetchLogs()
  }, [])

  useEffect(() => {
    setCoursesLoading(true)
    getDashboardCourses()
      .then(({ courses }) => setCourses(courses.filter((c) => !c.is_archived)))
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false))
  }, [])

  useEffect(() => {
    if (!form.courseId) {
      setStudents([])
      return
    }
    setStudentsLoading(true)
    setForm((prev) => ({ ...prev, studentId: '', studentName: '', studentEmail: '' }))
    getCourse(form.courseId)
      .then(({ students }) => setStudents(students))
      .catch(() => setStudents([]))
      .finally(() => setStudentsLoading(false))
  }, [form.courseId])

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true
    return log.type === filter
  })

  const handleOpenModal = () => {
    setForm(EMPTY_FORM)
    setFormError(null)
    setStudents([])
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.courseId) return setFormError('Please select a course.')
    if (!form.studentId) return setFormError('Please select a student.')
    if (!form.category) return setFormError('Please select a category.')
    if (!form.date) return setFormError('Please select a date.')

    const selectedCourse = courses.find((c) => c.id === form.courseId)

    setIsSubmitting(true)
    setFormError(null)
    try {
      await createBehaviourLog({
        courseId: form.courseId,
        courseName: selectedCourse?.name ?? form.courseId,
        studentEmail: form.studentEmail,
        studentName: form.studentName,
        type: form.type,
        category: form.category,
        notes: form.notes.trim(),
        date: form.date,
      })
      setModalOpen(false)
      await fetchLogs()
    } catch {
      setFormError('Failed to save entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      router.push('/login')
      router.refresh()
    }
  }

  const categories = form.type === 'positive' ? POSITIVE_CATEGORIES : NEGATIVE_CATEGORIES

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Behaviour Log"
        subtitle="Track and review student behaviour across your courses."
        onLogout={handleLogout}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Behaviour' }]}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Hero banner */}
        <Card className="border border-border/70 bg-gradient-to-r from-primary/8 to-violet-500/6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Behaviour</p>
              <h2 className="heading-sm">Student behaviour records</h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Log positive and negative behaviour events for students across your courses. Use filters to review patterns over time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterButton
              label="All"
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              count={logs.length}
            />
            <FilterButton
              label="Positive"
              active={filter === 'positive'}
              onClick={() => setFilter('positive')}
              count={logs.filter((l) => l.type === 'positive').length}
            />
            <FilterButton
              label="Negative"
              active={filter === 'negative'}
              onClick={() => setFilter('negative')}
              count={logs.filter((l) => l.type === 'negative').length}
            />
          </div>
          <Button variant="primary" size="md" onClick={handleOpenModal}>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Behaviour
          </Button>
        </div>

        {/* Table */}
        <Card className="border border-border/70 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border px-6 py-4">
            <CardTitle className="text-base font-semibold">
              {filter === 'all' ? 'All entries' : filter === 'positive' ? 'Positive entries' : 'Negative entries'}
              <span className="ml-2 text-sm font-normal text-muted-foreground">({filteredLogs.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {logsLoading ? (
              <div className="flex items-center justify-center py-16">
                <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : logsError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm font-medium text-destructive">{logsError}</p>
                <button onClick={fetchLogs} className="mt-2 text-xs text-primary hover:underline">
                  Try again
                </button>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">No behaviour logs yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click &ldquo;Log Behaviour&rdquo; to record the first entry.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {['Student', 'Course', 'Type', 'Category', 'Notes', 'Date'].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                          {log.studentName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                          {log.courseName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <TypeBadge type={log.type} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-foreground">
                          {log.category}
                        </td>
                        <td className="max-w-xs px-6 py-4 text-muted-foreground">
                          <span className="line-clamp-2">{log.notes || '—'}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                          {new Date(log.date).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Log Behaviour Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Behaviour" size="md">
        <div className="space-y-5">
          {/* Course */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Course</label>
            <select
              value={form.courseId}
              onChange={(e) => setForm((prev) => ({ ...prev, courseId: e.target.value, category: '' }))}
              disabled={coursesLoading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
              <option value="">{coursesLoading ? 'Loading courses…' : 'Select a course'}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}{course.section ? ` — ${course.section}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Student */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Student</label>
            <select
              value={form.studentId}
              onChange={(e) => {
                const student = students.find((s) => s.id === e.target.value)
                setForm((prev) => ({
                  ...prev,
                  studentId: e.target.value,
                  studentName: student?.name ?? '',
                  studentEmail: student?.email ?? '',
                }))
              }}
              disabled={!form.courseId || studentsLoading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
              <option value="">
                {!form.courseId
                  ? 'Select a course first'
                  : studentsLoading
                  ? 'Loading students…'
                  : 'Select a student'}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type toggle */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Type</label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: 'positive', category: '' }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.type === 'positive'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                Positive
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: 'negative', category: '' }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.type === 'negative'
                    ? 'bg-red-600 text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                Negative
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Notes <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Add any additional context…"
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Error */}
          {formError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              {formError}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting}>
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
