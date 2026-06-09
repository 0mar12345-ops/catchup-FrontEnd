import http from '@/http/http'

export interface GenerateLessonRequest {
  course_id: string
  topic: string
  week_number?: number
  date?: string
}

export interface LessonPlan {
  learning_objectives: string
  starter_activity: string
  main_teaching_sequence: string
  practice_questions: string
  exit_ticket: string
}

export interface GenerateLessonResponse {
  course_id: string
  course_name: string
  week_label: string
  topic: string
  lesson_plan: LessonPlan
}

export async function generateLesson(data: GenerateLessonRequest) {
  const { data: result } = await http.post<GenerateLessonResponse>('/lesson-builder/generate', data)
  return result
}

export async function generatePptx(data: GenerateLessonRequest): Promise<ArrayBuffer> {
  const { data: result } = await http.post<ArrayBuffer>(
    '/lesson-builder/generate-pptx',
    data,
    { responseType: 'arraybuffer' },
  )
  return result
}
