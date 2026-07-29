import { tv } from "tailwind-variants";

export const marketingStyles = tv({
	slots: {
		actions: "mt-[38px] flex flex-wrap items-center gap-[22px]",
		/**
		 * Less padding on a phone. The section already insets by `px-5` there, and
		 * 22 on top of it spent a quarter of a 393px screen on gutters — the plot
		 * inside is the widest thing the page has to show.
		 */
		chartCard:
			"overflow-hidden rounded-3xl border border-border-secondary bg-chart-surface p-[22px] shadow-card-default max-[560px]:p-3.5",
		/** One label, on the right — the card needs no title to say it is a chart. */
		chartHeader: "mb-6 flex items-center justify-end",
		/**
		 * Same story as the hero: the `h2` carries no size or margin on its own.
		 *
		 * One column drops the horizontal padding. The section already insets by
		 * `px-7`, and stacked cards added their own on top of it — the copy sat
		 * 64px in while the headline above it started at 28.
		 */
		platform:
			"min-h-[250px] border-l border-border-secondary px-9 py-12 first:border-l-0 max-[800px]:min-h-0 max-[800px]:border-l-0 max-[800px]:border-t max-[800px]:px-0 max-[800px]:py-10 max-[800px]:first:border-t-0 [&_h2]:mb-2.5 [&_h2]:mt-4 [&_h2]:text-[19px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:text-content-secondary",
		platformNumber: "font-mono text-content-accent",
		platforms:
			"mx-auto grid max-w-[1180px] grid-cols-3 border-t border-border-secondary px-7 max-[800px]:grid-cols-1 max-[560px]:px-5",
		/**
		 * The `h1` rules are load-bearing. Preflight resets a heading to body size,
		 * body weight and zero margin, and nothing else on this page styles it — so
		 * without them the headline and the lede render as two indistinguishable
		 * paragraphs with no space between them.
		 */
		hero: "mx-auto grid min-h-[680px] max-w-[1180px] grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] items-center gap-[68px] px-7 max-[800px]:grid-cols-1 max-[800px]:py-20 max-[560px]:px-5 [&_h1]:mb-[26px] [&_h1]:text-[clamp(46px,5.4vw,68px)] [&_h1]:font-bold [&_h1]:leading-[1] [&_h1]:tracking-[-.055em]",
		/**
		 * A row on desktop, a stack below 800px.
		 *
		 * Four package-manager tabs, a non-wrapping command and a copy button add up
		 * to 442px, which is wider than any phone — the pill used to hang off the
		 * right edge and take the whole page's horizontal scroll with it. Stacked it
		 * fills the column instead and the command moves under the tabs.
		 *
		 * 800px rather than the 560 it used to be: that is where the hero drops to
		 * one column, so the pill stacks exactly when it stops sharing its row with
		 * the chart. In between the two it was a 442px pill floating in a 700px
		 * column next to the button, which read as neither layout.
		 */
		install:
			"flex items-center gap-2 rounded-full border border-border-secondary bg-surface-secondary py-2.5 pl-3 pr-2 max-[800px]:w-full max-[800px]:flex-wrap max-[800px]:gap-y-1.5 max-[800px]:rounded-[22px] max-[800px]:px-3",
		/**
		 * `flex-1` with `min-w-0` on the second row: it holds the copy button out at
		 * the right edge the way it sits on desktop, and lets a command longer than
		 * the row scroll on its own instead of widening the pill.
		 */
		installCommand:
			"whitespace-nowrap px-1 text-[13px] text-content-secondary max-[800px]:min-w-0 max-[800px]:flex-1 max-[800px]:overflow-x-auto max-[800px]:px-0.5",
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
		/** The selected tab still answers the pointer, one step further than its rest fill. */
		installTabActive:
			"bg-fill-secondary-hover text-content-primary hover:bg-fill-secondary-pressed",
		installTabInactive: "text-content-tertiary hover:text-content-primary",
		/** Its own row once stacked, so the command below keeps the copy button. */
		installTabs: "flex items-center gap-0.5 max-[800px]:w-full",
		lede: "max-w-[620px] text-xl leading-[1.55] text-content-secondary",
		/** The wordmark is a link home on every page; opacity says so in both themes. */
		brandLink: "transition-opacity hover:opacity-70",
		menuIconLink:
			"inline-flex items-center gap-2.5 rounded-[9px] px-2 py-2.5 text-content-secondary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary",
		menuLink:
			"rounded-[9px] px-2 py-2.5 text-content-secondary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary",
		menuNav: "grid gap-px text-[15px]",
		/** `px-5` on a phone is the docs header's gutter, so the two headers line up. */
		nav: "mx-auto flex h-20 max-w-[1180px] items-center justify-between gap-4 px-7 max-[560px]:px-5",
		navActions: "flex shrink-0 items-center gap-7 max-[820px]:gap-2.5",
		navIconLink:
			"inline-flex items-center gap-2 transition-colors hover:text-content-primary",
		navMark: "size-4 shrink-0",
		navLink: "transition-colors hover:text-content-primary",
		navLinks:
			"flex items-center gap-7 text-content-tertiary max-[820px]:hidden",
		/** The one accent button on the site, so it is the one that has to answer. */
		primaryButton:
			"rounded-full bg-fill-accent-primary px-[22px] py-3.5 font-bold text-content-on-bg transition-colors hover:bg-fill-accent-hover active:bg-fill-accent-pressed",
		status: "text-xs font-bold uppercase tracking-[0.12em] text-content-accent",
		wordmark: "text-xl font-bold tracking-[-0.04em]",
	},
});
