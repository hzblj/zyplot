'use client'

import {tv} from 'tailwind-variants'
import {applyTheme, storeTheme} from './theme'
import {useColorScheme} from './use-color-scheme'

const themeToggle = tv({
  slots: {
    button:
      'relative flex h-8 w-[68px] cursor-pointer items-center justify-between rounded-full border border-border-secondary bg-fill-secondary-primary px-2 text-content-tertiary shadow-card-default transition-colors hover:bg-fill-secondary-hover',
    icon: 'relative z-10 size-3.5',
    // The thumb rides the root class rather than React state: state would only be right one render
    // after hydration, which is a visible jump on every load in dark mode.
    thumb:
      'absolute left-1 top-1 size-[22px] rounded-full bg-surface-primary shadow-[0_1px_4px_#00000024] transition-transform duration-200 dark:translate-x-9',
  },
})

const styles = themeToggle()

export const ThemeToggle = () => {
  const isDark = useColorScheme() === 'dark'

  const toggleTheme = () => {
    // Off the root rather than the render, so a click landing before the store settles still flips.
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    applyTheme(next)
    storeTheme(next)
  }

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className={styles.button()}
      onClick={toggleTheme}
      type="button"
    >
      <span className={styles.thumb()} />
      <svg aria-hidden="true" className={styles.icon()} fill="none" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" />
        <path
          d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
      <svg aria-hidden="true" className={styles.icon()} fill="none" viewBox="0 0 16 16">
        <path
          d="M13.5 10.25A5.75 5.75 0 0 1 5.75 2.5a5.75 5.75 0 1 0 7.75 7.75Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
