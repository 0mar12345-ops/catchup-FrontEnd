'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'

interface LoginScreenProps {
  onGoogleLogin: () => Promise<void>
}

export function LoginScreen({ onGoogleLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      await onGoogleLogin()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-primary rounded-lg mb-4 items-center justify-center">
            <span className="text-white text-xl font-serif font-semibold">C</span>
          </div>
          <h1 className="heading-lg mb-2">CatchUp</h1>
          <p className="text-muted-foreground">AI-Powered Catch-Up Lessons</p>
        </div>

        {/* Login Card */}
        <Card>
          <div className="space-y-6">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Continue Button */}
            <Button
              onClick={handleGoogleLogin}
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Continue with Google
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-sm text-info font-medium">School Account Required</p>
          <p className="text-xs text-info/80 mt-1">
            Please use your Google school account to access your classroom data.
          </p>
        </div>
      </div>
    </div>
  )
}
