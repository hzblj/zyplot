import { docsStyles } from "../../docs-styles";
import type { ChartDoc } from "../types";
import { Example } from "./example";
import { PropsTable } from "./props-table";

const styles = docsStyles();

export const ChartSection = ({ chart }: { chart: ChartDoc }) => (
	<section className={styles.chartDoc()} id={chart.id}>
		<div className={styles.chartIntro()}>
			<p className={styles.kicker()}>Chart</p>
			<h2>{chart.name}</h2>
			<p>{chart.description}</p>
		</div>
		<Example source={chart.code}>{chart.preview}</Example>
		<div className={styles.callout()}>
			<strong>When to use</strong>
			<p>{chart.when}</p>
		</div>
		<h3 id={`${chart.id}-props`}>Props</h3>
		<PropsTable rows={chart.props} />
	</section>
);
