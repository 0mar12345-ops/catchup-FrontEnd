import http from '@/http/http'

// ─── Raw (snake_case) types from API ─────────────────────────────────────────

interface AbsenceRecordRaw {
  id: string
  student_name: string
  course_name: string
  date: string
  reason: string
  excused: boolean
}

interface CourseCatchUpStatRaw {
  course_id: string
  course_name: string
  section: string
  total_generated: number
  completed: number
  pending: number
}

interface CourseBehaviourSummaryRaw {
  course_id: string
  course_name: string
  positive: number
  negative: number
}

interface MissedAssessmentRaw {
  id: string
  student_name: string
  course_name: string
  assessment_title: string
  assessment_date: string
  absence_reason: string
}

interface AdminOverviewRaw {
  total_students: number
  total_absences_this_month: number
  catchup_completion_rate: number
  total_behaviour_logs: number
  absences: AbsenceRecordRaw[]
  catchup_stats: CourseCatchUpStatRaw[]
  behaviour_summary: CourseBehaviourSummaryRaw[]
  missed_assessments: MissedAssessmentRaw[]
}

// ─── Public (camelCase) types ─────────────────────────────────────────────────

export interface AbsenceRecord {
  id: string
  studentName: string
  courseName: string
  date: string
  reason: string
  excused: boolean
}

export interface CourseCatchUpStat {
  courseId: string
  courseName: string
  section: string
  totalGenerated: number
  completed: number
  pending: number
}

export interface CourseBehaviourSummary {
  courseId: string
  courseName: string
  positive: number
  negative: number
}

export interface MissedAssessment {
  id: string
  studentName: string
  courseName: string
  assessmentTitle: string
  assessmentDate: string
  absenceReason: string
}

export interface AdminOverview {
  totalStudents: number
  totalAbsencesThisMonth: number
  catchupCompletionRate: number
  totalBehaviourLogs: number
  absences: AbsenceRecord[]
  catchupStats: CourseCatchUpStat[]
  behaviourSummary: CourseBehaviourSummary[]
  missedAssessments: MissedAssessment[]
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeAbsence(r: AbsenceRecordRaw): AbsenceRecord {
  return {
    id: r.id,
    studentName: r.student_name,
    courseName: r.course_name,
    date: r.date,
    reason: r.reason,
    excused: r.excused,
  }
}

function normalizeCatchUpStat(r: CourseCatchUpStatRaw): CourseCatchUpStat {
  return {
    courseId: r.course_id,
    courseName: r.course_name,
    section: r.section,
    totalGenerated: r.total_generated,
    completed: r.completed,
    pending: r.pending,
  }
}

function normalizeBehaviourSummary(r: CourseBehaviourSummaryRaw): CourseBehaviourSummary {
  return {
    courseId: r.course_id,
    courseName: r.course_name,
    positive: r.positive,
    negative: r.negative,
  }
}

function normalizeMissedAssessment(r: MissedAssessmentRaw): MissedAssessment {
  return {
    id: r.id,
    studentName: r.student_name,
    courseName: r.course_name,
    assessmentTitle: r.assessment_title,
    assessmentDate: r.assessment_date,
    absenceReason: r.absence_reason,
  }
}

function normalize(raw: AdminOverviewRaw): AdminOverview {
  return {
    totalStudents: raw.total_students,
    totalAbsencesThisMonth: raw.total_absences_this_month,
    catchupCompletionRate: raw.catchup_completion_rate,
    totalBehaviourLogs: raw.total_behaviour_logs,
    absences: (raw.absences ?? []).map(normalizeAbsence),
    catchupStats: (raw.catchup_stats ?? []).map(normalizeCatchUpStat),
    behaviourSummary: (raw.behaviour_summary ?? []).map(normalizeBehaviourSummary),
    missedAssessments: (raw.missed_assessments ?? []).map(normalizeMissedAssessment),
  }
}

// ─── API function ─────────────────────────────────────────────────────────────

export async function getAdminOverview(): Promise<AdminOverview> {
  const { data } = await http.get<AdminOverviewRaw>('/admin/overview')
  return normalize(data)
}
