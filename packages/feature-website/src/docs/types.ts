import type {ReactNode} from 'react'

export type PropRow = {
  defaultValue?: string
  description: string
  name: string
  required?: boolean
  type: string
}

export type ChartPlatform = 'web' | 'ios' | 'android'

export type ChangelogEntry = {
  commit?: {href: string; sha: string}
  paragraphs: string[]
}

export type ChangelogRelease = {
  groups: {entries: ChangelogEntry[]; label: string}[]
  version: string
}

export type ChartDoc = {
  code: string
  description: string
  id: string
  name: string
  platforms: readonly ChartPlatform[]
  preview: ReactNode
  props: PropRow[]
  when: string
}
