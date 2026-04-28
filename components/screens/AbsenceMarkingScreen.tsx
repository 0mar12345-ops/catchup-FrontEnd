'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Checkbox } from '@/components/shared/Checkbox'
import { Input } from '@/components/shared/Input'
import { Avatar } from '@/components/shared/Avatar'
import { LoadingState } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { getCourse, type CourseDetails, type CourseStudent } from '@/http/courses.http'
import { getMe } from '@/http/auth.http'
import { useToast } from '@/hooks/use-toast'

interface AbsenceMarkingScreenProps {
  courseId: string
  onSubmit: (studentIds: string[], absenceDate: string) => void
  onBack: () => void
  onLogout: () => void
}

export function AbsenceMarkingScreen({
  courseId,
  onSubmit,
  onBack,
  onLogout,
}: AbsenceMarkingScreenProps) {
  const { toast } = useToast()
  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [userName, setUserName] = useState('Teacher')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [absenceDate, setAbsenceDate] = useState(new Date().toISOString().split('T')[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError('')
        
        const [courseData, meData] = await Promise.all([
          getCourse(courseId),
          getMe().catch(() => ({ username: 'Teacher', role: 'teacher' }))
        ])
        
        setCourse(courseData)
        setUserName(meData.username)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  if (isLoading) {
    return <LoadingState message="Loading course..." />
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          title="Error"
          subtitle=""
          userName={userName}
          onLogout={onLogout}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState 
            title="Course Not Found"
            description={error || 'The course you are looking for does not exist.'}
          />
        </main>
      </div>
    )
  }

  const filteredStudents = course.students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const toggleAllStudents = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)))
    }
  }

  const handleSubmit = async () => {
    if (selectedStudents.size === 0) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(Array.from(selectedStudents), absenceDate)
    } catch (err: any) {
      console.error('Failed to generate catch-up:', err)
      
      // Handle specific error cases
      const errorMessage = err?.response?.data?.error || err?.message || 'Unknown error'
      
      if (errorMessage === 'no content found for the specified date') {
        toast({
          title: 'No Content Found',
          description: `There is no classroom content available for ${new Date(absenceDate).toLocaleDateString()}. Please select a different date.`,
          variant: 'destructive',
        })
      } else if (errorMessage === 'insufficient content to generate catch-up lesson') {
        toast({
          title: 'Insufficient Content',
          description: 'The content found for this date is too short to generate a meaningful catch-up lesson. Please select a different date.',
          variant: 'destructive',
        })
      } else if (err?.response?.data?.error === 'oauth_invalid') {
        // OAuth error is already handled by the interceptor
        // No need to show additional toast
      } else {
        toast({
          title: 'Generation Failed',
          description: 'Failed to generate catch-up lesson. Please try again.',
          variant: 'destructive',
        })
      }
      
      setIsSubmitting(false)
    }
  }

  const isAllSelected = filteredStudents.length > 0 && selectedStudents.size === filteredStudents.length
  const isIndeterminate = selectedStudents.size > 0 && selectedStudents.size < filteredStudents.length
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Mark Student Absence"
        subtitle={`${course.name}${course.section ? ` • ${course.section}` : ''}`}
        userInitials={initials}
        userName={userName}
        onLogout={onLogout}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: course.name, href: `/course/${courseId}` },
          { label: 'Mark Absences' },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground mb-2">Select Absent Students</h2>
                <p className="text-sm text-muted-foreground">
                  Select students who were absent and choose the date. The system will automatically generate personalized catch-up lessons from that day's classroom content.
                </p>
              </div>

              {/* Date Picker - Moved to top for better flow */}
              <div className="p-6 border-b border-border bg-muted/30">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Absence Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={absenceDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAbsenceDate(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Content from this date will be used to generate catch-up lessons
                </p>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-border">
                <Input
                  placeholder="Search students by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {course.students.length === 0 ? (
                <div className="p-8">
                  <EmptyState 
                    title="No Students Enrolled"
                    description="There are no students enrolled in this course yet."
                  />
                </div>
              ) : (
                <>
                  {/* Select All */}
                  <div className="p-6 border-b border-border flex items-center gap-3 bg-muted/20">
                    <Checkbox
                      id="select-all"
                      checked={isAllSelected}
                      onChange={toggleAllStudents}
                      indeterminate={isIndeterminate}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium text-foreground cursor-pointer">
                      Select All Students ({selectedStudents.size} of {filteredStudents.length} selected)
                    </label>
                  </div>

                  {/* Student List */}
                  <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">No students found matching &quot;{searchQuery}&quot;</p>
                      </div>
                    ) : (
                      filteredStudents.map((student) => {
                        const studentInitials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        
                        return (
                          <div
                            key={student.id}
                            className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => toggleStudent(student.id)}
                          >
                            <Checkbox
                              checked={selectedStudents.has(student.id)}
                              onChange={() => toggleStudent(student.id)}
                            />
                            <Avatar initials={studentInitials} name={student.name} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border border-border sticky top-8 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Students Selected</p>
                  <p className="text-3xl font-bold text-primary">{selectedStudents.size}</p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground mb-1">Absence Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(absenceDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground mb-1">Course</p>
                  <p className="text-sm font-medium text-foreground">{course.name}</p>
                  {course.section && (
                    <p className="text-xs text-muted-foreground mt-1">{course.section}</p>
                  )}
                </div>
              </div>

              <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-info flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-info">What happens next?</p>
                    <p className="text-xs text-info/80 mt-1">
                      AI will analyze classroom content from the selected date and generate personalized catch-up lessons for each student.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={selectedStudents.size === 0 || isSubmitting}
                  isLoading={isSubmitting}
                  variant="primary"
                  className="w-full"
                >
                  {isSubmitting ? 'Generating Catch-Up...' : `Generate Catch-Up (${selectedStudents.size})`}
                </Button>
                <Button
                  onClick={onBack}
                  variant="secondary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>

              {selectedStudents.size > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs font-medium text-foreground mb-3 uppercase tracking-wide">
                    Selected Students ({selectedStudents.size})
                  </p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {Array.from(selectedStudents)
                      .map((id) => course.students.find((s) => s.id === id))
                      .filter(Boolean)
                      .map((student) => {
                        if (!student) return null
                        return (
                          <div
                            key={student.id}
                            className="text-xs py-2 px-3 bg-muted rounded flex items-center justify-between group"
                          >
                            <span className="truncate text-foreground font-medium">{student.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStudent(student.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-muted-foreground hover:text-destructive"
                              aria-label="Remove student"
                            >
                              ✕
                            </button>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
