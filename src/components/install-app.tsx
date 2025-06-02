/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect, useState } from 'react'

export default function InstallButton({children}:{children:React.ReactNode}) {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()

    if (!deferredPrompt) return

    // Cast to real PromptEvent because TS hates us
    const promptEvent = deferredPrompt as any
    promptEvent.prompt()

    const result = await promptEvent.userChoice
    console.log('User choice:', result)

    // Reset after prompting
    setDeferredPrompt(null)
    setCanInstall(false)
  }

  return (
    <button
      onClick={handleInstall}
      disabled={!canInstall}
    >
      {canInstall ? children: ''}
    </button>
  )
}
