import { useState } from 'react'
import { CUT_LABEL, type CutKind, type MediaItem, type Vehicle } from '../../data/vehicles'
import { fmtDateTime, nowLocal } from '../../lib/format'
import { Icon } from '../Icon'
import { MediaViewer, Modal, Section } from '../ui'
import { btn, input } from '../styles'

const KINDS: CutKind[] = ['chassis', 'full']

export function CutMilestones({
  vehicle,
  onMark,
  onUndo,
}: {
  vehicle: Vehicle
  onMark: (kind: CutKind, date: string, file: File, url: string) => void
  onUndo: (kind: CutKind) => void
}) {
  const [marking, setMarking] = useState<CutKind | null>(null)
  const [viewing, setViewing] = useState<MediaItem | null>(null)

  return (
    <Section title="Cutting" description="Each cut needs a video as proof.">
      <ul className="-my-3 divide-y divide-slate-100 dark:divide-slate-800">
        {KINDS.map((kind) => {
          const record = kind === 'chassis' ? vehicle.chassisCut : vehicle.fullCut
          const video = record && vehicle.media.find((m) => m.id === record.videoId)
          return (
            <li key={kind} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    record ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <Icon name={record ? 'check' : 'content_cut'} className="text-lg" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{CUT_LABEL[kind]}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {record ? `Done on ${fmtDateTime(record.date)}` : 'Not done yet'}
                  </div>
                </div>
              </div>
              {record ? (
                <div className="flex gap-1 pl-12 sm:pl-0">
                  {video && (
                    <button className={btn.ghost} onClick={() => setViewing(video)}>
                      <Icon name="play_circle" className="text-lg" /> Video
                    </button>
                  )}
                  <button
                    className={btn.ghost}
                    onClick={() => {
                      if (confirm(`Undo ${CUT_LABEL[kind].toLowerCase()}? The video stays in the gallery.`))
                        onUndo(kind)
                    }}
                  >
                    Undo
                  </button>
                </div>
              ) : (
                <button className={`${btn.primary} w-full sm:w-auto`} onClick={() => setMarking(kind)}>
                  Mark as done
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {marking && (
        <MarkCutModal
          kind={marking}
          onClose={() => setMarking(null)}
          onConfirm={(date, file, url) => {
            onMark(marking, date, file, url)
            setMarking(null)
          }}
        />
      )}
      {viewing && <MediaViewer item={viewing} onClose={() => setViewing(null)} />}
    </Section>
  )
}

function MarkCutModal({
  kind,
  onClose,
  onConfirm,
}: {
  kind: CutKind
  onClose: () => void
  onConfirm: (date: string, file: File, url: string) => void
}) {
  const [date, setDate] = useState(nowLocal)
  const [pick, setPick] = useState<{ file: File; url: string } | null>(null)

  const choose = (file: File | undefined) => {
    if (pick) URL.revokeObjectURL(pick.url)
    setPick(file ? { file, url: URL.createObjectURL(file) } : null)
  }
  const close = () => {
    if (pick) URL.revokeObjectURL(pick.url)
    onClose()
  }

  const label = CUT_LABEL[kind]

  return (
    <Modal
      title={`Mark ${label.toLowerCase()} as done`}
      onClose={close}
      footer={
        <>
          <button className={btn.secondary} onClick={close}>
            Cancel
          </button>
          <button
            className={btn.primary}
            disabled={!pick || !date}
            onClick={() => pick && onConfirm(new Date(date).toISOString(), pick.file, pick.url)}
          >
            Confirm
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label} date</span>
          <input
            type="datetime-local"
            className={input}
            value={date}
            max={nowLocal()}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Video <span className="font-normal text-slate-400 dark:text-slate-500">(required)</span>
          </span>
          {pick ? (
            <div className="flex flex-col gap-2">
              <video src={pick.url} controls className="aspect-video w-full rounded-lg bg-black" />
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="truncate">{pick.file.name}</span>
                <label className="cursor-pointer font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                  Replace
                  <input type="file" accept="video/*" className="sr-only" onChange={(e) => choose(e.target.files?.[0])} />
                </label>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-4 py-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5">
              <Icon name="videocam" className="text-3xl text-slate-400 dark:text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Record or choose a video</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Shows the {label.toLowerCase()} being done</span>
              <input type="file" accept="video/*" className="sr-only" onChange={(e) => choose(e.target.files?.[0])} />
            </label>
          )}
        </div>
      </div>
    </Modal>
  )
}
