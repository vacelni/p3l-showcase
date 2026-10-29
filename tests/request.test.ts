import { describe, expect, it } from 'vitest'
import { clientIp, isSameOrigin } from '@/lib/request'

const headers = (values: Record<string, string>) => new Headers(values)

describe('clientIp', () => {
  it('prefers the platform header Vercel rewrites over client-supplied ones', () => {
    expect(clientIp(headers({ 'x-vercel-forwarded-for': '203.0.113.7', 'x-forwarded-for': '1.1.1.1' }))).toBe('203.0.113.7')
  })

  it('takes the first hop of a forwarded chain', () => {
    expect(clientIp(headers({ 'x-forwarded-for': '198.51.100.4, 10.0.0.1' }))).toBe('198.51.100.4')
  })

  it('unwraps IPv4-mapped IPv6 addresses so both forms share one rate-limit bucket', () => {
    expect(clientIp(headers({ 'x-real-ip': '::ffff:192.0.2.10' }))).toBe('192.0.2.10')
  })

  it('collapses an IPv6 address to its /64 so rotating within the block does not reset the limit', () => {
    const a = clientIp(headers({ 'x-real-ip': '2001:db8:abcd:12:1111:2222:3333:4444' }))
    const b = clientIp(headers({ 'x-real-ip': '2001:db8:abcd:12::9' }))
    expect(a).toBe('2001:db8:abcd:12::/64')
    expect(b).toBe(a)
  })

  it('expands a compressed prefix before cutting it', () => {
    expect(clientIp(headers({ 'x-real-ip': '2001:db8::1' }))).toBe('2001:db8:0:0::/64')
  })

  it('ignores a zone index', () => {
    expect(clientIp(headers({ 'x-real-ip': 'fe80::1%eth0' }))).toBe('fe80:0:0:0::/64')
  })

  it('falls back to "unknown" without any address header', () => {
    expect(clientIp(headers({}))).toBe('unknown')
  })
})

describe('isSameOrigin', () => {
  it('accepts a POST whose Origin matches the host', () => {
    expect(isSameOrigin(headers({ origin: 'https://p3l.example', host: 'p3l.example' }))).toBe(true)
  })

  it('uses the forwarded host behind a proxy', () => {
    expect(isSameOrigin(headers({ origin: 'https://p3l.example', host: 'internal:3000', 'x-forwarded-host': 'p3l.example' }))).toBe(true)
  })

  it('rejects a cross-site POST', () => {
    expect(isSameOrigin(headers({ origin: 'https://evil.example', host: 'p3l.example' }))).toBe(false)
  })

  it('rejects a request without Origin', () => {
    expect(isSameOrigin(headers({ host: 'p3l.example' }))).toBe(false)
  })

  it('rejects a malformed Origin', () => {
    expect(isSameOrigin(headers({ origin: 'not a url', host: 'p3l.example' }))).toBe(false)
  })
})
