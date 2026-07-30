import {
  AriaComponent,
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import {CanvasRenderer} from 'echarts/renderers'

let isRegistered = false

export const ensureEchartsRuntime = () => {
  if (isRegistered) {
    return
  }
  isRegistered = true
  echarts.use([
    AriaComponent,
    CanvasRenderer,
    GridComponent,
    MarkAreaComponent,
    MarkLineComponent,
    MarkPointComponent,
    TooltipComponent,
  ])
}

export {echarts}
