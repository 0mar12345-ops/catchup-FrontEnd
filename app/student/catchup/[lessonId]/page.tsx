'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card'
import { Input } from '@/components/shared/Input'
import { LoadingState } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { deliverCatchUpLesson, getCatchUpLessonById, type CatchUpLessonReview } from '@/http/catchup.http'

function splitSteps(text: string) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length ? lines : ['Review the lesson summary to understand what you missed.']
}

export default function StudentCatchupPage() {
  const router = useRouter()
  const params = useParams<{ lessonId: string }>()
  const lessonId = params.lessonId

  const [lesson, setLesson] = useState<CatchUpLessonReview | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setError('')
        const data = await getCatchUpLessonById(lessonId)
        setLesson(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson content.')
      }
    }

    void loadLesson()
  }, [lessonId])

  const steps = useMemo(() => (lesson ? splitSteps(lesson.explanation) : []), [lesson])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError('')
      await deliverCatchUpLesson(lessonId)
      setIsCompleted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your answers right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!lesson) return <LoadingState message="Loading lesson content..." />

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Catch-Up Lesson" onLogout={async () => { const { logout } = await import('@/http/auth.http'); try { await logout() } finally { router.push('/login'); router.refresh() } }} />
        <main className="mx-auto max-w-4xl px-4 py-8"><EmptyState title="Unable to load lesson" description={error} /></main>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl border border-border/70 bg-gradient-to-r from-primary/8 to-indigo-500/6">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Lesson complete</p>
            <h1 className="heading-md mt-2">You finished this catch-up lesson.</h1>
            <p className="mt-3 text-muted-foreground">Your answers were submitted and the lesson has been marked as delivered for review.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="primary" onClick={() => router.push('/student/dashboard')}>Back to dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={lesson.title || 'Catch-Up Lesson'}
        subtitle={lesson.course_name || 'Student lesson'}
        onLogout={async () => { const { logout } = await import('@/http/auth.http'); try { await logout() } finally { router.push('/login'); router.refresh() } }}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>AI explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground">{lesson.explanation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step-by-step breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step, index) => (
              <div key={`${step}-${index}`} className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-foreground">{index + 1}. {step}</div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lesson.quiz?.length ? lesson.quiz.map((question, index) => (
              <div key={`${question.question}-${index}`} className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground">{question.question}</p>
                <Input
                  className="mt-3"
                  placeholder="Type your answer here"
                  value={answers[String(index)] || ''}
                  onChange={(event) => setAnswers((current) => ({ ...current, [String(index)]: event.target.value }))}
                />
              </div>
            )) : <p className="text-sm text-muted-foreground">No practice questions are available for this lesson yet.</p>}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Submit your answers to mark this lesson complete.</p>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>Submit Answers</Button>
        </div>
      </main>
    </div>
  )
}
