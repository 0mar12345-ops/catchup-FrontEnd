'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/shared/Avatar'
import { Card } from '@/components/shared/Card'
import { LoadingState } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { getCourse, type CourseDetails, type CourseStudent } from '@/http/courses.http'
import { getMe, syncCourseStudents } from '@/http/auth.http'
import { getCourseStats, type CourseStats } from '@/http/catchup.http'

interface CourseOverviewScreenProps {
  courseId: string
  onMarkAbsence: () => void
  onReviewStudent: (studentId: string) => void
  onLogout: () => void
  onBackToDashboard?: () => void
}

export function CourseOverviewScreen({
  courseId,
  onMarkAbsence,
  onReviewStudent,
  onLogout,
}: CourseOverviewScreenProps) {
  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [userName, setUserName] = useState('Teacher')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const [courseData, statsData, meData] = await Promise.all([
        getCourse(courseId),
        getCourseStats(courseId),
        getMe().catch(() => ({ username: 'Teacher', role: 'teacher' }))
      ])
      
      setCourse(courseData)
      setStats(statsData)
      setUserName(meData.username)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncStudents = async () => {
    try {
      setIsSyncing(true)
      setSyncMessage('')
      const result = await syncCourseStudents(courseId)
      setSyncMessage(`Synced ${result.students_synced} students`)
      await fetchData()
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : 'Failed to sync students')
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
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
          userInitials={userName[0]?.toUpperCase() || 'T'}
          userName={userName}
          onLogout={onLogout}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState 
            title="Course Not Found"
            description={error || 'The course you are looking for does not exist or you do not have access to it.'}
          />
        </main>
      </div>
    )
  }

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={course.name}
        subtitle={`${course.section || ''} • ${course.total_students} students`}
        userInitials={initials}
        userName={userName}
        onLogout={onLogout}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: course.name },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Students</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{stats?.total_students || 0}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Absent Catch-ups</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{stats?.total_absences || 0}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Ready to Deliver</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{stats?.ready_to_deliver || 0}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Delivered</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{stats?.total_delivered || 0}</p>
            </div>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button variant="primary" size="lg" onClick={onMarkAbsence} className="cursor-pointer">
            Mark Student Absence
          </Button>
          <div className="flex items-center gap-4">
            {syncMessage && (
              <span className="text-sm text-muted-foreground">{syncMessage}</span>
            )}
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleSyncStudents}
              disabled={isSyncing}
              className="cursor-pointer"
            >
              {isSyncing ? 'Syncing...' : 'Sync New Students'}
            </Button>
          </div>
        </div>

        {/* Students Table */}
        <Card>
          {course.students.length === 0 ? (
            <EmptyState 
              title="No Students Enrolled"
              description="There are no students enrolled in this course yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Student Name</th>
                    <th className="text-right py-4 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {course.students.map((student, index) => {
                    const studentInitials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    
                    return (
                      <tr
                        key={student.id}
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar initials={studentInitials} name={student.name} size="md" />
                            <div>
                              <p className="font-medium text-foreground">{student.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReviewStudent(student.id)}
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
