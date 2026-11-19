import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { btn, input } from '../components/styles'
import { Modal } from '../components/ui'
import type { Vehicle } from '../data/vehicles'
import {
  createGodown,
  deleteGodown,
  godownLabel,
  updateGodown,
  useGodowns,
  type Godown,
  type GodownInput,
} from '../lib/godowns'

type Editing = { mode: 'create' } | { mode: 'edit'; godown: Godown }

export function GodownsPage({ vehicles }: { vehicles: Vehicle[] }) {
  const godowns = useGodowns()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Editing | null>(null)
  const [deleting, setDeleting] = useState<Godown | null>(null)

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const v of vehicles) m.set(v.godown, (m.get(v.godown) ?? 0) + 1)
    return m
  }, [vehicles])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = [...godowns].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
    if (!q) return list
    return list.filter((g) =>
      [g.code, g.name, g.address, g.manager, g.phone].some((s) => s.toLowerCase().includes(q)),
    )
  }, [godowns, query])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Godowns</h1>
          <span className="text-sm text-slate-500 dark:text-slate-400">{godowns.length} total</span>
        </div>
        <button className={btn.primary} onClick={() => setEditing({ mode: 'create' })}>
          <Icon name="add" className="text-lg" />
          Add godown
        </button>
      </div>

      <div className="relative">
        <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 text-xl text-slate-400 dark:text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code, name, address or manager"
          className={`${input} pl-10`}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Mobile: cards */}
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
          {filtered.map((g) => (
            <li key={g.id} className="flex flex-col gap-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <Title g={g} />
                <Actions onEdit={() => setEditing({ mode: 'edit', godown: g })} onDelete={() => setDeleting(g)} />
              </div>
              {g.address && <div className="text-xs text-slate-500 dark:text-slate-400">{g.address}</div>}
              <div className="flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                <Manager g={g} />
                <Usage used={counts.get(g.id) ?? 0} capacity={g.capacity} />
              </div>
            </li>
          ))}
        </ul>

        {/* Tablet/desktop: table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-400 dark:text-slate-500">
                <th scope="col" className="px-5 py-3">Godown</th>
                <th scope="col" className="px-3 py-3">Address</th>
                <th scope="col" className="px-3 py-3">Manager</th>
                <th scope="col" className="px-3 py-3">Occupancy</th>
                <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-4"><Title g={g} /></td>
                  <td className="max-w-xs px-3 py-4 text-sm text-slate-600 dark:text-slate-400">{g.address || '—'}</td>
                  <td className="whitespace-nowrap px-3 py-4"><Manager g={g} /></td>
                  <td className="whitespace-nowrap px-3 py-4"><Usage used={counts.get(g.id) ?? 0} capacity={g.capacity} /></td>
                  <td className="w-24 pr-4 text-right">
                    <Actions onEdit={() => setEditing({ mode: 'edit', godown: g })} onDelete={() => setDeleting(g)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-14 text-center text-sm text-slate-400 dark:text-slate-500">
            {godowns.length === 0 ? 'No godowns yet. Add your first one.' : 'No godowns match your search.'}
          </div>
        )}
      </div>

      {editing && (
        <GodownForm
          godown={editing.mode === 'edit' ? editing.godown : undefined}
          existing={godowns}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing.mode === 'edit') updateGodown(editing.godown.id, data)
            else createGodown(data)
            setEditing(null)
          }}
        />
      )}

      {deleting && (
        <DeleteGodown
          godown={deleting}
          vehicleCount={counts.get(deleting.id) ?? 0}
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            deleteGodown(deleting.id)
            setDeleting(null)
          }}
        />
      )}
    </main>
  )
}

function Title({ g }: { g: Godown }) {
  return (
    <div className="min-w-0">
      <div className="truncate font-medium text-slate-900 dark:text-slate-100">{g.name}</div>
      <div className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">Godown #{g.code}</div>
    </div>
  )
}

function Manager({ g }: { g: Godown }) {
  if (!g.manager && !g.phone) return <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
  return (
    <div>
      <div className="text-sm text-slate-800 dark:text-slate-200">{g.manager || '—'}</div>
      {g.phone && (
        <a href={`tel:${g.phone.replace(/\s+/g, '')}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400">
          {g.phone}
        </a>
      )}
    </div>
  )
}

function Usage({ used, capacity }: { used: number; capacity: number }) {
  const pct = capacity > 0 ? Math.min(100, Math.round((used / capacity) * 100)) : 0
  const tone = used > capacity ? 'bg-red-500' : pct >= 90 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
        {used}/{capacity}
      </span>
    </div>
  )
}

function Actions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 justify-end gap-1">
      <button className={btn.ghost} onClick={onEdit} aria-label="Edit" title="Edit">
        <Icon name="edit" className="text-lg" />
      </button>
      <button className={`${btn.ghost} hover:!bg-red-50 dark:hover:!bg-red-500/10 hover:!text-red-600 dark:hover:!text-red-400`} onClick={onDelete} aria-label="Delete" title="Delete">
        <Icon name="delete" className="text-lg" />
      </button>
    </div>
  )
}

const normCode = (s: string) => s.trim().replace(/^#/, '')

function GodownForm({
  godown,
  existing,
  onClose,
  onSave,
}: {
  godown?: Godown
  existing: Godown[]
  onClose: () => void
  onSave: (data: GodownInput) => void
}) {
  const [form, setForm] = useState({
    code: godown?.code ?? '',
    name: godown?.name ?? '',
    address: godown?.address ?? '',
    manager: godown?.manager ?? '',
    phone: godown?.phone ?? '',
    capacity: godown ? String(godown.capacity) : '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const code = normCode(form.code)
    const capacity = Number(form.capacity)
    const next: typeof errors = {}
    if (!code) next.code = 'Code is required.'
    else if (existing.some((g) => g.id !== godown?.id && g.code.toLowerCase() === code.toLowerCase()))
      next.code = `Godown #${code} already exists.`
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!Number.isInteger(capacity) || capacity <= 0) next.capacity = 'Enter a whole number above 0.'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({
      code,
      name: form.name.trim(),
      address: form.address.trim(),
      manager: form.manager.trim(),
      phone: form.phone.trim(),
      capacity,
    })
  }

  return (
    <Modal
      title={godown ? `Edit ${godownLabel(godown)}` : 'Add godown'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onClose}>Cancel</button>
          <button type="submit" form="godown-form" className={btn.primary}>
            {godown ? 'Save changes' : 'Add godown'}
          </button>
        </>
      }
    >
      <form id="godown-form" onSubmit={submit} noValidate className="grid grid-cols-2 gap-4">
        <Field label="Code" error={errors.code} className="col-span-1">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-slate-400 dark:text-slate-500">#</span>
            <input autoFocus value={form.code} onChange={set('code')} placeholder="07" className={`${input} pl-7`} />
          </div>
        </Field>
        <Field label="Capacity (vehicles)" error={errors.capacity} className="col-span-1">
          <input type="number" min={1} inputMode="numeric" value={form.capacity} onChange={set('capacity')} placeholder="40" className={input} />
        </Field>
        <Field label="Name" error={errors.name} className="col-span-2">
          <input value={form.name} onChange={set('name')} placeholder="Sector 4" className={input} />
        </Field>
        <Field label="Address" optional className="col-span-2">
          <input value={form.address} onChange={set('address')} placeholder="Plot 22, Sector 4 Industrial Area" className={input} />
        </Field>
        <Field label="Manager" optional className="col-span-2 sm:col-span-1">
          <input value={form.manager} onChange={set('manager')} placeholder="R. Sharma" className={input} />
        </Field>
        <Field label="Phone" optional className="col-span-2 sm:col-span-1">
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="98110 22341" className={input} />
        </Field>
      </form>
    </Modal>
  )
}

function Field({
  label,
  error,
  optional,
  className = '',
  children,
}: {
  label: string
  error?: string
  optional?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">(optional)</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  )
}

function DeleteGodown({
  godown,
  vehicleCount,
  onClose,
  onConfirm,
}: {
  godown: Godown
  vehicleCount: number
  onClose: () => void
  onConfirm: () => void
}) {
  const blocked = vehicleCount > 0
  return (
    <Modal
      title={`Delete ${godownLabel(godown)}?`}
      onClose={onClose}
      footer={
        blocked ? (
          <button className={btn.secondary} onClick={onClose}>OK</button>
        ) : (
          <>
            <button className={btn.secondary} onClick={onClose}>Cancel</button>
            <button
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 text-sm font-medium text-white transition hover:bg-red-700"
              onClick={onConfirm}
            >
              Delete
            </button>
          </>
        )
      }
    >
      {blocked ? (
        <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Icon name="warning" className="text-lg text-amber-500" />
          <span>
            This godown still has {vehicleCount} vehicle{vehicleCount === 1 ? '' : 's'} assigned. Move them to another
            godown before deleting it.
          </span>
        </p>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-400">This godown will be removed permanently. This can't be undone.</p>
      )}
    </Modal>
  )
}
