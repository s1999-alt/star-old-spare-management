import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { VEHICLES, type Vehicle } from './data/vehicles'
import { useUser } from './lib/auth'
import { useHash } from './lib/route'
import { GodownsPage } from './pages/GodownsPage'
import { LoginPage } from './pages/LoginPage'
import { VehicleDetailPage } from './pages/VehicleDetailPage'
import { VehicleListPage } from './pages/VehicleListPage'

function App() {
  // In-memory store until a backend exists; edits survive navigation but not a reload.
  const user = useUser()
  const [vehicles, setVehicles] = useState(VEHICLES)
  const hash = useHash()
  const match = hash.match(/^#\/vehicles\/([^/]+)$/)
  const jobId = match ? decodeURIComponent(match[1]) : null
  const current = jobId ? vehicles.find((v) => v.jobId === jobId) : undefined
  const onGodowns = hash === '#/godowns'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [jobId, onGodowns])

  const update = (id: string) => (fn: (v: Vehicle) => Vehicle) =>
    setVehicles((vs) => vs.map((v) => (v.jobId === id ? fn(v) : v)))

  if (!user) return <LoginPage />

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 antialiased lg:flex-row">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* List stays mounted (hidden) so filters and page survive a round-trip to a detail page. */}
        <div className={jobId || onGodowns ? 'hidden' : 'flex flex-1 flex-col'}>
          <VehicleListPage vehicles={vehicles} />
        </div>
        {onGodowns && <GodownsPage vehicles={vehicles} />}
        {jobId &&
          (current ? (
            <VehicleDetailPage key={current.jobId} vehicle={current} onUpdate={update(current.jobId)} />
          ) : (
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-2 px-4 py-20 text-center">
              <p className="text-slate-500 dark:text-slate-400">Vehicle #{jobId} not found.</p>
              <a href="#/" className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                Back to vehicles
              </a>
            </main>
          ))}
      </div>
    </div>
  )
}

export default App
