import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	dts: true,
	entry: ["src/index.ts"],
	external: ["../style.css"],
	format: ["esm"],
	outDir: "build",
	sourcemap: true,
	splitting: true,
	treeshake: true,
});
