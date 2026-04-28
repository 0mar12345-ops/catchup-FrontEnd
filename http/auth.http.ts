import http from '@/http/http'

export interface GoogleAuthStartResponse {
  auth_url: string
}

export interface MeResponse {
  username: string
  role: string
}

export async function getGoogleOAuthURL() {
  const { data } = await http.get<GoogleAuthStartResponse>('/users/oauth/google')
  return data
}

export async function getMe() {
  const { data } = await http.get<MeResponse>('/users/me')
  return data
}

export async function logout() {
  const { data } = await http.post<{ message: string }>('/users/logout')
  return data
}

export interface SyncCoursesResponse {
  teacher_email: string
  teacher_name: string
  school_id: string
  user_id: string
  courses_synced: number
  students_synced: number
  enrollments_synced: number
  granted_scopes_count: number
}

export async function syncCourses() {
  const { data } = await http.post<SyncCoursesResponse>('/users/sync-courses')
  return data
}

export async function syncCourseStudents(courseId: string) {
  const { data } = await http.post<SyncCoursesResponse>(`/users/sync-course/${courseId}/students`)
  return data
}
