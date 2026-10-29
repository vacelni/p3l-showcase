'use client'

import { useEffect, useRef } from 'react'

// Cloudflare Turnstile (pengganti CAPTCHA, tanpa teka-teki). Hanya tampil jika
// NEXT_PUBLIC_TURNSTILE_SITE_KEY di-set; tanpa kunci, formulir tetap berjalan seperti biasa.

export const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadScript() {
  return new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile)
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => (window.turnstile ? resolve(window.turnstile) : reject()))
    script.addEventListener('error', () => reject())
  })
}

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const callback = useRef(onToken)
  useEffect(() => {
    callback.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!TURNSTILE_ENABLED) return
    let widgetId: string | undefined
    let cancelled = false
    loadScript()
      .then((api) => {
        if (cancelled || !ref.current) return
        widgetId = api.render(ref.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          language: 'id',
          callback: (t: string) => callback.current(t),
          'expired-callback': () => callback.current(''),
          'error-callback': () => callback.current(''),
        })
      })
      .catch(() => callback.current(''))
    return () => {
      cancelled = true
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [])

  if (!TURNSTILE_ENABLED) return null
  return <div ref={ref} className="min-h-[65px]" />
}
