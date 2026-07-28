import { ChartDemo } from "./chart-demo";
import { ThemeToggle } from "./theme-toggle";

const platforms = [
	["Web", "uPlot performance with a small runtime footprint."],
	["iOS", "Swift Charts rendered through an Expo Module."],
	["Android", "Jetpack Compose rendering with native gestures."],
];

export const MarketingPage = () => (
	<main>
		<nav className="nav shell">
			<a className="wordmark" href="/">
				zyplot
			</a>
			<div className="nav__links">
				<a href="/docs">Docs</a>
				<a href="https://github.com/hzblj/zyplot">GitHub</a>
				<ThemeToggle />
			</div>
		</nav>
		<section className="hero shell">
			<div>
				<p className="eyebrow">One API. Three native renderers.</p>
				<h1>Charts that belong on every platform.</h1>
				<p className="lede">
					A shared TypeScript model for React and Expo, backed by the charting
					technology each platform does best.
				</p>
				<div className="actions">
					<a className="button button--primary" href="/docs">
						Get started
					</a>
					<code>yarn add @hzblj/zyplot</code>
				</div>
			</div>
			<ChartDemo />
		</section>
		<section className="platforms shell">
			{platforms.map(([title, copy]) => (
				<article key={title}>
					<span className="platforms__number">
						0{platforms.findIndex((item) => item[0] === title) + 1}
					</span>
					<h2>{title}</h2>
					<p>{copy}</p>
				</article>
			))}
		</section>
	</main>
);
