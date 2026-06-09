'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Card, CardContent } from '@/components/shared/Card'
import { logout } from '@/http/auth.http'
import {
  getAdminOverview,
  type AbsenceRecord,
  type CourseCatchUpStat,
  type CourseBehaviourSummary,
  type MissedAssessment,
  type AdminOverview,
} from '@/http/admin.http'

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string
  value: string | number
  sub?: string
  accent: 'indigo' | 'amber' | 'emerald' | 'violet'
  icon: ReactNode
}) {
  const iconBg: Record<typeof accent, string> = {
    indigo:  'bg-primary/10 text-primary',
    amber:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    violet:  'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  }

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className={`rounded-xl p-3 shrink-0 ${iconBg[accent]}`}>{icon}</div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ExcusedBadge({ excused }: { excused: boolean }) {
  if (excused) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
        Excused
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
      Unexcused
    </span>
  )
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead className="bg-muted/50">
      <tr>
        {cols.map((col) => (
          <th
            key={col}
            className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function SectionHeading({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="heading-sm">{title}</h2>
      {meta && <span className="shrink-0 text-sm text-muted-foreground">{meta}</span>}
    </div>
  )
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetchOverview()
  }, [])

  const fetchOverview = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await getAdminOverview()
      setOverview(data)
    } catch {
      setError('Failed to load admin overview. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try { await logout() } finally {
      router.push('/login')
      router.refresh()
    }
  }

  // Derived data
  const absences: AbsenceRecord[] = overview?.absences ?? []
  const catchupStats: CourseCatchUpStat[] = overview?.catchupStats ?? []
  const behaviourSummary: CourseBehaviourSummary[] = overview?.behaviourSummary ?? []
  const missedAssessments: MissedAssessment[] = overview?.missedAssessments ?? []

  const totalStudents = overview?.totalStudents ?? 0
  const totalAbsencesThisMonth = overview?.totalAbsencesThisMonth ?? absences.length
  const totalGenerated = catchupStats.reduce((s, c) => s + c.totalGenerated, 0)
  const totalCompleted = catchupStats.reduce((s, c) => s + c.completed, 0)
  const completionRate = overview?.catchupCompletionRate != null
    ? Math.round(overview.catchupCompletionRate)
    : (totalGenerated > 0 ? Math.round((totalCompleted / totalGenerated) * 100) : 0)
  const totalBehaviourLogs = overview?.totalBehaviourLogs ?? behaviourSummary.reduce((s, c) => s + c.positive + c.negative, 0)
  const totalPositive = behaviourSummary.reduce((s, c) => s + c.positive, 0)
  const totalNegative = behaviourSummary.reduce((s, c) => s + c.negative, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Admin Dashboard"
        subtitle="School-wide overview of absences, catch-up progress, and behaviour records."
        onLogout={handleLogout}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin' }]}
      />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <Card className="border border-border/70 bg-gradient-to-r from-primary/8 to-violet-500/6 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Admin</p>
            <h2 className="heading-sm mt-1">School-wide at a glance</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Review absences, catch-up completion, behaviour patterns, and missed assessments across all courses from one place. Data shown is for the current term.
            </p>
          </CardContent>
        </Card>

        {/* ── Loading ───────────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && !isLoading && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {!isLoading && !error && (
          <>
            {/* ── Overview cards ────────────────────────────────────────────── */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Students"
                value={totalStudents}
                sub="Across all active courses"
                accent="indigo"
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Absences This Month"
                value={totalAbsencesThisMonth}
                sub="Current month"
                accent="amber"
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                label="Catch-Up Completion"
                value={`${completionRate}%`}
                sub={`${totalCompleted} of ${totalGenerated} completed`}
                accent="emerald"
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Behaviour Logs"
                value={totalBehaviourLogs}
                sub={`${totalPositive} positive · ${totalNegative} negative`}
                accent="violet"
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
            </section>

            {/* ── Absences table ────────────────────────────────────────────── */}
            <section className="space-y-4">
              <SectionHeading
                title="Absences"
                meta={`${absences.length} records this month`}
              />
              <Card className="overflow-hidden border border-border/70 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                      <TableHead cols={['Student', 'Course', 'Date', 'Reason', 'Status']} />
                      <tbody className="divide-y divide-border bg-card">
                        {absences.map((row) => (
                          <tr key={row.id} className="transition-colors hover:bg-muted/40">
                            <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{row.studentName}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{row.courseName}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{fmtDate(row.date)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-foreground">{row.reason}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <ExcusedBadge excused={row.excused} />
                            </td>
                          </tr>
                        ))}
                        {absences.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                              No absence records this month.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* ── Catch-Up Status + Behaviour Summary ─────────────────────── */}
            <div className="grid gap-8 xl:grid-cols-2">

              {/* Catch-Up Status */}
              <section className="space-y-4">
                <SectionHeading title="Catch-Up Status" meta="Per course" />
                <Card className="overflow-hidden border border-border/70 shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border text-sm">
                        <TableHead cols={['Course', 'Generated', 'Completed', 'Pending']} />
                        <tbody className="divide-y divide-border bg-card">
                          {catchupStats.map((row) => {
                            const pct = row.totalGenerated > 0
                              ? Math.round((row.completed / row.totalGenerated) * 100)
                              : 0
                            return (
                              <tr key={row.courseId} className="transition-colors hover:bg-muted/40">
                                <td className="px-6 py-4">
                                  <p className="font-medium text-foreground">{row.courseName}</p>
                                  <p className="text-xs text-muted-foreground">{row.section}</p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-foreground">{row.totalGenerated}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <span className="font-medium text-emerald-700 dark:text-emerald-400">{row.completed}</span>
                                  <span className="ml-1.5 text-xs text-muted-foreground">({pct}%)</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <span className={`font-medium ${row.pending > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'}`}>
                                    {row.pending}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                          {catchupStats.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                No catch-up data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {catchupStats.length > 0 && (
                          <tfoot className="border-t border-border bg-muted/30">
                            <tr>
                              <td className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</td>
                              <td className="px-6 py-3 text-sm font-semibold text-foreground">{totalGenerated}</td>
                              <td className="px-6 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{totalCompleted}</td>
                              <td className="px-6 py-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
                                {catchupStats.reduce((s, c) => s + c.pending, 0)}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Behaviour Summary */}
              <section className="space-y-4">
                <SectionHeading title="Behaviour Summary" meta="Per course" />
                <Card className="overflow-hidden border border-border/70 shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border text-sm">
                        <TableHead cols={['Course', 'Positive', 'Negative', 'Total']} />
                        <tbody className="divide-y divide-border bg-card">
                          {behaviourSummary.map((row) => {
                            const total = row.positive + row.negative
                            const posPct = total > 0 ? Math.round((row.positive / total) * 100) : 0
                            return (
                              <tr key={row.courseId} className="transition-colors hover:bg-muted/40">
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{row.courseName}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    {row.positive}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <span className="inline-flex items-center gap-1.5 font-medium text-red-700 dark:text-red-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    {row.negative}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <span className="font-medium text-foreground">{total}</span>
                                  <span className="ml-1.5 text-xs text-muted-foreground">({posPct}% positive)</span>
                                </td>
                              </tr>
                            )
                          })}
                          {behaviourSummary.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                No behaviour data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {behaviourSummary.length > 0 && (
                          <tfoot className="border-t border-border bg-muted/30">
                            <tr>
                              <td className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</td>
                              <td className="px-6 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                {totalPositive}
                              </td>
                              <td className="px-6 py-3 text-sm font-semibold text-red-700 dark:text-red-400">
                                {totalNegative}
                              </td>
                              <td className="px-6 py-3 text-sm font-semibold text-foreground">{totalBehaviourLogs}</td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* ── Missed Assessments ────────────────────────────────────────── */}
            <section className="space-y-4">
              <SectionHeading
                title="Missed Assessments"
                meta="Students absent on assessment days (term overview)"
              />
              <Card className="overflow-hidden border border-border/70 shadow-sm">
                <CardContent className="p-0">
                  {missedAssessments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="mb-4 rounded-full bg-muted p-4">
                        <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-foreground">No missed assessments on record</p>
                      <p className="mt-1 text-xs text-muted-foreground">Upload a term overview to populate this section.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border text-sm">
                        <TableHead cols={['Student', 'Course', 'Assessment', 'Date', 'Absence Reason']} />
                        <tbody className="divide-y divide-border bg-card">
                          {missedAssessments.map((row) => (
                            <tr key={row.id} className="transition-colors hover:bg-muted/40">
                              <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{row.studentName}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{row.courseName}</td>
                              <td className="max-w-[260px] px-6 py-4 text-foreground">
                                <span className="line-clamp-2">{row.assessmentTitle}</span>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{fmtDate(row.assessmentDate)}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{row.absenceReason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}

      </main>
    </div>
  )
}
