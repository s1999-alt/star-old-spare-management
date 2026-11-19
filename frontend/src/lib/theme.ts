import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'

// Keep in sync with the inline script in index.html, which applies the theme before first paint.
const KEY = 'scrapvault.theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set<() => void>()

function read(): Theme {
  const v = localStorage.getItem(KEY)
  return v === 'light' || v === 'dark' ? v : 'system'
}

let theme = read()

function apply() {
  const dark = theme === 'dark' || (theme === 'system' && media.matches)
  document.documentElement.classList.toggle('dark', dark)
}

media.addEventListener('change', () => theme === 'system' && apply())

export function setTheme(next: Theme) {
  if (next === 'system') localStorage.removeItem(KEY)
  else localStorage.setItem(KEY, next)
  theme = next
  apply()
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const useTheme = () => useSyncExternalStore(subscribe, () => theme)
