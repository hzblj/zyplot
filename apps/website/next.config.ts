import type { NextConfig } from "next";

const config: NextConfig = {
	transpilePackages: [
		"@hzblj/zyplot",
		"@hzblj/zyplot-core",
		"@hzblj/zyplot-platform-web",
		"@zyplot/feature-website",
	],
};

export default config;
