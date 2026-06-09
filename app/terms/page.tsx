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

export default function TermsPage() {
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
          <h1 className="heading-lg mt-3 text-foreground">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Effective date: {EFFECTIVE_DATE}. By using EduCatchUp you agree to these terms. Please read them carefully.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          <Section title="1. Acceptance of terms">
            <p>
              By accessing or using EduCatchUp (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. We reserve the right to update these terms at any time; continued use after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="2. Description of the service">
            <p>
              EduCatchUp is a teacher productivity platform that integrates with Google Classroom to help educators manage student absences, generate AI-powered catch-up lesson summaries, build lesson plans, and track student behaviour. The Service is intended for use by qualified teachers, school administrators, and authorised school staff.
            </p>
          </Section>

          <Section title="3. Eligibility and accounts">
            <ul className="space-y-1.5 pl-4">
              {[
                'Teachers and administrators must be authorised school staff to create an account.',
                'Students may use the platform as directed by their school; student accounts are provisioned by the school.',
                'You are responsible for maintaining the security of your Google account used to sign in.',
                'You are responsible for all activity that occurs under your account.',
                'You must notify us immediately at ' + CONTACT_EMAIL + ' if you become aware of any unauthorised use of your account.',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="4. Acceptable use">
            <p>You agree to use the Service only for its intended educational purpose. You must not:</p>
            <ul className="mt-2 space-y-1.5 pl-4">
              {[
                'Use the Service to process data about students outside your own classes or school.',
                'Share access credentials or allow unauthorised individuals to use your account.',
                'Upload data that you do not have lawful authority to process.',
                'Attempt to reverse-engineer, scrape, or exploit any part of the Service.',
                'Use the Service in any way that violates applicable law, including data protection and privacy legislation.',
                'Upload content that is harmful, offensive, or illegal.',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="5. Data and privacy">
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-primary underline underline-offset-2 hover:opacity-80">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. You are responsible for ensuring you have the necessary authority and consents to upload and process any student data within the Service, in accordance with your school&apos;s data governance policies and applicable law.
            </p>
          </Section>

          <Section title="6. Intellectual property">
            <p>
              All content, software, and design elements of the Service are owned by or licensed to EduCatchUp. You are granted a limited, non-exclusive, non-transferable licence to use the Service for its intended purpose. You retain ownership of any data you upload to the Service.
            </p>
            <p className="mt-2">
              AI-generated lesson content produced by the Service is provided for your use as a teacher. We make no claim of ownership over content you generate or export.
            </p>
          </Section>

          <Section title="7. Service availability">
            <p>
              We aim to keep the Service available and reliable, but we do not guarantee uninterrupted access. We may suspend or modify the Service at any time for maintenance, security, or operational reasons without notice. We are not liable for any loss arising from Service downtime or unavailability.
            </p>
          </Section>

          <Section title="8. AI-generated content disclaimer">
            <p>
              Catch-up lesson summaries and lesson plans generated by the Service are produced by AI and are intended as a starting point for your professional judgement — not as a substitute for it. You should review all AI-generated content before sharing it with students. EduCatchUp makes no warranty as to the accuracy, completeness, or curriculum alignment of generated content.
            </p>
          </Section>

          <Section title="9. Limitation of liability">
            <p>
              To the maximum extent permitted by law, EduCatchUp and its operators are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of — or inability to use — the Service. Our total liability for any claim arising from the Service shall not exceed the amount you have paid us in the 12 months preceding the claim.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              We may suspend or terminate your access to the Service at any time if we believe you have violated these Terms. You may stop using the Service and request account deletion at any time by contacting us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2 hover:opacity-80">
                {CONTACT_EMAIL}
              </a>. Sections relating to intellectual property, liability, and dispute resolution survive termination.
            </p>
          </Section>

          <Section title="11. Governing law">
            <p>
              These Terms are governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of the United Arab Emirates.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions about these Terms? Contact us at{' '}
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
