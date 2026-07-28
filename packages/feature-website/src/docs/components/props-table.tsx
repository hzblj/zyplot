import Link from "next/link";
import { docsStyles } from "../../docs-styles";
import type { PropRow } from "../types";

const styles = docsStyles();

const typeReferences: Record<string, string> = {
	BoxplotLabels: "/docs/data-types#specialized-data",
	ChartAnimation: "/docs/data-types#plot-style",
	ChartAnnotation: "/docs/data-types#annotations",
	ChartAxes: "/docs/data-types#chart-options",
	ChartAxisOptions: "/docs/data-types#axis-options",
	ChartBoxplotGroup: "/docs/data-types#specialized-data",
	ChartCandlestickDatum: "/docs/data-types#finance-data",
	ChartCandlestickStyle: "/docs/data-types#finance-data",
	ChartDatum: "/docs/data-types#chart-datum",
	ChartDumbbellRow: "/docs/data-types#specialized-data",
	ChartFlowLink: "/docs/data-types#specialized-data",
	ChartFlowNode: "/docs/data-types#specialized-data",
	ChartHeatmapCell: "/docs/data-types#specialized-data",
	ChartHierarchyNode: "/docs/data-types#specialized-data",
	ChartInteraction: "/docs/data-types#interaction",
	ChartInteractionEvent: "/docs/data-types#interaction",
	ChartLegendItem: "/docs/data-types#chart-legend",
	ChartNumberFormat: "/docs/data-types#chart-options",
	ChartPlotStyle: "/docs/data-types#plot-style",
	ChartRadarAxis: "/docs/data-types#specialized-data",
	ChartScatterSeries: "/docs/data-types#specialized-data",
	ChartSeries: "/docs/data-types#chart-series",
	ChartSeriesStyle: "/docs/data-types#plot-style",
	ChartSurface: "/docs/theming#surface",
	ChartSurfacePadding: "/docs/theming#surface",
	ChartTheme: "/docs/theming#theme-keys",
	ChartTimePoints: "/docs/data-types#specialized-data",
};

/**
 * The longest matching name wins. `Record<string, ChartSeriesStyle>` contains
 * `ChartSeries` too, and a first-match lookup sent it to the series anchor.
 */
const getTypeReference = (type: string) => {
	const typeName = Object.keys(typeReferences)
		.filter((name) => type.includes(name))
		.sort((first, second) => second.length - first.length)[0];
	return typeName ? typeReferences[typeName] : undefined;
};

export const PropsTable = ({ rows }: { rows: PropRow[] }) => (
	<div className={styles.propsTableWrap()}>
		<table className={styles.propsTable()}>
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => {
					const typeReference = getTypeReference(row.type);

					return (
						<tr key={row.name}>
							<td>
								<code>{row.name}</code>
								{row.required && (
									<span className="ml-0.5 text-content-destructive">*</span>
								)}
							</td>
							<td>
								{typeReference ? (
									<Link className={styles.propsTypeLink()} href={typeReference}>
										<code>{row.type}</code>
									</Link>
								) : (
									<code>{row.type}</code>
								)}
							</td>
							<td>
								{row.defaultValue ? <code>{row.defaultValue}</code> : "—"}
							</td>
							<td>{row.description}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	</div>
);
