import { godownLabel, useGodowns } from '../lib/godowns'
import { Icon } from './Icon'

export interface Filters {
  query: string
  godown: string
  cutType: string
}

const field =
  'h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15'

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative min-w-0 flex-1 sm:flex-none">
      <select
        className={`${field} w-full cursor-pointer appearance-none pl-3 pr-8`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      <Icon name="expand_more" className="pointer-events-none absolute right-2 top-2.5 text-xl text-slate-400 dark:text-slate-500" />
    </div>
  )
}

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const godowns = useGodowns()
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 text-xl text-slate-400 dark:text-slate-500" />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Search VIN, plate or job ID"
          className={`${field} w-full pl-10 pr-3 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
        />
      </div>
      <div className="flex gap-2">
        <Select value={filters.godown} onChange={(godown) => set({ godown })}>
          <option value="all">All godowns</option>
          {godowns.map((g) => (
            <option key={g.id} value={g.id}>{godownLabel(g)}</option>
          ))}
        </Select>
        <Select value={filters.cutType} onChange={(cutType) => set({ cutType })}>
          <option value="all">All cuts</option>
          <option value="full">Full cut</option>
          <option value="chassis">Chassis cut</option>
        </Select>
      </div>
    </div>
  )
}
