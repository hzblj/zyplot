"use client";

import { useState } from "react";
import { docsStyles } from "../../docs-styles";
import { cn } from "../../utils";

const styles = docsStyles();

const commands = {
	npm: "npm install @hzblj/zyplot-platform-web",
	yarn: "yarn add @hzblj/zyplot-platform-web",
	pnpm: "pnpm add @hzblj/zyplot-platform-web",
	bun: "bun add @hzblj/zyplot-platform-web",
} as const;

type PackageManager = keyof typeof commands;

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
					{(Object.keys(commands) as PackageManager[]).map((value) => (
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
