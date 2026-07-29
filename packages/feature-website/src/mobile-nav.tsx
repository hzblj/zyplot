"use client";

import { usePathname } from "next/navigation";
import {
	type MouseEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { tv } from "tailwind-variants";
import { CloseIcon, MenuIcon } from "./icons";
import { cn } from "./utils";

/**
 * 820px is where the docs sidebar goes away, so it is also where the drawer
 * becomes the only way to reach the nav. Above it every part of this component
 * is hidden, and the listener below closes an open drawer on the way up — a
 * rotation past the breakpoint would otherwise leave the scroll lock on with
 * nothing visible to explain it.
 */
const DESKTOP_QUERY = "(min-width: 821px)";

const mobileNav = tv({
	slots: {
		/**
		 * Duration and easing live on the two state classes, not here. `cn` is a
		 * plain join with no Tailwind conflict resolution, so a duration on the base
		 * and another on a state would both survive and CSS order would pick the
		 * winner — which is also what makes the asymmetry below possible.
		 */
		backdrop:
			"absolute inset-0 cursor-pointer bg-black/45 transition-opacity motion-reduce:transition-none",
		backdropClosed: "pointer-events-none opacity-0 duration-200",
		backdropOpen: "pointer-events-auto opacity-100 duration-300",
		close:
			"flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[9px] text-content-tertiary transition-colors hover:bg-fill-secondary-hover hover:text-content-primary",
		icon: "size-4",
		panel:
			"pointer-events-auto absolute right-0 top-0 flex h-full w-[min(320px,86vw)] flex-col overflow-y-auto border-l border-border-secondary bg-surface-base px-5 pb-8 pt-4 shadow-card-elevated transition-transform motion-reduce:transition-none [scrollbar-color:var(--color-gray-5)_transparent] [scrollbar-width:thin]",
		/** Accelerating out of view, and quicker: leaving needs no announcing. */
		panelClosed: "translate-x-full duration-200 ease-[cubic-bezier(.4,0,1,1)]",
		/**
		 * Arriving decelerates into place on the same curve the docs page
		 * transitions use, over a longer 300ms — the drawer is what the reader
		 * asked for, so it is the half worth watching.
		 */
		panelOpen: "translate-x-0 duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
		panelTop: "mb-6 flex h-8 items-center justify-between",
		panelTitle:
			"text-[11px] font-bold uppercase tracking-[0.12em] text-content-tertiary",
		trigger:
			"flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-secondary bg-fill-secondary-primary text-content-secondary shadow-card-default transition-colors hover:bg-fill-secondary-hover hover:text-content-primary min-[821px]:hidden",
		/**
		 * The clip. A drawer parked at `translate-x-full` sits outside the viewport,
		 * and an off-screen box still counts towards the document's scrollable
		 * width — the page picked up 320px of horizontal scroll with the drawer shut.
		 *
		 * `clip` rather than `hidden`, and the difference is the whole opening
		 * animation. Both crop, but `hidden` leaves a scroll container behind, and
		 * focusing the close button scrolled it 320px sideways to reveal the panel
		 * that was still parked — the drawer arrived instantly and only the closing
		 * half ever animated. `clip` cannot be scrolled at all.
		 */
		viewport:
			"pointer-events-none fixed inset-0 z-[60] overflow-clip min-[821px]:hidden",
	},
});

const styles = mobileNav();

/**
 * The hamburger and the panel it opens — the mobile counterpart of a sidebar.
 *
 * The panel is portalled to the body rather than left where it is written. The
 * docs header it renders inside carries `backdrop-blur`, and a filter makes an
 * element the containing block for its fixed-position descendants: in place, the
 * drawer anchored to the header instead of the viewport.
 *
 * `children` are plain elements rather than a render prop taking `close`,
 * because the marketing nav is a server component and a function cannot cross
 * that boundary. Closing on navigation is handled here instead, twice over: the
 * open state is keyed to the pathname, and one delegated handler on the panel
 * catches any anchor click. The handler is not redundant — a link pointing at
 * the page already open changes no pathname, and without it the drawer would
 * stay standing over the page it just confirmed.
 *
 * The panel stays mounted so both directions of the slide animate. `inert` keeps
 * the closed one out of the tab order and off the accessibility tree, which a
 * transform on its own does not.
 */
export const MobileNav = ({ children }: { children: ReactNode }) => {
	/**
	 * The page the drawer was opened on, rather than a boolean.
	 *
	 * Navigating then closes it in render: the pathname no longer matches what
	 * was stored, so there is no effect resetting state after the new page has
	 * already painted with the drawer still over it.
	 */
	const [openedAt, setOpenedAt] = useState<string | null>(null);
	/** The portal needs a document, so the drawer lands on the first client pass. */
	const [isMounted, setIsMounted] = useState(false);
	const pathname = usePathname();
	const closeRef = useRef<HTMLButtonElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const isOpen = openedAt === pathname;

	/** Focus goes back to the hamburger, or it lands on the body. */
	const close = () => {
		setOpenedAt(null);
		triggerRef.current?.focus({ preventScroll: true });
	};

	/** Any link in the panel closes it, wherever in the tree the caller put it. */
	const onPanelClick = (event: MouseEvent<HTMLDivElement>) => {
		if ((event.target as HTMLElement).closest("a")) {
			setOpenedAt(null);
		}
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const desktop = window.matchMedia(DESKTOP_QUERY);
		const previousOverflow = document.body.style.overflow;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpenedAt(null);
				triggerRef.current?.focus({ preventScroll: true });
			}
		};

		const onBreakpoint = () => {
			if (desktop.matches) {
				setOpenedAt(null);
			}
		};

		document.addEventListener("keydown", onKeyDown);
		desktop.addEventListener("change", onBreakpoint);
		document.body.style.overflow = "hidden";
		closeRef.current?.focus({ preventScroll: true });

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			desktop.removeEventListener("change", onBreakpoint);
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

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
						{/* Not a tab stop: Escape and the close button are the keyboard paths out. */}
						<button
							aria-label="Close navigation"
							className={cn(
								styles.backdrop(),
								isOpen ? styles.backdropOpen() : styles.backdropClosed(),
							)}
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
							className={cn(
								styles.panel(),
								isOpen ? styles.panelOpen() : styles.panelClosed(),
							)}
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
					document.body,
				)}
		</>
	);
};
