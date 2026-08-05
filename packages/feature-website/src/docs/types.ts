import type {ReactNode} from 'react'

export type PropRow = {
  defaultValue?: string
  description: string
  name: string
  required?: boolean
  type: string
}

export type ChartPlatform = 'web' | 'ios' | 'android'

export type ChartSource = string | Partial<Record<ChartPlatform, string>>

export type ChangelogEntry = {
  commit?: {href: string; sha: string}
  paragraphs: string[]
}

export type ChangelogRelease = {
  groups: {entries: ChangelogEntry[]; label: string}[]
  version: string
}

export type ChartDoc = {
  code: ChartSource
  description: string
  id: string
  name: string
  platforms: readonly ChartPlatform[]
  preview: ReactNode
  props: PropRow[]
  when: string
}
