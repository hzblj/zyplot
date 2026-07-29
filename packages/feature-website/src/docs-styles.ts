import { tv } from "tailwind-variants";

/**
 * One vertical rhythm for both documentation containers: 24px between blocks,
 * 40px before a subsection heading.
 *
 * The gap belongs to the top of each block, which is what the two `mb-0` rules
 * are for. The slots bring their own bottom margins — `codeBlock` is `my-6`,
 * `kicker` is `mb-5`, `chartIntro` is `mb-8`, `propsIntro` is `mb-4` — and left
 * alone those stack on top of the 24 and give some pairs a larger gap than
 * others. Headings are the exception: they own the space beneath themselves, so
 * whatever follows one takes `mt-0`.
 *
 * Every selector here outweighs `[&>*+*]` on specificity, so the order they
 * land in the stylesheet does not decide the winner. A rule added with a bare
 * `*` would break that.
 *
 * Before this, the spacing was whatever margin each slot happened to bring: a
 * paragraph after a note, a paragraph after a paragraph and a props table after
 * either all measured 0, while their neighbours measured 24.
 */
const flow =
	"[&>*+*]:mt-6 [&>div]:mb-0 [&>h3+*]:mt-0 [&>h3]:mb-6 [&>h3]:mt-10 [&>p]:mb-0";

/**
 * Inline code in running text — `@hzblj/zyplot/ios`, `*.ios.tsx`, a prop name
 * mid-sentence — carries weight, because it had none at all before: a `<code>`
 * got the browser's monospace default, and mono at the body's own size reads
 * smaller than the prose around it. The one thing in the sentence a reader
 * scans for was the one thing set quieter than the rest.
 *
 * Bolding every `<code>` and then standing the two block contexts back down,
 * rather than naming the inline parents. There are a hundred of these across the
 * guides and they sit in paragraphs, headings, notes and callouts — a rule per
 * parent is a rule to forget. A code block set in semibold would be a listing
 * shouting every line, and a props table's `<code>` is already a column.
 *
 * Both resets outweigh the base on specificity, so stylesheet order does not
 * decide it.
 */
const inlineCode =
	"[&_code]:font-semibold [&_pre_code]:font-normal [&_td_code]:font-normal";

export const docsStyles = tv({
	slots: {
		chartDoc: `scroll-mt-6 border-b border-border-secondary pb-[72px] pt-10 ${flow} ${inlineCode} [&_h2]:mb-3 [&_h2]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&>h3]:text-[17px]`,
		chartIntro:
			"mb-8 [&_h2]:mb-3 [&_h2]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&_p:last-child]:max-w-[680px] [&_p:last-child]:text-base [&_p:last-child]:leading-7 [&_p:last-child]:text-content-secondary",
		galleryImage: "mx-auto block w-full max-w-[520px]",
		galleryImageDark: "mx-auto hidden w-full max-w-[520px] dark:block",
		galleryImageLight: "mx-auto block w-full max-w-[520px] dark:hidden",
		galleryMeta:
			"border-t border-border-secondary px-4 py-3 text-[13px] text-content-tertiary [&_a]:font-medium [&_a]:text-content-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity [&_a:hover]:opacity-70",
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
			"cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-fill-secondary-hover hover:text-content-primary",
		compactPreview: "flex min-h-[280px] items-center px-[12%]",
		/**
		 * `px-10` rather than the 16 it was. The grid caps at 1180 to stay aligned
		 * with the marketing container, which leaves this column 740px wide — at 64px
		 * of padding a side the measure came to 612, and a props table declares
		 * `min-w-[660px]`, so every one of them opened already scrolled sideways.
		 *
		 * The two mobile gutters are the header's, which are the marketing page's:
		 * `px-5` on a phone, `px-7` from 560 up, so the prose starts under the
		 * wordmark rather than 8px inside it through that range.
		 */
		content:
			"min-w-0 px-10 pb-40 max-[820px]:px-7 max-[820px]:pb-24 max-[560px]:px-5",
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
		/**
		 * `h-20` and the marketing gutters, both to the letter: this row and the
		 * landing page's nav are the two headers a reader crosses between, so the
		 * wordmark has to land on the same pixel in both. It used to be 64px tall at
		 * a flat `px-5`, which moved the logo up 8px on every hop into the docs and
		 * sideways by another 8 between 560 and 820px.
		 *
		 * 81px, not 80, and the odd pixel is the rule underneath. Preflight sizes
		 * boxes with `border-box`, so `h-20` and a bottom border leave a 79px content
		 * box for `items-center` to work in — the wordmark centred half a pixel above
		 * where the nav puts it, and rendered a shade softer for it.
		 */
		mobileHeader:
			"sticky top-0 z-20 hidden h-[81px] items-center justify-between gap-4 border-b border-border-secondary bg-surface-base/90 px-7 backdrop-blur max-[820px]:flex max-[560px]:px-5",
		mobileHeaderActions: "flex shrink-0 items-center gap-2.5",
		/**
		 * No colour on the row. It used to carry `text-content-tertiary` for the
		 * "Docs" label beside the wordmark, and the wordmark inherited it — the
		 * logo's letters came out grey on every phone while its mark stayed accent
		 * purple. The label owns its own colour instead.
		 */
		mobileHeaderBrand: "flex min-w-0 items-baseline gap-2.5",
		/** Shared with `sidebarBrand`: one "Docs" beside the wordmark, one size. */
		brandLabel: "text-sm text-content-tertiary",
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
			"rounded-[7px] px-2 py-1.5 text-[13px] leading-tight transition-colors hover:bg-fill-secondary-hover hover:text-content-primary",
		/** One step past its rest fill, or hovering the page you are on does nothing. */
		navLinkActive:
			"bg-fill-secondary-hover font-semibold text-content-primary hover:bg-fill-secondary-pressed",
		navLinkInactive: "text-content-tertiary",
		pager: "mt-8 flex items-center justify-between gap-4",
		pagerLink:
			"rounded-xl border border-border-secondary bg-surface-secondary px-4 py-3 text-sm font-semibold text-content-primary transition-colors hover:bg-fill-secondary-hover",
		/**
		 * A titled aside. Fill, full radius, and the lead-in promoted to a line of
		 * its own — the presence comes from the type, not from a rule down the side.
		 *
		 * What it replaced was an accent bar against `rounded-r` only: square down
		 * the left, round on the right, and the loudest colour on the page spent on
		 * a 2px decoration. It also made every aside shout equally, which is the
		 * opposite of what an aside is for.
		 *
		 * `[&_strong]:block` is what turns the existing markup into a title without
		 * touching a single note. Every one already opens with a `<strong>`
		 * sentence, and the chart callout already follows its own with a `<p>`.
		 * Sentence case, because the lead-ins carry `iOS`, `tsc` and inline
		 * `<code>` that an uppercase eyebrow would flatten.
		 */
		note: "mt-6 rounded-xl bg-surface-secondary p-5 text-sm leading-relaxed text-content-secondary [&_strong]:mb-1.5 [&_strong]:block [&_strong]:font-semibold [&_strong]:text-content-primary",
		propsIntro: "mb-4 text-sm leading-6 text-content-secondary",
		propsTable:
			"w-full min-w-[660px] border-collapse text-xs [&_th]:bg-surface-secondary [&_th]:text-left [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-content-tertiary [&_th]:px-3.5 [&_th]:py-[13px] [&_td]:border-b [&_td]:border-border-secondary [&_td]:px-3.5 [&_td]:py-[13px] [&_td]:align-top [&_tbody_tr:last-child_td]:border-b-0",
		propsTableWrap: "overflow-x-auto rounded-xl border border-border-secondary",
		propsTypeLink:
			"rounded-sm text-content-accent underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current",
		section: `scroll-mt-6 border-b border-border-secondary py-[72px] max-[820px]:py-[60px] ${flow} ${inlineCode} [&>h2+*]:mt-0 [&>h2]:mb-6 [&>h2]:text-[34px] [&>h2]:font-semibold [&>h2]:tracking-[-0.035em] [&>h3]:text-[17px] [&>p]:max-w-[680px] [&>p]:text-base [&>p]:leading-7 [&>p]:text-content-secondary`,
		/**
		 * No top padding: `sidebarTop` is a fixed 80px band that stands in for the
		 * header this column replaces, and the padding used to sit on top of it.
		 */
		sidebar:
			"sticky top-0 left-0 flex h-screen flex-col overflow-y-auto border-r border-border-secondary px-7 pb-6 [scrollbar-color:var(--color-gray-5)_transparent] [scrollbar-width:thin] max-[820px]:hidden",
		/**
		 * Stacked, not a row. Two links reading "GitHub" and "Buy me a coffee" come
		 * to roughly 200px of text in a 208px column, so side by side they had
		 * nothing between them and wrapped at the first narrow viewport.
		 */
		sidebarFooter:
			"mt-auto grid gap-2.5 border-t border-border-secondary pt-5 text-[13px]",
		sidebarFooterLink:
			"inline-flex items-center gap-2 text-content-tertiary transition-colors hover:text-content-primary",
		sidebarFooterMark: "size-4 shrink-0",
		/**
		 * The desktop stand-in for the marketing nav, and the reason the wordmark
		 * does not move when a reader clicks into the docs: same 80px band, same
		 * `items-center`, same brand group inside it as `mobileHeader`. Anything that
		 * changes the height here has to change there and in `marketingStyles.nav`.
		 *
		 * The 24px beneath it replaces the old `pt-7` plus `mb-11`, which put the
		 * first nav group 101px down — this lands it at 104.
		 */
		sidebarTop: "mb-6 flex h-20 shrink-0 items-center",
		/** Baseline-aligned, so "Docs" sits on the wordmark's own baseline. */
		sidebarBrand: "flex min-w-0 items-baseline gap-2.5",
		/**
		 * 1180 rather than 1344, and both rails narrower with it. The wordmark in
		 * `sidebarTop` has to sit at the same x as the one in the marketing nav, and
		 * that nav is a `max-w-[1180px]` container with the same `px-7` — a wider grid
		 * here dragged the logo 82px left of where the landing page left it on a
		 * 1440px screen. The cost is the 120px the content column gives up, which
		 * `content` buys most of back in padding.
		 *
		 * `minmax(0,1fr)` on the middle column, not a pixel cap. A capped column
		 * leaves free space the grid then has to distribute, and `justify-center`
		 * spent it on both margins — which moved the sidebar, and the logo with it,
		 * by up to 20px through the 1060–1180 range.
		 */
		site: "mx-auto grid min-h-screen max-w-[1180px] grid-cols-[240px_minmax(0,1fr)_200px] max-[1180px]:grid-cols-[240px_minmax(0,1fr)] max-[820px]:block",
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
		toc: "sticky top-0 h-screen overflow-y-auto px-5 py-[72px] max-[1180px]:hidden",
		tocLabel: "mb-2 text-xs font-bold text-content-primary",
		tocSection:
			"mx-2 mb-1 mt-[22px] text-[11px] font-bold uppercase text-content-primary",
		tocNav:
			"grid gap-px text-[11px] leading-[1.35] text-content-tertiary [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:transition-colors [&_a:hover]:bg-fill-secondary-hover [&_a:hover]:text-content-primary",
		/**
		 * Desktop only. The mobile header owns a toggle of its own, and this one is
		 * pinned over the same row — both together read as two controls.
		 *
		 * A full-width band rather than the `right-5 top-5` corner it was. The toggle
		 * has to land where the marketing nav's own toggle sits, and that one is the
		 * last item in a centred `max-w-[1180px] px-7` row 80px tall — a viewport
		 * corner is 138px to the right of it and 20px above on a 1440px screen.
		 *
		 * `pointer-events-none` is load-bearing now that the band is the full width:
		 * it spans the top 80px of the page, which is the sidebar's brand row and the
		 * link home inside it. The toggle takes its own events back.
		 */
		themeCorner:
			"pointer-events-none fixed inset-x-0 top-0 z-50 flex h-20 items-center max-[820px]:hidden",
		themeCornerInner:
			"mx-auto flex w-full max-w-[1180px] justify-end px-7 [&>*]:pointer-events-auto",
		/** Matches the marketing nav's brand link — opacity reads in both themes. */
		brandLink: "transition-opacity hover:opacity-70",
		wordmark: "text-xl font-bold tracking-[-0.04em]",
	},
});
