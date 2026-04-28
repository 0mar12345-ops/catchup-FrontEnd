'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { AbsenceMarkingScreen } from '@/components/screens/AbsenceMarkingScreen'
import { logout } from '@/http/auth.http'
import { generateCatchUp, getBatchJobStatus, type BatchJobStatus } from '@/http/catchup.http'
import { toast } from '@/hooks/use-toast'

export default function CourseMarkingPage() {
  const router = useRouter()
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId
  const [batchJobId, setBatchJobId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Poll for batch job status
  useEffect(() => {
    if (!batchJobId || !isPolling) return

    const pollStatus = async () => {
      try {
        const status = await getBatchJobStatus(batchJobId)
        
        // Show progress update
        if (status.status === 'processing') {
          const progress = status.total_students > 0 
            ? Math.round((status.processed_students / status.total_students) * 100)
            : 0
          
          console.log(`Processing: ${status.processed_students}/${status.total_students} (${progress}%)`)
        }
        
        if (status.status === 'completed') {
          // Stop polling
          setIsPolling(false)
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
          }

          // Show success message
          toast({
            title: 'Generation Complete',
            description: `Successfully generated ${status.success_count} catch-up lesson(s). ${status.failed_count > 0 ? `${status.failed_count} failed.` : ''}`,
          })

          // Redirect to course page
          setTimeout(() => {
            router.push(`/course/${courseId}`)
          }, 1500)
        } else if (status.status === 'failed') {
          // Stop polling
          setIsPolling(false)
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
          }

          // Handle specific error types
          if (status.failure_reason === 'oauth_invalid') {
            // Redirect to accounts page for OAuth errors
            window.location.href = '/accounts?oauth_expired=true'
            return
          } else if (status.failure_reason === 'no_content_found') {
            // Show specific error for no content
            toast({
              title: 'No Content Found',
              description: 'There is no classroom content available for the selected date. Please choose a different date.',
              variant: 'destructive',
            })
          } else if (status.failure_reason === 'insufficient_content') {
            // Show specific error for insufficient content
            toast({
              title: 'Insufficient Content',
              description: 'The content found for this date is too short to generate a meaningful catch-up lesson. Please select a different date.',
              variant: 'destructive',
            })
          } else {
            // Show generic error message
            toast({
              title: 'Generation Failed',
              description: status.failure_reason || 'Failed to generate catch-up lessons.',
              variant: 'destructive',
            })
          }
        }
        // For 'pending' or 'processing', continue polling
      } catch (error) {
        console.error('Failed to poll batch job status:', error)
      }
    }

    // Initial poll
    pollStatus()

    // Set up polling interval (every 2 seconds)
    pollingIntervalRef.current = setInterval(pollStatus, 2000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [batchJobId, isPolling, courseId, router])

  return (
    <AbsenceMarkingScreen
      courseId={courseId}
      onSubmit={async (studentIds, absenceDate) => {
        try {
          const result = await generateCatchUp({
            course_id: courseId,
            student_ids: studentIds,
            absence_date: absenceDate,
          })

          // Check if async processing (has batch_job_id)
          if (result.batch_job_id) {
            setBatchJobId(result.batch_job_id)
            setIsPolling(true)
            
            toast({
              title: 'Processing Started',
              description: result.message || 'Generating catch-up lessons in the background...',
            })
          } else {
            // Legacy sync response (should not happen with new code)
            if (result.success_count && result.success_count > 0) {
              toast({
                title: 'Success',
                description: `Successfully generated catch-up lessons for ${result.success_count} student(s).`,
              })
            }
            
            if (result.warnings && result.warnings.length > 0) {
              console.log('Warnings:', result.warnings)
            }
            
            router.push(`/course/${courseId}`)
          }
        } catch (error) {
          console.error('Failed to generate catch-up:', error)
          throw error
        }
      }}
      onBack={() => router.push(`/course/${courseId}`)}
      onLogout={async () => {
        try {
          await logout()
        } finally {
          router.push('/login')
          router.refresh()
        }
      }}
    />
  )
}
