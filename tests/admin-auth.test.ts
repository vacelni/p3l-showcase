import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkPassword, createSessionToken, verifySessionToken } from '@/lib/admin-auth'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

beforeEach(() => {
  vi.stubEnv('ADMIN_PASSWORD', 'correct horse battery staple')
  vi.stubEnv('ADMIN_SESSION_SECRET', 'test-session-secret')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('checkPassword', () => {
  it('accepts the configured password only', () => {
    expect(checkPassword('correct horse battery staple')).toBe(true)
    expect(checkPassword('correct horse battery stapl')).toBe(false)
    expect(checkPassword('')).toBe(false)
  })

  it('refuses every login when no password is configured', () => {
    vi.stubEnv('ADMIN_PASSWORD', '')
    expect(checkPassword('')).toBe(false)
  })
})

describe('session token', () => {
  it('verifies a freshly issued token for 12 hours', () => {
    const { token, maxAge } = createSessionToken()
    expect(maxAge).toBe(12 * 3600)
    expect(verifySessionToken(token)).toBe(true)
  })

  it('rejects a token whose expiry was edited', () => {
    const { token } = createSessionToken()
    const [, signature] = token.split('.')
    const forged = `${Date.now() + 10 * 365 * 86_400_000}.${signature}`
    expect(verifySessionToken(forged)).toBe(false)
  })

  it('rejects an expired token', () => {
    vi.useFakeTimers()
    const { token } = createSessionToken()
    vi.advanceTimersByTime(12 * 3_600_000 + 1)
    expect(verifySessionToken(token)).toBe(false)
  })

  it('rejects every token after the session secret rotates', () => {
    const { token } = createSessionToken()
    vi.stubEnv('ADMIN_SESSION_SECRET', 'rotated-secret')
    expect(verifySessionToken(token)).toBe(false)
  })

  it('rejects missing and malformed tokens', () => {
    expect(verifySessionToken(undefined)).toBe(false)
    expect(verifySessionToken('')).toBe(false)
    expect(verifySessionToken('no-dot')).toBe(false)
  })
})
