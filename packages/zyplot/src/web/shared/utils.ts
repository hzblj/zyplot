export type ClassValue = false | null | string | undefined

export const cn = (...values: ClassValue[]): string => values.filter(Boolean).join(' ')
