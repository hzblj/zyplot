import {
	AriaComponent,
	GridComponent,
	MarkLineComponent,
	TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

/**
 * The shared ECharts runtime: the canvas renderer plus the handful of
 * components every chart here needs.
 *
 * Registered from a function rather than at module scope, and called by
 * `useECharts` before `init`. A top-level `echarts.use([…])` is a module side
 * effect, and a package that declares `sideEffects` narrowly — or a bundler
 * that resolves `export *` straight through to `echarts/core` — is entitled to
 * skip the module that holds it. The symptom is remote from the cause:
 * zrender throws "Renderer 'undefined' is not imported", naming `undefined`
 * because *no* painter registered rather than because canvas failed to.
 *
 * Series types are deliberately NOT registered here. Each chart file calls
 * `echarts.use([…])` with its own, so a page that renders one line chart does
 * not ship the sankey, sunburst and boxplot code. Registering the full set from
 * a barrel is the single easiest way to turn a 100 kB dependency into 330 kB.
 *
 * `LegendComponent` is absent on purpose — legends are React, built from
 * `Typography`, so their text obeys the type scale and is selectable and
 * translatable. Only marks and axis ticks are painted into the canvas.
 */
let isRegistered = false;

export const ensureEchartsRuntime = () => {
	if (isRegistered) {
		return;
	}
	isRegistered = true;
	echarts.use([
		AriaComponent,
		CanvasRenderer,
		GridComponent,
		MarkLineComponent,
		TooltipComponent,
	]);
};

export { echarts };
