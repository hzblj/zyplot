export const INSTALL_COMMANDS = {
  bun: 'bun add @hzblj/zyplot',
  npm: 'npm install @hzblj/zyplot',
  pnpm: 'pnpm add @hzblj/zyplot',
  yarn: 'yarn add @hzblj/zyplot',
} as const

export type PackageManager = keyof typeof INSTALL_COMMANDS

export const PACKAGE_MANAGERS = Object.keys(INSTALL_COMMANDS) as PackageManager[]
