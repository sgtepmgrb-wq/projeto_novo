'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function useIdleTimeout(timeout: number) {
  const [isIdle, setIsIdle] = useState(false)
  const router = useRouter()

  const supabase = useMemo(() => createClient(), [])

  const handleIdle = useCallback(async () => {
    setIsIdle(true)
    console.log('Usuário inativo, deslogando...')
    await supabase.auth.signOut()
    router.push('/login?message=Você foi desconectado por inatividade.')
    router.refresh()
  }, [router, supabase])

  useEffect(() => {
    let timer: NodeJS.Timeout

    const resetTimer = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer)
        timer = setTimeout(handleIdle, timeout)
      }
    }

    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart']

    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }))
    resetTimer()

    return () => {
      clearTimeout(timer)
      events.forEach(event => window.removeEventListener(event, resetTimer))
    }
  }, [timeout, handleIdle])

  return { isIdle }
}
