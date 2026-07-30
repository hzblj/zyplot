package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.drawText
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor

private const val LABEL_LIFT = 8f

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
    config.textStyle(
      fontSize = style.labelSize.sp,
      color = style.labelColor?.let(::parseColor) ?: config.labelColor,
    ),
    maxLines = 1,
  ) ?: return
  drawText(
    text,
    topLeft = Offset(
      x = (at.x - text.size.width / 2f).coerceIn(0f, (size.width - text.size.width).coerceAtLeast(0f)),
      y = plot.top - text.size.height - LABEL_LIFT * density,
    ),
  )
}
