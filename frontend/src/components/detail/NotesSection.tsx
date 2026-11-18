import { useState } from 'react'
import type { Note } from '../../data/vehicles'
import { fmtDateTime } from '../../lib/format'
import { Section } from '../ui'
import { btn } from '../styles'

const initials = (name: string) =>
  name.split(/[\s.]+/).filter(Boolean).slice(-2).map((p) => p[0]).join('').toUpperCase()

export function NotesSection({ notes, onAdd }: { notes: Note[]; onAdd: (text: string) => void }) {
  const [text, setText] = useState('')
  const submit = () => {
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <Section title="Notes">
      <div className="flex flex-col gap-2">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
          }}
          placeholder="Add a note…"
          className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
        />
        <div className="flex items-center justify-between">
          <span className="hidden text-xs text-slate-400 sm:inline">Ctrl / ⌘ + Enter to add</span>
          <button className={`${btn.primary} ml-auto`} disabled={!text.trim()} onClick={submit}>
            Add note
          </button>
        </div>
      </div>

      {notes.length > 0 && (
        <ul className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5">
          {notes.map((n) => (
            <li key={n.id} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                {initials(n.author)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-medium text-slate-900">{n.author}</span>
                  <span className="text-xs text-slate-400">{fmtDateTime(n.createdAt)}</span>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-slate-700">{n.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
