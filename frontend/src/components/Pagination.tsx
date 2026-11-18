import { Icon } from './Icon'

interface Props {
  page: number
  pageSize: number
  total: number
  onPage: (p: number) => void
  onPageSize: (n: number) => void
}

const btn =
  'flex h-8 items-center justify-center rounded-md px-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent'

function pageList(page: number, last: number): (number | '…')[] {
  if (last <= 6) return Array.from({ length: last }, (_, i) => i + 1)
  const set = new Set([1, 2, page - 1, page, page + 1, last])
  const nums = [...set].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push('…')
    out.push(n)
  })
  return out
}

export function Pagination({ page, pageSize, total, onPage, onPageSize }: Props) {
  const last = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const strong = 'font-semibold text-slate-800'

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs sm:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500">
        <span>
          Showing <strong className={strong}>{from}</strong> to <strong className={strong}>{to}</strong> of{' '}
          <strong className={strong}>{total.toLocaleString()}</strong> entries
        </span>
        <span className="hidden text-slate-300 sm:inline">·</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        >
          {[5, 10, 25, 50].map((n) => (
            <option key={n} value={n}>{n} per page</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1 font-medium">
        <button className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <Icon name="chevron_left" className="text-sm" />
        </button>
        {pageList(page, last).map((p, i) =>
          p === '…' ? (
            <span key={`gap${i}`} className="select-none px-1 text-slate-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={
                p === page
                  ? 'flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 font-medium text-white'
                  : `${btn} w-8`
              }
            >
              {p}
            </button>
          ),
        )}
        <button className={btn} disabled={page >= last} onClick={() => onPage(page + 1)}>
          <Icon name="chevron_right" className="text-sm" />
        </button>
      </div>
    </div>
  )
}
