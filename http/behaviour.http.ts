import http from '@/http/http'

// Shape returned by the API (snake_case)
interface BehaviourLogRaw {
  id: string
  student_id: string
  student_name: string
  student_email: string
  course_id: string
  course_name: string
  type: 'positive' | 'negative'
  category: string
  notes: string
  date: string
}

// Normalised shape used by the UI (camelCase)
export interface BehaviourLog {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string
  courseName: string
  type: 'positive' | 'negative'
  category: string
  notes: string
  date: string
}

export interface CreateBehaviourLogPayload {
  courseId: string
  courseName: string
  studentEmail: string
  studentName: string
  type: 'positive' | 'negative'
  category: string
  notes: string
  date: string
}

function normalize(raw: BehaviourLogRaw): BehaviourLog {
  return {
    id: raw.id,
    studentId: raw.student_id,
    studentName: raw.student_name,
    studentEmail: raw.student_email,
    courseId: raw.course_id,
    courseName: raw.course_name,
    type: raw.type,
    category: raw.category,
    notes: raw.notes,
    date: raw.date,
  }
}

export async function getBehaviourLogs(): Promise<BehaviourLog[]> {
  const { data } = await http.get<{ logs: BehaviourLogRaw[]; total: number }>('/behaviour')
  return data.logs.map(normalize)
}

export async function createBehaviourLog(payload: CreateBehaviourLogPayload): Promise<BehaviourLog> {
  const { data } = await http.post<BehaviourLogRaw>('/behaviour', {
    course_id: payload.courseId,
    course_name: payload.courseName,
    student_email: payload.studentEmail,
    student_name: payload.studentName,
    type: payload.type,
    category: payload.category,
    notes: payload.notes,
    date: payload.date,
  })
  return normalize(data)
}
