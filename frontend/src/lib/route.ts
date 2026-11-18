import { useSyncExternalStore } from 'react'

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export const useHash = () => useSyncExternalStore(subscribe, () => window.location.hash)

export const navigate = (path: string) => {
  window.location.hash = path
}

export const vehiclePath = (jobId: string) => `/vehicles/${encodeURIComponent(jobId)}`
