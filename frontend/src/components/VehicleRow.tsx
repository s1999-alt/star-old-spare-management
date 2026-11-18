import { GODOWNS, type StatusTone, type Vehicle } from '../data/vehicles'
import { isOwnerComplete } from '../lib/ids'
import { navigate, vehiclePath } from '../lib/route'
import { Icon } from './Icon'

const DOT: Record<StatusTone, string> = {
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  slate: 'bg-slate-400',
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const godownName = (v: Vehicle) => GODOWNS[v.godown]?.split(' - ')[0] ?? ''
const cutLabel = (v: Vehicle) => (v.cutType === 'full' ? 'Full cut' : 'Chassis cut')

export function Status({ v }: { v: Vehicle }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-700">
      <span className={`h-2 w-2 rounded-full ${DOT[v.status.tone]} ${v.status.pulse ? 'animate-pulse' : ''}`} />
      {v.status.label}
    </span>
  )
}

function Docs({ v }: { v: Vehicle }) {
  const ok = isOwnerComplete(v.owner)
  return (
    <span className="inline-flex items-center gap-3 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1" title="Photos & videos">
        <Icon name="photo_library" className="text-base" />
        {v.media.length}
      </span>
      <span className={`inline-flex items-center gap-1 ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>
        <Icon name={ok ? 'verified' : 'pending'} className="text-base" />
        {ok ? 'Docs OK' : 'Docs pending'}
      </span>
    </span>
  )
}

function Title({ v }: { v: Vehicle }) {
  return (
    <div className="min-w-0">
      <a
        href={`#${vehiclePath(v.jobId)}`}
        className="block truncate font-medium text-slate-900 hover:text-emerald-700"
        title={v.vin}
        onClick={(e) => e.stopPropagation()}
      >
        {v.name}
      </a>
      <div className="mt-0.5 text-xs text-slate-500">
        <span className="text-emerald-700">#{v.jobId}</span>
        <span className="mx-1.5 text-slate-300">·</span>
        <span className="font-mono">{v.plate}</span>
      </div>
    </div>
  )
}

/** Desktop table row. */
export function VehicleRow({ v }: { v: Vehicle }) {
  return (
    <tr
      className="group cursor-pointer transition-colors hover:bg-slate-50"
      onClick={() => navigate(vehiclePath(v.jobId))}
    >
      <td className="px-5 py-4"><Title v={v} /></td>
      <td className="whitespace-nowrap px-3 py-4">
        <div className="text-sm text-slate-800">{godownName(v)}</div>
        <div className="text-xs text-slate-500">{v.bay.split(' (')[0]}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">{cutLabel(v)}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">{fmtDate(v.inward)}</td>
      <td className="whitespace-nowrap px-3 py-4"><Status v={v} /></td>
      <td className="hidden whitespace-nowrap px-3 py-4 xl:table-cell"><Docs v={v} /></td>
      <td className="w-10 pr-4 text-right">
        <Icon name="chevron_right" className="text-xl text-slate-300 transition group-hover:text-emerald-600" />
      </td>
    </tr>
  )
}

/** Mobile card. */
export function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <li
      className="flex cursor-pointer flex-col gap-3 px-4 py-4 active:bg-slate-50"
      onClick={() => navigate(vehiclePath(v.jobId))}
    >
      <div className="flex items-start justify-between gap-3">
        <Title v={v} />
        <Status v={v} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-500">
        <span>{godownName(v)} · {v.bay.split(' (')[0]} · {cutLabel(v)}</span>
        <span>{fmtDate(v.inward)}</span>
      </div>
      <Docs v={v} />
    </li>
  )
}
