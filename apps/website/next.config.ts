import type { NextConfig } from "next";

const config: NextConfig = {
	experimental: {
		viewTransition: true,
	},
	transpilePackages: [
		"@hzblj/zyplot",
		"@hzblj/zyplot-core",
		"@zyplot/feature-website",
	],
};

export default config;
