import { useMemo, useState } from 'react'
import { FilterBar, type Filters } from '../components/FilterBar'
import { Pagination } from '../components/Pagination'
import { VehicleCard, VehicleRow } from '../components/VehicleRow'
import type { Vehicle } from '../data/vehicles'

const COLUMNS = ['Vehicle', 'Location', 'Cut', 'Inward', 'Status', 'Media & docs', '']

export function VehicleListPage({ vehicles }: { vehicles: Vehicle[] }) {
  const [filters, setFilters] = useState<Filters>({ query: '', godown: 'all', cutType: 'all' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return vehicles.filter(
      (v) =>
        (filters.godown === 'all' || v.godown === filters.godown) &&
        (filters.cutType === 'all' || v.cutType === filters.cutType) &&
        (!q || [v.name, v.jobId, v.plate, v.vin].some((s) => s.toLowerCase().includes(q))),
    )
  }, [filters, vehicles])

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Vehicles</h1>
          <span className="text-sm text-slate-500">{filtered.length} total</span>
        </div>
        <FilterBar
          filters={filters}
          onChange={(f) => {
            setFilters(f)
            setPage(1)
          }}
        />
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          {/* Mobile: cards */}
          <ul className="divide-y divide-slate-100 md:hidden">
            {rows.map((v) => (
              <VehicleCard key={v.jobId} v={v} />
            ))}
          </ul>

          {/* Tablet/desktop: table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-medium text-slate-400">
                  {COLUMNS.map((c, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`py-3 ${i === 0 ? 'px-5' : 'px-3'} ${i === 5 ? 'hidden xl:table-cell' : ''}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((v) => (
                  <VehicleRow key={v.jobId} v={v} />
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 && (
            <div className="px-4 py-14 text-center text-sm text-slate-400">No vehicles match your filters.</div>
          )}

          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPage={setPage}
            onPageSize={(n) => {
              setPageSize(n)
              setPage(1)
            }}
          />
        </div>
    </main>
  )
}
