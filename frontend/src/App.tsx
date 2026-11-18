import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { VEHICLES, type Vehicle } from './data/vehicles'
import { useHash } from './lib/route'
import { VehicleDetailPage } from './pages/VehicleDetailPage'
import { VehicleListPage } from './pages/VehicleListPage'

function App() {
  // In-memory store until a backend exists; edits survive navigation but not a reload.
  const [vehicles, setVehicles] = useState(VEHICLES)
  const hash = useHash()
  const match = hash.match(/^#\/vehicles\/([^/]+)$/)
  const jobId = match ? decodeURIComponent(match[1]) : null
  const current = jobId ? vehicles.find((v) => v.jobId === jobId) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [jobId])

  const update = (id: string) => (fn: (v: Vehicle) => Vehicle) =>
    setVehicles((vs) => vs.map((v) => (v.jobId === id ? fn(v) : v)))

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased">
      <Header />
      {/* List stays mounted (hidden) so filters and page survive a round-trip to a detail page. */}
      <div className={jobId ? 'hidden' : 'flex flex-1 flex-col'}>
        <VehicleListPage vehicles={vehicles} />
      </div>
      {jobId &&
        (current ? (
          <VehicleDetailPage key={current.jobId} vehicle={current} onUpdate={update(current.jobId)} />
        ) : (
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-2 px-4 py-20 text-center">
            <p className="text-slate-500">Vehicle #{jobId} not found.</p>
            <a href="#/" className="text-sm font-medium text-emerald-700 hover:underline">
              Back to vehicles
            </a>
          </main>
        ))}
    </div>
  )
}

export default App
