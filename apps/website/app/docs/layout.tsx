import { DocsLayout } from "@zyplot/feature-website";
import type { ReactNode } from "react";
import { ViewTransition } from "react";

export default function DocumentationLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<DocsLayout>
			<ViewTransition default="docs-page">{children}</ViewTransition>
		</DocsLayout>
	);
}
