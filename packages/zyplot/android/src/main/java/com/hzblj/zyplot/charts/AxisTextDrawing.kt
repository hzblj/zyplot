package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
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
    drawXLabels(config, measurer, style, xLabels, xMinimum, xMaximum, plot)
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
  val gap = Y_CATEGORY_LABEL_GAP
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
            (size.width - config.yAxis.labelInset * density - text.size.width).coerceAtLeast(0f)
          config.yAxisAtEnd -> (plot.right + 6f).coerceAtMost(size.width - text.size.width)
          else -> (plot.left - 6f - text.size.width).coerceAtLeast(0f)
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
    if (config.xAxis.ticks) {
      drawAxisTick(config, Offset(centre, plot.bottom), Offset(centre, plot.bottom + TICK_LENGTH))
    }
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

private fun DrawScope.drawAxisTick(config: ChartConfiguration, start: Offset, end: Offset) {
  drawLine(color = config.axisColor, start = start, end = end, strokeWidth = 1f)
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
