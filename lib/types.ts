export interface Teacher {
  id: string
  name: string
  email: string
  avatar: string
  organization: string
}

export interface Course {
  id: string
  name: string
  section: string
  studentCount: number
  color: string
  lastActivity: string
}

export interface Student {
  id: string
  name: string
  avatar: string
  absenceDate: string
  daysAbsent: number
  status: 'pending' | 'generating' | 'generated' | 'completed' | 'failed'
  lastUpdated: string
}

export interface CatchUpContent {
  explanation: string
  contentAudit: {
    included: string[]
    excluded: string[]
  }
}

export interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'short-answer'
  question: string
  options?: string[]
  correctAnswer?: number
  placeholder?: string
}

export interface StatusConfig {
  [key: string]: {
    label: string
    color: string
    bg: string
  }
}

export type PageRoute = 'login' | 'dashboard' | 'course' | 'marking' | 'review' | 'student-view'
