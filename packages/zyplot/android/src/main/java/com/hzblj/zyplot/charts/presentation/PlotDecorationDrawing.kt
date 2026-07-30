package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor

internal fun DrawScope.drawPlotDecoration(config: ChartConfiguration) {
  val plot = presentationPlotRect(config)
  // The chart's own theme background is the fallback, so a chart that names one but
  // no plot style still paints it — the same order the iOS renderer resolves in.
  (config.plot.backgroundColor?.let(::parseColor) ?: config.backgroundColor)?.let {
    drawRoundRect(
      color = it,
      topLeft = plot.topLeft,
      size = plot.size,
      cornerRadius = CornerRadius(config.plot.borderRadius),
    )
  }
  config.plot.borderColor?.let {
    if (config.plot.borderWidth > 0) {
      drawRoundRect(
        color = parseColor(it),
        topLeft = plot.topLeft,
        size = plot.size,
        cornerRadius = CornerRadius(config.plot.borderRadius),
        style = Stroke(config.plot.borderWidth),
      )
    }
  }
}
