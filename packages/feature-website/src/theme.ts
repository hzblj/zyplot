export type Theme = 'dark' | 'light'

/** The cookie the toggle writes and {@link THEME_SCRIPT} reads back before the first paint. */
export const THEME_COOKIE = 'zyplot-theme'

const MAX_AGE = 60 * 60 * 24 * 365

/**
 * Resolves the root classes before the document body is parsed, so the first paint is already
 * in the right palette. It has to be an inline `<script>` in `<head>`: `next/script` queues even
 * `beforeInteractive` code for the client runtime, which lands after the page has painted.
 */
export const THEME_SCRIPT = `try{var r=document.documentElement,m=document.cookie.match(new RegExp("(?:^|; *)${THEME_COOKIE}=(dark|light)")),s=m&&m[1];if(!s){try{var l=localStorage.getItem("${THEME_COOKIE}");if(l==="dark"||l==="light"){s=l;document.cookie="${THEME_COOKIE}="+l+"; path=/; max-age=${MAX_AGE}; samesite=lax";localStorage.removeItem("${THEME_COOKIE}")}}catch(e){}}var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.classList.toggle("dark",d);r.classList.toggle("light",!d)}catch(e){}`

/** The pinned choice, or `undefined` while the reader is still following the OS. */
const storedTheme = (): Theme | undefined => {
  const match = document.cookie.match(new RegExp(`(?:^|; *)${THEME_COOKIE}=(dark|light)`))

  return match?.[1] as Theme | undefined
}

const systemTheme = (): Theme => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

/** The cookie wins whenever it is set; the OS is the answer only in its absence. */
export const resolvedTheme = (): Theme => storedTheme() ?? systemTheme()

/**
 * Writes both halves of the pair. `light` is not decoration: a root pinning neither class leaves
 * the chart tokens on `prefers-color-scheme`, so a dark OS keeps dark charts on a light page.
 */
export const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.classList.toggle('light', theme === 'light')
}

export const storeTheme = (theme: Theme) => {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${MAX_AGE}; samesite=lax`
}
