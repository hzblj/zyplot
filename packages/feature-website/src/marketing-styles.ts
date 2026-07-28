import { tv } from "tailwind-variants";

export const marketingStyles = tv({
	slots: {
		actions: "mt-[38px] flex flex-wrap items-center gap-[22px]",
		chartCard:
			"overflow-hidden rounded-3xl border border-border-secondary bg-chart-surface p-[22px] shadow-card-default",
		chartHeader: "mb-6 flex items-center justify-between",
		code: "rounded-xl border border-border-secondary bg-surface-secondary px-[18px] py-3.5 text-content-secondary",
		eyebrow:
			"text-xs font-bold uppercase tracking-[0.12em] text-content-accent",
		hero: "mx-auto grid min-h-[680px] max-w-[1180px] grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] items-center gap-[68px] px-7 max-[800px]:grid-cols-1 max-[800px]:py-20",
		lede: "max-w-[620px] text-xl leading-[1.55] text-content-secondary",
		nav: "mx-auto flex h-20 max-w-[1180px] items-center justify-between px-7",
		navLinks: "flex items-center gap-7 text-content-tertiary",
		platform:
			"min-h-[250px] border-l border-border-secondary px-9 py-12 first:border-l-0 max-[800px]:border-l-0 max-[800px]:border-t max-[800px]:first:border-t-0",
		platformNumber: "font-mono text-content-accent",
		platforms:
			"mx-auto grid max-w-[1180px] grid-cols-3 border-t border-border-secondary px-7 max-[800px]:grid-cols-1",
		primaryButton:
			"rounded-full bg-fill-accent-primary px-[22px] py-3.5 font-bold text-content-on-bg",
		status: "text-xs font-bold uppercase tracking-[0.12em] text-content-accent",
		wordmark: "text-xl font-bold tracking-[-0.04em]",
	},
});
