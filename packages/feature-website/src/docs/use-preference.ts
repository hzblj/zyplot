'use client'

import {useEffect, useState} from 'react'

const MAX_AGE = 60 * 60 * 24 * 365

export const usePreference = <T extends string>(initial: T, name: string, allowed: readonly T[]) => {
  const [value, setValue] = useState<T>(initial)

  const isAllowed = (allowed as readonly string[]).includes(value)
  const resolved = isAllowed ? value : (allowed[0] ?? initial)

  useEffect(() => {
    if (!isAllowed) {
      setValue(resolved)
    }
  }, [isAllowed, resolved])

  const choose = (next: T) => {
    setValue(next)
    document.cookie = `${name}=${next}; path=/; max-age=${MAX_AGE}; samesite=lax`
  }

  return [resolved, choose] as const
}
