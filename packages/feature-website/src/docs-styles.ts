import { tv } from "tailwind-variants";

export const docsStyles = tv({
	slots: {
		callout:
			"mt-6 rounded-r-[10px] border-l-2 border-fill-accent-primary bg-surface-secondary px-[18px] py-4 text-sm leading-relaxed text-content-secondary",
		chartDoc:
			"scroll-mt-6 border-b border-border-secondary py-[88px] [&_h2]:mb-[18px] [&_h2]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&_h3]:mb-4 [&_h3]:mt-10 [&_h3]:text-[17px]",
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
		feature:
			"-mr-px border border-border-secondary p-6 max-[820px]:-mb-px max-[820px]:mr-0",
		featureGrid:
			"mt-8 grid grid-cols-3 gap-px overflow-hidden max-[820px]:grid-cols-1",
		hero: "scroll-mt-6 border-b border-border-secondary pb-[72px] pt-[108px] max-[820px]:pt-[72px] [&_h1]:mb-[30px] [&_h1]:text-[clamp(52px,6vw,76px)] [&_h1]:font-bold [&_h1]:leading-[.98] [&_h1]:tracking-[-.06em] [&>p:last-child]:max-w-[680px] [&>p:last-child]:text-base [&>p:last-child]:leading-7 [&>p:last-child]:text-content-secondary",
		kicker:
			"mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-content-accent",
		mobileHeader:
			"sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-border-secondary bg-surface-base/90 px-5 backdrop-blur max-[820px]:flex",
		navGroup: "mb-7 grid gap-[3px]",
		navGroupLabel:
			"mb-2 text-xs font-bold tracking-[0.01em] text-content-primary",
		navLink:
			"rounded-[7px] px-2 py-1.5 text-[13px] leading-tight text-content-tertiary hover:bg-fill-secondary-hover hover:text-content-primary",
		note: "mt-6 rounded-r-[10px] border-l-2 border-fill-accent-primary bg-surface-secondary px-[18px] py-4 text-sm leading-relaxed text-content-secondary",
		propsTable:
			"w-full min-w-[660px] border-collapse text-xs [&_th]:bg-surface-secondary [&_th]:text-left [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-content-tertiary [&_th]:px-3.5 [&_th]:py-[13px] [&_td]:border-b [&_td]:border-border-secondary [&_td]:px-3.5 [&_td]:py-[13px] [&_td]:align-top [&_tbody_tr:last-child_td]:border-b-0",
		propsTableWrap: "overflow-x-auto rounded-xl border border-border-secondary",
		section:
			"scroll-mt-6 border-b border-border-secondary py-[72px] max-[820px]:py-[60px] [&>h2]:mb-[18px] [&>h2]:text-[34px] [&>h2]:font-semibold [&>h2]:tracking-[-0.035em] [&>h3]:mb-4 [&>h3]:mt-10 [&>h3]:text-[17px] [&>p]:max-w-[680px] [&>p]:text-base [&>p]:leading-7 [&>p]:text-content-secondary [&>pre]:mt-6",
		sectionDivider:
			"flex items-center justify-between border-b border-border-secondary pb-6 pt-[72px]",
		sidebar:
			"sticky top-0 left-0 flex h-screen flex-col overflow-y-auto border-r border-border-secondary px-7 pb-6 pt-7 max-[820px]:hidden",
		sidebarFooter:
			"mt-auto flex items-center justify-between border-t border-border-secondary pt-5 text-[13px]",
		sidebarTop: "mb-11 flex items-baseline gap-2.5",
		site: "mx-auto grid min-h-screen max-w-[1344px] grid-cols-[264px_minmax(0,860px)_220px] justify-center max-[1180px]:grid-cols-[240px_minmax(0,820px)] max-[820px]:block",
		tab: "rounded-[7px] px-[11px] py-2 text-xs font-semibold text-content-tertiary",
		tabActive:
			"bg-surface-primary text-content-primary shadow-[0_1px_2px_#00000014]",
		tabs: "flex gap-0.5",
		toc: "sticky top-0 h-screen overflow-y-auto px-6 py-[72px] max-[1180px]:hidden",
		tocLabel: "mb-2 text-xs font-bold text-content-primary",
		tocSection:
			"mx-2 mb-1 mt-[22px] text-[11px] font-bold uppercase text-content-primary",
		tocNav: "grid gap-0.5",
		wordmarkRow: "mb-11 flex items-baseline gap-2.5",
		wordmark: "text-xl font-bold tracking-[-0.04em]",
	},
});
