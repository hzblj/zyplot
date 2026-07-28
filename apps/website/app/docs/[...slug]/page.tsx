import { DocsPage } from "@zyplot/feature-website";
import type { Metadata } from "next";

export const metadata: Metadata = {
	description: "Zyplot web chart guide and API reference.",
	title: "Zyplot documentation",
};

type DocumentationPageProps = {
	params: Promise<{ slug: string[] }>;
};

export default async function DocumentationPage({
	params,
}: DocumentationPageProps) {
	const { slug } = await params;
	const page =
		slug[0] === "charts"
			? slug[1]
			: slug[0] === "web"
				? "web-package"
				: slug[0];

	return <DocsPage page={page} />;
}
