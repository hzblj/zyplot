"use client";

import { useState } from "react";
import { docsStyles } from "../../docs-styles";
import {
	INSTALL_COMMANDS as commands,
	PACKAGE_MANAGERS,
	type PackageManager,
} from "../../install-commands";
import { cn } from "../../utils";

const styles = docsStyles();

export const PackageInstall = () => {
	const [manager, setManager] = useState<PackageManager>("npm");
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard.writeText(commands[manager]);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1200);
	};

	return (
		<div className={styles.codeBlock()}>
			<div className={styles.exampleBar()}>
				<div
					aria-label="Package manager"
					className={styles.tabs()}
					role="tablist"
				>
					{PACKAGE_MANAGERS.map((value) => (
						<button
							aria-selected={manager === value}
							className={cn(
								styles.tab(),
								manager === value && styles.tabActive(),
							)}
							key={value}
							onClick={() => setManager(value)}
							role="tab"
							type="button"
						>
							{value}
						</button>
					))}
				</div>
				<button className={styles.codeCopy()} onClick={copy} type="button">
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
			<pre className={styles.codeBlockBody()}>
				<code>{commands[manager]}</code>
			</pre>
		</div>
	);
};
