import { tv } from "tailwind-variants";

export const docsStyles = tv({
	slots: {
		callout:
			"mt-6 rounded-r-[10px] border-l-2 border-fill-accent-primary bg-surface-secondary px-[18px] py-4 text-sm leading-relaxed text-content-secondary",
		chartDoc:
			"scroll-mt-6 border-b border-border-secondary pb-[72px] pt-10 [&_h2]:mb-3 [&_h2]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&_h3]:mb-4 [&_h3]:mt-10 [&_h3]:text-[17px]",
		chartIntro:
			"mb-8 [&_h2]:mb-3 [&_h2]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&_p:last-child]:max-w-[680px] [&_p:last-child]:text-base [&_p:last-child]:leading-7 [&_p:last-child]:text-content-secondary",
		galleryImage: "mx-auto block w-full max-w-[520px]",
		galleryImageDark: "mx-auto hidden w-full max-w-[520px] dark:block",
		galleryImageLight: "mx-auto block w-full max-w-[520px] dark:hidden",
		galleryMeta:
			"border-t border-border-secondary px-4 py-3 text-[13px] text-content-tertiary [&_a]:font-medium [&_a]:text-content-accent [&_a]:underline [&_a]:underline-offset-2",
		/**
		 * Exactly what the capture harness paints behind the card, so the
		 * screenshot dissolves into the container instead of landing as a patch of
		 * a second, slightly different grey. Changing one without the other brings
		 * the seam straight back.
		 *
		 * The two modes are not the same token. Light nests white card on
		 * `#fafafa` on white box — three steps close enough to read as one
		 * surface. The same nesting in dark put `#0a0a0a` between a `#171717` card
		 * and a `#171717` box, which reads as a black moat rather than an inset,
		 * so dark sits the stage flush with the box and lifts the card instead.
		 */
		galleryStage: "bg-[#fafafa] px-4 py-6 dark:bg-[#171717]",
		chartTitleRow:
			"flex items-start justify-between gap-6 max-[560px]:flex-col max-[560px]:gap-3",
		platformBadge:
			"rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]",
		platformBadgeOff:
			"border-border-secondary text-content-tertiary line-through decoration-1",
		platformBadgeOn:
			"border-fill-accent-primary/35 bg-fill-accent-primary/10 text-content-accent",
		platformBadges: "flex shrink-0 items-center gap-1.5 pt-1.5",
		codeBlock:
			"my-6 overflow-hidden rounded-xl border border-border-secondary bg-surface-secondary shadow-card-default",
		codeBlockBody:
			"m-0 overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6 text-content-primary",
		codeBlockHeader:
			"flex h-10 items-center justify-between border-b border-border-secondary px-4 text-[11px] font-medium text-content-tertiary",
		codeCopy:
			"cursor-pointer rounded-md px-2 py-1 hover:bg-fill-secondary-hover hover:text-content-primary",
		compactPreview: "flex min-h-[280px] items-center px-[12%]",
		content: "min-w-0 px-16 pb-40 max-[820px]:px-5 max-[820px]:pb-24",
		example:
			"overflow-hidden rounded-2xl border border-border-secondary bg-surface-primary shadow-card-default",
		exampleBar:
			"flex min-h-12 items-center justify-between border-b border-border-secondary bg-surface-secondary px-3 py-1.5 text-[11px] text-content-tertiary",
		exampleCode:
			"m-0 min-h-[350px] overflow-x-auto rounded-none border-0 bg-surface-secondary px-6 py-[22px] font-mono text-[13px] leading-7 text-content-secondary",
		examplePreview:
			"min-h-[350px] p-[30px] max-[820px]:min-h-[300px] max-[820px]:px-3 max-[820px]:py-5",
		hero: "scroll-mt-6 border-b border-border-secondary pb-[72px] pt-[108px] max-[820px]:pt-[72px] [&_h1]:mb-[30px] [&_h1]:text-[clamp(52px,6vw,76px)] [&_h1]:font-bold [&_h1]:leading-[.98] [&_h1]:tracking-[-.06em] [&>p:last-child]:max-w-[680px] [&>p:last-child]:text-base [&>p:last-child]:leading-7 [&>p:last-child]:text-content-secondary",
		kicker:
			"mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-content-accent",
		mobileHeader:
			"sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-border-secondary bg-surface-base/90 px-5 backdrop-blur max-[820px]:flex",
		navGroup: "mb-7 grid gap-[3px]",
		navGroupLabel:
			"mb-2 text-xs font-bold tracking-[0.01em] text-content-primary",
		/**
		 * No colour here. `cn` is a plain join with no Tailwind conflict
		 * resolution, so a colour on the base class and another on the active one
		 * both survive into the class list and CSS order decides the winner — the
		 * active link came out grey. The two states carry their own colour instead.
		 */
		navLink:
			"rounded-[7px] px-2 py-1.5 text-[13px] leading-tight hover:bg-fill-secondary-hover hover:text-content-primary",
		navLinkActive: "bg-fill-secondary-hover font-semibold text-content-primary",
		navLinkInactive: "text-content-tertiary",
		pager: "mt-8 flex items-center justify-between gap-4",
		pagerLink:
			"rounded-xl border border-border-secondary bg-surface-secondary px-4 py-3 text-sm font-semibold text-content-primary hover:bg-fill-secondary-hover",
		note: "mt-6 rounded-r-[10px] border-l-2 border-fill-accent-primary bg-surface-secondary px-[18px] py-4 text-sm leading-relaxed text-content-secondary",
		propsIntro: "mb-4 text-sm leading-6 text-content-secondary",
		propsTable:
			"w-full min-w-[660px] border-collapse text-xs [&_th]:bg-surface-secondary [&_th]:text-left [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-content-tertiary [&_th]:px-3.5 [&_th]:py-[13px] [&_td]:border-b [&_td]:border-border-secondary [&_td]:px-3.5 [&_td]:py-[13px] [&_td]:align-top [&_tbody_tr:last-child_td]:border-b-0",
		propsTableWrap: "overflow-x-auto rounded-xl border border-border-secondary",
		propsTypeLink:
			"rounded-sm text-content-accent underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current",
		section:
			"scroll-mt-6 border-b border-border-secondary py-[72px] max-[820px]:py-[60px] [&>h2]:mb-[18px] [&>h2]:text-[34px] [&>h2]:font-semibold [&>h2]:tracking-[-0.035em] [&>h3]:mb-4 [&>h3]:mt-10 [&>h3]:text-[17px] [&>p]:max-w-[680px] [&>p]:text-base [&>p]:leading-7 [&>p]:text-content-secondary [&>pre]:mt-6",
		sidebar:
			"sticky top-0 left-0 flex h-screen flex-col overflow-y-auto border-r border-border-secondary px-7 pb-6 pt-7 [scrollbar-color:var(--color-gray-5)_transparent] [scrollbar-width:thin] max-[820px]:hidden",
		sidebarFooter:
			"mt-auto flex items-center justify-between border-t border-border-secondary pt-5 text-[13px]",
		sidebarFooterLink:
			"inline-flex items-center gap-2 text-content-tertiary hover:text-content-primary",
		sidebarFooterMark: "size-4 shrink-0",
		sidebarTop: "mb-11 flex items-baseline gap-2.5",
		site: "mx-auto grid min-h-screen max-w-[1344px] grid-cols-[264px_minmax(0,860px)_220px] justify-center max-[1180px]:grid-cols-[240px_minmax(0,820px)] max-[820px]:block",
		/**
		 * The transparent border is load-bearing: the active state adds a real one,
		 * and without a placeholder every tab would shift a pixel on selection.
		 */
		tab: "cursor-pointer rounded-[7px] border border-transparent px-[11px] py-2 text-xs font-semibold transition-colors hover:bg-fill-secondary-hover hover:text-content-primary",
		/**
		 * `surface-primary` used to be the fill here, which is the same colour as
		 * the bar it sits on in dark mode — the active tab was invisible. An
		 * elevated fill plus a border reads in both themes.
		 */
		tabActive:
			"border-border-secondary bg-surface-elevated text-content-primary shadow-[0_1px_2px_#0000001f]",
		tabInactive: "text-content-tertiary",
		tabs: "flex gap-0.5",
		toc: "sticky top-0 h-screen overflow-y-auto px-6 py-[72px] max-[1180px]:hidden",
		tocLabel: "mb-2 text-xs font-bold text-content-primary",
		tocSection:
			"mx-2 mb-1 mt-[22px] text-[11px] font-bold uppercase text-content-primary",
		tocNav:
			"grid gap-px text-[11px] leading-[1.35] text-content-tertiary [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a:hover]:bg-fill-secondary-hover [&_a:hover]:text-content-primary",
		themeCorner: "fixed right-5 top-5 z-50",
		wordmarkRow: "mb-11 flex items-baseline gap-2.5",
		wordmark: "text-xl font-bold tracking-[-0.04em]",
	},
});
