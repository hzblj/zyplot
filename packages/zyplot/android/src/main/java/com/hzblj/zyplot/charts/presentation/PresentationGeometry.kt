package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration

internal const val GLOW_PASSES = 3

internal fun DrawScope.presentationPlotRect(config: ChartConfiguration): Rect {
  val fullPlot = plotRect(config)
  if (config.type != "candlestick" || !config.showVolume) return fullPlot
  return Rect(
    left = fullPlot.left,
    top = fullPlot.top,
    right = fullPlot.right,
    bottom = fullPlot.bottom -
      fullPlot.height * config.candlestickStyle.volumeHeightRatio.coerceIn(0.12f, 0.35f) -
      6f,
  )
}

internal fun pointerOnPlot(pointer: Offset, plot: Rect): Offset? {
  if (plot.width <= 0f || plot.height <= 0f) return null
  return Offset(
    pointer.x.coerceIn(plot.left, plot.right),
    pointer.y.coerceIn(plot.top, plot.bottom),
  )
}

internal fun xPosition(
  coordinate: Any?,
  config: ChartConfiguration,
  plotLeft: Float = 20f + config.plot.padding.left,
  plotWidth: Float,
): Float? {
  return when (coordinate) {
    is String -> {
      val index = config.categories.indexOf(coordinate)
      if (index < 0) null else {
        plotLeft + plotWidth * (index + 0.5f) / config.categories.size.coerceAtLeast(1)
      }
    }
    is Number -> {
      val minimum = config.xAxis.domain.minimum ?: 0.0
      val maximum = config.xAxis.domain.maximum ?: 1.0
      plotLeft + plotWidth * (
        (coordinate.toDouble() - minimum) / (maximum - minimum).coerceAtLeast(0.0001)
        ).toFloat()
    }
    else -> null
  }
}
