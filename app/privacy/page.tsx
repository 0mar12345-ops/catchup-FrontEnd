import Link from 'next/link'

const CONTACT_EMAIL = 'cardyomar@gmail.com'
const EFFECTIVE_DATE = 'June 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-serif text-lg font-semibold text-foreground">EduCatchUp</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
          <h1 className="heading-lg mt-3 text-foreground">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Effective date: {EFFECTIVE_DATE}. This policy explains what data EduCatchUp collects, why, and how it is protected.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          <Section title="1. Who we are">
            <p>
              EduCatchUp is a teacher productivity tool that automates catch-up lesson generation for absent students using AI and Google Classroom integration. References to &quot;we&quot;, &quot;us&quot;, or &quot;EduCatchUp&quot; in this policy refer to the service operator. For questions, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2 hover:opacity-80">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <Section title="2. Data we collect">
            <p>We collect the following categories of data when you use EduCatchUp:</p>
            <ul className="mt-2 space-y-2 pl-4">
              {[
                {
                  label: 'Google account information',
                  detail: 'Your name, email address, and profile photo, obtained via Google OAuth when you sign in.',
                },
                {
                  label: 'Google Classroom data',
                  detail: 'Course names, class rosters (student names and email addresses), and course metadata — accessed via the Google Classroom API on your behalf.',
                },
                {
                  label: 'Absence records',
                  detail: 'CSV files you upload containing student absence information, including student names, dates, and reasons.',
                },
                {
                  label: 'Behaviour logs',
                  detail: 'Behaviour entries you create manually within the app, including student names, behaviour type, category, and notes.',
                },
                {
                  label: 'Generated lesson content',
                  detail: 'AI-generated catch-up lesson summaries associated with specific students and courses.',
                },
              ].map(({ label, detail }) => (
                <li key={label} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span><strong className="font-medium text-foreground">{label}:</strong> {detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              EduCatchUp only requests Google Classroom permissions necessary to retrieve course information, student rosters, and coursework required for catch-up lesson generation. Specifically:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">classroom.courses.readonly</code>,{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">classroom.rosters.readonly</code>,{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">classroom.coursework.students.readonly</code>.
            </p>
          </Section>

          <Section title="3. How we use your data">
            <p>Your data is used exclusively to provide the EduCatchUp service:</p>
            <ul className="mt-2 space-y-1.5 pl-4">
              {[
                'Authenticate you and maintain your session via Google OAuth.',
                'Import and display your Google Classroom courses and student rosters.',
                'Cross-reference absence records with your class timetable to identify what each absent student missed.',
                'Generate personalised AI catch-up lesson summaries for absent students.',
                'Store and display behaviour log entries you create.',
                'Provide an admin dashboard with school-wide attendance and behaviour overviews.',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">We do not use your data for advertising, profiling, or any purpose beyond operating the service.</p>
            <p className="mt-2">
              School administrators may only access data belonging to users and students within their own school. Cross-school data access is not possible.
            </p>
          </Section>

          <Section title="4. Google API data usage">
            <p>
              EduCatchUp&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </Section>

          <Section title="5. Who we share data with">
            <p>
              <strong className="font-medium text-foreground">We do not sell, rent, or share your data with third parties.</strong>{' '}
              Your data stays on our servers. The only external service we interact with on your behalf is the Google Classroom API, which is used to read your course and roster data — this is governed by{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
                Google&apos;s Privacy Policy
              </a>.
            </p>
            <p className="mt-2">
              AI-generated lesson content is produced using a large language model. Prompts sent to the model include course name, topic, and curriculum context — no personally identifiable student information is included in AI requests.
            </p>
          </Section>

          <Section title="6. Data retention">
            <ul className="space-y-1.5 pl-4">
              {[
                'Account data (name, email, role) is retained for as long as your account is active.',
                'Google Classroom sync data (courses and rosters) is refreshed each time you sync and retained until you delete your account.',
                'Absence records and generated catch-up lessons are retained until you delete your account or request deletion.',
                'Behaviour logs are retained until you delete your account or request deletion.',
                'When an account is deleted, all associated data is permanently removed from our servers within 30 days.',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="7. Data security">
            <p>
              All data is transmitted over HTTPS. Authentication is handled via Google OAuth — we never receive or store your Google password.
            </p>
            <p className="mt-2">
              OAuth access tokens and refresh tokens are encrypted at rest and used solely to provide requested Google Classroom functionality. Tokens are not shared with third parties and are deleted when a user disconnects their Google account or deletes their account.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>You have the right to:</p>
            <ul className="mt-2 space-y-1.5 pl-4">
              {[
                'Access a copy of the data we hold about you.',
                'Request correction of inaccurate data.',
                'Request deletion of your account and all associated data.',
                "Revoke EduCatchUp's access to your Google Classroom data at any time via your Google account permissions page.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2 hover:opacity-80">
                {CONTACT_EMAIL}
              </a>{' '}
              with the subject line &quot;Data Request&quot;. We will respond within 14 days.
            </p>
          </Section>

          <Section title="9. Account deletion">
            <p>
              To request deletion of your account and all associated data, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}?subject=Delete%20My%20Account`} className="text-primary underline underline-offset-2 hover:opacity-80">
                {CONTACT_EMAIL}
              </a>{' '}
              with the subject line <strong className="font-medium text-foreground">&quot;Delete My Account&quot;</strong>. We will process your request within 30 days and confirm by email once your data has been permanently removed.
            </p>
            <p className="mt-2">Deleting your account will permanently remove:</p>
            <ul className="mt-2 space-y-1.5 pl-4">
              {[
                'Your account profile (name, email, role).',
                'All synced Google Classroom course and roster data.',
                'All absence records you have uploaded.',
                'All behaviour log entries you have created.',
                'All AI-generated catch-up lesson content associated with your students.',
                'Your Google OAuth access and refresh tokens.',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="10. Children's privacy">
            <p>
              EduCatchUp is used by teachers, school administrators, and students. Students interact with the platform via the student portal to view and complete AI-generated catch-up lessons assigned to them by their teacher. Student accounts are provisioned by the school, and students access the platform using their school-issued Google account.
            </p>
            <p className="mt-2">
              EduCatchUp acts as a service provider to educational institutions. Student information is processed only under the direction of the relevant school and solely for educational purposes.
            </p>
            <p className="mt-2">
              Student data (names, email addresses, and catch-up lesson content) is processed solely to deliver the catch-up workflow. Schools are responsible for obtaining any required parental or guardian consent for students to use the platform in accordance with applicable law. If you believe student data has been processed inappropriately, please contact us immediately at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2 hover:opacity-80">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <Section title="11. Changes to this policy">
            <p>
              We may update this policy from time to time. When we do, we will update the effective date at the top of this page. Continued use of the service after changes are posted constitutes your acceptance of the revised policy.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions or concerns about this policy? Contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2 hover:opacity-80">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/60 bg-background py-8">
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
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground">{CONTACT_EMAIL}</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
