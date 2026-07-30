package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.core.ChartConfiguration

internal fun DrawScope.drawGrid(config: ChartConfiguration, lines: Int = 4) {
  if (!config.yAxisVisible || !config.yAxis.grid) return
  val plot = plotRect(config)
  val count = config.yAxis.tickCount.takeIf { it > 0 } ?: lines
  val color = config.gridColor.copy(alpha = 0.7f)
  repeat(count + 1) { index ->
    val y = plot.top + plot.height * index / count
    drawLine(
      color = color,
      start = Offset(plot.left, y),
      end = Offset(plot.right, y),
      strokeWidth = 1f,
    )
  }
}
