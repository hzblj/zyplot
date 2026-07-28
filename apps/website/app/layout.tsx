import "./styles.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	description: "Native-feeling cross-platform charts for React and Expo.",
	/**
	 * The mark on the accent square rather than on transparency: a tab strip is
	 * light in one theme and dark in the other, and a bare glyph disappears into
	 * one of them.
	 */
	icons: {
		apple: {
			sizes: "180x180",
			type: "image/png",
			url: "/favicon/favicon-180.png",
		},
		icon: [
			{ sizes: "any", url: "/favicon.ico" },
			{ sizes: "16x16", type: "image/png", url: "/favicon/favicon-16.png" },
			{ sizes: "32x32", type: "image/png", url: "/favicon/favicon-32.png" },
			{ sizes: "48x48", type: "image/png", url: "/favicon/favicon-48.png" },
			{ sizes: "64x64", type: "image/png", url: "/favicon/favicon-64.png" },
			{ sizes: "192x192", type: "image/png", url: "/favicon/favicon-192.png" },
			{ sizes: "512x512", type: "image/png", url: "/favicon/favicon-512.png" },
		],
	},
	title: "Zyplot",
};

const inter = localFont({
	display: "swap",
	src: [
		{
			path: "../public/fonts/InterVariable.woff2",
			style: "normal",
			weight: "100 900",
		},
		{
			path: "../public/fonts/InterVariable-Italic.woff2",
			style: "italic",
			weight: "100 900",
		},
	],
	variable: "--font-zyplot-inter",
});

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html
			className={`${inter.className} ${inter.variable}`}
			data-scroll-behavior="smooth"
			lang="en"
			suppressHydrationWarning
		>
			<head>
				<Script id="theme" strategy="beforeInteractive">
					{
						'try{const t=localStorage.getItem("zyplot-theme");const d=t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch{}'
					}
				</Script>
			</head>
			<body
				style={{
					fontFamily:
						"var(--font-zyplot-inter), system-ui, -apple-system, 'Segoe UI', sans-serif",
				}}
			>
				{children}
			</body>
		</html>
	);
}
