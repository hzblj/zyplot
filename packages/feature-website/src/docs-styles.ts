import {tv} from 'tailwind-variants'

const flow = '[&>*+*]:mt-6 [&>div]:mb-0 [&>h3+*]:mt-0 [&>h3]:mb-6 [&>h3]:mt-10 [&>p]:mb-0'
const inlineCode = '[&_code]:font-semibold [&_pre_code]:font-normal [&_td_code]:font-normal'

export const docsStyles = tv({
  slots: {
    brandLabel: 'text-sm text-content-tertiary',
    brandLink: 'transition-opacity hover:opacity-70',
    changelogCommit:
      'justify-self-start font-mono text-xs text-content-accent underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current',
    changelogEntries: 'grid gap-5',
    changelogEntry: 'grid gap-2.5 border-l-2 border-border-secondary pl-4',
    changelogList: 'grid',
    changelogParagraph: 'text-sm leading-7 text-content-secondary',
    changelogRelease: 'border-t border-border-secondary py-8 first:border-t-0 first:pt-0',
    changelogTag:
      'rounded-full border border-border-secondary px-2.5 py-1 text-[11px] font-semibold text-content-tertiary',
    changelogVersion:
      'text-[22px] font-semibold tracking-[-0.03em] text-content-primary transition-opacity hover:opacity-70',
    changelogVersionRow: 'mb-4 flex flex-wrap items-center gap-3',
    chartDoc: `scroll-mt-6 border-b border-border-secondary pb-[72px] pt-10 ${flow} ${inlineCode} [&_h2]:mb-3 [&_h2]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&>h3]:text-[17px]`,
    chartIntro:
      'mb-8 [&_h2]:mb-3 [&_h2]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&_p:last-child]:max-w-[680px] [&_p:last-child]:text-base [&_p:last-child]:leading-7 [&_p:last-child]:text-content-secondary',
    chartTitleRow: 'flex items-start justify-between gap-6 max-[560px]:flex-col max-[560px]:gap-3',
    codeBlock:
      'my-6 overflow-hidden rounded-xl border border-border-secondary bg-surface-secondary shadow-card-default',
    codeBlockBody: 'm-0 overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6 text-content-primary',
    codeBlockHeader:
      'flex h-10 items-center justify-between border-b border-border-secondary px-4 text-[11px] font-medium text-content-tertiary',
    codeCopy:
      'cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    compactPreview: 'flex min-h-[280px] items-center px-[12%]',
    content: 'min-w-0 px-10 pb-40 max-[820px]:px-7 max-[820px]:pb-[128px] max-[560px]:px-5',
    example: 'overflow-hidden rounded-2xl border border-border-secondary bg-surface-primary shadow-card-default',
    exampleBar:
      'flex min-h-12 items-center justify-between border-b border-border-secondary bg-surface-secondary px-3 py-1.5 text-[11px] text-content-tertiary',
    exampleCode:
      'm-0 min-h-[350px] overflow-x-auto rounded-none border-0 bg-surface-secondary px-6 py-[22px] font-mono text-[13px] leading-7 text-content-secondary',
    examplePreview: 'min-h-[350px] p-[30px] max-[820px]:min-h-[300px] max-[820px]:px-3 max-[820px]:py-5',
    galleryImage: 'mx-auto block w-full max-w-[520px]',
    galleryImageDark: 'mx-auto hidden w-full max-w-[520px] dark:block',
    galleryImageLight: 'mx-auto block w-full max-w-[520px] dark:hidden',
    galleryMeta:
      'border-t border-border-secondary px-4 py-3 text-[13px] text-content-tertiary [&_a]:font-medium [&_a]:text-content-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity [&_a:hover]:opacity-70',
    galleryStage: 'bg-[#fafafa] px-4 py-6 dark:bg-[#171717]',
    hero: 'scroll-mt-6 border-b border-border-secondary pb-[72px] pt-[108px] max-[820px]:pt-[72px] [&_h1]:mb-[30px] [&_h1]:text-[clamp(52px,6vw,76px)] [&_h1]:font-bold [&_h1]:leading-[.98] [&_h1]:tracking-[-.06em] [&>p:last-child]:max-w-[680px] [&>p:last-child]:text-base [&>p:last-child]:leading-7 [&>p:last-child]:text-content-secondary',
    installCommand: 'min-w-0 flex-1 pr-0 max-[400px]:pl-4',
    installCopy: 'mr-1 shrink-0 text-[11px] text-content-tertiary',
    installRow: 'flex items-center gap-2 pr-2',
    kicker: 'mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-content-accent',
    mobileHeader:
      'sticky top-0 z-20 hidden h-[81px] items-center justify-between gap-4 border-b border-border-secondary bg-surface-base/90 px-7 backdrop-blur max-[820px]:flex max-[560px]:px-5',
    mobileHeaderActions: 'flex shrink-0 items-center gap-2.5',
    mobileHeaderBrand: 'flex min-w-0 items-baseline gap-2.5',
    navGroup: 'mb-7 grid gap-[3px]',
    navGroupLabel: 'mb-2 text-xs font-bold tracking-[0.01em] text-content-primary',
    navLink:
      'rounded-[7px] px-2 py-1.5 text-[13px] leading-tight transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    navLinkActive: 'bg-fill-secondary-hover font-semibold text-content-primary hover:bg-fill-secondary-pressed',
    navLinkInactive: 'text-content-tertiary',
    navSubGroup: 'mt-3.5 grid gap-[3px] first:mt-0',
    navSubGroupLabel: 'mb-1 pl-2 text-[11px] font-semibold text-content-tertiary',
    note: 'mt-6 rounded-xl bg-surface-secondary p-5 text-sm leading-relaxed text-content-secondary [&_strong]:mb-1.5 [&_strong]:block [&_strong]:font-semibold [&_strong]:text-content-primary',
    pager:
      'mt-8 flex items-center justify-between gap-4 max-[820px]:fixed max-[820px]:inset-x-0 max-[820px]:bottom-0 max-[820px]:z-30 max-[820px]:mt-0 max-[820px]:border-t max-[820px]:border-border-secondary max-[820px]:bg-surface-base/90 max-[820px]:px-5 max-[820px]:pt-3 max-[820px]:pb-[calc(12px+env(safe-area-inset-bottom))] max-[820px]:backdrop-blur',
    pagerLink:
      'rounded-xl border border-border-secondary bg-surface-secondary px-4 py-3 text-sm font-semibold text-content-primary transition-colors hover:bg-fill-secondary-hover',
    platformBadge: 'rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]',
    platformBadgeOff: 'border-border-secondary text-content-tertiary line-through decoration-1',
    platformBadgeOn: 'border-fill-accent-primary/35 bg-fill-accent-primary/10 text-content-accent',
    platformBadges: 'flex shrink-0 items-center gap-1.5 pt-1.5',
    propsIntro: 'mb-4 text-sm leading-6 text-content-secondary',
    propsTable:
      'w-full min-w-[660px] border-collapse text-xs [&_th]:bg-surface-secondary [&_th]:text-left [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-content-tertiary [&_th]:px-3.5 [&_th]:py-[13px] [&_td]:border-b [&_td]:border-border-secondary [&_td]:px-3.5 [&_td]:py-[13px] [&_td]:align-top [&_tbody_tr:last-child_td]:border-b-0',
    propsTableWrap: 'overflow-x-auto rounded-xl border border-border-secondary',
    propsTypeLink:
      'rounded-sm text-content-accent underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current',
    screenshot:
      'mx-0 mb-0 overflow-hidden rounded-2xl border border-border-secondary bg-surface-primary shadow-card-default',
    screenshotDark: 'hidden w-full dark:block',
    screenshotLight: 'block w-full dark:hidden',
    section: `scroll-mt-6 border-b border-border-secondary py-[72px] max-[820px]:py-[60px] ${flow} ${inlineCode} [&>h2+*]:mt-0 [&>h2]:mb-6 [&>h2]:text-[34px] [&>h2]:font-semibold [&>h2]:tracking-[-0.035em] [&>h3]:text-[17px] [&>p]:max-w-[680px] [&>p]:text-base [&>p]:leading-7 [&>p]:text-content-secondary`,
    sidebar:
      'sticky top-0 left-0 flex h-screen flex-col overflow-y-auto border-r border-border-secondary px-7 pb-6 [scrollbar-color:var(--color-gray-5)_transparent] [scrollbar-width:thin] max-[820px]:hidden',
    sidebarBrand: 'flex min-w-0 items-baseline gap-2.5',
    sidebarFooter: 'mt-auto grid gap-2.5 border-t border-border-secondary pt-5 text-[13px]',
    sidebarFooterLink:
      'inline-flex items-center gap-2 text-content-tertiary transition-colors hover:text-content-primary',
    sidebarFooterMark: 'size-4 shrink-0',
    sidebarTop: 'mb-6 flex h-20 shrink-0 items-center',
    site: 'mx-auto grid min-h-screen max-w-[1180px] grid-cols-[240px_minmax(0,1fr)_200px] max-[1180px]:grid-cols-[240px_minmax(0,1fr)] max-[820px]:block',
    tab: 'cursor-pointer rounded-[7px] border border-transparent px-[11px] py-2 text-xs font-semibold transition-colors hover:bg-fill-secondary-hover hover:text-content-primary',
    tabActive: 'border-border-secondary bg-surface-elevated text-content-primary shadow-[0_1px_2px_#0000001f]',
    tabInactive: 'text-content-tertiary',
    tabs: 'flex gap-0.5',
    themeCorner: 'pointer-events-none fixed inset-x-0 top-0 z-50 flex h-20 items-center max-[820px]:hidden',
    themeCornerInner: 'mx-auto flex w-full max-w-[1180px] justify-end px-7 [&>*]:pointer-events-auto',
    toc: 'sticky top-0 h-screen overflow-y-auto px-5 py-[72px] max-[1180px]:hidden',
    tocHeader: 'mb-2 flex items-baseline justify-between gap-2',
    tocLabel: 'text-xs font-bold text-content-primary',
    tocLinkActive: 'bg-fill-secondary-hover font-semibold text-content-primary',
    tocNav:
      'relative grid gap-px pl-3 text-[11px] leading-[1.35] text-content-tertiary [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:transition-colors [&_a:hover]:bg-fill-secondary-hover [&_a:hover]:text-content-primary',
    tocProgress: 'text-[10px] font-semibold tabular-nums text-content-tertiary',
    tocRail: 'absolute inset-y-0 left-0 w-[2px] overflow-hidden rounded-full bg-border-secondary',
    tocRailFill:
      'block w-full rounded-full bg-fill-accent-primary transition-[height] duration-100 ease-out motion-reduce:transition-none',
    tocSection: 'mx-2 mb-1 mt-[22px] text-[11px] font-bold uppercase text-content-primary',
    wordmark: 'text-xl font-bold tracking-[-0.04em]',
  },
})
