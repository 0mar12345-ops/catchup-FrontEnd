import http from '@/http/http'

export interface DashboardCourse {
  id: string
  name: string
  section?: string
  subject?: string
  room?: string
  grade_level?: string
  source: string
  is_archived: boolean
  total_students: number
  last_activity?: string
}

export interface DashboardCoursesResponse {
  courses: DashboardCourse[]
}

export interface CourseStudent {
  id: string
  name: string
  email: string
  photo_url?: string
}

export interface CourseDetails {
  id: string
  name: string
  section?: string
  subject?: string
  room?: string
  grade_level?: string
  source: string
  is_archived: boolean
  total_students: number
  students: CourseStudent[]
}

export async function getDashboardCourses() {
  const { data } = await http.get<DashboardCoursesResponse>('/courses')
  return data
}

export async function getCourse(courseId: string) {
  const { data } = await http.get<CourseDetails>(`/courses/${courseId}`)
  return data
}
