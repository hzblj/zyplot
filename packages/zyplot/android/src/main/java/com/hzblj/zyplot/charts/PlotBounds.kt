package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration

private const val Y_LABEL_GUTTER = 44f
private const val X_LABEL_GUTTER = 20f

internal const val Y_CATEGORY_LABEL_GAP = 14f

private const val AXIS_TITLE_GUTTER = 18f

/**
 * The gutters and paddings below are written in dp, the way the props that feed them are,
 * while the canvas measures in pixels — so every one of them is scaled on the way in.
 * `measuredYGutter` is the exception: it comes from a text measurement and is already pixels.
 */
internal fun plotLeft(config: ChartConfiguration, density: Float = 1f): Float {
  // An overlaid axis writes its labels inside the plot, so it needs no gutter of its own —
  // reserving one pushed the trace a label's width off the left edge.
  val axis = if (config.yAxisVisible && !config.yAxisAtEnd && !config.overlaysYAxis) {
    config.measuredYGutter ?: (Y_LABEL_GUTTER * density)
  } else {
    20f * density
  }
  return axis +
    (
      config.plot.padding.left +
        config.xAxis.padStart +
        (if (config.yAxisLabel != null) AXIS_TITLE_GUTTER else 0f)
      ) * density
}

internal fun plotRight(config: ChartConfiguration, width: Float, density: Float = 1f): Float {
  // An overlaid label is drawn against the view's trailing edge rather than this one, so
  // what the plot gives up here is the band that label needs — the same width iOS hands to
  // `plotDimension(endPadding:)`, on top of `plotDimensionEndPadding`. Without it the marks
  // run under the numbers.
  val axis = if (config.yAxisVisible && config.yAxisAtEnd && !config.overlaysYAxis) {
    config.measuredYGutter ?: (Y_LABEL_GUTTER * density)
  } else {
    config.overlayAxisGutter * density
  }
  return width - (12f + config.plot.padding.right + config.xAxis.padEnd) * density - axis
}

internal fun scrubLimit(config: ChartConfiguration, width: Float, density: Float = 1f): Float {
  val right = plotRight(config, width, density)
  val last = config.lastReadableIndex ?: return right
  val count = config.categories.size
  if (count <= 1 || last >= count - 1) return right
  val left = plotLeft(config, density)
  return left + (right - left) * (last + 0.999f) / count
}

internal fun DrawScope.plotRect(config: ChartConfiguration): Rect =
  plotRect(config, size.width, size.height, density)

/** The same box outside a draw pass, for reporting geometry to the app. */
internal fun plotRect(
  config: ChartConfiguration,
  width: Float,
  height: Float,
  density: Float = 1f,
): Rect {
  val padding = config.plot.padding
  val bottomGutter = if (config.xAxisVisible) 24f + X_LABEL_GUTTER else 24f
  return Rect(
    left = plotLeft(config, density),
    top = (16f + padding.top) * density,
    right = plotRight(config, width, density),
    bottom = height -
      (
        bottomGutter + padding.bottom +
          (if (config.xAxisLabel != null) AXIS_TITLE_GUTTER else 0f)
        ) * density,
  )
}

internal fun measureYGutter(
  config: ChartConfiguration,
  measurer: TextMeasurer,
  width: Float,
): Float {
  if (config.yCategoryLabels.isEmpty()) return Y_LABEL_GUTTER
  val style = config.textStyle(fontSize = 10.sp)
  val widest = config.yCategoryLabels.maxOf {
    measurer.measure(it, style, maxLines = 1).size.width
  }
  return (widest + Y_CATEGORY_LABEL_GAP + 4f).coerceIn(Y_LABEL_GUTTER, width / 3f)
}
