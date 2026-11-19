import { useEffect, type ReactNode } from 'react'
import { Icon } from './Icon'
import { btn } from './styles'

export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        {action}
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 dark:bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white dark:bg-slate-900 shadow-xl sm:rounded-2xl ${wide ? 'sm:max-w-3xl' : 'sm:max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button className={btn.ghost} onClick={onClose} aria-label="Close">
            <Icon name="close" className="text-xl" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 px-5 py-3.5">{footer}</div>
        )}
      </div>
    </div>
  )
}

/** Full-size viewer for a photo or video. */
export function MediaViewer({
  item,
  onClose,
}: {
  item: { kind: 'image' | 'video'; url: string; name: string }
  onClose: () => void
}) {
  return (
    <Modal title={item.name} onClose={onClose} wide>
      {item.kind === 'video' ? (
        <video src={item.url} controls autoPlay className="max-h-[70vh] w-full rounded-lg bg-black" />
      ) : (
        <img src={item.url} alt={item.name} className="max-h-[70vh] w-full rounded-lg object-contain" />
      )}
    </Modal>
  )
}
