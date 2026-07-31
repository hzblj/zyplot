package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration

private const val TICK_LENGTH = 4f

/** The dotted axis row, in dp: a dot at every category, and the longer mark that caps a named one. */
private const val ROW_DOT = 2f
private const val ROW_CAP_LENGTH = 6f
private const val ROW_CAP_WIDTH = 1.6f
private const val ROW_LABEL_GAP = 4f

/** The air between the plot's bottom edge and the row, so the marks sit under the chart. */
private const val ROW_GAP = 5f

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
  val style = config.textStyle(fontSize = 10.sp)
  val titleStyle = config.textStyle(fontSize = 11.sp)

  if (config.yAxisVisible) {
    if (yLabels.isNotEmpty()) {
      drawCategoricalYLabels(config, measurer, style, yLabels, plot)
    } else if (yMinimum != null && yMaximum != null) {
      drawNumericYLabels(config, measurer, style, yMinimum, yMaximum, plot)
    }
  }

  if (config.xAxisVisible) {
    // The size the axis asked for, the way the numeric labels down the side already read it.
    drawXLabels(
      config,
      measurer,
      style.copy(fontSize = config.xAxis.labelSize.sp),
      xLabels,
      xMinimum,
      xMaximum,
      plot,
    )
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

private fun DrawScope.drawCategoricalYLabels(
  config: ChartConfiguration,
  measurer: TextMeasurer,
  style: TextStyle,
  labels: List<String>,
  plot: Rect,
) {
  val gap = yCategoryLabelGap(config, density)
  labels.forEachIndexed { index, label ->
    val text = measurer.measure(
      label,
      style,
      overflow = overflowFor(config.yAxis.labelOverflow),
      maxLines = 1,
      constraints = gutterConstraints(config.yAxis.labelOverflow, plot.left - gap),
    )
    if (config.yAxis.ticks) {
      val y = plot.top + plot.height * (index + 0.5f) / labels.size
      drawAxisTick(config, Offset(plot.left, y), Offset(plot.left - TICK_LENGTH, y))
    }
    drawText(
      textLayoutResult = text,
      topLeft = Offset(
        x = (plot.left - gap - text.size.width).coerceAtLeast(0f),
        y = plot.top + plot.height * (index + 0.5f) / labels.size - text.size.height / 2f,
      ),
    )
  }
}

private fun DrawScope.drawNumericYLabels(
  config: ChartConfiguration,
  measurer: TextMeasurer,
  style: TextStyle,
  minimum: Double,
  maximum: Double,
  plot: Rect,
) {
  val values = config.yAxis.tickValues.ifEmpty {
    val count = config.yAxis.tickCount.coerceAtLeast(1)
    (0..count).map { maximum - (maximum - minimum) * it / count }
  }
  val tickStyle = style.copy(fontSize = config.yAxis.labelSize.sp)
  values.forEach { value ->
    val text = measurer.measure(config.yAxisFormat.format(value), tickStyle)
    val y = normalizedY(value, minimum, maximum, plot)
    if (config.yAxis.ticks && !config.overlaysYAxis) {
      val edge = if (config.yAxisAtEnd) plot.right else plot.left
      val outward = if (config.yAxisAtEnd) TICK_LENGTH else -TICK_LENGTH
      drawAxisTick(config, Offset(edge, y), Offset(edge + outward, y))
    }
    drawText(
      textLayoutResult = text,
      topLeft = Offset(
        x = when {
          config.overlaysYAxis ->
            (size.width - overlayLabelInset(config, density) - text.size.width).coerceAtLeast(0f)
          config.yAxisAtEnd ->
            (plot.right + yLabelGap(config, density)).coerceAtMost(size.width - text.size.width)
          else -> (plot.left - yLabelGap(config, density) - text.size.width).coerceAtLeast(0f)
        },
        y = (y - text.size.height / 2f).coerceIn(
          plot.top,
          (plot.bottom - text.size.height).coerceAtLeast(plot.top),
        ),
      ),
    )
  }
}

private fun DrawScope.drawXLabels(
  config: ChartConfiguration,
  measurer: TextMeasurer,
  style: TextStyle,
  xLabels: List<String>,
  xMinimum: Double?,
  xMaximum: Double?,
  plot: Rect,
) {
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
  val isCategorical = xLabels.isNotEmpty()
  // Which categories the axis was told to name. The rest keep their bar and lose their label,
  // so the band a label is measured against is the room the named ones actually have.
  val named = if (isCategorical) config.xAxis.tickCategories.toSet() else emptySet()
  val drawn = if (named.isEmpty()) labels.size else labels.count { it in named }
  val band = plot.width / drawn.coerceAtLeast(1)

  // The denser row first, so a named tick is drawn over its own minor one rather than beside it.
  // Dots, not dashes: a row of dashes reads as a comb where a row of dots reads as the axis.
  val dotted = isCategorical && config.xAxis.ticks && config.xAxis.minorTicks
  // The row sits under the plot rather than against it, so the marks are read as the axis and not
  // as part of the chart.
  val rowTop = plot.bottom + ROW_GAP * density
  if (dotted) {
    labels.forEachIndexed { index, _ ->
      val centre = plot.left + plot.width * (index + 0.5f) / labels.size
      drawCircle(
        color = config.axisColor,
        radius = ROW_DOT / 2f * density,
        center = Offset(centre, rowTop + ROW_CAP_LENGTH / 2f * density),
      )
    }
    // The mark that closes the row, on the trailing edge of the last band: the row runs to the end
    // of the last category rather than stopping in the middle of it.
    drawRowCap(config, plot.right, rowTop)
  }

  // Which of the labels are drawn, so the two on the ends can be squared up with the row.
  val shown = labels.indices.filter { named.isEmpty() || labels[it] in named }
  val edgeAligned = config.xAxis.labelEdgeAlign && shown.size > 1
  // The row of caps stands between the plot and its labels, so a dotted axis measures from its tip.
  val labelTop = plot.bottom + when {
    config.xAxis.labelInset != null -> xLabelGap(config, density)
    dotted -> (ROW_GAP + ROW_CAP_LENGTH + ROW_LABEL_GAP) * density
    else -> X_LABEL_GAP * density
  }

  labels.forEachIndexed { index, label ->
    if (named.isNotEmpty() && label !in named) {
      return@forEachIndexed
    }
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
    val left = when {
      edgeAligned && index == shown.first() -> centre
      edgeAligned && index == shown.last() -> centre - text.size.width
      else -> centre - text.size.width / 2f
    }
    val topLeft = Offset(
      x = left.coerceIn(0f, (size.width - text.size.width).coerceAtLeast(0f)),
      y = labelTop,
    )
    if (config.xAxis.ticks) {
      if (dotted) {
        // The same mark as a dot, drawn long: a named category is where the row starts or stops.
        drawRowCap(config, centre, rowTop)
      } else {
        drawAxisTick(config, Offset(centre, plot.bottom), Offset(centre, plot.bottom + TICK_LENGTH))
      }
    }
    if (config.xAxis.labelRotation != 0f) {
      rotate(
        degrees = config.xAxis.labelRotation,
        pivot = Offset(centre, labelTop),
      ) {
        drawText(textLayoutResult = text, topLeft = topLeft)
      }
    } else {
      drawText(textLayoutResult = text, topLeft = topLeft)
    }
  }
}

private fun DrawScope.drawAxisTick(config: ChartConfiguration, start: Offset, end: Offset) {
  drawLine(color = config.axisColor, start = start, end = end, strokeWidth = 1f)
}

/** A cap of the dotted row, hung from the plot's bottom edge and inset by its own round ends. */
private fun DrawScope.drawRowCap(config: ChartConfiguration, x: Float, top: Float) {
  val half = ROW_CAP_WIDTH * density / 2f
  drawLine(
    color = config.axisColor,
    start = Offset(x, top + half),
    end = Offset(x, top + ROW_CAP_LENGTH * density - half),
    strokeWidth = ROW_CAP_WIDTH * density,
    cap = StrokeCap.Round,
  )
}

private fun overflowFor(labelOverflow: String): TextOverflow = when (labelOverflow) {
  "clip" -> TextOverflow.Clip
  "visible" -> TextOverflow.Visible
  else -> TextOverflow.Ellipsis
}

private fun gutterConstraints(labelOverflow: String, available: Float): Constraints =
  if (labelOverflow == "visible") {
    Constraints()
  } else {
    Constraints(maxWidth = available.toInt().coerceAtLeast(1))
  }
