package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.drawText
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.charts.interaction.ChartRange
import com.hzblj.zyplot.charts.interaction.categoryCentre
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.presentation.CrosshairStyle
import com.hzblj.zyplot.core.parseColor

/**
 * A rule at each end of a span, drawn where the span ends rather than where its last mark
 * sits, so the outermost bars read as inside it.
 *
 * In the stretch's own colour where the chart named one: the rules at the ends of a span are the ends
 * of the span, and a reading in three colours reads as three things.
 */
internal fun DrawScope.drawRangeRules(
  config: ChartConfiguration,
  range: ChartRange,
) {
  val plot = presentationPlotRect(config)
  if (plot.width <= 0f) return
  val style = config.interaction.crosshairStyle
  val color = (config.rangeTint(range.startIndex, range.endIndex) ?: style.color)
    ?.let(::parseColor)
    ?: config.gridColor.copy(alpha = 0.9f)
  val effect = style.dashPattern?.let { PathEffect.dashPathEffect(it.toFloatArray()) }
  val start = categoryCentre(config, range.startIndex, size.width, density, align = "start")
    .coerceAtLeast(plot.left)
  val end = categoryCentre(config, range.endIndex, size.width, density, align = "end")
    .coerceAtMost(plot.right)
  listOf(start, end).forEach { x ->
    drawLine(
      color,
      Offset(x, plot.top),
      Offset(x, plot.bottom),
      strokeWidth = style.width * density,
      pathEffect = effect,
    )
  }
}

internal fun DrawScope.drawCrosshair(
  config: ChartConfiguration,
  pointer: Offset?,
  measurer: TextMeasurer? = null,
  index: Int? = null,
) {
  if (pointer == null) return
  val interaction = config.interaction
  if (!interaction.drawsVerticalCrosshair && !interaction.drawsHorizontalCrosshair) return
  val plot = presentationPlotRect(config)
  val at = pointerOnPlot(pointer, plot) ?: return
  val style = interaction.crosshairStyle
  val color = style.color?.let(::parseColor) ?: config.gridColor.copy(alpha = 0.9f)
  val effect = style.dashPattern?.let { PathEffect.dashPathEffect(it.toFloatArray()) }
  if (interaction.drawsVerticalCrosshair) {
    drawLine(
      color,
      Offset(at.x, plot.top),
      Offset(at.x, plot.bottom),
      strokeWidth = style.width * density,
      pathEffect = effect,
    )
  }
  if (interaction.drawsHorizontalCrosshair) {
    drawLine(
      color,
      Offset(plot.left, at.y),
      Offset(plot.right, at.y),
      strokeWidth = style.width * density,
      pathEffect = effect,
    )
  }

  val label = style.labelAt(index) ?: return
  val text = measurer?.measure(
    label,
    config.textStyle(fontSize = CrosshairStyle.LABEL_SIZE.sp, color = config.labelColor),
    maxLines = 1,
  ) ?: return

  val left = (at.x - text.size.width / 2f).coerceIn(0f, (size.width - text.size.width).coerceAtLeast(0f))
  drawText(text, topLeft = Offset(left, plot.top - text.size.height - CrosshairStyle.LABEL_LIFT * density))
}
