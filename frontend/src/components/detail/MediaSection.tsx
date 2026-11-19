import { useRef, useState } from 'react'
import type { MediaItem } from '../../data/vehicles'
import { uid } from '../../lib/format'
import { Icon } from '../Icon'
import { MediaViewer, Section } from '../ui'
import { btn } from '../styles'

type Filter = 'all' | 'image' | 'video'

function toMedia(files: FileList | null): MediaItem[] {
  return [...(files ?? [])]
    .filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))
    .map((f) => ({
      id: uid(),
      kind: f.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(f),
      name: f.name,
      addedAt: new Date().toISOString(),
    }))
}

export function MediaSection({
  media,
  onAdd,
  onRemove,
}: {
  media: MediaItem[]
  onAdd: (items: MediaItem[]) => void
  onRemove: (id: string) => void
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [viewing, setViewing] = useState<MediaItem | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const add = (files: FileList | null) => {
    const items = toMedia(files)
    if (items.length) onAdd(items)
  }

  const counts = {
    all: media.length,
    image: media.filter((m) => m.kind === 'image').length,
    video: media.filter((m) => m.kind === 'video').length,
  }
  const shown = filter === 'all' ? media : media.filter((m) => m.kind === filter)
  const tabs: [Filter, string][] = [['all', 'All'], ['image', 'Photos'], ['video', 'Videos']]

  return (
    <Section
      title="Photos & videos"
      action={
        <button className={btn.secondary} onClick={() => inputRef.current?.click()}>
          <Icon name="upload" className="text-lg" />
          <span className="hidden sm:inline">Upload</span>
        </button>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          add(e.target.files)
          e.target.value = ''
        }}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          add(e.dataTransfer.files)
        }}
        className={`rounded-lg transition ${dragging ? 'bg-emerald-50 dark:bg-emerald-500/10 ring-2 ring-emerald-500/30' : ''}`}
      >
        {media.length === 0 ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-4 py-10 text-center transition hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5"
          >
            <Icon name="add_photo_alternate" className="text-3xl text-slate-400 dark:text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add photos or videos</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Tap to choose, or drag files here</span>
          </button>
        ) : (
          <>
            <div className="mb-3 inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-medium">
              {tabs.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-md px-3 py-1.5 transition ${
                    filter === key ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {label} <span className="text-slate-400 dark:text-slate-500">{counts[key]}</span>
                </button>
              ))}
            </div>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {shown.map((m) => (
                <li key={m.id} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  <button className="h-full w-full" onClick={() => setViewing(m)} aria-label={`Open ${m.name}`}>
                    {m.kind === 'image' ? (
                      <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <>
                        <video src={m.url} preload="metadata" muted className="h-full w-full object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <Icon name="play_circle" className="text-4xl text-white drop-shadow" />
                        </span>
                      </>
                    )}
                  </button>
                  {m.tag && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {m.tag}
                    </span>
                  )}
                  {!m.tag && (
                    <button
                      onClick={() => confirm('Delete this file?') && onRemove(m.id)}
                      aria-label="Delete"
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Icon name="close" className="text-base" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {viewing && <MediaViewer item={viewing} onClose={() => setViewing(null)} />}
    </Section>
  )
}
