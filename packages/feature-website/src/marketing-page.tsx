import { ChartDemo } from "./chart-demo";
import { marketingStyles } from "./marketing-styles";
import { ThemeToggle } from "./theme-toggle";

const styles = marketingStyles();

const platforms = [
	["Web", "uPlot performance with a small runtime footprint."],
	["iOS", "Swift Charts rendered through an Expo Module."],
	["Android", "Jetpack Compose rendering with native gestures."],
];

export const MarketingPage = () => (
	<main>
		<nav className={styles.nav()}>
			<a className={styles.wordmark()} href="/">
				zyplot
			</a>
			<div className={styles.navLinks()}>
				<a href="/docs">Docs</a>
				<a href="https://github.com/hzblj/zyplot">GitHub</a>
				<ThemeToggle />
			</div>
		</nav>
		<section className={styles.hero()}>
			<div>
				<p className={styles.eyebrow()}>One API. Three native renderers.</p>
				<h1>Charts that belong on every platform.</h1>
				<p className={styles.lede()}>
					A shared TypeScript model for React and Expo, backed by the charting
					technology each platform does best.
				</p>
				<div className={styles.actions()}>
					<a className={styles.primaryButton()} href="/docs">
						Get started
					</a>
					<code className={styles.code()}>yarn add @hzblj/zyplot</code>
				</div>
			</div>
			<ChartDemo />
		</section>
		<section className={styles.platforms()}>
			{platforms.map(([title, copy]) => (
				<article className={styles.platform()} key={title}>
					<span className={styles.platformNumber()}>
						0{platforms.findIndex((item) => item[0] === title) + 1}
					</span>
					<h2>{title}</h2>
					<p>{copy}</p>
				</article>
			))}
		</section>
	</main>
);
