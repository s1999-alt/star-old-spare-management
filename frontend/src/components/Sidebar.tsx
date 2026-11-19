import { useEffect, useState } from 'react'
import { initials, signOut, type User } from '../lib/auth'
import { useHash } from '../lib/route'
import { Icon } from './Icon'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { href: '#/', label: 'Vehicles', icon: 'directions_car', active: (h: string) => !h.startsWith('#/godowns') },
  { href: '#/godowns', label: 'Godowns', icon: 'warehouse', active: (h: string) => h.startsWith('#/godowns') },
]

function Brand() {
  return (
    <a className="flex items-center gap-2" href="#/">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">
        <Icon name="recycling" className="text-lg" />
      </div>
      <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">ScrapVault</span>
    </a>
  )
}

function Nav({ hash, onNavigate }: { hash: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const on = n.active(hash)
        return (
          <a
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            aria-current={on ? 'page' : undefined}
            className={`flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition ${
              on ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon name={n.icon} className="text-xl" />
            {n.label}
          </a>
        )
      })}
    </nav>
  )
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        {initials(user.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium leading-tight text-slate-900 dark:text-slate-100">{user.name}</div>
        <div className="truncate text-xs text-slate-500 dark:text-slate-400">{user.role}</div>
      </div>
      <button
        type="button"
        onClick={signOut}
        title="Sign out"
        aria-label="Sign out"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
      >
        <Icon name="logout" className="text-lg" />
      </button>
    </div>
  )
}

function Panel({ user, hash, onNavigate }: { user: User; hash: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 px-3 py-4">
      <div className="px-2">
        <Brand />
      </div>
      <div className="flex-1">
        <Nav hash={hash} onNavigate={onNavigate} />
      </div>
      <div className="flex flex-col gap-4 px-1">
        <ThemeToggle />
        <UserCard user={user} />
      </div>
    </div>
  )
}

export function Sidebar({ user }: { user: User }) {
  const hash = useHash()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 lg:block">
        <Panel user={user} hash={hash} />
      </aside>

      {/* Mobile: top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Icon name="menu" className="text-2xl" />
        </button>
        <Brand />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 shadow-xl">
            <Panel user={user} hash={hash} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
