'use client'

import { Check } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import type { Schedule } from '@/lib/types'
import { formatDateRange } from '@/lib/format'
import { programForSchedule } from '@/lib/programs'

export default function SyllabusModal({
  schedule,
  onClose,
  onRegister,
  canRegister = true,
}: {
  schedule: Schedule | null
  onClose: () => void
  onRegister: (s: Schedule) => void
  canRegister?: boolean
}) {
  const program = schedule ? programForSchedule(schedule) : undefined
  const fromDb = (schedule?.syllabus || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean)
  const items = fromDb.length ? fromDb : program?.outcomes ?? []

  return (
    <Modal
      open={!!schedule}
      onClose={onClose}
      size="lg"
      title={program?.outcomesTitle ?? 'Materi pelatihan'}
      description={schedule && `${schedule.title} • ${formatDateRange(schedule.date_start, schedule.date_end)}`}
    >
      {items.length ? (
        <ol className="grid gap-3">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="leading-relaxed text-ink">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted">Materi lengkap untuk kelas ini bisa ditanyakan langsung ke admin melalui WhatsApp.</p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Tutup
        </button>
        {schedule && canRegister && (
          <button type="button" onClick={() => onRegister(schedule)} className="btn btn-primary">
            Daftar kelas ini
          </button>
        )}
      </div>
    </Modal>
  )
}
