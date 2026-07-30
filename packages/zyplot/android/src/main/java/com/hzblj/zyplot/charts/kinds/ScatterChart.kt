package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.drawGrid
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.paddedExtent
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration

internal fun DrawScope.drawScatter(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val points = config.scatterSeries.flatMap { it.points }
  val xExtent = paddedExtent(points.map { it.x })
  val yExtent = paddedExtent(points.map { it.y })
  drawGrid(config)
  measurer?.let {
    drawAxisText(
      config,
      it,
      yExtent.first,
      yExtent.second,
      xMinimum = xExtent.first,
      xMaximum = xExtent.second,
    )
  }
  config.scatterSeries.forEachIndexed { index, series ->
    val color = config.colorFor(index, series.color, series.slot)
      .copy(alpha = config.dimming(series.id))
    series.points.forEach { point ->
      val x = plot.left + ((point.x - xExtent.first) / (xExtent.second - xExtent.first) * plot.width).toFloat()
      val y = normalizedY(point.y, yExtent.first, yExtent.second, plot)
      drawCircle(color, radius = (point.size ?: 30.0).toFloat().coerceIn(4f, 16f), center = Offset(x, y))
    }
  }
}
