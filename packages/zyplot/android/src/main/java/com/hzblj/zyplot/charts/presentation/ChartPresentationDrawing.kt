package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor

internal fun DrawScope.drawPlotDecoration(config: ChartConfiguration) {
  val plot = presentationPlotRect(config)
  config.plot.backgroundColor?.let {
    drawRoundRect(
      color = parseColor(it),
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

internal fun DrawScope.drawAnnotations(config: ChartConfiguration) {
  val plot = presentationPlotRect(config)
  val values = config.series.flatMap { it.values.filterNotNull() } +
    config.data.map { it.value } +
    config.array("candlesticks").flatMap {
      listOf(it.optDouble("low"), it.optDouble("high"))
    }
  val extent = config.valueExtent(values)

  config.annotations.forEach { annotation ->
    val color = parseColor(annotation.color ?: "#71717a")
    val effect = annotation.dash.takeIf { it.size >= 2 }
      ?.let { PathEffect.dashPathEffect(it.toFloatArray()) }
    when (annotation.type) {
      "line" -> {
        if (annotation.axis == "x") {
          xPosition(annotation.value, config, plot.left, plot.width)?.let { x ->
            drawLine(
              color,
              Offset(x, plot.top),
              Offset(x, plot.bottom),
              pathEffect = effect,
            )
          }
        } else {
          (annotation.value as? Number)?.toDouble()?.let { value ->
            val y = normalizedY(value, extent.first, extent.second, plot)
            drawLine(
              color,
              Offset(plot.left, y),
              Offset(plot.right, y),
              pathEffect = effect,
            )
          }
        }
      }
      "range" -> {
        val rangeColor = color.copy(alpha = annotation.opacity)
        if (annotation.axis == "x") {
          val start = xPosition(annotation.start, config, plot.left, plot.width)
          val end = xPosition(annotation.end, config, plot.left, plot.width)
          if (start != null && end != null) {
            drawRect(
              rangeColor,
              Offset(minOf(start, end), plot.top),
              Size(kotlin.math.abs(end - start), plot.height),
            )
          }
        } else {
          val start = (annotation.start as? Number)?.toDouble()
          val end = (annotation.end as? Number)?.toDouble()
          if (start != null && end != null) {
            val top = normalizedY(maxOf(start, end), extent.first, extent.second, plot)
            val bottom = normalizedY(minOf(start, end), extent.first, extent.second, plot)
            drawRect(
              rangeColor,
              Offset(plot.left, top),
              Size(plot.width, bottom - top),
            )
          }
        }
      }
      "point", "text" -> {
        val x = xPosition(annotation.x, config, plot.left, plot.width)
        val yValue = annotation.y
        if (x != null && yValue != null) {
          val y = normalizedY(yValue, extent.first, extent.second, plot)
          drawCircle(color, radius = 5f, center = Offset(x, y))
        }
      }
    }
  }
}

internal fun DrawScope.drawCrosshair(
  config: ChartConfiguration,
  pointer: Offset?,
) {
  if (pointer == null) return
  val plot = presentationPlotRect(config)
  if (!plot.contains(pointer)) return
  val color = config.gridColor.copy(alpha = 0.9f)
  if (config.interaction.crosshair == "x" || config.interaction.crosshair == "both") {
    drawLine(color, Offset(pointer.x, plot.top), Offset(pointer.x, plot.bottom))
  }
  if (config.interaction.crosshair == "y" || config.interaction.crosshair == "both") {
    drawLine(color, Offset(plot.left, pointer.y), Offset(plot.right, pointer.y))
  }
}

private fun DrawScope.presentationPlotRect(config: ChartConfiguration): Rect {
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
