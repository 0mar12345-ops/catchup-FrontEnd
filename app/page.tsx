import Link from 'next/link'

// ─── Feature cards ─────────────────────────────────────────────────────────────

const features = [
  {
    title: 'AI Catch-Up Generation',
    description:
      'When a student misses class, the system automatically generates a personalised catch-up lesson — covering exactly what they missed, in their course context.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.319 2.798H4.117c-1.35 0-2.32-1.798-1.319-2.798L4.2 15.3" />
      </svg>
    ),
  },
  {
    title: 'Lesson Builder',
    description:
      'Create structured, curriculum-aligned lesson plans in seconds. Select a course, enter a topic, and get a complete plan with objectives, activities, and an exit ticket — ready to edit.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: 'Behaviour Tracking',
    description:
      'Log positive and negative behaviour events across all your courses. Identify patterns at a glance and keep an accurate, searchable record for parent meetings and reports.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
]

// ─── Steps ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    title: 'Sync Google Classroom',
    description:
      'Connect your existing Google Classroom account in one click. Your courses, students, and rosters are imported instantly — no manual data entry.',
  },
  {
    number: '02',
    title: 'Upload your absence list',
    description:
      'Drop in your daily CSV export. EduCatchUp cross-references absences with your timetable and identifies exactly what each student missed.',
  },
  {
    number: '03',
    title: 'AI builds the catch-up',
    description:
      'A personalised lesson summary is generated for every absent student and queued for delivery — so no one falls behind, even on your busiest days.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-serif text-lg font-semibold text-foreground">EduCatchUp</span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-violet-500/8 pointer-events-none" />
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                AI-Powered Teacher Tools
              </span>
              <h1 className="heading-display mt-6 text-foreground">
                Never let an absent student{' '}
                <span className="text-primary">fall behind again.</span>
              </h1>
              <p className="text-body-lg mt-6 text-muted-foreground">
                EduCatchUp automates the entire catch-up workflow — from detecting absences to generating personalised lessons — so you can focus on teaching, not admin.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
                >
                  Get Started
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Dashboard preview card */}
            <div className="mx-auto mt-20 max-w-5xl">
              <div className="rounded-2xl border border-border/70 bg-card shadow-2xl shadow-primary/10 ring-1 ring-border/50">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/70" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                  <div className="ml-3 flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                    app.educatchup.com/dashboard
                  </div>
                </div>
                {/* Fake dashboard content */}
                <div className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Daily overview</p>
                      <p className="mt-1 font-serif text-lg font-semibold text-foreground">Keep your morning planning and catch-up work in sync.</p>
                    </div>
                    <div className="hidden sm:flex gap-2">
                      <div className="h-8 w-24 rounded-lg bg-primary/10" />
                      <div className="h-8 w-20 rounded-lg bg-muted" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { label: "AP Biology", students: "28 students", period: "3rd Period" },
                      { label: "Honors Chemistry", students: "24 students", period: "5th Period" },
                      { label: "Biology Basics", students: "31 students", period: "6th Period" },
                    ].map((course) => (
                      <div key={course.label} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                        <p className="text-xs font-medium text-primary">{course.period}</p>
                        <p className="mt-0.5 font-semibold text-foreground">{course.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{course.students}</p>
                        <div className="mt-3 h-7 w-24 rounded-md bg-border/80" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Features</p>
            <h2 className="heading-lg mt-3 text-foreground">Everything you need to support every student</h2>
            <p className="text-body mt-4 text-muted-foreground">
              Built for secondary school teachers who want to spend less time on paperwork and more time in front of their class.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/70 bg-card p-8 shadow-sm transition-shadow hover:shadow-md hover:shadow-primary/8"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-muted/40 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
              <h2 className="heading-lg mt-3 text-foreground">From absence to catch-up in three steps</h2>
              <p className="text-body mt-4 text-muted-foreground">
                The entire workflow runs in minutes. No manual lesson writing. No chasing up students. No falling through the cracks.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-[calc(50%+3rem)] top-6 hidden h-0.5 w-[calc(100%-3rem)] bg-gradient-to-r from-primary/30 to-transparent lg:block" />
                  )}
                  <div className="rounded-2xl border border-border/70 bg-card p-8 shadow-sm">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <span className="font-mono text-sm font-bold">{step.number}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats banner ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-primary/8 to-violet-500/6 p-10">
            <div className="grid gap-10 text-center sm:grid-cols-3">
              {[
                { value: '< 60s', label: 'To generate a catch-up lesson' },
                { value: '100%', label: 'Google Classroom compatible' },
                { value: '5 min', label: 'Average daily setup time' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-primary py-24 sm:py-32">
          <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-violet-300/10 blur-3xl pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Get started today</p>
            <h2 className="heading-lg mt-4 text-primary-foreground">
              Ready to transform your classroom?
            </h2>
            <p className="text-body-lg mt-5 text-primary-foreground/80">
              Join teachers who are automating their catch-up workflow and giving every student the support they deserve — without adding hours to their week.
            </p>
            <div className="mt-10">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-medium text-primary shadow-sm transition-opacity hover:opacity-90 active:opacity-80"
              >
                Get Started with Google
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <svg className="h-3.5 w-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold text-foreground">EduCatchUp</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Built for teachers who care about every student.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
