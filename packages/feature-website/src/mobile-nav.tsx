'use client'

import {usePathname} from 'next/navigation'
import {type MouseEvent, type ReactNode, useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {tv} from 'tailwind-variants'
import {CloseIcon, MenuIcon} from './icons'
import {cn} from './utils'

const DESKTOP_QUERY = '(min-width: 821px)'

const mobileNav = tv({
  slots: {
    backdrop: 'absolute inset-0 cursor-pointer bg-black/45 transition-opacity motion-reduce:transition-none',
    backdropClosed: 'pointer-events-none opacity-0 duration-200',
    backdropOpen: 'pointer-events-auto opacity-100 duration-300',
    close:
      'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[9px] text-content-tertiary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    icon: 'size-4',
    panel:
      'pointer-events-auto absolute right-0 top-0 flex h-full w-[min(320px,86vw)] flex-col overflow-y-auto border-l border-border-secondary bg-surface-base px-5 pb-8 pt-4 shadow-card-elevated transition-transform motion-reduce:transition-none [scrollbar-color:var(--color-gray-5)_transparent] [scrollbar-width:thin]',
    panelClosed: 'translate-x-full duration-200 ease-[cubic-bezier(.4,0,1,1)]',
    panelOpen: 'translate-x-0 duration-300 ease-[cubic-bezier(.2,.8,.2,1)]',
    panelTitle: 'text-[11px] font-bold uppercase tracking-[0.12em] text-content-tertiary',
    panelTop: 'mb-6 flex h-8 items-center justify-between',
    trigger:
      'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-secondary bg-fill-secondary-primary text-content-secondary shadow-card-default transition-colors hover:bg-fill-secondary-hover hover:text-content-primary min-[821px]:hidden',
    viewport: 'pointer-events-none fixed inset-0 z-[60] overflow-clip min-[821px]:hidden',
  },
})

const styles = mobileNav()

export const MobileNav = ({children}: {children: ReactNode}) => {
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isOpen = openedAt === pathname

  const close = () => {
    setOpenedAt(null)
    triggerRef.current?.focus({preventScroll: true})
  }

  const onPanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a')) {
      setOpenedAt(null)
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const desktop = window.matchMedia(DESKTOP_QUERY)
    const previousOverflow = document.body.style.overflow

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenedAt(null)
        triggerRef.current?.focus({preventScroll: true})
      }
    }

    const onBreakpoint = () => {
      if (desktop.matches) {
        setOpenedAt(null)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onBreakpoint)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({preventScroll: true})

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onBreakpoint)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <>
      <button
        aria-controls="mobile-nav"
        aria-expanded={isOpen}
        aria-label="Open navigation"
        className={styles.trigger()}
        onClick={() => setOpenedAt(pathname)}
        ref={triggerRef}
        type="button"
      >
        <MenuIcon className={styles.icon()} />
      </button>
      {isMounted &&
        createPortal(
          <div className={styles.viewport()} inert={!isOpen}>
            <button
              aria-label="Close navigation"
              className={cn(styles.backdrop(), isOpen ? styles.backdropOpen() : styles.backdropClosed())}
              onClick={close}
              tabIndex={-1}
              type="button"
            />
            {/*
             * biome-ignore lint/a11y/useKeyWithClickEvents: this handler only
             * delegates for the links inside, and activating a link from the
             * keyboard dispatches a click of its own — there is no keyboard path
             * a companion key handler would add.
             */}
            <div
              aria-label="Navigation"
              aria-modal={isOpen || undefined}
              className={cn(styles.panel(), isOpen ? styles.panelOpen() : styles.panelClosed())}
              id="mobile-nav"
              onClick={onPanelClick}
              role="dialog"
            >
              <div className={styles.panelTop()}>
                <p className={styles.panelTitle()}>Menu</p>
                <button
                  aria-label="Close navigation"
                  className={styles.close()}
                  onClick={close}
                  ref={closeRef}
                  type="button"
                >
                  <CloseIcon className={styles.icon()} />
                </button>
              </div>
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
