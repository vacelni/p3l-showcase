'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Dialog berbasis <dialog> native: fokus terkunci di dalam, tombol Esc menutup, latar tidak bisa di-scroll.
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  dismissible = true,
}: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  size?: 'md' | 'lg' | 'xl'
  dismissible?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const width = size === 'xl' ? 'max-w-4xl' : size === 'lg' ? 'max-w-2xl' : 'max-w-xl'

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        if (dismissible) onClose()
      }}
      onClick={(e) => {
        if (dismissible && e.target === ref.current) onClose()
      }}
      className={`m-auto max-h-[92dvh] w-[calc(100%-2rem)] ${width} overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-navy-950/60 backdrop:backdrop-blur-[2px] open:animate-in open:fade-in-0 open:zoom-in-95`}
    >
      {open && (
        <div className="flex max-h-[92dvh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold leading-snug text-navy-900">{title}</h2>
              {description && <div className="mt-1 text-sm text-muted">{description}</div>}
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="-mr-2 -mt-1 shrink-0 rounded-lg p-2 text-muted hover:bg-paper hover:text-navy-900"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
        </div>
      )}
    </dialog>
  )
}
