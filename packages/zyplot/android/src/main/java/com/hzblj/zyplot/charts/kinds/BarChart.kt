package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.drawGrid
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawBars(
  config: ChartConfiguration,
  progress: Float,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val maximum = max(config.seriesValues.maxOrNull() ?: 1.0, 1.0)
  drawGrid(config)
  measurer?.let {
    if (config.isHorizontal) {
      drawAxisText(config, it, 0.0, maximum, xMinimum = 0.0, xMaximum = maximum)
    } else {
      drawAxisText(config, it, 0.0, maximum, xLabels = config.categories)
    }
  }
  val categoryCount = max(1, config.categories.size)
  val categoryWidth =
    if (config.isHorizontal) plot.height / categoryCount else plot.width / categoryCount

  config.categories.indices.forEach { categoryIndex ->
    if (config.type == "stacked-bar") {
      var accumulated = 0.0
      config.series.forEachIndexed { seriesIndex, series ->
        val value = series.values.getOrNull(categoryIndex) ?: return@forEachIndexed
        val next = accumulated + value
        val color = config.seriesColor(seriesIndex, series)
        val band = plot.top + categoryWidth * categoryIndex + categoryWidth * 0.18f
        val thickness = categoryWidth * 0.64f
        if (config.isHorizontal) {
          val start = plot.left + (accumulated / maximum * plot.width).toFloat()
          val target = plot.left + (next / maximum * plot.width).toFloat()
          val end = start + (target - start) * progress
          drawRect(
            color = color,
            topLeft = Offset(start, band),
            size = Size(max(0f, end - start), thickness),
          )
        } else {
          val bottom = normalizedY(accumulated, 0.0, maximum, plot)
          val targetTop = normalizedY(next, 0.0, maximum, plot)
          val top = bottom + (targetTop - bottom) * progress
          drawRect(
            color = color,
            topLeft = Offset(
              plot.left + categoryWidth * categoryIndex + categoryWidth * 0.18f,
              top,
            ),
            size = Size(thickness, bottom - top),
          )
        }
        accumulated = next
      }
    } else {
      val barWidth = categoryWidth * 0.72f / max(1, config.series.size)
      config.series.forEachIndexed { seriesIndex, series ->
        val value = series.values.getOrNull(categoryIndex) ?: return@forEachIndexed
        val color = config.seriesColor(seriesIndex, series)
        if (config.isHorizontal) {
          val length = (value / maximum * plot.width).toFloat() * progress
          drawRect(
            color = color,
            topLeft = Offset(
              plot.left,
              plot.top + categoryWidth * categoryIndex + categoryWidth * 0.14f +
                barWidth * seriesIndex,
            ),
            size = Size(max(0f, length), max(2f, barWidth - 2f)),
          )
        } else {
          val targetTop = normalizedY(value, 0.0, maximum, plot)
          val top = plot.bottom + (targetTop - plot.bottom) * progress
          drawRect(
            color = color,
            topLeft = Offset(
              plot.left + categoryWidth * categoryIndex + categoryWidth * 0.14f +
                barWidth * seriesIndex,
              top,
            ),
            size = Size(max(2f, barWidth - 2f), plot.bottom - top),
          )
        }
      }
    }
  }
}
