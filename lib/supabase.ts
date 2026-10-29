import { createClient } from '@supabase/supabase-js'
import type { Insight, Schedule } from '@/lib/types'
import { idFromInsightSlug, parseLooseDate, todayISO } from '@/lib/format'

// Klien publik (anon key) — hanya untuk MEMBACA data yang memang tampil di website.
// Operasi admin & pendaftaran memakai klien server di lib/supabase-admin.ts.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

// Jadwal aktif yang belum lewat, urut dari yang paling dekat.
export async function getSchedules(): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('is_active', true)
    .gte('date_end', todayISO())
    .order('date_start', { ascending: true })

  if (error) {
    console.error('Error mengambil data jadwal:', error)
    return []
  }
  return data ?? []
}

// Berita, artikel, dan event yang aktif, terbaru di atas.
export async function getInsights(): Promise<Insight[]> {
  const { data, error } = await supabase.from('insights').select('*').order('id', { ascending: false })

  if (error) {
    console.error('Error mengambil data artikel & berita:', error)
    return []
  }
  return (data ?? [])
    .filter((i: Insight) => i.is_active !== false)
    .sort((a: Insight, b: Insight) => {
      const da = parseLooseDate(a.date)?.getTime() ?? 0
      const db = parseLooseDate(b.date)?.getTime() ?? 0
      return db - da
    })
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const id = idFromInsightSlug(slug)
  if (id === null) return null
  const { data, error } = await supabase.from('insights').select('*').eq('id', id).maybeSingle()
  if (error || !data || data.is_active === false) return null
  return data
}
