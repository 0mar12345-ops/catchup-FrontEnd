'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent } from '@/components/shared/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/shared/Avatar'
import { LoadingState } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { DeadlinePickerModal } from '@/components/shared/DeadlinePickerModal'
import { RegenerateCatchUpModal } from '@/components/shared/RegenerateCatchUpModal'
import { useAuthMe } from '@/providers/auth-me-provider'
import {
  getCatchUpLessonForReview,
  getCatchUpLessonById,
  deliverCatchUpLesson,
  regenerateCatchUpLesson,
  type CatchUpLessonReview,
} from '@/http/catchup.http'

interface TeacherReviewScreenProps {
  studentId: string
  courseId: string
  lessonId?: string
  onBack: () => void
  onShare: (studentId: string) => void
  onLogout: () => void
}

export function TeacherReviewScreen({
  studentId,
  courseId,
  lessonId,
  onBack,
  onShare,
  onLogout,
}: TeacherReviewScreenProps) {
  const { me } = useAuthMe()
  const [lesson, setLesson] = useState<CatchUpLessonReview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [showDeadlineModal, setShowDeadlineModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    fetchLesson()
  }, [courseId, studentId, lessonId])

  const fetchLesson = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // If lessonId is provided, fetch specific lesson, otherwise get the latest for student
      const data = lessonId 
        ? await getCatchUpLessonById(lessonId)
        : await getCatchUpLessonForReview(courseId, studentId)
      setLesson(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load catch-up lesson')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async (dueDate?: Date, title?: string) => {
    if (!lesson) return

    try {
      setIsSharing(true)
      await deliverCatchUpLesson(lesson.lesson_id, dueDate, title || lesson.title)
      // Update local state
      setLesson({ ...lesson, status: 'delivered' })
      setShowDeadlineModal(false)
      setShowConfirmation(false)
      // Navigate to student view after a brief delay
      setTimeout(() => {
        onShare(studentId)
      }, 800)
    } catch (err: any) {
      alert(err.response?.data?.details || err.response?.data?.error || 'Failed to deliver lesson')
      setIsSharing(false)
    }
  }

  const handleShareClick = () => {
    // Check if a lesson for this date was already delivered
    if (lesson?.already_delivered_for_date) {
      setShowConfirmation(true)
    } else {
      setShowDeadlineModal(true)
    }
  }

  const handleConfirmDelivery = () => {
    setShowConfirmation(false)
    setShowDeadlineModal(true)
  }

  const handleRegenerate = async (type: 'full' | 'explanation' | 'quiz', customPrompt?: string) => {
    if (!lesson) return

    try {
      setIsRegenerating(true)
      await regenerateCatchUpLesson(lesson.lesson_id, type, customPrompt)
      // Refresh lesson data
      await fetchLesson()
      setShowRegenerateModal(false)
    } catch (err: any) {
      alert(err.response?.data?.details || err.response?.data?.error || 'Failed to regenerate lesson')
    } finally {
      setIsRegenerating(false)
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading catch-up lesson..." />
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          title="Review Catch-Up Lesson"
          userInitials={me?.username?.substring(0, 2).toUpperCase() || 'U'}
          userName={me?.username || 'User'}
          onLogout={onLogout}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            title="Lesson Not Found"
            description={error || 'The catch-up lesson could not be loaded'}
            action={{
              label: 'Go Back',
              onClick: onBack
            }}
          />
        </main>
      </div>
    )
  }

  const getStudentInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={`Review: ${lesson.student_name}`}
        subtitle={`${lesson.course_name} • Content Review and Share`}
        userInitials={me?.username?.substring(0, 2).toUpperCase() || 'U'}
        userName={me?.username || 'User'}
        onLogout={onLogout}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: lesson.course_name, href: `/course/${courseId}` },
          { label: lesson.student_name },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Status */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Course
          </Button>
          <StatusBadge status={lesson.status as any} />
        </div>

        {/* Student Info Card */}
        <Card className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar
              initials={getStudentInitials(lesson.student_name)}
              name={lesson.student_name}
              size="lg"
            />
            <div className="flex-1">
              <h2 className="heading-sm">{lesson.student_name}</h2>
              {lesson.title && (
                <p className="text-base font-medium text-foreground mt-1">
                  {lesson.title}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Word count: {lesson.word_count} words
              </p>
            </div>
          </div>
        </Card>

        {/* Content Review Section */}
        <div className="space-y-8">
          {/* Explanation Section */}
          {lesson.explanation ? (
            <Card>
              <div className="mb-4">
                <h3 className="heading-sm text-primary">AI-Generated Explanation</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  This content has been generated based on the curriculum covered during the absence
                </p>
              </div>
              <CardContent className="pt-4 border-t border-border">
                <div 
                  className="prose prose-sm max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: lesson.explanation }}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="mb-4">
                <h3 className="heading-sm text-warning">Content Extracted - Awaiting AI Generation</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  The content has been extracted from Google Classroom. AI lesson generation is pending.
                </p>
              </div>
            </Card>
          )}

          {/* Content Audit */}
          <Card>
            <div className="mb-4">
              <h3 className="heading-sm">Content Audit</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Topics included and excluded in this catch-up content
              </p>
            </div>
            <CardContent className="space-y-4 pt-4 border-t border-border">
              {lesson.content_audit.included.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-success mb-2">Included Topics</h4>
                  <ul className="space-y-1">
                    {lesson.content_audit.included.map((topic, i) => (
                      <li key={i} className="text-sm text-foreground flex items-center gap-2">
                        <span className="text-success">✓</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lesson.content_audit.excluded.length > 0 && (
                <div className={lesson.content_audit.included.length > 0 ? 'pt-4 border-t border-border' : ''}>
                  <h4 className="font-semibold text-sm text-warning mb-2">Excluded Content</h4>
                  <ul className="space-y-1">
                    {lesson.content_audit.excluded.map((topic, i) => (
                      <li key={i} className="text-sm text-foreground flex items-center gap-2">
                        <span className="text-warning">−</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {lesson.content_audit.included.length === 0 && lesson.content_audit.excluded.length === 0 && (
                <p className="text-sm text-muted-foreground">No content audit available</p>
              )}
            </CardContent>
          </Card>

          {/* Quiz Preview */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <Card>
              <div className="mb-4">
                <h3 className="heading-sm">Quiz Preview</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  {lesson.quiz.length} question{lesson.quiz.length !== 1 ? 's' : ''}
                </p>
              </div>
              <CardContent className="pt-4 border-t border-border">
                <div className="space-y-4">
                  {lesson.quiz.map((question, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Question {index + 1}: ({question.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'})
                      </p>
                      <p className="text-sm text-muted-foreground">{question.question}</p>
                      {question.options && question.options.length > 0 && (
                        <ul className="mt-2 space-y-1 ml-4">
                          {question.options.map((option, i) => (
                            <li key={i} className="text-sm text-foreground">
                              {String.fromCharCode(65 + i)}) {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}


        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 space-y-3">
          <div className="max-w-7xl mx-auto flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={onBack}>
              Back
            </Button>
            {lesson.status !== 'delivered' && lesson.status !== 'completed' && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setShowRegenerateModal(true)}
                disabled={!lesson.explanation}
              >
                Regenerate Content
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleShareClick}
              disabled={lesson.status === 'delivered' || lesson.status === 'completed' || !lesson.explanation}
            >
              {lesson.status === 'delivered' ? 'Already Delivered' : 'Share with Student'}
            </Button>
          </div>
        </div>

        {/* Deadline Picker Modal */}
        <DeadlinePickerModal
          isOpen={showDeadlineModal}
          onClose={() => setShowDeadlineModal(false)}
          onConfirm={handleShare}
          isLoading={isSharing}
          defaultTitle={lesson.title}
        />

        {/* Confirmation Dialog for Already Delivered */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 border border-border">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Lesson Already Delivered
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A catch-up lesson for this absence date has already been delivered to the student. 
                    Do you want to deliver this lesson anyway?
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleConfirmDelivery}
                >
                  Deliver Anyway
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Regenerate Modal */}
        <RegenerateCatchUpModal
          isOpen={showRegenerateModal}
          onClose={() => setShowRegenerateModal(false)}
          onConfirm={handleRegenerate}
          isLoading={isRegenerating}
        />

        {/* Spacer for sticky footer */}
        <div className="h-20"></div>
      </main>
    </div>
  )
}
