import http from '@/http/http'

export interface GenerateCatchUpRequest {
  course_id: string
  student_ids: string[]
  absence_date: string
}

export interface GenerateCatchUpResponse {
  success_count?: number
  failed_count?: number
  warnings?: string[]
  message: string
  batch_job_id?: string
}

export interface BatchJobStatus {
  id: string
  school_id: string
  course_id: string
  teacher_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  total_students: number
  processed_students: number
  success_count: number
  failed_count: number
  warnings?: string[]
  failure_reason?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  question: string
  type: 'mcq' | 'short_answer'
  options?: string[]
  answer?: string
}

export interface ContentAudit {
  included: string[]
  excluded: string[]
}

export interface CatchUpLessonReview {
  lesson_id: string
  student_id: string
  student_name: string
  course_id: string
  course_name: string
  status: string
  title: string
  explanation: string
  quiz: QuizQuestion[]
  content_audit: ContentAudit
  word_count: number
  warnings?: string[]
  generated_at?: string
  delivered_at?: string
  created_at: string
  already_delivered_for_date?: boolean
}

export interface StudentCatchUpLesson {
  id: string
  student_id: string
  course_id: string
  absence_date: string
  status: 'empty' | 'generated' | 'delivered' | 'completed' | 'failed'
  title?: string
  word_count?: number
  created_at: string
  updated_at: string
  has_duplicate_date?: boolean
  already_delivered_for_date?: boolean
}

export async function generateCatchUp(request: GenerateCatchUpRequest) {
  const { data } = await http.post<GenerateCatchUpResponse>('/catchup/generate', request)
  return data
}

export async function getBatchJobStatus(batchJobId: string) {
  const { data } = await http.get<BatchJobStatus>(`/catchup/batch/${batchJobId}`)
  return data
}

export async function getStudentCatchUpLessons(courseId: string, studentId: string) {
  const { data } = await http.get<StudentCatchUpLesson[]>(
    `/catchup/course/${courseId}/student/${studentId}/lessons`
  )
  return data
}

export async function getCatchUpLessonForReview(courseId: string, studentId: string) {
  const { data } = await http.get<CatchUpLessonReview>(
    `/catchup/course/${courseId}/student/${studentId}`
  )
  return data
}

export async function getCatchUpLessonById(lessonId: string) {
  const { data } = await http.get<CatchUpLessonReview>(
    `/catchup/lesson/${lessonId}`
  )
  return data
}

export async function deliverCatchUpLesson(lessonId: string, dueDate?: Date, title?: string) {
  const { data } = await http.post<{ message: string }>(`/catchup/lesson/${lessonId}/deliver`, {
    due_date: dueDate?.toISOString() || null,
    title: title || null
  })
  return data
}

export async function regenerateCatchUpLesson(
  lessonId: string,
  type: 'full' | 'explanation' | 'quiz',
  customPrompt?: string
) {
  const { data } = await http.post<CatchUpLessonReview>(
    `/catchup/lesson/${lessonId}/regenerate`,
    {
      regeneration_type: type,
      custom_prompt: customPrompt || null
    }
  )
  return data
}

export interface CourseStats {
  total_students: number
  total_absences: number
  ready_to_deliver: number
  total_delivered: number
}

export async function getCourseStats(courseId: string) {
  const { data } = await http.get<CourseStats>(`/catchup/course/${courseId}/stats`)
  return data
}
