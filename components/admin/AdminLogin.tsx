'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'
import { LogoMark } from '@/components/Logo'
import { login } from '@/app/admin/actions'
import Turnstile from '@/components/schedule/Turnstile'

export default function AdminLogin() {
  const router = useRouter()
  const [state, action, pending] = useActionState(login, null)
  const [token, setToken] = useState('')

  useEffect(() => {
    if (state && !state.error) router.refresh()
  }, [state, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <LogoMark id="admin-login" tone="light" className="h-12 w-12" />
          <h1 className="mt-4 text-2xl font-extrabold">Admin P3L</h1>
          <p className="mt-1 text-sm text-white/60">Kelola jadwal, konten, dan pendaftar</p>
        </div>

        <form action={action} className="rounded-2xl bg-white p-7 shadow-2xl">
          <label htmlFor="admin-password" className="label">
            Kata sandi
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              aria-invalid={!!state?.error}
              aria-describedby={state?.error ? 'admin-error' : undefined}
              className={`field !pl-10 ${state?.error ? '!border-red-400' : ''}`}
            />
          </div>
          {state?.error && (
            <p id="admin-error" role="alert" className="mt-2 text-sm font-medium text-red-700">
              {state.error}
            </p>
          )}
          {/* Hanya diwajibkan server setelah banyak percobaan gagal; tidak tampil tanpa site key. */}
          <input type="hidden" name="turnstile_token" value={token} />
          <div className="mt-4 empty:hidden">
            <Turnstile onToken={setToken} />
          </div>
          <button type="submit" disabled={pending} className="btn btn-navy mt-5 w-full">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Masuk'}
          </button>
        </form>

        <Link href="/" className="mt-6 block text-center text-sm font-semibold text-white/60 hover:text-white">
          Kembali ke website
        </Link>
      </div>
    </div>
  )
}
