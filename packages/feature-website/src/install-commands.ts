/**
 * One copy of the install line, shared by the landing hero and the docs.
 *
 * Two places offering the same command is exactly how one of them ends up
 * naming a package that moved.
 */
export const INSTALL_COMMANDS = {
	npm: "npm install @hzblj/zyplot",
	yarn: "yarn add @hzblj/zyplot",
	pnpm: "pnpm add @hzblj/zyplot",
	bun: "bun add @hzblj/zyplot",
} as const;

export type PackageManager = keyof typeof INSTALL_COMMANDS;

export const PACKAGE_MANAGERS = Object.keys(
	INSTALL_COMMANDS,
) as PackageManager[];
