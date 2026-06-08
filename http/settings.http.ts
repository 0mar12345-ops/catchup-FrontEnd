import http from '@/http/http'

export interface UploadResponse {
  message?: string
  preview?: unknown[]
  rows?: unknown[]
  results?: unknown[]
  students?: unknown[]
  summary?: unknown
  [key: string]: unknown
}

export async function uploadTimetable(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await http.post<UploadResponse>('/timetable/upload', formData)
  return data
}

export async function uploadTermOverview(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await http.post<UploadResponse>('/timetable/term-overview/upload', formData)
  return data
}

export async function uploadAbsences(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await http.post<UploadResponse>('/absences/upload', formData)
  return data
}
