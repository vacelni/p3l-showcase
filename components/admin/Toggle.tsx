'use client'

export default function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-semibold text-muted hover:bg-paper disabled:cursor-wait disabled:opacity-60"
    >
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-line'}`}>
        <span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </span>
      <span className="min-w-[6.25rem] text-left">{label}</span>
    </button>
  )
}
