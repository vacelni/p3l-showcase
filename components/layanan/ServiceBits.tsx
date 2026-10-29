import { ClipboardList } from 'lucide-react'
import { consultationData, engagementSteps } from '@/lib/content'

export function EngagementSteps() {
  return (
    <ol className="grid gap-8 sm:grid-cols-2">
      {engagementSteps.map((s, i) => (
        <li key={s.title}>
          <span className="tabular flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-green-600 text-lg font-extrabold text-green-700">
            {i + 1}
          </span>
          <h3 className="mt-4 text-lg font-bold text-navy-900">{s.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  )
}

export function PrepChecklist() {
  return (
    <div className="rounded-2xl bg-paper p-6">
      <h2 className="flex items-center gap-2 font-extrabold text-navy-900">
        <ClipboardList className="h-5 w-5 text-green-700" /> Data yang membantu diskusi awal
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Tidak harus lengkap. Kirim yang sudah ada, kami bantu melengkapi sisanya.</p>
      <ul className="mt-4 space-y-3">
        {consultationData.map((d) => (
          <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-ink">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  )
}
