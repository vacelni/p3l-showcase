import { Fragment, type ReactNode } from 'react'
import { slugify } from '@/lib/format'

// Format penulisan sederhana untuk isi artikel (diketik admin di textarea):
//   ## Subjudul        ### Sub-subjudul
//   - butir daftar     1. daftar bernomor
//   **tebal**          [teks link](https://alamat)
// Baris biasa menjadi paragraf. Semua teks dirender sebagai React node (tanpa HTML mentah), jadi aman dari XSS.

type Heading = { type: 'h2' | 'h3'; text: string; id: string }
type Block =
  | Heading
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }

export function parseArticle(source: string): Block[] {
  const blocks: Block[] = []
  const used = new Set<string>()
  const uniqueId = (text: string) => {
    let id = slugify(text) || 'bagian'
    for (let n = 2; used.has(id); n++) id = `${slugify(text)}-${n}`
    used.add(id)
    return id
  }

  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    const heading = line.match(/^(#{2,3})\s+(.+)$/)
    const bullet = line.match(/^[-*•]\s+(.+)$/)
    const numbered = line.match(/^\d+[.)]\s+(.+)$/)
    const last = blocks[blocks.length - 1]

    if (heading) {
      const text = heading[2].replace(/#+$/, '').trim()
      blocks.push({ type: heading[1].length === 2 ? 'h2' : 'h3', text, id: uniqueId(text) })
    } else if (bullet) {
      if (last?.type === 'ul') last.items.push(bullet[1])
      else blocks.push({ type: 'ul', items: [bullet[1]] })
    } else if (numbered) {
      if (last?.type === 'ol') last.items.push(numbered[1])
      else blocks.push({ type: 'ol', items: [numbered[1]] })
    } else {
      blocks.push({ type: 'p', text: line.replace(/^#\s+/, '') })
    }
  }
  return blocks
}

export const sectionHeadings = (blocks: Block[]) => blocks.filter((b): b is Heading => b.type === 'h2')

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/(?![/\\])[^\s)]*)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) {
      parts.push(<strong key={m.index}>{m[1]}</strong>)
    } else {
      const internal = m[3].startsWith('/')
      parts.push(
        <a
          key={m.index}
          href={m[3]}
          className="font-semibold text-green-700 underline underline-offset-2 hover:text-green-800"
          {...(!internal && { target: '_blank', rel: 'noopener noreferrer nofollow' })}
        >
          {m[2]}
        </a>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-p3l text-[1.125rem] text-ink xl:text-[1.1875rem]">
      {blocks.map((b, i) => (
        <Fragment key={i}>
          {b.type === 'h2' && (
            <h2 id={b.id} className="mb-4 mt-12 scroll-mt-28 text-2xl font-extrabold leading-snug text-navy-900">
              {inline(b.text)}
            </h2>
          )}
          {b.type === 'h3' && (
            <h3 id={b.id} className="mb-3 mt-8 scroll-mt-28 text-xl font-bold leading-snug text-navy-900">
              {inline(b.text)}
            </h3>
          )}
          {b.type === 'p' && <p>{inline(b.text)}</p>}
          {b.type === 'ul' && (
            <ul className="mb-[1.15em] list-disc space-y-2 pl-6 leading-relaxed marker:text-green-600">
              {b.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          )}
          {b.type === 'ol' && (
            <ol className="mb-[1.15em] list-decimal space-y-2 pl-6 leading-relaxed marker:font-bold marker:text-green-700">
              {b.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ol>
          )}
        </Fragment>
      ))}
    </div>
  )
}
