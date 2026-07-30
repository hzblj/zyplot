package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor

internal fun DrawScope.drawCrosshair(
  config: ChartConfiguration,
  pointer: Offset?,
) {
  if (pointer == null) return
  val interaction = config.interaction
  if (!interaction.drawsVerticalCrosshair && !interaction.drawsHorizontalCrosshair) return
  val plot = presentationPlotRect(config)
  if (!plot.contains(pointer)) return
  val style = interaction.crosshairStyle
  val color = style.color?.let(::parseColor) ?: config.gridColor.copy(alpha = 0.9f)
  val effect = style.dashPattern?.let { PathEffect.dashPathEffect(it.toFloatArray()) }
  if (interaction.drawsVerticalCrosshair) {
    drawLine(
      color,
      Offset(pointer.x, plot.top),
      Offset(pointer.x, plot.bottom),
      strokeWidth = style.width * density,
      pathEffect = effect,
    )
  }
  if (interaction.drawsHorizontalCrosshair) {
    drawLine(
      color,
      Offset(plot.left, pointer.y),
      Offset(plot.right, pointer.y),
      strokeWidth = style.width * density,
      pathEffect = effect,
    )
  }
}
