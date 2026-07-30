import {tv} from 'tailwind-variants'

export const marketingStyles = tv({
  slots: {
    actions: 'mt-[38px] flex flex-wrap items-center gap-[22px]',
    brandLink: 'transition-opacity hover:opacity-70',
    chartCard:
      'overflow-hidden rounded-3xl border border-border-secondary bg-chart-surface p-[22px] shadow-card-default max-[560px]:p-3.5',
    chartHeader: 'mb-6 flex items-center justify-end',
    hero: 'mx-auto grid min-h-[680px] max-w-[1180px] grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] items-center gap-[68px] px-7 max-[800px]:grid-cols-1 max-[800px]:py-20 max-[560px]:px-5 [&_h1]:mb-[26px] [&_h1]:text-[clamp(46px,5.4vw,68px)] [&_h1]:font-bold [&_h1]:leading-[1] [&_h1]:tracking-[-.055em]',
    /**
     * Two rows at every width — managers above, command and copy below — so this
     * reads as the same control as the docs install block.
     *
     * It used to be a single-row pill that only stacked under 800px, but the row
     * needs 442px and the hero column is 448, so on desktop it was a pill sized to
     * the millimetre by its own contents: one longer command and it broke. Stacked,
     * the command gets the whole width and the managers keep their own line.
     */
    install:
      'flex w-full flex-col gap-y-1.5 rounded-[22px] border border-border-secondary bg-surface-secondary px-3 py-2.5',
    installCommand: 'min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-0.5 text-[13px] text-content-secondary',
    installCopy:
      'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-content-tertiary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    installCopyIcon: 'size-3.5',
    /** Copy rides at the right edge of the command's row, as in the docs block. */
    installRow: 'flex items-center gap-2',
    installTab: 'cursor-pointer rounded-full px-2 py-1 text-[11px] font-semibold transition-colors',
    installTabActive: 'bg-fill-secondary-hover text-content-primary hover:bg-fill-secondary-pressed',
    installTabInactive: 'text-content-tertiary hover:text-content-primary',
    installTabs: 'flex items-center gap-0.5',
    lede: 'max-w-[620px] text-xl leading-[1.55] text-content-secondary',
    menuIconLink:
      'inline-flex items-center gap-2.5 rounded-[9px] px-2 py-2.5 text-content-secondary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    menuLink:
      'rounded-[9px] px-2 py-2.5 text-content-secondary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    menuNav: 'grid gap-px text-[15px]',
    nav: 'mx-auto flex h-20 max-w-[1180px] items-center justify-between gap-4 px-7 max-[560px]:px-5',
    navActions: 'flex shrink-0 items-center gap-7 max-[820px]:gap-2.5',
    navIconLink: 'inline-flex items-center gap-2 transition-colors hover:text-content-primary',
    navLink: 'transition-colors hover:text-content-primary',
    navLinks: 'flex items-center gap-7 text-content-tertiary max-[820px]:hidden',
    navMark: 'size-4 shrink-0',
    platform:
      'min-h-[250px] border-l border-border-secondary px-9 py-12 first:border-l-0 max-[800px]:min-h-0 max-[800px]:border-l-0 max-[800px]:border-t max-[800px]:px-0 max-[800px]:py-10 max-[800px]:first:border-t-0 [&_h2]:mb-2.5 [&_h2]:mt-4 [&_h2]:text-[19px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:text-content-secondary',
    platformNumber: 'font-mono text-content-accent',
    platforms:
      'mx-auto grid max-w-[1180px] grid-cols-3 border-t border-border-secondary px-7 max-[800px]:grid-cols-1 max-[560px]:px-5',
    primaryButton:
      'rounded-full bg-fill-accent-primary px-[22px] py-3.5 font-bold text-content-on-bg transition-colors hover:bg-fill-accent-hover active:bg-fill-accent-pressed',
    status: 'text-xs font-bold uppercase tracking-[0.12em] text-content-accent',
    wordmark: 'text-xl font-bold tracking-[-0.04em]',
  },
})
