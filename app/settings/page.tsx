'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Button } from '@/components/shared/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card'
import { logout } from '@/http/auth.http'
import { uploadAbsences, uploadTermOverview, uploadTimetable } from '@/http/settings.http'
import { CalendarRange, FileSpreadsheet, ShieldAlert, UploadCloud } from 'lucide-react'

interface UploadState {
  fileName: string | null
  message: string
  preview: unknown[] | null
  isUploading: boolean
  error: string | null
}

function normalizePreview(result: unknown): unknown[] | null {
  if (!result || typeof result !== 'object') {
    return null
  }

  const candidate = result as Record<string, unknown>
  const preview =
    (candidate.preview as unknown[]) ||
    (candidate.rows as unknown[]) ||
    (candidate.results as unknown[]) ||
    (candidate.students as unknown[]) ||
    (candidate.data as unknown[])

  return Array.isArray(preview) ? preview : null
}

function formatPreviewValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function PreviewTable({ rows }: { rows: unknown[] }) {
  if (!rows.length) return null

  const firstRow = rows[0]
  const columns = firstRow && typeof firstRow === 'object' && !Array.isArray(firstRow)
    ? Object.keys(firstRow as Record<string, unknown>)
    : ['value']

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-muted/40">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 text-left font-medium">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.slice(0, 6).map((row, index) => {
            if (row && typeof row === 'object' && !Array.isArray(row)) {
              const record = row as Record<string, unknown>
              return (
                <tr key={`${record.id ?? index}-${index}`} className="hover:bg-muted/70">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-3 align-top text-foreground">
                      {formatPreviewValue(record[column])}
                    </td>
                  ))}
                </tr>
              )
            }

            return (
              <tr key={`row-${index}`}>
                <td className="px-4 py-3 text-foreground">{formatPreviewValue(row)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function UploadSection({
  title,
  description,
  acceptedTypes,
  icon: Icon,
  onUpload,
  state,
  setState,
}: {
  title: string
  description: string
  acceptedTypes: string
  icon: typeof UploadCloud
  onUpload: (file: File) => Promise<unknown>
  state: UploadState
  setState: (next: UploadState) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = (file?: File | null) => {
    if (!file) return
    setState({
      fileName: file.name,
      message: 'Uploading file…',
      preview: null,
      isUploading: true,
      error: null,
    })

    onUpload(file)
      .then((response) => {
        const preview = normalizePreview(response)
        setState({
          fileName: file.name,
          message: (response as { message?: string })?.message || 'Upload completed successfully.',
          preview,
          isUploading: false,
          error: null,
        })
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Upload failed. Please try again.'
        setState({
          fileName: file.name,
          message: '',
          preview: null,
          isUploading: false,
          error: message,
        })
      })
  }

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <label
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragActive(false)
            handleFile(event.dataTransfer.files?.[0])
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/60 hover:bg-primary/5'
          }`}
        >
          <UploadCloud className="mb-3 h-8 w-8 text-primary" />
          <p className="text-sm font-medium text-foreground">Drop your file here or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">Accepted formats: {acceptedTypes}</p>
          <input
            ref={inputRef}
            type="file"
            accept={acceptedTypes}
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </label>

        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            Choose file
          </Button>
          <span className="text-xs text-muted-foreground">{state.fileName || 'No file selected yet'}</span>
        </div>

        {state.message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100">
            {state.message}
          </div>
        )}

        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
            {state.error}
          </div>
        )}

        {state.preview && state.preview.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Parsed preview</p>
            <PreviewTable rows={state.preview} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [timetableState, setTimetableState] = useState<UploadState>({
    fileName: null,
    message: '',
    preview: null,
    isUploading: false,
    error: null,
  })
  const [termOverviewState, setTermOverviewState] = useState<UploadState>({
    fileName: null,
    message: '',
    preview: null,
    isUploading: false,
    error: null,
  })
  const [absenceState, setAbsenceState] = useState<UploadState>({
    fileName: null,
    message: '',
    preview: null,
    isUploading: false,
    error: null,
  })

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      router.push('/login')
      router.refresh()
    }
  }

  const uploadCards = useMemo(
    () => [
      {
        title: 'Timetable Upload',
        description: 'Upload a timetable export to refresh the course schedule view.',
        acceptedTypes: '.csv,.xlsx,.xls',
        icon: CalendarRange,
        onUpload: uploadTimetable,
        state: timetableState,
        setState: setTimetableState,
      },
      {
        title: 'Term Overview Upload',
        description: 'Import term overview data for your semester planning and reporting.',
        acceptedTypes: '.csv,.xlsx,.xls',
        icon: FileSpreadsheet,
        onUpload: uploadTermOverview,
        state: termOverviewState,
        setState: setTermOverviewState,
      },
      {
        title: 'Absence Upload',
        description: 'Upload CSV files with student_email, date, reason, and excused columns.',
        acceptedTypes: '.csv',
        icon: ShieldAlert,
        onUpload: uploadAbsences,
        state: absenceState,
        setState: setAbsenceState,
      },
    ],
    [absenceState, termOverviewState, timetableState],
  )

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Settings"
        subtitle="Import timetable, term overview, and absence data from the dashboard."
        onLogout={handleLogout}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border border-border/70 bg-gradient-to-r from-primary/8 to-violet-500/6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Data import</p>
              <h2 className="heading-sm">Keep your records in sync</h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Upload the latest timetable, term overview, and absence files here. Each upload completes through the existing API client and returns a parsed preview to confirm the import was successful.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {uploadCards.map((card) => (
            <UploadSection key={card.title} {...card} />
          ))}
        </div>
      </main>
    </div>
  )
}
