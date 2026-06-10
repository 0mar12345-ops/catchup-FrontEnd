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
  verification: {
    google: 'VKwaZdAUrzpO-L_ozYeJpWPEEMH75Uzljc5k4RCoS98',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
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
