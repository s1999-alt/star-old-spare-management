import { useState } from 'react'
import type { IdType, OwnerDocs } from '../../data/vehicles'
import { ID_LABEL, displayId, groupAadhaar, idError, isOwnerComplete } from '../../lib/ids'
import { Icon } from '../Icon'
import { MediaViewer, Section } from '../ui'
import { btn, input } from '../styles'

export function OwnerDocuments({
  owner,
  plate,
  onSave,
}: {
  owner: OwnerDocs
  plate: string
  onSave: (o: OwnerDocs) => void
}) {
  const complete = isOwnerComplete(owner)
  const [editing, setEditing] = useState(!complete)
  const [draft, setDraft] = useState(owner)
  const [viewing, setViewing] = useState<{ url: string; name: string } | null>(null)

  const set = (patch: Partial<OwnerDocs>) => setDraft((d) => ({ ...d, ...patch }))
  const err = idError(draft.idType, draft.idNumber)
  const dirty = JSON.stringify(draft) !== JSON.stringify(owner)

  const badge = complete ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <Icon name="verified" className="text-sm" /> Complete
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      Pending
    </span>
  )

  if (!editing) {
    return (
      <Section
        title="Owner documents"
        action={
          <button className={btn.ghost} onClick={() => setEditing(true)}>
            <Icon name="edit" className="text-base" /> Edit
          </button>
        }
      >
        <ul className="flex flex-col gap-3">
          {[
            { label: 'RC', value: owner.rcNumber, img: owner.rcImage },
            { label: ID_LABEL[owner.idType], value: displayId(owner.idType, owner.idNumber), img: owner.idImage },
          ].map((d) => (
            <li key={d.label} className="flex items-center gap-3">
              <button
                className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100"
                onClick={() => d.img && setViewing({ url: d.img, name: `${d.label} photo` })}
                aria-label={`View ${d.label} photo`}
              >
                {d.img && <img src={d.img} alt="" className="h-full w-full object-cover" />}
              </button>
              <div className="min-w-0">
                <div className="text-xs text-slate-500">{d.label}</div>
                <div className="truncate font-mono text-sm text-slate-900">{d.value}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">{badge}</div>
        {viewing && (
          <MediaViewer item={{ kind: 'image', ...viewing }} onClose={() => setViewing(null)} />
        )}
      </Section>
    )
  }

  return (
    <Section title="Owner documents" action={badge}>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (err) return
          onSave(draft)
          if (isOwnerComplete(draft)) setEditing(false)
        }}
      >
        {/* RC */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium text-slate-700">Registration certificate (RC)</legend>
          <input
            className={`${input} font-mono uppercase`}
            placeholder={`RC number, e.g. ${plate}`}
            value={draft.rcNumber}
            onChange={(e) => set({ rcNumber: e.target.value.toUpperCase() })}
          />
          <ImageField label="RC photo" value={draft.rcImage} onChange={(rcImage) => set({ rcImage })} />
        </fieldset>

        {/* PAN / Aadhaar */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium text-slate-700">Owner ID</legend>
          <div className="inline-flex self-start rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
            {(['aadhaar', 'pan'] as IdType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => t !== draft.idType && set({ idType: t, idNumber: '' })}
                className={`rounded-md px-3 py-1.5 transition ${
                  draft.idType === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {ID_LABEL[t]}
              </button>
            ))}
          </div>
          {draft.idType === 'aadhaar' ? (
            <input
              className={`${input} font-mono`}
              inputMode="numeric"
              autoComplete="off"
              placeholder="1234 5678 9012"
              value={groupAadhaar(draft.idNumber)}
              onChange={(e) => set({ idNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
            />
          ) : (
            <input
              className={`${input} font-mono uppercase`}
              autoComplete="off"
              placeholder="ABCDE1234F"
              maxLength={10}
              value={draft.idNumber}
              onChange={(e) => set({ idNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
            />
          )}
          {err && <p className="text-xs text-red-600">{err}</p>}
          <ImageField
            label={`${ID_LABEL[draft.idType]} photo`}
            value={draft.idImage}
            onChange={(idImage) => set({ idImage })}
          />
        </fieldset>

        <div className="flex justify-end gap-2">
          {complete && (
            <button
              type="button"
              className={btn.secondary}
              onClick={() => {
                setDraft(owner)
                setEditing(false)
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className={btn.primary} disabled={!dirty || !!err}>
            Save
          </button>
        </div>
      </form>
    </Section>
  )
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (url: string | undefined) => void
}) {
  const pick = (f: File | undefined) => f && onChange(URL.createObjectURL(f))

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-2">
        <img src={value} alt={label} className="h-12 w-16 rounded object-cover" />
        <span className="flex-1 truncate text-sm text-slate-700">{label}</span>
        <label className="cursor-pointer text-xs font-medium text-emerald-700 hover:underline">
          Replace
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        <button type="button" className={btn.ghost} onClick={() => onChange(undefined)} aria-label={`Remove ${label}`}>
          <Icon name="delete" className="text-base" />
        </button>
      </div>
    )
  }
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-3 transition hover:border-emerald-500 hover:bg-emerald-50/40">
      <Icon name="add_a_photo" className="text-xl text-slate-400" />
      <span className="text-sm text-slate-600">Upload {label.toLowerCase()}</span>
      <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
    </label>
  )
}
