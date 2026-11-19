import { CUT_LABEL, type Vehicle } from '../../data/vehicles'
import { fmtDateTime } from '../../lib/format'
import { useGodownLabel } from '../../lib/godowns'
import { Section } from '../ui'

export function VehicleInfo({ v }: { v: Vehicle }) {
  const godownLabel = useGodownLabel()
  const rows: [string, string, boolean?][] = [
    ['Job ID', `#${v.jobId}`],
    ['Plate', v.plate, true],
    ['VIN', v.vin, true],
    ['Godown', godownLabel(v.godown)],
    ['Bay', v.bay],
    ['Planned cut', CUT_LABEL[v.cutType]],
    ['Inward', fmtDateTime(v.inward)],
  ]
  return (
    <Section title="Vehicle">
      <dl className="flex flex-col gap-3 text-sm">
        {rows.map(([k, val, mono]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="shrink-0 text-slate-500 dark:text-slate-400">{k}</dt>
            <dd className={`min-w-0 break-all text-right text-slate-900 dark:text-slate-100 ${mono ? 'font-mono text-[13px]' : ''}`}>{val}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
