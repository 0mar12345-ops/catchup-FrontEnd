'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, type MeResponse } from '@/http/auth.http'

type AuthMeContextValue = {
  me: MeResponse | null
  isLoading: boolean
  refreshMe: () => Promise<void>
}

const AuthMeContext = createContext<AuthMeContextValue | undefined>(undefined)

export function AuthMeProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<MeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    try {
      const data = await getMe()
      setMe(data)
    } catch {
      setMe(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshMe()
  }, [refreshMe])

  const value = useMemo(
    () => ({
      me,
      isLoading,
      refreshMe,
    }),
    [me, isLoading, refreshMe]
  )

  return <AuthMeContext.Provider value={value}>{children}</AuthMeContext.Provider>
}

export function useAuthMe() {
  const context = useContext(AuthMeContext)
  if (!context) {
    throw new Error('useAuthMe must be used within AuthMeProvider')
  }

  return context
}
