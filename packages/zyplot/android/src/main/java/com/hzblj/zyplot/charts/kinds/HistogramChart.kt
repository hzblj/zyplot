package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.charts.drawGrid
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawHistogram(config: ChartConfiguration) {
  val values = config.values
  if (values.isEmpty()) return
  val plot = plotRect(config)
  val minimum = values.min()
  val maximum = values.max()
  val count = config.binCount.coerceAtLeast(1)
  val width = (maximum - minimum).takeIf { it > 0 }?.div(count) ?: 1.0
  val bins = IntArray(count)
  values.forEach {
    bins[((it - minimum) / width).toInt().coerceIn(0, count - 1)] += 1
  }
  val maximumCount = bins.maxOrNull()?.coerceAtLeast(1) ?: 1
  drawGrid(config)
  bins.forEachIndexed { index, value ->
    val barWidth = plot.width / count
    val height = plot.height * value / maximumCount
    drawRect(
      color = config.palette[0],
      topLeft = Offset(plot.left + barWidth * index + 1f, plot.bottom - height),
      size = Size(barWidth - 2f, height),
    )
  }
}
