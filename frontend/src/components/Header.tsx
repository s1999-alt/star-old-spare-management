import { Icon } from './Icon'

export function Header() {
  return (
    <header className="border-b border-slate-200/70 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a className="flex items-center gap-2" href="#/">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">
            <Icon name="recycling" className="text-lg" />
          </div>
          <span className="font-semibold tracking-tight text-slate-900">ScrapVault</span>
        </a>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium leading-tight text-slate-900">Y. K. Rathore</div>
            <div className="text-xs text-slate-500">Yard Lead</div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
            YR
          </div>
        </div>
      </div>
    </header>
  )
}
