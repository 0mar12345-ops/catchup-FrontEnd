'use client'

import { useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import type { DashboardCourse } from '@/http/courses.http'
import { syncCourses } from '@/http/auth.http'

interface CourseSelectionScreenProps {
  courses: DashboardCourse[]
  isLoading?: boolean
  onSelectCourse: (courseId: string) => void
  onLogout: () => void
  onCoursesRefresh?: () => void
}

const courseColors = ['#3D3580', '#8B7DC8', '#D97706', '#0EA5E9', '#16A34A', '#DC2626']

function formatLastActivity(lastActivity?: string): string {
  if (!lastActivity) return 'No activity yet'
  
  const date = new Date(lastActivity)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return date.toLocaleDateString()
}

export function CourseSelectionScreen({ courses, isLoading = false, onSelectCourse, onLogout, onCoursesRefresh }: CourseSelectionScreenProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  const handleSyncCourses = async () => {
    try {
      setIsSyncing(true)
      setSyncMessage('')
      const result = await syncCourses()
      setSyncMessage(`Synced ${result.courses_synced} courses, ${result.students_synced} students`)
      if (onCoursesRefresh) {
        onCoursesRefresh()
      }
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : 'Failed to sync courses')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="My Courses"
        subtitle="Select a course to manage."
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sync Button */}
        <div className="mb-6 flex items-center justify-end gap-4">
          {syncMessage && (
            <span className="text-sm text-muted-foreground">{syncMessage}</span>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleSyncCourses}
            disabled={isSyncing}
            className="cursor-pointer"
          >
            {isSyncing ? 'Syncing...' : 'Sync New Courses'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const color = courseColors[index % courseColors.length]

            return (
            <Card
              key={course.id}
              hoverable
              className="cursor-pointer transition-all duration-300 relative overflow-hidden group"
              onClick={() => {
                setTimeout(() => onSelectCourse(course.id), 300)
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: color }}
              ></div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{course.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Section</span>
                  <span className="text-foreground font-medium">section: {course.section || 'A'}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Students</span>
                  <span className="text-foreground font-semibold">{course.total_students}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span className="text-foreground">{formatLastActivity(course.last_activity)}</span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setTimeout(() => onSelectCourse(course.id), 300)
                  }}
                >
                  Open Course
                </Button>
              </CardContent>
            </Card>
            )
          })}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground mt-6">Loading courses...</p>}
        {!isLoading && courses.length === 0 && (
          <p className="text-sm text-muted-foreground mt-6">No courses found for this account.</p>
        )}

        {/* Help Section */}
        <div className="mt-12 pt-12 border-t border-border">
          <h2 className="heading-sm mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-primary">
                1
              </div>
              <h3 className="font-semibold text-foreground">Select a Course</h3>
              <p className="text-sm text-muted-foreground">
                Choose any course to see an overview of student absences and generate catch-up content.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-primary">
                2
              </div>
              <h3 className="font-semibold text-foreground">Mark Absences</h3>
              <p className="text-sm text-muted-foreground">
                Select students and absence dates to generate personalized catch-up content with AI.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-primary">
                3
              </div>
              <h3 className="font-semibold text-foreground">Review & Share</h3>
              <p className="text-sm text-muted-foreground">
                Review the generated content and send it to students for their personalized learning.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
