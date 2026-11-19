import { setTheme, useTheme, type Theme } from '../lib/theme'
import { Icon } from './Icon'

const OPTIONS: { value: Theme; label: string; title: string; icon: string }[] = [
  { value: 'light', label: 'Light', title: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', title: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'Auto', title: 'Match system', icon: 'computer' },
]

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useTheme()
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`flex gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 ${className}`}
    >
      {OPTIONS.map((o) => {
        const on = theme === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            title={o.title}
            onClick={() => setTheme(o.value)}
            className={`flex h-7 min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-medium transition ${
              on
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Icon name={o.icon} className="text-base" />
            <span className="sr-only sm:not-sr-only">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
