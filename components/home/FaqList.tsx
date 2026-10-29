import { Plus } from 'lucide-react'

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-bold text-navy-900 [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus className="h-5 w-5 shrink-0 text-green-700 transition-transform group-open:rotate-45" />
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
