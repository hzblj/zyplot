const example = `import { LineChart } from '@hzblj/zyplot'
import '@hzblj/zyplot/style.css'

const series = [{
  id: 'revenue',
  label: 'Revenue',
  data: [{ x: 0, y: 12 }, { x: 1, y: 28 }],
}]

export const RevenueChart = () => (
  <LineChart series={series} height={320} />
)`;

export const DocsPage = () => (
	<main className="docs shell">
		<aside>
			<a className="wordmark" href="/">
				zyplot
			</a>
			<ThemeToggle />
			<nav>
				<a href="#install">Installation</a>
				<a href="#usage">Usage</a>
				<a href="#architecture">Architecture</a>
			</nav>
		</aside>
		<article>
			<p className="eyebrow">Documentation</p>
			<h1>Start plotting.</h1>
			<p className="lede">
				The public API stays the same. Zyplot chooses the renderer for the
				current platform.
			</p>
			<h2 id="install">Installation</h2>
			<pre>
				<code>yarn add @hzblj/zyplot</code>
			</pre>
			<p>
				For Expo projects, run a native build after installation so autolinking
				can register both native modules.
			</p>
			<h2 id="usage">Usage</h2>
			<pre>
				<code>{example}</code>
			</pre>
			<h2 id="architecture">Architecture</h2>
			<p>
				<code>@hzblj/zyplot-core</code> owns serializable chart contracts. The
				web, iOS, and Android packages only translate those contracts into
				platform rendering primitives.
			</p>
		</article>
	</main>
);

import { ThemeToggle } from "./theme-toggle";
