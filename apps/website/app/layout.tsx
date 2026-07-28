import "./styles.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	description: "Native-feeling cross-platform charts for React and Expo.",
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
	variable: "--font-inter",
});

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html className={inter.variable} lang="en" suppressHydrationWarning>
			<head>
				<Script id="theme" strategy="beforeInteractive">
					{
						'try{const t=localStorage.getItem("zyplot-theme");const d=t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch{}'
					}
				</Script>
			</head>
			<body>{children}</body>
		</html>
	);
}
