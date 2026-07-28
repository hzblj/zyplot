"use client";

import { type ReactNode, useState } from "react";
import { docsStyles } from "../../docs-styles";
import { cn } from "../../utils";

const styles = docsStyles();

export const Example = ({
	children,
	source,
}: {
	children: ReactNode;
	source: string;
}) => {
	const [tab, setTab] = useState<"code" | "preview">("preview");

	return (
		<div className={styles.example()}>
			<div className={styles.exampleBar()}>
				<div aria-label="Example view" className={styles.tabs()} role="tablist">
					{(["preview", "code"] as const).map((value) => (
						<button
							aria-selected={tab === value}
							className={cn(styles.tab(), tab === value && styles.tabActive())}
							key={value}
							onClick={() => setTab(value)}
							role="tab"
							type="button"
						>
							{value === "preview" ? "Preview" : "Code"}
						</button>
					))}
				</div>
				<span>Web</span>
			</div>
			{tab === "preview" ? (
				<div className={styles.examplePreview()}>{children}</div>
			) : (
				<pre className={styles.exampleCode()}>
					<code>{source}</code>
				</pre>
			)}
		</div>
	);
};
