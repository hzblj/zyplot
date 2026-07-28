package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration

/** Gutter reserved for tick text, in px. Wide enough for "-1,234". */
private const val Y_LABEL_GUTTER = 44f
private const val X_LABEL_GUTTER = 20f
/** Space between a word-shaped y tick label and the first mark. */
private const val Y_CATEGORY_LABEL_GAP = 14f
/** Extra room for an axis *title* on top of its tick labels. */
private const val AXIS_TITLE_GUTTER = 18f

/**
 * Horizontal plot bounds.
 *
 * Split out of [plotRect] because hit-testing runs outside a `DrawScope` and has
 * only the view width to work with — if it recomputed these itself the tap target
 * would drift away from the marks the moment a gutter changed.
 */
internal fun plotLeft(config: ChartConfiguration): Float =
  (if (config.yAxisVisible) config.measuredYGutter ?: Y_LABEL_GUTTER else 20f) +
    config.plot.padding.left +
    (if (config.yAxisLabel != null) AXIS_TITLE_GUTTER else 0f)

/**
 * Reserves room for categorical y tick labels, measured rather than guessed.
 *
 * Capped at a third of the width: a long label should be truncated, but it
 * should never be allowed to squeeze the plot down to nothing.
 */
internal fun measureYGutter(
  config: ChartConfiguration,
  measurer: TextMeasurer,
  width: Float,
): Float {
  if (config.yCategoryLabels.isEmpty()) return Y_LABEL_GUTTER
  val style = TextStyle(fontSize = 10.sp)
  val widest = config.yCategoryLabels.maxOf {
    measurer.measure(it, style, maxLines = 1).size.width
  }
  return (widest + Y_CATEGORY_LABEL_GAP + 4f).coerceIn(Y_LABEL_GUTTER, width / 3f)
}

internal fun plotRight(config: ChartConfiguration, width: Float): Float =
  width - 12f - config.plot.padding.right

internal fun DrawScope.plotRect(config: ChartConfiguration): Rect {
  val padding = config.plot.padding
  val bottomGutter = if (config.xAxisVisible) 24f + X_LABEL_GUTTER else 24f
  return Rect(
    left = plotLeft(config),
    top = 16f + padding.top,
    right = plotRight(config, size.width),
    bottom = size.height - bottomGutter - padding.bottom -
      (if (config.xAxisLabel != null) AXIS_TITLE_GUTTER else 0f),
  )
}

/**
 * Draws tick text and axis titles.
 *
 * The caller passes the extent it actually plotted against rather than letting
 * this recompute one, because each form derives its scale differently — bars are
 * anchored at zero, lines fit their own range — and a tick that disagrees with
 * the marks above it is worse than no tick at all.
 *
 * Pass [xLabels]/[yLabels] for a categorical axis; omit them and that axis is
 * numeric.
 */
internal fun DrawScope.drawAxisText(
  config: ChartConfiguration,
  measurer: TextMeasurer,
  yMinimum: Double? = null,
  yMaximum: Double? = null,
  xLabels: List<String> = emptyList(),
  yLabels: List<String> = emptyList(),
  xMinimum: Double? = null,
  xMaximum: Double? = null,
) {
  val plot = plotRect(config)
  val style = TextStyle(color = config.labelColor, fontSize = 10.sp)
  val titleStyle = TextStyle(color = config.labelColor, fontSize = 11.sp)

  if (config.yAxisVisible) {
    if (yLabels.isNotEmpty()) {
      // A word sitting 6px from the first mark reads as touching it, where a
      // right-aligned number does not. Categorical ticks get twice the gap.
      val gap = Y_CATEGORY_LABEL_GAP
      yLabels.forEachIndexed { index, label ->
        val text = measurer.measure(
          label,
          style,
          overflow = overflowFor(config.yAxis.labelOverflow),
          maxLines = 1,
          constraints = gutterConstraints(config.yAxis.labelOverflow, plot.left - gap),
        )
        drawText(
          textLayoutResult = text,
          topLeft = Offset(
            x = (plot.left - gap - text.size.width).coerceAtLeast(0f),
            y = plot.top + plot.height * (index + 0.5f) / yLabels.size -
              text.size.height / 2f,
          ),
        )
      }
    } else if (yMinimum != null && yMaximum != null) {
      val count = config.yAxis.tickCount.coerceAtLeast(1)
      repeat(count + 1) { index ->
        val ratio = index.toDouble() / count
        val value = yMaximum - (yMaximum - yMinimum) * ratio
        val text = measurer.measure(config.yAxisFormat.format(value), style)
        drawText(
          textLayoutResult = text,
          topLeft = Offset(
            x = (plot.left - 6f - text.size.width).coerceAtLeast(0f),
            y = plot.top + plot.height * ratio.toFloat() - text.size.height / 2f,
          ),
        )
      }
    }
  }

  if (config.xAxisVisible) {
    val labels = when {
      xLabels.isNotEmpty() -> xLabels
      xMinimum != null && xMaximum != null -> {
        val count = config.xAxis.tickCount.coerceAtLeast(1)
        (0..count).map {
          config.xAxisFormat.format(xMinimum + (xMaximum - xMinimum) * it / count)
        }
      }
      else -> emptyList()
    }
    // Categories sit at band centres; a numeric axis is sampled at its edges, so
    // the first and last tick land exactly on the plot bounds.
    val isCategorical = xLabels.isNotEmpty()
    val band = plot.width / labels.size.coerceAtLeast(1)
    labels.forEachIndexed { index, label ->
      val text = measurer.measure(
        label,
        style,
        overflow = overflowFor(config.xAxis.labelOverflow),
        maxLines = 1,
        constraints = gutterConstraints(config.xAxis.labelOverflow, band - 4f),
      )
      val centre = if (isCategorical) {
        plot.left + plot.width * (index + 0.5f) / labels.size
      } else {
        plot.left + plot.width * index / (labels.size - 1).coerceAtLeast(1)
      }
      val topLeft = Offset(
        x = (centre - text.size.width / 2f)
          .coerceIn(0f, (size.width - text.size.width).coerceAtLeast(0f)),
        y = plot.bottom + 6f,
      )
      if (config.xAxis.labelRotation != 0f) {
        rotate(
          degrees = config.xAxis.labelRotation,
          pivot = Offset(centre, plot.bottom + 6f),
        ) {
          drawText(textLayoutResult = text, topLeft = topLeft)
        }
      } else {
        drawText(textLayoutResult = text, topLeft = topLeft)
      }
    }
  }

  config.xAxisLabel?.let {
    val text = measurer.measure(it, titleStyle)
    drawText(
      textLayoutResult = text,
      topLeft = Offset(
        x = plot.left + (plot.width - text.size.width) / 2f,
        y = size.height - text.size.height - 2f,
      ),
    )
  }

  config.yAxisLabel?.let {
    val text = measurer.measure(it, titleStyle)
    // Rotated about its own centre so it reads bottom-to-top beside the ticks.
    rotate(degrees = -90f, pivot = Offset(10f, plot.center.y)) {
      drawText(
        textLayoutResult = text,
        topLeft = Offset(
          x = 10f - text.size.width / 2f,
          y = plot.center.y - text.size.height / 2f,
        ),
      )
    }
  }
}

internal fun DrawScope.drawGrid(config: ChartConfiguration, lines: Int = 4) {
  val plot = plotRect(config)
  if (!config.yAxis.grid) return
  val count = config.yAxis.tickCount.takeIf { it > 0 } ?: lines
  repeat(count + 1) { index ->
    val y = plot.top + plot.height * index / count
    drawLine(
      color = config.gridColor.copy(alpha = 0.7f),
      start = Offset(plot.left, y),
      end = Offset(plot.right, y),
      strokeWidth = 1f,
    )
  }
}

private fun overflowFor(labelOverflow: String): TextOverflow = when (labelOverflow) {
  "clip" -> TextOverflow.Clip
  "visible" -> TextOverflow.Visible
  else -> TextOverflow.Ellipsis
}

/**
 * Width budget for a tick label. `visible` opts out of the budget entirely — the
 * caller has accepted that long labels will run into their neighbours.
 */
private fun gutterConstraints(labelOverflow: String, available: Float): Constraints =
  if (labelOverflow == "visible") {
    Constraints()
  } else {
    Constraints(maxWidth = available.toInt().coerceAtLeast(1))
  }

internal fun normalizedY(value: Double, minimum: Double, maximum: Double, plot: Rect): Float {
  if (maximum <= minimum) return plot.bottom
  return plot.bottom - ((value - minimum) / (maximum - minimum) * plot.height).toFloat()
}

/**
 * [valuesExtent] widened so the extreme values do not land on the axis itself.
 *
 * A dot drawn exactly on the axis line reads as clipped rather than as the
 * smallest value, which is why Swift Charts insets its domain by default. Bars
 * and areas are anchored at zero and must keep the plain extent — moving their
 * baseline would misstate the data.
 */
internal fun paddedExtent(
  values: List<Double>,
  fraction: Double = 0.06,
): Pair<Double, Double> {
  val (minimum, maximum) = valuesExtent(values)
  val inset = (maximum - minimum) * fraction
  return (minimum - inset) to (maximum + inset)
}

internal fun valuesExtent(values: List<Double>): Pair<Double, Double> {
  val minimum = values.minOrNull() ?: 0.0
  val maximum = values.maxOrNull() ?: 1.0
  return if (minimum == maximum) minimum to (maximum + 1) else minimum to maximum
}

internal fun Color.withDefaultAlpha(alpha: Float): Color = copy(alpha = alpha)
