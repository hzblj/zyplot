package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration

private const val Y_LABEL_GUTTER = 44f
private const val X_LABEL_GUTTER = 20f

/**
 * The air between the plot's edge and a label, in dp, when the axis did not name its own
 * `labelInset`. The gutter reserves the same number the label is drawn at, so a ladder ends flush
 * with the view whatever the prices are, and the placeholder's labels land where the chart's will.
 */
internal const val Y_LABEL_GAP = 6f
internal const val X_LABEL_GAP = 6f

/** An overlaid label sits inside the plot, so it steps in from the trailing edge rather than out. */
internal const val OVERLAY_LABEL_INSET = 2f
internal const val Y_CATEGORY_LABEL_GAP = 14f
private const val AXIS_TITLE_GUTTER = 18f

/**
 * What a plot with no axis on that side keeps clear of the view. A `plotDimensionStartPadding` or
 * `plotDimensionEndPadding` replaces it rather than adding to it, so a `0` runs the marks to the
 * edge the way it does on iOS.
 */
private const val BARE_START_GUTTER = 20f
private const val BARE_END_GUTTER = 12f

/**
 * The same, down the plot: the air above the highest reading and below the lowest, before the label
 * row takes its own. A `plotDimensionEndPadding` on the y axis replaces the headroom and a
 * `plotDimensionStartPadding` the floor, so a `0` runs the marks to the edge of the box.
 */
private const val BARE_HEADROOM = 16f
private const val BARE_FLOOR = 24f

/**
 * What the axis asked for, or the default for that side of the plot — in pixels, since every
 * caller is drawing or measuring. One answer for the gutter and the label alike: the two disagreeing
 * is what puts a price under the trace, and what made the placeholder's labels move when data landed.
 */
internal fun yLabelGap(config: ChartConfiguration, density: Float) =
  (config.yAxis.labelInset ?: Y_LABEL_GAP) * density

internal fun yCategoryLabelGap(config: ChartConfiguration, density: Float) =
  config.yAxis.labelInset?.times(density) ?: Y_CATEGORY_LABEL_GAP

internal fun xLabelGap(config: ChartConfiguration, density: Float) =
  (config.xAxis.labelInset ?: X_LABEL_GAP) * density

internal fun overlayLabelInset(config: ChartConfiguration, density: Float) =
  (config.yAxis.labelInset ?: OVERLAY_LABEL_INSET) * density

internal fun plotLeft(config: ChartConfiguration, density: Float = 1f): Float {
  val title = if (config.yAxisLabel != null) AXIS_TITLE_GUTTER else 0f
  if (config.yAxisVisible && !config.yAxisAtEnd && !config.overlaysYAxis) {
    val axis = config.measuredYGutter ?: (Y_LABEL_GUTTER * density)
    return axis + ((config.xAxis.padStart ?: 0f) + config.plot.padding.left + title) * density
  }
  return ((config.xAxis.padStart ?: BARE_START_GUTTER) + config.plot.padding.left + title) * density
}

internal fun plotRight(config: ChartConfiguration, width: Float, density: Float = 1f): Float {
  val axis = if (config.yAxisVisible && config.yAxisAtEnd && !config.overlaysYAxis) {
    config.measuredYGutter ?: (Y_LABEL_GUTTER * density)
  } else {
    config.overlayAxisGutter * density
  }
  val gutter = config.xAxis.padEnd ?: BARE_END_GUTTER
  return width - (gutter + config.plot.padding.right) * density - axis
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

internal fun plotRect(
  config: ChartConfiguration,
  width: Float,
  height: Float,
  density: Float = 1f,
): Rect {
  val padding = config.plot.padding
  val labelRow = if (config.xAxisVisible) X_LABEL_GUTTER else 0f
  val floor = (config.yAxis.padStart ?: BARE_FLOOR) + labelRow
  return Rect(
    left = plotLeft(config, density),
    top = ((config.yAxis.padEnd ?: BARE_HEADROOM) + padding.top) * density,
    right = plotRight(config, width, density),
    bottom = height -
      (
        floor + padding.bottom +
          (if (config.xAxisLabel != null) AXIS_TITLE_GUTTER else 0f)
        ) * density,
  )
}

/**
 * How much room the ladder takes beside the plot. A numeric axis is measured at the size it will
 * actually be drawn at, so the plot ends where the widest price begins rather than under it. With
 * no ticks to measure there is nothing to go on, and the bare gutter is the answer — in dp, the
 * way `plotLeft` and `plotRight` read it.
 */
internal fun measureYGutter(
  config: ChartConfiguration,
  measurer: TextMeasurer,
  width: Float,
  density: Float = 1f,
): Float {
  if (config.yCategoryLabels.isEmpty()) {
    val ticks = config.yAxis.tickValues
    if (ticks.isEmpty()) return Y_LABEL_GUTTER * density
    val style = config.textStyle(fontSize = config.yAxis.labelSize.sp)
    val widest = ticks.maxOf {
      measurer.measure(config.yAxisFormat.format(it), style, maxLines = 1).size.width
    }
    return (widest + yLabelGap(config, density)).coerceAtMost(width / 3f)
  }
  val style = config.textStyle(fontSize = 10.sp)
  val widest = config.yCategoryLabels.maxOf {
    measurer.measure(it, style, maxLines = 1).size.width
  }
  return (widest + yCategoryLabelGap(config, density) + 4f).coerceIn(Y_LABEL_GUTTER, width / 3f)
}
