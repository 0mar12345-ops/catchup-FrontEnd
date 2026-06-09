'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, FileSpreadsheet, RefreshCw, ShieldAlert } from 'lucide-react'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card'
import { Input } from '@/components/shared/Input'
import { OAuthStatusProvider } from '@/providers/oauth-status-provider'
import { logout } from '@/http/auth.http'
import { getDashboardCourses, type DashboardCourse } from '@/http/courses.http'
import { generateLesson, type GenerateLessonResponse, type LessonPlan } from '@/http/lesson-builder.http'

const LESSON_SECTIONS: Array<{
  key: keyof LessonPlan
  label: string
  icon: React.ComponentType<{ className?: string }>
  rows: number
  description: string
}> = [
  {
    key: 'learning_objectives',
    label: 'Learning Objectives',
    icon: CheckCircle,
    rows: 3,
    description: 'What students will know or be able to do by the end of the lesson',
  },
  {
    key: 'starter_activity',
    label: 'Starter Activity',
    icon: RefreshCw,
    rows: 4,
    description: 'Opening activity to activate prior knowledge',
  },
  {
    key: 'main_teaching_sequence',
    label: 'Main Teaching Sequence',
    icon: FileSpreadsheet,
    rows: 5,
    description: 'Core instruction, modelling, and guided practice',
  },
  {
    key: 'practice_questions',
    label: 'Practice Questions',
    icon: ShieldAlert,
    rows: 6,
    description: 'Independent tasks and questions for consolidation',
  },
  {
    key: 'exit_ticket',
    label: 'Exit Ticket',
    icon: AlertCircle,
    rows: 3,
    description: 'Quick end-of-lesson check for understanding',
  },
]

export default function LessonBuilderPage() {
  const router = useRouter()

  const [courses, setCourses] = useState<DashboardCourse[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [weekNumber, setWeekNumber] = useState('')
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [formError, setFormError] = useState('')

  const [lesson, setLesson] = useState<GenerateLessonResponse | null>(null)
  const [editedPlan, setEditedPlan] = useState<LessonPlan>({
    learning_objectives: '',
    starter_activity: '',
    main_teaching_sequence: '',
    practice_questions: '',
    exit_ticket: '',
  })

  useEffect(() => {
    void fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true)
      const data = await getDashboardCourses()
      setCourses(data.courses || [])
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedCourseId) {
      setFormError('Please select a course.')
      return
    }
    if (!topic.trim()) {
      setFormError('Please enter a topic.')
      return
    }

    setFormError('')
    setIsGenerating(true)

    try {
      const parsed = weekNumber ? parseInt(weekNumber, 10) : undefined
      const result = await generateLesson({
        course_id: selectedCourseId,
        topic: topic.trim(),
        ...(parsed !== undefined && !isNaN(parsed) ? { week_number: parsed } : {}),
      })

      setLesson(result)
      setEditedPlan({ ...result.lesson_plan })
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error
      setFormError(msg || 'Failed to generate lesson plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setLesson(null)
    setEditedPlan({
      learning_objectives: '',
      starter_activity: '',
      main_teaching_sequence: '',
      practice_questions: '',
      exit_ticket: '',
    })
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const updateSection = (key: keyof LessonPlan, value: string) => {
    setEditedPlan((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <OAuthStatusProvider>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-section { break-inside: avoid; margin-bottom: 1.5rem; }
          .print-section textarea {
            border: none !important;
            padding: 0 !important;
            background: transparent !important;
            resize: none !important;
            box-shadow: none !important;
            outline: none !important;
            width: 100%;
            font-size: 0.875rem;
            line-height: 1.6;
          }
        }
      `}</style>

      <div className="min-h-screen bg-background">
        <div className="no-print">
          <Header
            title="Lesson Builder"
            subtitle="Generate a structured lesson plan for any course and topic."
            onLogout={async () => {
              try {
                await logout()
              } finally {
                router.push('/login')
                router.refresh()
              }
            }}
          />
        </div>

        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero banner */}
          <Card className="border border-border/70 bg-gradient-to-r from-primary/8 to-indigo-500/6 no-print">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                    AI-powered planning
                  </p>
                  <h2 className="heading-sm mt-1">Build a structured lesson plan in seconds.</h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                    Select a course, enter a week and topic, and let the system generate a ready-to-use
                    lesson structure — then edit any section to make it your own.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main layout: form + lesson side by side */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Form column */}
            <div className="no-print xl:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Build Your Lesson</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Course selector */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Course
                    </label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      disabled={isLoadingCourses}
                      className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="">
                        {isLoadingCourses ? 'Loading courses…' : 'Select a course'}
                      </option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.name}
                          {course.section ? ` — ${course.section}` : ''}
                        </option>
                      ))}
                    </select>
                    {courses.length === 0 && !isLoadingCourses && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        No synced courses found. Sync your courses from the dashboard first.
                      </p>
                    )}
                  </div>

                  {/* Week number */}
                  <Input
                    label="Week Number (optional)"
                    type="number"
                    min={1}
                    max={52}
                    placeholder="e.g. 4"
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(e.target.value)}
                    helperText="Leave blank to use 'Current week'"
                  />

                  {/* Topic */}
                  <Input
                    label="Topic"
                    placeholder="e.g. Photosynthesis"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    helperText="The main concept or subject for this lesson."
                  />

                  {formError && (
                    <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
                      {formError}
                    </p>
                  )}

                  <Button
                    variant="primary"
                    size="md"
                    isLoading={isGenerating}
                    onClick={() => void handleGenerate()}
                    disabled={isGenerating || isLoadingCourses}
                    className="w-full"
                  >
                    Generate Lesson
                  </Button>

                  {lesson && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="w-full text-muted-foreground"
                    >
                      Start over
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column: placeholder or lesson plan */}
            <div className="xl:col-span-2">
              {!lesson ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                  <div className="space-y-2 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Your lesson plan will appear here</p>
                    <p className="text-xs text-muted-foreground">
                      Select a course and topic, then click Generate Lesson
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* Lesson header */}
                  <div className="flex items-start justify-between gap-4 no-print">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        Lesson plan ready
                      </p>
                      <h2 className="heading-sm mt-1">{lesson.course_name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lesson.week_label} · {lesson.topic}
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
                      Download PDF
                    </Button>
                  </div>

                  {/* Print-only title block */}
                  <div className="hidden" style={{ display: 'none' }}>
                    <div id="print-title">
                      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        {lesson.course_name}
                      </h1>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {lesson.week_label} · {lesson.topic}
                      </p>
                      <hr style={{ margin: '1rem 0', borderColor: '#e5e7eb' }} />
                    </div>
                  </div>

                  {/* Editable sections */}
                  {LESSON_SECTIONS.map(({ key, label, icon: Icon, rows, description }) => (
                    <div key={key} className="print-section">
                      <Card>
                        <CardHeader className="mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 no-print">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <CardTitle>{label}</CardTitle>
                              <p className="mt-0.5 text-xs text-muted-foreground no-print">
                                {description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <textarea
                            value={editedPlan[key]}
                            onChange={(e) => updateSection(key, e.target.value)}
                            rows={rows}
                            className="w-full resize-none rounded-lg border border-border bg-input px-4 py-3 text-sm leading-relaxed text-foreground placeholder-muted-foreground transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  ))}

                  {/* Bottom action bar */}
                  <div className="flex gap-3 pb-8 no-print">
                    <Button variant="outline" onClick={handleReset}>
                      Start Over
                    </Button>
                    <Button variant="primary" onClick={handleDownloadPDF}>
                      Download as PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </OAuthStatusProvider>
  )
}
