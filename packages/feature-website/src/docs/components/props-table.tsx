import Link from "next/link";
import { docsStyles } from "../../docs-styles";
import type { PropRow } from "../types";

const styles = docsStyles();

const typeReferences: Record<string, string> = {
	BoxplotLabels: "/docs/data-types#specialized-data",
	ChartAxes: "/docs/data-types#chart-options",
	ChartBoxplotGroup: "/docs/data-types#specialized-data",
	ChartDatum: "/docs/data-types#chart-datum",
	ChartDumbbellRow: "/docs/data-types#specialized-data",
	ChartFlowLink: "/docs/data-types#specialized-data",
	ChartFlowNode: "/docs/data-types#specialized-data",
	ChartHeatmapCell: "/docs/data-types#specialized-data",
	ChartHierarchyNode: "/docs/data-types#specialized-data",
	ChartLegendItem: "/docs/data-types#chart-legend",
	ChartNumberFormat: "/docs/data-types#chart-options",
	ChartRadarAxis: "/docs/data-types#specialized-data",
	ChartScatterSeries: "/docs/data-types#specialized-data",
	ChartSeries: "/docs/data-types#chart-series",
	ChartTheme: "/docs/theming#provider-props",
	ChartTimePoints: "/docs/data-types#specialized-data",
};

const getTypeReference = (type: string) => {
	const typeName = Object.keys(typeReferences).find((name) =>
		type.includes(name),
	);
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
