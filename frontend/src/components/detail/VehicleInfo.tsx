import { CUT_LABEL, GODOWNS, type Vehicle } from '../../data/vehicles'
import { fmtDateTime } from '../../lib/format'
import { Section } from '../ui'

export function VehicleInfo({ v }: { v: Vehicle }) {
  const rows: [string, string, boolean?][] = [
    ['Job ID', `#${v.jobId}`],
    ['Plate', v.plate, true],
    ['VIN', v.vin, true],
    ['Godown', GODOWNS[v.godown] ?? v.godown],
    ['Bay', v.bay],
    ['Planned cut', CUT_LABEL[v.cutType]],
    ['Inward', fmtDateTime(v.inward)],
  ]
  return (
    <Section title="Vehicle">
      <dl className="flex flex-col gap-3 text-sm">
        {rows.map(([k, val, mono]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="shrink-0 text-slate-500">{k}</dt>
            <dd className={`min-w-0 break-all text-right text-slate-900 ${mono ? 'font-mono text-[13px]' : ''}`}>{val}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
