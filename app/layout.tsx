import type { Metadata } from 'next'
import { Source_Serif_4, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthMeProvider } from '@/providers/auth-me-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CatchUp - AI-Powered Catch-Up Lessons',
  description: 'Personalized catch-up lessons for students created with AI',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ "--font-playfair": sourceSerif.style.fontFamily, "--font-dm-sans": inter.style.fontFamily } as React.CSSProperties}>
      <body className={`${inter.className} font-sans antialiased bg-background text-foreground`}>
        <AuthMeProvider>{children}</AuthMeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
