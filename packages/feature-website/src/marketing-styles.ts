import { tv } from "tailwind-variants";

export const marketingStyles = tv({
	slots: {
		actions: "mt-[38px] flex flex-wrap items-center gap-[22px]",
		chartCard:
			"overflow-hidden rounded-3xl border border-border-secondary bg-chart-surface p-[22px] shadow-card-default",
		/** One label, on the right — the card needs no title to say it is a chart. */
		chartHeader: "mb-6 flex items-center justify-end",
		/** Same story as the hero: the `h2` carries no size or margin on its own. */
		platform:
			"min-h-[250px] border-l border-border-secondary px-9 py-12 first:border-l-0 max-[800px]:border-l-0 max-[800px]:border-t max-[800px]:first:border-t-0 [&_h2]:mb-2.5 [&_h2]:mt-4 [&_h2]:text-[19px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:text-content-secondary",
		platformNumber: "font-mono text-content-accent",
		platforms:
			"mx-auto grid max-w-[1180px] grid-cols-3 border-t border-border-secondary px-7 max-[800px]:grid-cols-1",
		/**
		 * The `h1` rules are load-bearing. Preflight resets a heading to body size,
		 * body weight and zero margin, and nothing else on this page styles it — so
		 * without them the headline and the lede render as two indistinguishable
		 * paragraphs with no space between them.
		 */
		hero: "mx-auto grid min-h-[680px] max-w-[1180px] grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] items-center gap-[68px] px-7 max-[800px]:grid-cols-1 max-[800px]:py-20 [&_h1]:mb-[26px] [&_h1]:text-[clamp(46px,5.4vw,68px)] [&_h1]:font-bold [&_h1]:leading-[1] [&_h1]:tracking-[-.055em]",
		install:
			"flex items-center gap-2 rounded-full border border-border-secondary bg-surface-secondary py-2.5 pl-3 pr-2",
		installCommand: "whitespace-nowrap px-1 text-[13px] text-content-secondary",
		installCopy:
			"flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-content-tertiary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary",
		installCopyIcon: "size-3.5",
		/**
		 * No colour on the base class: `cn` is a plain join, so a colour here and
		 * another on the active variant would both survive and CSS order would pick
		 * the winner. Each state carries its own, as in the docs tabs.
		 */
		installTab:
			"cursor-pointer rounded-full px-2 py-1 text-[11px] font-semibold transition-colors",
		installTabActive: "bg-fill-secondary-hover text-content-primary",
		installTabInactive: "text-content-tertiary hover:text-content-primary",
		installTabs: "flex items-center gap-0.5",
		lede: "max-w-[620px] text-xl leading-[1.55] text-content-secondary",
		nav: "mx-auto flex h-20 max-w-[1180px] items-center justify-between px-7",
		navGithub: "inline-flex items-center gap-2 hover:text-content-primary",
		navGithubMark: "size-4 shrink-0",
		navLinks: "flex items-center gap-7 text-content-tertiary",
		primaryButton:
			"rounded-full bg-fill-accent-primary px-[22px] py-3.5 font-bold text-content-on-bg",
		status: "text-xs font-bold uppercase tracking-[0.12em] text-content-accent",
		wordmark: "text-xl font-bold tracking-[-0.04em]",
	},
});
