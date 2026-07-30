'use client'

import {useEffect, useState} from 'react'
import {docsStyles} from '../../docs-styles'
import {cn} from '../../utils'

const styles = docsStyles()

/**
 * Where in the viewport a heading counts as the one being read. Sitting it below
 * the top edge rather than on it means a heading becomes active as it settles
 * into reading position, not the instant it appears.
 */
const ACTIVE_LINE = 140

type Heading = {id: string; label: string}

/**
 * The last heading that has passed the reading line — the one whose prose fills
 * the screen. Falls back to the first, which is what is being read before any of
 * them has scrolled past it.
 */
const activeIdFor = (headings: Heading[]) => {
  let active = headings[0]?.id

  for (const heading of headings) {
    const element = document.getElementById(heading.id)

    if (element && element.getBoundingClientRect().top <= ACTIVE_LINE) {
      active = heading.id
    }
  }

  return active
}

const scrolledFraction = () => {
  const {clientHeight, scrollHeight} = document.documentElement
  const scrollable = scrollHeight - clientHeight

  return scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1
}

/**
 * The page's own sections, with how far through them the reader is.
 *
 * The rail doubles as the scrollbar for the article: the docs shell hides the
 * window's own inside a sticky grid, so the list of sections is the only place
 * left that can honestly say how much is below the fold.
 */
export const DocsToc = ({headings}: {headings: Heading[]}) => {
  const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      setActiveId(activeIdFor(headings))
      setPercent(Math.round(scrolledFraction() * 100))
    }

    /** Reads geometry once per frame at most, however many events arrive. */
    const schedule = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener('scroll', schedule, {passive: true})
    window.addEventListener('resize', schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [headings])

  return (
    <aside className={styles.toc()}>
      <div className={styles.tocHeader()}>
        <p className={styles.tocLabel()}>On this page</p>
        <span className={styles.tocProgress()}>{percent}%</span>
      </div>
      <nav aria-label="On this page" className={styles.tocNav()}>
        <span aria-hidden="true" className={styles.tocRail()}>
          <span className={styles.tocRailFill()} style={{height: `${percent}%`}} />
        </span>
        {headings.map(heading => (
          <a
            aria-current={heading.id === activeId ? 'true' : undefined}
            className={cn(heading.id === activeId && styles.tocLinkActive())}
            href={`#${heading.id}`}
            key={heading.id}
          >
            {heading.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
