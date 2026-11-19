import { CutMilestones } from '../components/detail/CutMilestones'
import { MediaSection } from '../components/detail/MediaSection'
import { NotesSection } from '../components/detail/NotesSection'
import { OwnerDocuments } from '../components/detail/OwnerDocuments'
import { VehicleInfo } from '../components/detail/VehicleInfo'
import { Icon } from '../components/Icon'
import { Status } from '../components/VehicleRow'
import { CURRENT_USER, CUT_LABEL, type Vehicle } from '../data/vehicles'
import { uid } from '../lib/format'

export function VehicleDetailPage({
  vehicle: v,
  onUpdate,
}: {
  vehicle: Vehicle
  onUpdate: (fn: (v: Vehicle) => Vehicle) => void
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
      <a href="#/" className="inline-flex items-center gap-1 self-start text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
        <Icon name="arrow_back" className="text-lg" /> Vehicles
      </a>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">{v.name}</h1>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            <span className="text-emerald-700 dark:text-emerald-400">#{v.jobId}</span>
            <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
            <span className="font-mono">{v.plate}</span>
          </div>
        </div>
        <Status v={v} />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <CutMilestones
            vehicle={v}
            onMark={(kind, date, file, url) =>
              onUpdate((cur) => {
                const video = {
                  id: uid(),
                  kind: 'video' as const,
                  url,
                  name: file.name,
                  addedAt: new Date().toISOString(),
                  tag: CUT_LABEL[kind],
                }
                const record = { date, videoId: video.id }
                return {
                  ...cur,
                  media: [video, ...cur.media],
                  ...(kind === 'chassis' ? { chassisCut: record } : { fullCut: record }),
                }
              })
            }
            onUndo={(kind) =>
              onUpdate((cur) => {
                const record = kind === 'chassis' ? cur.chassisCut : cur.fullCut
                return {
                  ...cur,
                  // keep the video but untag it so it can be deleted normally
                  media: cur.media.map((m) => (m.id === record?.videoId ? { ...m, tag: undefined } : m)),
                  ...(kind === 'chassis' ? { chassisCut: undefined } : { fullCut: undefined }),
                }
              })
            }
          />
          <MediaSection
            media={v.media}
            onAdd={(items) => onUpdate((cur) => ({ ...cur, media: [...items, ...cur.media] }))}
            onRemove={(id) => onUpdate((cur) => ({ ...cur, media: cur.media.filter((m) => m.id !== id) }))}
          />
          <NotesSection
            notes={v.notes}
            onAdd={(text) =>
              onUpdate((cur) => ({
                ...cur,
                notes: [{ id: uid(), text, author: CURRENT_USER, createdAt: new Date().toISOString() }, ...cur.notes],
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-4">
          <OwnerDocuments
            owner={v.owner}
            plate={v.plate}
            onSave={(owner) => onUpdate((cur) => ({ ...cur, owner }))}
          />
          <VehicleInfo v={v} />
        </div>
      </div>
    </main>
  )
}
