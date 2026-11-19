import { useState } from 'react'
import { Icon } from '../components/Icon'
import { ThemeToggle } from '../components/ThemeToggle'
import { signIn } from '../lib/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Shown on the login page until real accounts exist.
const TEST_EMAIL = 'test@scrapvault.com'
const TEST_PASSWORD = 'test1234'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) return setError('Enter a valid email address.')
    if (!password) return setError('Enter your password.')
    setError(null)
    setSubmitting(true)
    try {
      await signIn(trimmed, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Try again.')
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 dark:disabled:bg-slate-800'

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 text-slate-800 dark:text-slate-200 antialiased">
      <ThemeToggle className="absolute right-4 top-4" />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Icon name="recycling" className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Sign in to ScrapVault</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage yard inventory and vehicle parts.</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="space-y-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300"
            >
              <Icon name="error" className="text-base" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting && <Icon name="progress_activity" className="animate-spin text-base" />}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setEmail(TEST_EMAIL)
            setPassword(TEST_PASSWORD)
            setError(null)
          }}
          disabled={submitting}
          className="mt-4 w-full rounded-xl border border-dashed border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-500/10 px-4 py-3 text-left text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-70"
        >
          <div className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
            <Icon name="info" className="text-base" />
            Test account
            <span className="ml-auto text-xs font-normal text-emerald-700 dark:text-emerald-400">Click to fill</span>
          </div>
          <div className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-slate-600 dark:text-slate-400">
            <span className="text-slate-500 dark:text-slate-400">Email</span>
            <code className="font-mono text-slate-800 dark:text-slate-200">{TEST_EMAIL}</code>
            <span className="text-slate-500 dark:text-slate-400">Password</span>
            <code className="font-mono text-slate-800 dark:text-slate-200">{TEST_PASSWORD}</code>
          </div>
        </button>
      </div>
    </main>
  )
}
