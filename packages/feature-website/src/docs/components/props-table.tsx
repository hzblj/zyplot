import { docsStyles } from "../../docs-styles";
import type { PropRow } from "../types";

const styles = docsStyles();

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
				{rows.map((row) => (
					<tr key={row.name}>
						<td>
							<code>{row.name}</code>
							{row.required && (
								<span className="ml-0.5 text-content-destructive">*</span>
							)}
						</td>
						<td>
							<code>{row.type}</code>
						</td>
						<td>{row.defaultValue ? <code>{row.defaultValue}</code> : "—"}</td>
						<td>{row.description}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);
