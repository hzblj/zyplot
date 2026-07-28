import {
	AriaComponent,
	GridComponent,
	MarkLineComponent,
	TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

/**
 * The shared ECharts runtime: the canvas renderer plus the handful of components
 * every chart here needs, registered once.
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
echarts.use([
	AriaComponent,
	CanvasRenderer,
	GridComponent,
	MarkLineComponent,
	TooltipComponent,
]);

export { echarts };
