'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingState } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/shared/Avatar'
import { useAuthMe } from '@/providers/auth-me-provider'
import { getStudentCatchUpLessons, type StudentCatchUpLesson } from '@/http/catchup.http'
import { getCourse } from '@/http/courses.http'
import { AlertCircle } from 'lucide-react'

interface StudentCatchUpListScreenProps {
  studentId: string
  courseId: string
  onBack: () => void
  onReviewLesson: (lessonId: string) => void
  onLogout: () => void
}

export function StudentCatchUpListScreen({
  studentId,
  courseId,
  onBack,
  onReviewLesson,
  onLogout,
}: StudentCatchUpListScreenProps) {
  const { me } = useAuthMe()
  const [lessons, setLessons] = useState<StudentCatchUpLesson[]>([])
  const [studentName, setStudentName] = useState('')
  const [courseName, setCourseName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [studentId, courseId])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch course data to get student name
      const courseData = await getCourse(courseId)
      setCourseName(courseData.name)
      
      const student = courseData.students.find(s => s.id === studentId)
      if (student) {
        setStudentName(student.name)
      }
      
      // Fetch catch-up lessons
      const lessonsData = await getStudentCatchUpLessons(courseId, studentId)
      setLessons(lessonsData)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load catch-up lessons')
    } finally {
      setIsLoading(false)
    }
  }

  const getStudentInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return <LoadingState message="Loading catch-up lessons..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          title="Catch-Up Lessons"
          userInitials={me?.username?.substring(0, 2).toUpperCase() || 'U'}
          userName={me?.username || 'User'}
          onLogout={onLogout}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            title="Error Loading Lessons"
            description={error}
            action={{
              label: 'Go Back',
              onClick: onBack,
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={`Catch-Up Lessons: ${studentName}`}
        subtitle={courseName}
        userInitials={me?.username?.substring(0, 2).toUpperCase() || 'U'}
        userName={me?.username || 'User'}
        onLogout={onLogout}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: courseName, href: `/course/${courseId}` },
          { label: studentName },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Course
          </Button>
        </div>

        {/* Student Info Card */}
        <Card className="mb-8">
          <div className="flex items-center gap-4">
            <Avatar
              initials={getStudentInitials(studentName)}
              name={studentName}
              size="lg"
            />
            <div>
              <h2 className="heading-sm">{studentName}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {lessons.length} catch-up lesson{lessons.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>

        {/* Lessons List */}
        {lessons.length === 0 ? (
          <EmptyState
            title="No Catch-Up Lessons"
            description="This student has no catch-up lessons generated yet."
            action={{
              label: 'Go Back',
              onClick: onBack,
            }}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">
                      Lesson
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground hidden md:table-cell">
                      Word Count
                    </th>
                    <th className="text-right py-4 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson, index) => (
                    <tr
                      key={lesson.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {lesson.title || formatDate(lesson.absence_date)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Absent: {formatDate(lesson.absence_date)}
                          </p>
                          {lesson.has_duplicate_date && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span>Multiple lessons for this date</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 sm:hidden">
                          <StatusBadge status={lesson.status as any} />
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <StatusBadge status={lesson.status as any} />
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell text-muted-foreground">
                        {lesson.word_count ? `${lesson.word_count} words` : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReviewLesson(lesson.id)}
                          className="hover:bg-primary/10 hover:text-primary"
                          disabled={lesson.status === 'empty' || lesson.status === 'failed'}
                        >
                          {lesson.status === 'generated' ? 'Review' : 
                           lesson.status === 'delivered' ? 'View' : 
                           lesson.status === 'completed' ? 'View' : 
                           lesson.status === 'failed' ? 'Failed' : 'Pending'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
