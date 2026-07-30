import {tv} from 'tailwind-variants'

export const marketingStyles = tv({
  slots: {
    actions: 'mt-[38px] flex flex-wrap items-center gap-[22px]',
    brandLink: 'transition-opacity hover:opacity-70',
    chartCard:
      'overflow-hidden rounded-3xl border border-border-secondary p-[22px] shadow-card-default max-[560px]:p-3.5',
    chartHeader: 'mb-5 flex h-9 items-center justify-between gap-3',
    chartToggle:
      'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-secondary bg-surface-elevated text-content-secondary shadow-[0_1px_2px_#0000001f] transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    chartToggleIcon: 'size-4 shrink-0',
    eventCard:
      'pointer-events-none absolute -translate-y-1/2 rounded-[10px] border border-border-secondary bg-surface-elevated px-2.5 py-2 shadow-card-default motion-safe:transition-opacity motion-safe:duration-150',
    eventCardLabel: 'text-xs text-content-secondary',
    eventCardRow: 'mt-1 flex items-center justify-between gap-4',
    eventCardTitle: 'text-[13px] font-semibold text-content-primary',
    eventCardValue: 'text-xs tabular-nums text-content-primary',
    example:
      'group grid gap-6 rounded-3xl border border-border-secondary bg-surface-primary p-7 shadow-card-default max-[560px]:gap-4 max-[560px]:rounded-[22px] max-[560px]:p-4 [&_h3]:mb-2.5 [&_h3]:mt-3.5 [&_h3]:text-[clamp(20px,2.2vw,24px)] [&_h3]:font-semibold [&_h3]:leading-[1.2] [&_h3]:tracking-[-.03em] [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:text-content-secondary',
    exampleArrow: 'transition-transform group-hover:translate-x-0.5',
    exampleCopy: 'max-w-[620px]',
    exampleLink:
      'mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-content-accent transition-opacity hover:opacity-70',
    // The shot always fits the card, at every width. Held at a legible minimum it
    // would have to pan, and what a phone would then show first is the browser
    // panel — the least interesting third of it. Small and whole reads better than
    // large and cropped: the three devices are the point, not the labels on them.
    // The background is the stage colour baked into the image, so only the corners
    // it rounds off ever show it.
    exampleShot: 'rounded-2xl border border-border-secondary bg-[#fafafa] max-[560px]:rounded-xl dark:bg-[#171717]',
    exampleShotDark: 'hidden w-full dark:block',
    exampleShotLight: 'block w-full dark:hidden',
    examples: 'mx-auto max-w-[1180px] px-7 py-[92px] max-[800px]:py-[68px] max-[560px]:px-5',
    examplesHeader:
      'mb-10 max-w-[720px] [&_h2]:mb-4 [&_h2]:mt-4 [&_h2]:text-[clamp(30px,3.6vw,42px)] [&_h2]:font-bold [&_h2]:leading-[1.05] [&_h2]:tracking-[-.045em]',
    examplesList: 'grid gap-7 max-[560px]:gap-5',
    hero: 'mx-auto grid min-h-[680px] max-w-[1180px] grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] items-center gap-[68px] px-7 max-[800px]:grid-cols-1 max-[800px]:py-20 max-[560px]:px-5 [&_h1]:mb-[26px] [&_h1]:text-[clamp(46px,5.4vw,68px)] [&_h1]:font-bold [&_h1]:leading-[1] [&_h1]:tracking-[-.055em]',
    install:
      'flex w-full flex-col gap-y-1.5 rounded-[22px] border border-border-secondary bg-surface-secondary px-3 py-2.5',
    installCommand: 'min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-0.5 text-[13px] text-content-secondary',
    installCopy:
      'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-content-tertiary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    installCopyIcon: 'size-3.5',
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
    platforms: 'mx-auto grid max-w-[1180px] grid-cols-3 px-7 max-[800px]:grid-cols-1 max-[560px]:px-5',
    primaryButton:
      'rounded-full bg-fill-accent-primary px-[22px] py-3.5 font-bold text-content-on-bg transition-colors hover:bg-fill-accent-hover active:bg-fill-accent-pressed',
    status: 'text-xs font-bold uppercase tracking-[0.12em] text-content-accent',
    tab: 'cursor-pointer rounded-[7px] border border-transparent px-[11px] py-2 text-xs font-semibold transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    tabActive: 'border-border-secondary bg-surface-elevated text-content-primary shadow-[0_1px_2px_#0000001f]',
    tabInactive: 'text-content-tertiary',
    tabs: 'flex gap-0.5',
    wordmark: 'text-xl font-bold tracking-[-0.04em]',
  },
})
