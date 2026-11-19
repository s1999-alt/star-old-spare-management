import { useSyncExternalStore } from 'react'

export interface Godown {
  id: string // referenced by Vehicle.godown
  code: string // e.g. "07"
  name: string // e.g. "Sector 4"
  address: string
  manager: string
  phone: string
  capacity: number // max vehicles
}

export type GodownInput = Omit<Godown, 'id'>

const SEED: Godown[] = [
  { id: 'g07', code: '07', name: 'Sector 4', address: 'Plot 22, Sector 4 Industrial Area', manager: 'R. Sharma', phone: '98110 22341', capacity: 40 },
  { id: 'g04', code: '04', name: 'Pune Central', address: 'MIDC Bhosari, Pune', manager: 'S. Kulkarni', phone: '98220 55102', capacity: 30 },
  { id: 'g01', code: '01', name: 'North Sector', address: 'GT Karnal Road, Alipur', manager: 'A. Verma', phone: '98990 77120', capacity: 25 },
  { id: 'g12', code: '12', name: 'South Yard', address: 'Okhla Phase II', manager: 'M. Khan', phone: '98710 30418', capacity: 20 },
]

// In-memory store until a backend exists; changes survive navigation but not a reload.
let godowns = SEED
const listeners = new Set<() => void>()

function commit(next: Godown[]) {
  godowns = next
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const useGodowns = () => useSyncExternalStore(subscribe, () => godowns)

export const createGodown = (input: GodownInput) =>
  commit([...godowns, { ...input, id: `g-${crypto.randomUUID()}` }])

export const updateGodown = (id: string, input: GodownInput) =>
  commit(godowns.map((g) => (g.id === id ? { ...input, id } : g)))

export const deleteGodown = (id: string) => commit(godowns.filter((g) => g.id !== id))

export const godownShort = (g: Godown) => `Godown #${g.code}`
export const godownLabel = (g: Godown) => `${godownShort(g)} - ${g.name}`

/** Look up a godown by id for display; falls back to the raw id if it no longer exists. */
export function useGodownLabel() {
  const list = useGodowns()
  return (id: string, short = false) => {
    const g = list.find((x) => x.id === id)
    return g ? (short ? godownShort(g) : godownLabel(g)) : id
  }
}
