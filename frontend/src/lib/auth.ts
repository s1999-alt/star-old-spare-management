import { useSyncExternalStore } from 'react'

export type User = { name: string; email: string; role: string }

const KEY = 'scrapvault.user'
const listeners = new Set<() => void>()

let cached: User | null = read()

function read(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function set(user: User | null) {
  if (user) localStorage.setItem(KEY, JSON.stringify(user))
  else localStorage.removeItem(KEY)
  cached = user
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const useUser = () => useSyncExternalStore(subscribe, () => cached)

const nameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ')

// Placeholder until a backend exists: accepts any well-formed email with a 6+ char password.
// Replace the body with a real API call; keep the signature.
export async function signIn(email: string, password: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 500))
  if (password.length < 6) throw new Error('Incorrect email or password.')
  const user: User = { name: nameFromEmail(email) || email, email, role: 'Yard Lead' }
  set(user)
  return user
}

export const signOut = () => set(null)

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
