import type {ChartPlatform} from './types'

export const CHARTS_VERSION = '4'
export const VIEW_COOKIE = 'zyplot-docs-view'
export const PLATFORM_COOKIE = 'zyplot-docs-platform'

export type DocsView = 'code' | 'preview'

export type DocsPreferences = {
  platform: ChartPlatform
  view: DocsView
}

export const DEFAULT_PREFERENCES: DocsPreferences = {
  platform: 'web',
  view: 'preview',
}

const VIEWS: readonly string[] = ['code', 'preview']
const PLATFORMS: readonly string[] = ['android', 'ios', 'web']

export const readDocsPreferences = (view: string | undefined, platform: string | undefined): DocsPreferences => ({
  platform: PLATFORMS.includes(platform ?? '') ? (platform as ChartPlatform) : DEFAULT_PREFERENCES.platform,
  view: VIEWS.includes(view ?? '') ? (view as DocsView) : DEFAULT_PREFERENCES.view,
})
